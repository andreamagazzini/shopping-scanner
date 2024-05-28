import { Product } from '@/@types/Product';
import axios from 'axios';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";
import { getCameraWithClosestFocus, getCameras } from '@/app/utils/cameras';

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
  const [deviceId, setDeviceId] = useState("")
  const [error, setError] = useState<Error | unknown>()

  const { devices } = useMediaDevices({ constraints })

  useEffect(() => {
    getCameraWithClosestFocus().then((id) => {
      id && setDeviceId(id)
    }).catch((e) => {
      console.log(e)
    })
  }, [])

  const getProductDetails = useCallback(async (code: string) => {
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}`)
    data.product && onDetected(data.product)
    setLoading(false)
  }, [onDetected])

  const { ref } = useZxing({
    paused: !deviceId,
    deviceId,
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

  const handleSelectCamera = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    console.log(value)

    localStorage.setItem("favoriteNumber", value)
    setDeviceId(value)
  }

  return (
    <>
      <div>
        <video id="camera-stream" ref={ref} />
        <canvas id="screenshot" className="hidden" />
        {
          devices &&
          <select className="w-full text-black p-3 bg-white" onChange={handleSelectCamera}>
            {
              devices?.filter((device) => device.kind === "videoinput").map((camera: MediaDeviceInfo) => (
                <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
              ))
            }
          </select>
        }
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