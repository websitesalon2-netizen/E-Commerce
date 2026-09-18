export type PaymentMethod = 'UPI' | 'QR' | 'COD';

export type PaymentStatus = 
  | 'Payment Pending'
  | 'Payment Verification Required'
  | 'Payment Verified'
  | 'COD - Pay on Delivery';

export type OrderStatus =
  | 'New'
  | 'Payment Pending'
  | 'Payment Verification Required'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  sku: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  featured: boolean;
  newArrival: boolean;
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  unitPrice: number;
  productTotal: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  mobile: string;
  whatsapp?: string;
  address: string;
  landmark?: string;
  city: string;
  pinCode: string;
  deliveryInstructions?: string;
  notes?: string;
  internalNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  estimatedDistanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  shopName: string;
  subtitle: string;
  logoUrl?: string;
  faviconUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PaymentSettings {
  upiId: string;
  upiDisplayName: string;
  upiInstructions: string;
  qrCodeUrl?: string;
  codEnabled: boolean;
}

export interface DeliverySettings {
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  codRadiusKm: number;
  deliveryAvailable: boolean;
  onlineOrdersOpen: boolean;
  orderClosedMessage: string;
}

export interface DayHours {
  open: boolean;
  openingTime: string;
  closingTime: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  address: string;
  pinCode: string;
  googleMapsUrl: string;
  email?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  borderRadius: string;
}

export interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImageUrl?: string;
  promoBannerText?: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl?: string;
  contactHeading: string;
  contactDescription: string;
  footerText: string;
  deliveryPolicy: string;
  returnPolicy: string;
  termsConditions: string;
  privacyPolicy: string;
}

export type UserRole = 'guest' | 'manager' | 'developer';
