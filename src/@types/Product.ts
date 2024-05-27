export type Product = {
  barcode_formats: {
    ean_13: string
  },
  brand: string,
  category: string,
  description: string,
  images: string[],
  ingredients: string[],
  manufacturer: string,
  title: string
}