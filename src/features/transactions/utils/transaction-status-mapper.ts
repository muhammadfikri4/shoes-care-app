import { TRANSACTION_STATUS, TransactionStatus } from "@core/model/transaction";
import { BadgeVariant } from "@features/_global/components/Badge";

export interface TransactionStatusConfig {
  label: string;
  badgeVariant: BadgeVariant;
  borderVariant: string;
}

/**
 * Mapping untuk Transaction Status
 * - label: untuk display text
 * - badgeVariant: untuk Badge component
 * - borderVariant: untuk border color (tailwind classes)
 */
export const TRANSACTION_STATUS_MAP: Record<
  TransactionStatus,
  TransactionStatusConfig
> = {
  [TRANSACTION_STATUS.CREATED]: {
    label: "Dibuat",
    badgeVariant: "default",
    borderVariant: "border-yellow-500",
  },
  [TRANSACTION_STATUS.IN_PROGRESS]: {
    label: "Diproses",
    badgeVariant: "secondary",
    borderVariant: "border-gray-500",
  },
  [TRANSACTION_STATUS.READY_TO_PICKUP]: {
    label: "Siap Diambil",
    badgeVariant: "primary",
    borderVariant: "border-blue-500",
  },
  [TRANSACTION_STATUS.COMPLETED]: {
    label: "Selesai",
    badgeVariant: "success",
    borderVariant: "border-green-500",
  },
  [TRANSACTION_STATUS.CANCELLED]: {
    label: "Dibatalkan",
    badgeVariant: "danger",
    borderVariant: "border-red-500",
  },
} as const;

/**
 * Get status configuration
 */
export const getTransactionStatusConfig = (
  status: TransactionStatus
): TransactionStatusConfig => {
  return (
    TRANSACTION_STATUS_MAP[status] || {
      label: status,
      badgeVariant: "secondary",
      borderVariant: "border-gray-500",
    }
  );
};

/**
 * Get display label for status
 */
export const getTransactionStatusLabel = (status: TransactionStatus): string => {
  return getTransactionStatusConfig(status).label;
};

/**
 * Get badge variant for status
 */
export const getTransactionStatusBadgeVariant = (
  status: TransactionStatus
): BadgeVariant => {
  return getTransactionStatusConfig(status).badgeVariant;
};

/**
 * Get border variant (tailwind class) for status
 */
export const getTransactionStatusBorderVariant = (
  status: TransactionStatus
): string => {
  return getTransactionStatusConfig(status).borderVariant;
};
