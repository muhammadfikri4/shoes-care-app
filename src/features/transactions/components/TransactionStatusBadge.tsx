import React from "react";
import { Badge } from "@features/_global/components/Badge";
import { TransactionStatus } from "../../../core/model/transaction";
import { getTransactionStatusConfig } from "../utils/transaction-status-mapper";

export const TransactionStatusBadge: React.FC<{
  status: TransactionStatus;
}> = ({ status }) => {
  const cfg = getTransactionStatusConfig(status);
  return (
    <Badge variant={cfg.badgeVariant} size="sm">
      {cfg.label}
    </Badge>
  );
};
