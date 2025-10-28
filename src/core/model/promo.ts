export interface PromoModel {
  id: string;
  code: string;
  userId: string;
  discountPercent: number;
  isActive: boolean;
  used: boolean;
  usedAt?: string | null;
  createdAt: string;
  user?: { id: string; email: string; name?: string | null };
}

export interface PromoCheckResponse {
  valid: boolean;
  code: string;
  discountPercent: number;
}

