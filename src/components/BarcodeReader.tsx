import { Product } from '@/@types/Product';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useZxing } from "react-zxing";
import { RiLoader5Fill } from "react-icons/ri";

interface Props {
  onDetected: (product: Product) => void,
  deviceId?: string
}

const BarcodeReader: FC<Props> = ({ deviceId, onDetected }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | unknown>()

  const getProductDetails = useCallback(async (code: string) => {
    setLoading(true)
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}`)
    data.product && onDetected(data.product)
    setLoading(false)
  }, [onDetected])

  const { ref } = useZxing({
    ...(deviceId && {deviceId}),
    onDecodeResult(result) {
      setError(null)
      if (!loading) {
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
      <div className="relative">
        <video id="camera-stream" ref={ref} />
        {
          loading &&
          <div className="absolute flex justify-center items-center top-0 w-full h-full bg-black bg-opacity-50 text-2xl">
            <RiLoader5Fill className="animate-spin" />
            <span>Loading...</span>
          </div>
        }
        
      </div>
      {
        Boolean(error && Object.keys(error).length) &&
        <div>{JSON.stringify(error)}</div>
      }
    </>
  )
}

export default BarcodeReader