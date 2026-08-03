export interface ColorOption {
  label: string;
  swatchClass: string;
  img: string;
  hex?: string;
}

export interface SizeOption {
  value: string;
  price?: string;
  active?: boolean;
}

export interface UnitVariantOption {
  id: number;
  label: string;
  price: number;
  priceOld?: number;
  stock: number;
  img?: string;
  isDefault?: boolean;
}
