export interface PromoModel {
  id: string;
  code: string;
  userId: string;
  discountPercent: number;
  isActive: boolean;
  isUsed: boolean;
  usedAt?: string | null;
  createdAt: string;
  user?: { id: string; email: string; name?: string | null };
}

export interface PromoCheckResponse {
  valid: boolean;
  code: string;
  discountPercent: number;
}

export interface PromoSummary {
  totalPromo?: number;                    // Admin: Total promos in system
  totalCustomerWithPromo?: number;        // Admin: Total customers who have promos
  totalPromoUsed?: number;                // Admin: Total promos used by all customers
  totalPromoUnused?: number;              // Admin: Total promos unused by all customers
  totalPromoOwned?: number;               // Customer: Total promos owned by this customer
  customerTotalPromoUsed?: number;        // Customer: Total promos used by this customer
  customerTotalPromoUnused?: number;      // Customer: Total promos unused by this customer
  totalTransactionAfterPromo?: number;    // Customer: Eligibility count
}

