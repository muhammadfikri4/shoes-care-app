import {
  TRANSACTION_ITEM_STATUS,
  TransactionItemStatus,
} from "@core/model/transaction";
import { BadgeVariant } from "@features/_global/components/Badge";

export interface TransactionItemStatusConfig {
  label: string;
  badgeVariant: BadgeVariant;
}

/**
 * Mapping untuk Transaction Item Status
 * - label: untuk display text
 * - badgeVariant: untuk Badge component
 */
export const TRANSACTION_ITEM_STATUS_MAP: Record<
  TransactionItemStatus,
  TransactionItemStatusConfig
> = {
  [TRANSACTION_ITEM_STATUS.INCOMING]: {
    label: "Belum Dikerjakan",
    badgeVariant: "warning",
  },
  [TRANSACTION_ITEM_STATUS.IN_PROGRESS]: {
    label: "Dalam Proses",
    badgeVariant: "secondary",
  },
  [TRANSACTION_ITEM_STATUS.COMPLETED]: {
    label: "Selesai",
    badgeVariant: "success",
  },
} as const;

/**
 * Get status configuration
 */
export const getTransactionItemStatusConfig = (
  status: TransactionItemStatus
): TransactionItemStatusConfig => {
  return (
    TRANSACTION_ITEM_STATUS_MAP[status] || {
      label: status,
      badgeVariant: "secondary",
    }
  );
};

/**
 * Get display label for status
 */
export const getTransactionItemStatusLabel = (
  status: TransactionItemStatus
): string => {
  return getTransactionItemStatusConfig(status).label;
};

/**
 * Get badge variant for status
 */
export const getTransactionItemStatusBadgeVariant = (
  status: TransactionItemStatus
): BadgeVariant => {
  return getTransactionItemStatusConfig(status).badgeVariant;
};
