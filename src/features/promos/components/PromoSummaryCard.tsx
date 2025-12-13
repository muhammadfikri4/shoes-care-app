import React from "react";
import { PromoSummary } from "@core/model/promo";
import { ROLE } from "@core/model/profile";
import { Poppins } from "../../_global/components/Text";
import { Skeleton } from "../../_global/components/Shimer";

interface PromoSummaryCardProps {
  summary?: PromoSummary;
  role?: string;
  isLoading?: boolean;
}

export const PromoSummaryCard: React.FC<PromoSummaryCardProps> = ({
  summary,
  role,
  isLoading,
}) => {
  const isAdmin = role === ROLE.ADMIN || role === ROLE.SUPERADMIN;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
          >
            <div className="space-y-3">
              <Skeleton width="75%" height="1rem" />
              <Skeleton width="40%" height="2rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const adminStats = [
    {
      label: "Total Promo",
      value: summary.totalPromo ?? 0,
      color: "text-blue-600",
    },
    {
      label: "Total Pelanggan Yang Memiliki Promo",
      value: summary.totalCustomerWithPromo ?? 0,
      color: "text-green-600",
    },
    {
      label: "Total Promo Terpakai",
      value: summary.totalPromoUsed ?? 0,
      color: "text-purple-600",
    },
    {
      label: "Total Promo Belum Terpakai",
      value: summary.totalPromoUnused ?? 0,
      color: "text-orange-600",
    },
  ];

  const customerStats = [
    {
      label: "Total Promo Saya",
      value: summary.totalPromoOwned ?? 0,
      color: "text-blue-600",
    },
    {
      label: "Total Promo Terpakai",
      value: summary.customerTotalPromoUsed ?? 0,
      color: "text-green-600",
    },
    {
      label: "Total Promo Tersedia",
      value: summary.customerTotalPromoUnused ?? 0,
      color: "text-purple-600",
    },
    {
      label: "Total Transaksi",
      value: summary.totalTransactionAfterPromo ?? 0,
      color: "text-orange-600",
    },
  ];

  const stats = isAdmin ? adminStats : customerStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <Poppins className="text-sm text-slate-600 mb-1">
            {stat.label}
          </Poppins>
          <Poppins className={`text-2xl font-semibold ${stat.color}`}>
            {stat.value}
          </Poppins>
        </div>
      ))}
    </div>
  );
};
