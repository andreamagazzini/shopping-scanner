import { Product } from '@/@types/Product';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useZxing } from "react-zxing";

interface Props {
  onDetected: (product: Product) => void,
  deviceId?: string
}

const BarcodeReader: FC<Props> = ({ deviceId, onDetected }) => {
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | unknown>()

  const getProductDetails = useCallback(async (code: string) => {
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}`)
    data.product && onDetected(data.product)
    setLoading(false)
  }, [onDetected])

  const { ref } = useZxing({
    ...(deviceId && {deviceId}),
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