'use client'
import { useState } from "react";

import ImageAnalyzer from "@/components/ExpDateButton";
import BarcodeReader from "@/components/BarcodeReader";
import { Product } from "@/@types/Product";
import ExpDateButton from "@/components/ExpDateButton";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  const handleProductDetected = (product: Product) => {
    setProducts((products: Product[]) => [...products, product])
  }

  console.log(products)
  
  return (
    <main className="flex flex-col gap-2">
      <BarcodeReader onDetected={handleProductDetected} />
      <div className="w-full flex flex-col">
      {
        products.map((product) => (
          <div key={product.barcode_formats.ean_13} className="p-3 flex justify-between">{product.title} <ExpDateButton /></div>
        ))
      }
      </div>
    </main>
  );
}
