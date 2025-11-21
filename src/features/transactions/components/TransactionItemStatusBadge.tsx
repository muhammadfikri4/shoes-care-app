import React from "react";
import { Badge } from "@features/_global/components/Badge";
import { TransactionItemStatus } from "@core/model/transaction";
import { getTransactionItemStatusConfig } from "../utils/transaction-item-status-mapper";

export const TransactionItemStatusBadge: React.FC<{
  status: TransactionItemStatus;
}> = ({ status }) => {
  const cfg = getTransactionItemStatusConfig(status);
  return (
    <Badge variant={cfg.badgeVariant} size="sm">
      {cfg.label}
    </Badge>
  );
};
