import Lens from 'image-to-text-google-lens'

export async function POST(request: Request) {
  let startTime = Date.now()
  console.log("Starting...")
  const formData = await request.formData()
  const image = formData.get('image') as Blob

  let endTime = Date.now()

  console.log("Loading request body...", (endTime-startTime)/1000)

  // const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  // const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  // const body = {
  //   requests: [
  //     {
  //       image: {
  //         content: requestBody.image,
  //       },
  //       features: [{ type: 'TEXT_DETECTION', maxResults: 5 }],
  //     },
  //   ],
  // };

  // const res = await axios.post(apiUrl, body);

  const lens = new Lens()
  const uint8 = new Uint8Array(await image.arrayBuffer());

  startTime = Date.now()

  const data = await lens.scanByData(uint8, 'image/png')

  endTime = Date.now()

  console.log("Analyzing data...", (endTime-startTime)/1000)

  return Response.json({ ...data })
}
