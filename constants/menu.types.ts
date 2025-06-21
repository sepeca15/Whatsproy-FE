export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

export interface MenuSettings {
  template: "classic" | "modern" | "minimalist" | "elegant"
  showPrices: boolean
  showDescriptions: boolean
  showImages: boolean
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logoUrl: string
  restaurantName: string
  categoryOrder: string[]
  columns: 1 | 2
}

export interface MenuTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export interface ExportOptions {
  format: "pdf" | "png" | "jpeg"
  quality: "standard" | "high" | "ultra"
  size: string
}
