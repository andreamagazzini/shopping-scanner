'use client'
import { useEffect, useState } from "react";

import BarcodeReader from "@/components/BarcodeReader";
import { Product } from "@/@types/Product";
import CameraSelect from "@/components/CameraSelect";
import ScannedProductList from "@/components/ScannedProductList";
import { ScannedProduct } from "@/@types/ScannedProduct";

export default function Home() {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([])
  const [deviceId, setDeviceId] = useState("")

  useEffect(() => {
    const id = localStorage.getItem("deviceId")

    id && setDeviceId(id)
  }, [])

  const handleProductDetected = (product: Product) => {
    let scannedProduct = { 
      ...product,
      id: `${product.code}-${Date.now()}`,
      quantity: 1
    } as ScannedProduct
    
    setScannedProducts((scannedProducts: ScannedProduct[]) => [...scannedProducts, scannedProduct])
  }

  const handleChangeCamera = (id: string) => {
    localStorage.setItem("deviceId", id)
    setDeviceId(id)
  }

  const handleDelete = (id: string) => {
    setScannedProducts((scannedProducts: ScannedProduct[]) => scannedProducts.filter((sp) => sp.id !== id))
  }

  const handleDetectDate = (id: string, date: Date) => {
    setScannedProducts((scannedProducts: ScannedProduct[]) => scannedProducts.map((sp) => {
      if (sp.id === id) { 
        return { ...sp, expDate: date }
      }

      return sp
    }))
  }
  
  return (
    <main className="flex flex-col gap-2">
      <CameraSelect onChange={handleChangeCamera} defaultValue={deviceId} />
      <BarcodeReader onDetected={handleProductDetected} deviceId={deviceId} />
      <ScannedProductList scannedProducts={scannedProducts} onDeleteItem={handleDelete} onDetectDate={handleDetectDate} />
    </main>
  );
}
