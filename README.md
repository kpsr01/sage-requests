# YouTube Transcript Service

A standalone serverless API for extracting YouTube video transcripts.

## Endpoints

### POST /api/index
Extract transcript from a YouTube video.

**Request Body:**
```json
{
  "videoId": "dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "transcript": [
    {
      "text": "Hello world",
      "offset": 0,
      "duration": 2.5
    }
  ],
  "metadata": {
    "segmentCount": 150,
    "totalLength": 5000
  }
}
```

### GET /api/health
Health check endpoint.

## Deployment

1. Install dependencies:
```bash
npm install
```

2. Deploy to Vercel:
```bash
vercel --prod
```

## Usage

```javascript
const response = await fetch('https://your-transcript-service.vercel.app/api/index', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    videoId: 'dQw4w9WgXcQ'
  })
});

const data = await response.json();
console.log(data.transcript);
```
