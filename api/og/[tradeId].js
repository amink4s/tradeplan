// Vercel Serverless Function for OG Image
// For now, redirect to a static image. 
// For dynamic images, deploy https://github.com/farcasterxyz/miniapp-img separately

export default async function handler(req, res) {
  // Redirect to the static image
  // This ensures the embed always works while you set up dynamic image generation
  const staticImageUrl = 'https://tradeplan-mu.vercel.app/image.png';
  
  res.setHeader('Location', staticImageUrl);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(302).end();
}
