import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// 4EVERLAND S3-compatible client configuration
const s3Client = new S3Client({
  endpoint: import.meta.env. VITE_4EVERLAND_ENDPOINT || 'https://endpoint.4everland. co',
  credentials: {
    accessKeyId: import. meta.env. VITE_4EVERLAND_API_KEY,
    secretAccessKey: import. meta.env. VITE_4EVERLAND_API_SECRET,
  },
  region: '4everland',
  forcePathStyle: true,
});

const BUCKET_NAME = import.meta.env.VITE_4EVERLAND_BUCKET;

/**
 * Check if 4EVERLAND is properly configured
 */
export const isIPFSConfigured = () => {
  return ! !(
    import.meta.env. VITE_4EVERLAND_API_KEY &&
    import.meta.env.VITE_4EVERLAND_API_SECRET &&
    import.meta.env. VITE_4EVERLAND_BUCKET
  );
};

/**
 * Upload a file to 4EVERLAND and get the IPFS CID
 * @param {File|Blob|Buffer} file - The file to upload
 * @param {string} filename - The filename to use
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{cid: string, url: string}>}
 */
export const uploadToIPFS = async (file, filename, contentType = 'application/json') => {
  if (!isIPFSConfigured()) {
    throw new Error('4EVERLAND is not configured.  Please set environment variables.');
  }

  // Convert File/Blob to ArrayBuffer if needed
  let body = file;
  if (file instanceof Blob || file instanceof File) {
    body = await file.arrayBuffer();
    body = new Uint8Array(body);
  }

  const key = `commitments/${Date.now()}-${filename}`;

  // Upload the file
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(putCommand);

  // Get the IPFS hash from metadata
  const headCommand = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const metadata = await s3Client.send(headCommand);
  const cid = metadata. Metadata?.['ipfs-hash'] || metadata. Metadata?.['x-amz-meta-ipfs-hash'];

  if (!cid) {
    throw new Error('Failed to retrieve IPFS CID from 4EVERLAND');
  }

  return {
    cid,
    url: `https://ipfs.io/ipfs/${cid}`,
    gateway4everland: `https://4everland.io/ipfs/${cid}`,
  };
};

/**
 * Upload trade commitment metadata as JSON
 * @param {object} trade - The trade object
 * @param {object} user - The Farcaster user object
 * @returns {Promise<{cid: string, url: string}>}
 */
export const uploadTradeMetadata = async (trade, user) => {
  const metadata = {
    name: `TradePlan Commitment:  ${trade.pair} ${trade.direction. toUpperCase()}`,
    description: `A trading commitment locked on-chain by @${user?. username || 'anonymous'}`,
    image: '', // We'll add image generation later
    attributes:  [
      { trait_type: 'Pair', value: trade.pair },
      { trait_type: 'Direction', value: trade. direction.toUpperCase() },
      { trait_type: 'Entry', value: trade.entry },
      { trait_type: 'Stop Loss', value: trade. sl },
      { trait_type: 'Take Profit', value:  trade.tp },
      { trait_type:  'Risk %', value: `${trade.riskPercent}%` },
      { trait_type: 'R: R', value: `1:${trade.rr}` },
      { trait_type:  'Position Size', value: trade.positionSize },
      { trait_type: 'Trader', value: user?.username || 'anonymous' },
      { trait_type:  'Trader FID', value: user?.fid?. toString() || 'unknown' },
    ],
    external_url: 'https://tradeplan.app', // Update with your actual URL
    timestamp: Date.now(),
    trader: {
      fid:  user?.fid,
      username: user?.username,
      walletAddress: user?. walletAddress,
    },
    trade: {
      ... trade,
      thesis: trade.thesis,
    },
  };

  const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: 'application/json',
  });

  return uploadToIPFS(jsonBlob, `${trade.id || Date.now()}-metadata. json`, 'application/json');
};

/**
 * Upload an image to IPFS (for commitment certificate images)
 * @param {Blob|File} imageBlob - The image blob
 * @param {string} tradeId - The trade ID for naming
 * @returns {Promise<{cid: string, url: string}>}
 */
export const uploadImage = async (imageBlob, tradeId) => {
  const contentType = imageBlob.type || 'image/png';
  const extension = contentType.split('/')[1] || 'png';
  return uploadToIPFS(imageBlob, `${tradeId}-certificate.${extension}`, contentType);
};