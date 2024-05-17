'use client'
import { useEffect, useRef, useState } from "react";

import CameraCanvas from "@/components/CameraCanvas";
import CanvasAnalyzer from "@/components/CanvasAnalyzer";

export default function Home() {
  const [src, setSrc] = useState(null)
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      setSrc(canvasRef.current)
    }
  }, [canvasRef]) 
  
  return (
    <main className="flex flex-col gap-2">
      <CameraCanvas innerRef={canvasRef} />
      <CanvasAnalyzer src={src} />
    </main>
  );
}
