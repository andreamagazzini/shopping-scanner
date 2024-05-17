import { useState, useRef, useCallback, FC, CanvasHTMLAttributes } from 'react';
//import Tesseract from 'tesseract.js';
import axios from 'axios';

interface Props {
  src: any
}

const CanvasAnalyzer: FC<Props> = ({ src }) => {
  const [loading, setLoading] = useState(false);
  const [textResult,setTextResult] = useState(null);
  const outputRef = useRef<HTMLCanvasElement>(null);

  const drawBoxes = useCallback((ctx: any, boundingBoxes: any[]) => {
    boundingBoxes.forEach((box) => {
      ctx.beginPath();
      
      box.forEach((line: any, index: number) => {
        if (index === 0) {
          ctx.moveTo(line.x, line.y);
        } else {
          ctx.lineTo(line.x, line.y);
        }
      })
      
      ctx.closePath();
      ctx.stroke();
    })
  }, [])

  const recognizeText = async (canvas: any) => {
    setLoading(true)
    const img = await canvas.toDataURL("image/jpg");
    
    if (!outputRef.current) {
      return;
    }

    const ctx = outputRef.current.getContext("2d");
    outputRef.current.width = canvas.width;
    outputRef.current.height = canvas.height;
    ctx && ctx.drawImage(canvas, 0, 0);

    const apiResponse = await axios.post('/api/image/text-detection', {
      image: img.split(';base64,')[1]
    })

    console.log(apiResponse);

    const boundingBoxes = apiResponse.data.responses[0].textAnnotations?.map(({ boundingPoly }: any) => (boundingPoly.vertices)) || [] 

    drawBoxes(ctx, boundingBoxes)
    setTextResult(apiResponse.data.responses[0].fullTextAnnotation?.text || "No text found")
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