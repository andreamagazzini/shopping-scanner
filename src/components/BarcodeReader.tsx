import { Product } from '@/@types/Product';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";

const constraints: MediaStreamConstraints = {
  video: true,
  audio: false,
};
interface Props {
  onDetected: (product: Product) => void,
}

const BarcodeReader: FC<Props> = ({ onDetected }) => {
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | unknown>()

  const { devices } = useMediaDevices({ constraints });

  const getProductDetails = useCallback(async (code: string) => {
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}`)
    data.product && onDetected(data.product)
    setLoading(false)
  }, [onDetected])

  const { ref } = useZxing({
    onDecodeResult(result) {
      setError(null)
      setLoading(true)
      if (result.getText() && code !== result.getText()) {
        setCode(result.getText())
        getProductDetails(result.getText())
      } else {
        setLoading(false)
      }
    },
    onDecodeError(error) {
      setError(error)
    },
    onError(error) {
      setError(error)
    }
  });

  return (
    <>
      <div>
        <video id="camera-stream" ref={ref} />
        <canvas id="screenshot" className="hidden" />
      </div>
      {JSON.stringify(devices?.filter((device) => device.kind === "videoinput"))}
      {
        loading &&
        <div>Loading...</div>
      }
      {
        Boolean(error && Object.keys(error).length) && 
        <div>{JSON.stringify(error)}</div>
      }
    </>
  )
}

export default BarcodeReader