import { YoutubeTranscript } from 'youtube-transcript';

export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Transcript request received:', req.body);
    const { videoId } = req.body;

    if (!videoId) {
      console.error('Missing videoId parameter');
      return res.status(400).json({ 
        error: 'Missing required parameter: videoId',
        success: false 
      });
    }

    console.log('Fetching transcript for video:', videoId);
    
    // Fetch transcript using youtube-transcript
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptData || transcriptData.length === 0) {
      console.log('No transcript found for video:', videoId);
      return res.status(404).json({ 
        error: 'No transcript available for this video',
        success: false 
      });
    }

    // Format transcript data
    const formattedTranscript = transcriptData.map(item => ({
      text: item.text,
      offset: item.offset,
      duration: item.duration
    }));

    console.log('Transcript fetched successfully:', {
      videoId,
      segmentCount: formattedTranscript.length,
      totalLength: formattedTranscript.reduce((acc, item) => acc + item.text.length, 0)
    });

    return res.status(200).json({
      success: true,
      videoId,
      transcript: formattedTranscript,
      metadata: {
        segmentCount: formattedTranscript.length,
        totalLength: formattedTranscript.reduce((acc, item) => acc + item.text.length, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching transcript:', {
      message: error.message,
      stack: error.stack,
      videoId: req.body?.videoId
    });

    // Handle specific error types
    if (error.message.includes('Transcript is disabled')) {
      return res.status(403).json({ 
        error: 'Transcript is disabled for this video',
        success: false 
      });
    }

    if (error.message.includes('No transcript found')) {
      return res.status(404).json({ 
        error: 'No transcript available for this video',
        success: false 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch transcript',
      details: error.message,
      success: false 
    });
  }
};
