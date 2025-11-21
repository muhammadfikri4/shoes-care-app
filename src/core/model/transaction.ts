export type PaymentMethod = "QRIS" | "CASH";

export type TransactionStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "READY_TO_PICKUP"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type TransactionItemStatus = "INCOMING" | "IN_PROGRESS" | "COMPLETED";

export enum TRANSACTION_STATUS {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  READY_TO_PICKUP = "READY_TO_PICKUP",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TRANSACTION_ITEM_STATUS {
  INCOMING = "INCOMING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface TransactionItemModel {
  id: string;
  name: string;
  qty: number;
  price: number;
  status?: TransactionItemStatus;
  estimateDay?: number | null;
  photoUrl?: string | null;
  note?: string | null;
  rackCode?: string | null;
}

export interface TransactionModel {
  id: string;
  code: string;
  status: TransactionStatus;
  createdAt: string;
  price: number;
  finalPrice: number;
  promoApplied: boolean;
  discount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paidAt?: string | null;
  cashPaid?: number | null;
  cashChange?: number | null;
  midtransToken?: string | null;
  midtransRedirectUrl?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  rack?: { id: string; code: string; name?: string | null } | null;
  items?: TransactionItemModel[];
  quantityShoes?: number;
}

export interface TransactionCreateItem {
  shoeName: string;
  price: number;
  qty?: number;
  days?: number;
  photoUrl?: string;
  note?: string;
}

export interface TransactionCreateRequest {
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: PaymentMethod;
  usePromo?: boolean;
  promoCode?: string;
  cashPaid?: number;
  items?: TransactionCreateItem[];
  price?: number;
}

export interface TransactionListResponse {
  rows: TransactionModel[];
}

export interface TransactionHistoryItem {
  id: string;
  previousStatus?: TransactionStatus | null;
  newStatus: TransactionStatus;
  note?: string | null;
  changedAt: string;
}

export interface TransactionLookupModel {
  id: string;
  code: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  rack: { id: string; code: string; name?: string | null } | null;
  price: number;
  finalPrice: number;
  promoApplied: boolean;
  discount?: number;
  qrCodeUrl?: string | null;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  items: TransactionItemModel[];
  history: TransactionHistoryItem[];
}

export interface OkResponse {
  ok: boolean;
}

export interface PromoVerifyRequest {
  email: string;
  code: string;
}
export interface PromoVerifyResponse {
  valid: boolean;
  discountPercent: number;
}

export interface TransactionItem {
  rack: { id: string; name: string };
  name: string;
  price: number;
  estimateDay: number;
  file?: File;
  note?: string;
}

export interface TransactionCreationDTO {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  usePromo: boolean;
  cashPaid: number;
  promoCode: string;
  items: TransactionItem[];
}
