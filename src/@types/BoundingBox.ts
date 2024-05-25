interface PixelCoords {
  x: number,
  y: number,
  width: number,
  height: number
}

interface BoundingBox {
  pixelCoords: PixelCoords
}

export default BoundingBox