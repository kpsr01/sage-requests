export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return res.status(200).json({
    status: 'ok',
    service: 'YouTube Transcript Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      transcript: '/api/index (POST)',
      health: '/api/health (GET)'
    }
  });
};
