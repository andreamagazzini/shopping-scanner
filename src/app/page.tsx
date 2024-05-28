'use client'
import { useEffect, useState } from "react";

import BarcodeReader from "@/components/BarcodeReader";
import { Product } from "@/@types/Product";
import ExpDateButton from "@/components/ExpDateButton";
import CameraSelect from "@/components/CameraSelect";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [deviceId, setDeviceId] = useState("")

  useEffect(() => {
    const id = localStorage.getItem("deviceId")

    id && setDeviceId(id)
  }, [])

  const handleProductDetected = (product: Product) => {
    setProducts((products: Product[]) => [...products, product])
  }

  const handleChangeCamera = (id: string) => {
    localStorage.setItem("deviceId", id)
    setDeviceId(id)
  }
  
  return (
    <main className="flex flex-col gap-2">
      <CameraSelect onChange={handleChangeCamera} defaultValue={deviceId} />
      <BarcodeReader onDetected={handleProductDetected} deviceId={deviceId} />
      <div className="w-full flex flex-col">
      {
        products.map((product) => (
          <div key={product.code} className="p-3 flex justify-between">{product.product_name} <ExpDateButton /></div>
        ))
      }
      </div>
    </main>
  );
}
