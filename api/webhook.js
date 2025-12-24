// Vercel serverless function for Farcaster webhook
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res. status(405).json({ error: 'Method not allowed' });
  }

  // Log webhook events for now
  console.log('Farcaster webhook received:', req.body);

  // Acknowledge receipt
  return res.status(200).json({ success: true });
}