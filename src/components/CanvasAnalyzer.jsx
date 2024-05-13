import { useState, useRef, useCallback } from 'react';
//import Tesseract from 'tesseract.js';
import axios from 'axios';

const CanvasAnalyzer = ({ src }) => {
  const [loading, setLoading] = useState(false);
  const [textResult,setTextResult] = useState(null);
  const outputRef = useRef();

  const drawBoxes = useCallback((ctx, boundingBoxes) => {
    boundingBoxes.forEach((box) => {
      ctx.beginPath();
      
      box.forEach((line, index) => {
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

  const recognizeText = async (canvas) => {
    setLoading(true)
    const img = await canvas.toDataURL("image/jpg");
    const ctx = outputRef.current.getContext("2d");
    outputRef.current.width = canvas.width;
    outputRef.current.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);

    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestData = {
      requests: [
        {
          image: {
            content: img.split(';base64,')[1],
          },
          features: [{ type: 'TEXT_DETECTION', maxResults: 5 }],
        },
      ],
    };

    const apiResponse = await axios.post(apiUrl, requestData);

    const boundingBoxes = apiResponse.data.responses[0].textAnnotations.map(({ boundingPoly }) => (boundingPoly.vertices)) 

    drawBoxes(ctx, boundingBoxes)
    setTextResult(apiResponse.data.responses[0].fullTextAnnotation.text)
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