export type ProductCategory = "tyre" | "battery";

export type RequestStatus =
  | "pending"
  | "quoted"
  | "available"
  | "not_available"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AvailabilityStatus = "pending" | "available" | "not_available";

export type CarCareProduct = {
  id: string;
  category: ProductCategory;
  brand: string;
  name: string;
  size: string;
  price: number;
  stock: number;
  active: boolean;
  description: string;
};

export type VehicleFitment = {
  id: string;
  carBrand: string;
  carType: string;
  tyreSize: string;
  batterySize: string;
};

export type ServiceRequest = {
  id: string;
  requestNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carBrand: string;
  carType: string;
  productId: string;
  productCategory: ProductCategory;
  productName: string;
  productSize: string;
  estimatePrice: number;
  quotedPrice?: number;
  availability: AvailabilityStatus;
  status: RequestStatus;
  preferredDate: string;
  customerNote: string;
  adminNote: string;
  createdAt: string;
};

export type CarCareStore = {
  products: CarCareProduct[];
  fitments: VehicleFitment[];
  requests: ServiceRequest[];
};

export type ProductDraft = Omit<CarCareProduct, "id"> & { id?: string };
export type FitmentDraft = Omit<VehicleFitment, "id"> & { id?: string };
