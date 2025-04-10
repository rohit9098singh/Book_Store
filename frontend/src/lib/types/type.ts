export interface BookDetails {
  _id: string;
  title: string;
  images: File[];
  subject: string;
  category: string;
  condition: string;
  classType: string;
  price: number;
  author: string;
  edition?: string;
  description?: string;
  finalPrice: number;
  shippingCharge: string;
  seller: userData;
  paymentMode: "UPI" | "Bank Account";
  paymentDetails: {
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  createdAt: Date;
}

export interface userData {
  name: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
  address: Address[];
}

export interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Product {
  _id: string;
  images: string[];
  title: string;
  price: number;
  finalPrice: number;
  shippingCharge: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  _id: string;
  product: BookDetails;
  quantity: number;
}

export interface PaymentDetails {
  razorpay_order_id: String;
  razorpay_payment_id: String;
  razorpay_signature: String;
}

export interface Order {
  _id: string;
  user: userData;
  items: OrderItem;
  totalAmount: number;
  createdAt: Date;

  shippingAddress: Address;
  paymentStatus: "pending" | "complete" | "failed";
  paymentMethod: string;
  paymentDetails: PaymentDetails;
  status:string;
}
