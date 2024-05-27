import { useState, FC } from 'react';
import axios from 'axios';
import Segment from '@/@types/Segment';

interface Props {}

const dateRegex = new RegExp([
  '(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})',
  '(0[1-9]|1[0-2])-?([0-9]{4}|[0-9]{2})'
].join('|'), "g");

const ExpDateButton: FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const [textResult, setTextResult] = useState<string | null>(null);

  const recognizeText = async (blob: Blob) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      const { data } = await axios.post('/api/image/text-detection', formData)

      const text = data.segments?.map((segment: Segment) => segment.text).join(" ")

      const dates = text.match(dateRegex) || []

      console.log(dates, text)
      dates[0] && setTextResult(dates[0])
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const getBlob = () => {
    const canvas = document.querySelector('#screenshot') as HTMLCanvasElement;
    const video = document.querySelector('#camera-stream') as HTMLVideoElement;

    if (!video || !canvas) {
      return
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob(async (blob: Blob | null) => {
      blob && await recognizeText(blob)
    })
  }

  return (
    <>
      {
          textResult ?
            <div>{textResult}</div>
            :
            <button
              onClick={getBlob}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get exp date"}
            </button>
      }
    </>
  )
}

export default ExpDateButton