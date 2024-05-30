import { ScannedProduct } from "@/@types/ScannedProduct";
import { FC } from "react";
import { FaTrash } from "react-icons/fa";
import { RiLoader5Fill } from "react-icons/ri";
import { MdCamera } from "react-icons/md";
import useGoogleLens from "@/hooks/useGoogleLens";
import { formatDate } from "@/app/utils/dates";

type Props = {
  scannedProducts: ScannedProduct[],
  onDeleteItem(id: string): void,
  onDetectDate(id: string, date: Date): void
}

const ScannedProductList: FC<Props> = ({ scannedProducts, onDeleteItem, onDetectDate }) => {

  const { analyzeImage, loading } = useGoogleLens({ videoId: "camera-stream" })

  const handleClick = async (id: string) => {
    const { dates } = await analyzeImage()

    dates && dates[0] && onDetectDate(id, dates[0])
  }

  return (
    <div className="w-full flex flex-col">
      {
        scannedProducts.map((scannedProduct) => (
          <div key={scannedProduct.id} className="px-5 py-3 flex justify-between">
            <div className="flex flex-col">
            <span className="text-sm text-gray-500">{scannedProduct.code}</span>
            <span className="text-xl">{scannedProduct.product_name}</span>
            <span className="text-sm">Expiring date: {scannedProduct.expDate ? formatDate(scannedProduct.expDate) : "?"}</span>
            </div>
            <div className="flex gap-5 text-3xl">
              {
                !scannedProduct.expDate &&
                  <button
                    onClick={() => handleClick(scannedProduct.id)}
                    disabled={loading}
                  >
                    {loading ? <RiLoader5Fill className="animate-spin" /> : <MdCamera />}
                  </button>
              }
              <button
                onClick={() => onDeleteItem(scannedProduct.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ScannedProductList