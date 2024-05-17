import { useState, useEffect, FC } from 'react';

const constraints = { video: { facingMode: 'environment', min: 200, max: 400 }, audio: false };

interface Props {
  innerRef: any
}

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

    let width = 400;
    let height = 400;

    video.onresize = () => {
      width = video.videoWidth;
      height = video.videoHeight;
    };

    canvas.width = 400;
    canvas.height = 400;

    const render = () => {
      context.drawImage(video, Math.round(width / 3), Math.round(height / 3), 400, 400, 0, 0, width, height);
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