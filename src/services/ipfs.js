/**
 * IPFS Upload Service
 * 
 * This service provides a unified interface for uploading files to IPFS
 * using different providers based on environment configuration.
 * 
 * Supported Providers:
 * 1. Storj - Decentralized cloud storage (accepts crypto)
 *    - Set VITE_STORJ_ACCESS_GRANT and VITE_STORJ_BUCKET
 * 
 * 2. 4EVERLAND - IPFS pinning service (accepts crypto)
 *    - Set VITE_4EVERLAND_API_KEY and VITE_4EVERLAND_BUCKET
 * 
 * 3. web3.storage / NFT.Storage - Free IPFS storage
 *    - Set VITE_WEB3_STORAGE_TOKEN
 */

/**
 * Upload a file to IPFS using the configured provider
 * @param {File|Blob} file - The file to upload
 * @param {Object} metadata - Optional metadata object to include
 * @returns {Promise<string>} The IPFS CID/hash
 */
export const uploadToIPFS = async (file, metadata = {}) => {
  // Check which provider is configured
  const storjGrant = import.meta.env.VITE_STORJ_ACCESS_GRANT;
  const storjBucket = import.meta.env.VITE_STORJ_BUCKET;
  const fourEverApiKey = import.meta.env.VITE_4EVERLAND_API_KEY;
  const fourEverBucket = import.meta.env.VITE_4EVERLAND_BUCKET;
  const web3Token = import.meta.env.VITE_WEB3_STORAGE_TOKEN;

  if (storjGrant && storjBucket) {
    return uploadViaStorj(file, metadata, storjGrant, storjBucket);
  } else if (fourEverApiKey && fourEverBucket) {
    return uploadVia4EVERLAND(file, metadata, fourEverApiKey, fourEverBucket);
  } else if (web3Token) {
    return uploadViaWeb3Storage(file, metadata, web3Token);
  } else {
    throw new Error(
      'No IPFS provider configured. Please set one of: ' +
      'VITE_STORJ_ACCESS_GRANT, VITE_4EVERLAND_API_KEY, or VITE_WEB3_STORAGE_TOKEN'
    );
  }
};

/**
 * Upload via Storj
 * Requires: npm install @storj/uplink
 */
const uploadViaStorj = async (file, metadata, accessGrant, bucketName) => {
  // TODO: Implement Storj upload
  // Documentation: https://docs.storj.io/dcs/api-reference/uplink-cli
  throw new Error('Storj upload not yet implemented. See documentation in src/services/ipfs.js');
};

/**
 * Upload via 4EVERLAND
 * Uses S3-compatible API
 */
const uploadVia4EVERLAND = async (file, metadata, apiKey, bucketName) => {
  // TODO: Implement 4EVERLAND upload
  // Documentation: https://docs.4everland.org/storage/bucket/api
  throw new Error('4EVERLAND upload not yet implemented. See documentation in src/services/ipfs.js');
};

/**
 * Upload via web3.storage
 * Requires: npm install web3.storage
 */
const uploadViaWeb3Storage = async (file, metadata, token) => {
  // TODO: Implement web3.storage upload
  // Documentation: https://web3.storage/docs/
  throw new Error('web3.storage upload not yet implemented. See documentation in src/services/ipfs.js');
};

/**
 * Helper: Generate trade commitment metadata for NFT
 */
export const generateTradeMetadata = (trade) => {
  return {
    name: `Trade Plan - ${trade.pair}`,
    description: `Trading commitment for ${trade.pair} ${trade.direction.toUpperCase()}`,
    attributes: [
      { trait_type: 'Pair', value: trade.pair },
      { trait_type: 'Direction', value: trade.direction.toUpperCase() },
      { trait_type: 'Entry', value: trade.entry },
      { trait_type: 'Target', value: trade.tp },
      { trait_type: 'Stop Loss', value: trade.sl },
      { trait_type: 'Risk Percent', value: `${trade.riskPercent}%` },
      { trait_type: 'Timestamp', value: trade.timestamp },
    ],
  };
};
