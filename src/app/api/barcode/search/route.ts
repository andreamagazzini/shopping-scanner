import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")

  const options = {
    method: 'GET',
    url: 'https://barcodes1.p.rapidapi.com/',
    params: {
      query: code
    },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'barcodes1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return Response.json({ ...response.data })
  } catch (error) {
    console.error(error);
  }
}