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
      'x-rapidapi-key': '356902a95emshece54ab074e5976p16ddacjsneb2b14b100dc',
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