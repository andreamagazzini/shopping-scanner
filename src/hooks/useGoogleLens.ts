import { identifyDates } from './../app/utils/dates';
import Segment from "@/@types/Segment"
import { dateRegex } from "@/app/utils/dates"
import axios from "axios"
import { useState } from "react"

type Props = {
  videoId: string
}

const useGoogleLens = ({ videoId }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const analyzeBlob = async (blob: Blob) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      const { data } = await axios.post('/api/image/text-detection', formData)
      setLoading(false)

      const text = data.segments?.map((segment: Segment) => segment.text).join(" ")
      const dates = identifyDates(text);

      return { text, dates }
    } catch (e) {
      console.log(e)
      setLoading(false)
      return {}
    }
  }

  const analyzeImage = async () => {
    const video = document.querySelector(`#${videoId}`) as HTMLVideoElement;

    if (!video) {
      return {}
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve));

    if (blob) {
      return await analyzeBlob(blob)
    } 

    return {}
  }
  
  
  return {
    analyzeImage,
    loading
  }
}

export default useGoogleLens