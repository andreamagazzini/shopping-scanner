import { Product } from '@/@types/Product';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useZxing } from "react-zxing";

interface Props {
  onDetected: (product: Product) => void,
}

const BarcodeReader: FC<Props> = ({ onDetected }) => {
  const [code, setCode] = useState<string>("")

  const getProductDetails = useCallback(async (code: string) => {
    const { data } = await axios.get(`/api/barcode/search?code=${code}`)
    data.product && onDetected(data.product)
  }, [onDetected])

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log(result)
      if (result.getText() && code !== result.getText()) {
        setCode(result.getText())
        getProductDetails(result.getText())
      }
    },
  });

  return (
    <>
      <div>
        <video id="camera-stream" ref={ref} />
        <canvas id="screenshot" className="hidden" />
      </div>
    </>
  )
}

export default BarcodeReader