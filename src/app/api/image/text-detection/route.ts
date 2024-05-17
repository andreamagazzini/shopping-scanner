import axios from "axios";

export async function POST(request: Request) {
  const requestBody = await request.json()

  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const body = {
    requests: [
      {
        image: {
          content: requestBody.image,
        },
        features: [{ type: 'TEXT_DETECTION', maxResults: 5 }],
      },
    ],
  };

  const res = await axios.post(apiUrl, body);
 
  return Response.json(res.data)
}