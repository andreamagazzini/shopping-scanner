import { useState, useRef, useCallback, FC } from 'react';
import axios from 'axios';
import Point from '@/@types/Point';
import Segment from '@/@types/Segment';
import BoundingBox from '@/@types/BoundingBox';

interface Props {
  src: any
}

const dateRegex = new RegExp([
  '(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})',
  '(0[1-9]|1[0-2])-?([0-9]{4}|[0-9]{2})'
].join(''),"g");

const mapBoundingBoxCoordsToPoints = (boundingBox: BoundingBox) => {
  const {x, y, width, height } = boundingBox.pixelCoords

  return [
    { x, y }, 
    { x: (x + width), y },
    { x: (x + width), y: (y + height)},
    { x, y: (y + height)}
  ]
}

const CanvasAnalyzer: FC<Props> = ({ src }) => {
  const [loading, setLoading] = useState(false);
  const [textResult, setTextResult] = useState<string | null>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);

  const drawBoxes = useCallback((ctx: any, boxes: any[]) => {
    boxes.forEach((box) => {
      ctx.beginPath();

      box.forEach(({x, y}: Point, index: number) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      })

      ctx.closePath();
      ctx.stroke();
    })
  }, [])

  const recognizeText = async (canvas: any) => {
    setLoading(true)
    const img = await canvas.toDataURL("image/png");

    if (!outputRef.current) {
      return;
    }

    const ctx = outputRef.current.getContext("2d");
    outputRef.current.width = canvas.width;
    outputRef.current.height = canvas.height;
    ctx && ctx.drawImage(canvas, 0, 0);

    canvas.toBlob(async (blob: Blob) => {
      try {
        const formData = new FormData();
        formData.append('image', blob, 'image.png');
        const { data } = await axios.post('/api/image/text-detection', formData)
  
        const boundingBoxes = data.segments?.map((segment: Segment) => mapBoundingBoxCoordsToPoints(segment.boundingBox))
        const text = data.segments?.map((segment: Segment) => segment.text).join(" ")

        const dates = text.match(dateRegex)
  
        drawBoxes(ctx, boundingBoxes)
        setTextResult(dates[0] || "No date found")
      } catch (e) {
        console.log(e)
        setTextResult("No text found")
      }
    })

    setLoading(false)
  }

  return (
    <>
      {/* <!-- Camera frame --> */}
      <canvas ref={outputRef}></canvas>
      {
        loading ?
          <div>Loading...</div>
          :
          <div>{textResult}</div>
      }
      <button disabled={loading} onClick={async () => await recognizeText(src)}>Start</button>
    </>
  )
}

export default CanvasAnalyzer