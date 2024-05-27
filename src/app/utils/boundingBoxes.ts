import BoundingBox from '@/@types/BoundingBox';
import Point from '@/@types/Point';

export const mapBoundingBoxCoordsToPoints = (boundingBox: BoundingBox) => {
  const {x, y, width, height } = boundingBox.pixelCoords

  return [
    { x, y }, 
    { x: (x + width), y },
    { x: (x + width), y: (y + height)},
    { x, y: (y + height)}
  ]
}

export const drawBoxes = (ctx: any, boxes: any[]) => {
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
}