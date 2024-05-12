import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

const CanvasAnalyzer = ({ src }) => {
  const [textResult,setTextResult] = useState(null);
  const outputRef = useRef();

  useInterval(() => {
    recognizeText(src)
  }, 3000); 

  const drawImage = useCallback((canvas, data) => {
    const ctx = outputRef.current.getContext("2d");
    outputRef.current.width = canvas.width;
    outputRef.current.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);
    const { lines } = data || {};

    lines.forEach((block) => {
      const {x0, y0, x1, y1} = block.bbox;

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0, y1);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, y0);
      ctx.closePath();
      ctx.stroke();
    })
  }, [])

  const recognizeText = async (canvas) => {
    const img = await canvas.toDataURL("image/jpg");

    // TODO: change the way the text is recognized
    const result = await Tesseract.recognize(img, "eng");
    
    drawImage(canvas, result.data)
    setTextResult(result.data.text)
  }

  return (
    <>
      {/* <!-- Camera frame --> */}
      <canvas ref={outputRef}></canvas>
      <div>{textResult}</div>
    </>
  )
}

export default CanvasAnalyzer