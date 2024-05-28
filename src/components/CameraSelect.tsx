import { ChangeEvent, FC, useEffect, useState } from "react"
import { useMediaDevices } from "react-media-devices";

const constraints: MediaStreamConstraints = {
  video: true,
  audio: false,
};

type Props = {
  onChange(deviceId: string): void,
  defaultValue?: string 
}

const CameraSelect: FC<Props> = ({ onChange, defaultValue }) => {
  const [deviceId, setDeviceId] = useState(defaultValue || "")
  const { devices } = useMediaDevices({ constraints })

  useEffect(() => {
    const id = localStorage.getItem("deviceId")

    !deviceId && id && setDeviceId(id)
  }, [deviceId])

  const handleSelectCamera = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    localStorage.setItem("deviceId", value)
    setDeviceId(value)
    onChange(value)
  }

  return (
    <>
      {
          devices &&
          <select className="w-full text-black p-3 bg-white" onChange={handleSelectCamera} value={deviceId}>
            {
              devices?.filter((device) => device.kind === "videoinput").map((camera: MediaDeviceInfo) => (
                <option 
                  key={camera.deviceId} 
                  value={camera.deviceId}
                >
                  {camera.label}
                </option>
              ))
            }
          </select>
        }
    </>
  )
}

export default CameraSelect