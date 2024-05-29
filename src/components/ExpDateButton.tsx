import { useState, FC } from 'react';
import useGoogleLens from '@/hooks/useGoogleLens';

interface Props {}

const dateRegex = new RegExp([
  '(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})',
  '(0[1-9]|1[0-2])-?([0-9]{4}|[0-9]{2})'
].join('|'), "g");

const ExpDateButton: FC<Props> = () => {
  const [textResult, setTextResult] = useState<string | null>(null);

  const { analyzeImage, loading } = useGoogleLens({videoId: "camera-stream"})

  const handleClick = async () => {
    const { text } = await analyzeImage()

    const dates = text.match(dateRegex) || [];

    dates.length && setTextResult(dates)
  }

  return (
    <>
      {
          textResult ?
            <div>{textResult}</div>
            :
            <button
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get exp date"}
            </button>
      }
    </>
  )
}

export default ExpDateButton