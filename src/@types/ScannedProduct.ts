import { Product } from "./Product"

export type ScannedProduct = Product & {
  id: string,
  quantity: number,
  expDate?: Date
}

