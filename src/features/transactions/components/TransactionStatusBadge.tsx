import React from "react";
import { Badge, type BadgeVariant } from "@features/_global/components/Badge";
import {
  TRANSACTION_STATUS,
  TransactionStatus,
} from "../../../core/model/transaction";

export const TransactionStatusBadge: React.FC<{
  status: TransactionStatus;
}> = ({ status }) => {
  const map: Record<
    TransactionStatus,
    { label: string; variant: BadgeVariant }
  > = {
    [TRANSACTION_STATUS.CREATED]: { label: "Pending", variant: "warning" },
    [TRANSACTION_STATUS.IN_PROGRESS]: {
      label: "On Process",
      variant: "secondary",
    },
    [TRANSACTION_STATUS.READY_TO_PICKUP]: {
      label: "Ready to Pick Up",
      variant: "primary",
    },
    [TRANSACTION_STATUS.COMPLETED]: { label: "Completed", variant: "success" },
    [TRANSACTION_STATUS.CANCELLED]: { label: "Cancelled", variant: "danger" },
  } as const;
  const cfg = map[status] || { label: status, variant: "secondary" };
  return (
    <Badge variant={cfg.variant} size="sm">
      {cfg.label}
    </Badge>
  );
};
