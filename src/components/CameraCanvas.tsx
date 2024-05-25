import { useState, useEffect, FC } from 'react';

const constraints = { video: { facingMode: 'environment', min: 200, max: 400 }, audio: false };

interface Props {
  innerRef: any
}

const CANVAS_SIZE = 400

const CameraCanvas: FC<Props> = ({ innerRef }) => {
  const [stream, setStream] = useState<null | MediaStream>(null);

  useEffect(() => {
    if (!stream) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: MediaStream) => {
          setStream(stream);
        })
        .catch((error) => {
          console.error("Oops. Something is broken.", error);
        });

      return;
    }

    const canvas = innerRef.current;
    const context = canvas.getContext('2d');
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    let width = CANVAS_SIZE;
    let height = CANVAS_SIZE;

    video.onresize = () => {
      width = video.videoWidth;
      height = video.videoHeight;
    };

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const render = () => {
      context.drawImage(video, Math.round(width / 3), Math.round(height / 3), CANVAS_SIZE, CANVAS_SIZE, 0, 0, width, height);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };
  }, [stream, innerRef]);

  return (
    <>
      {/* <!-- Camera stream --> */}
      <canvas ref={innerRef}></canvas>
    </>
  )
}

export default CameraCanvas