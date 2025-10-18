import React from 'react';
import { Badge, type BadgeVariant } from "@features/_global/components/Badge";

export const TransactionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    CREATED: { label: 'Pending', variant: 'warning' },
    IN_PROGRESS: { label: 'On Process', variant: 'secondary' },
    READY_FOR_PICKUP: { label: 'Ready to Pick Up', variant: 'primary' },
    PICKED_UP: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
  } as const;
  const cfg = map[status] || { label: status, variant: 'secondary' };
  // @ts-ignore
  return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
};
