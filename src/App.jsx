import './App.css'
import { useRef } from 'react';

import CameraCanvas from './components/CameraCanvas';
import CanvasAnalyzer from './components/CanvasAnalyzer';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [src, setSrc] = useState(null)
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      setSrc(canvasRef.current)
    }
  }, [canvasRef]) 

  return (
    <>
      {/* <!-- Camera --> */}
      <main className='container'>
        <CameraCanvas innerRef={canvasRef} />
        <CanvasAnalyzer src={src} />
      </main>
    </>
  )
}

export default App
