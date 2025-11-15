import DSC from "@core/assets/logo/DSC.svg";
import React, { useMemo } from "react";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { LoadingFallback } from "../../_global/components/Loading";
import { formatTime } from "../../_global/lib/format-time";
import { TransactionStatusBadge } from "../components/TransactionStatusBadge";
import { TransactionTimeline } from "../components/TransactionTimeline";
import {
  useDetailTransaction,
  useMarkCompleted,
  useMarkReadyToPickup,
} from "../hooks/useTransactions";
import { Button } from "../../_global/components/Button";
import { TRANSACTION_STATUS } from "../../../core/model/transaction";

export const TransactionDetail: React.FC = () => {
  const { data: transaction, isFetching, error } = useDetailTransaction();
  const markReady = useMarkReadyToPickup();
  const markDone = useMarkCompleted();

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  if (isFetching) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-600">{error?.message}</div>;

  const items = transaction?.data?.items ?? [];

  return (
    <BaseLayout
      title={`Detail Transaksi #${transaction?.data?.code}`}
      backButton={{
        title: "Kembali",
      }}
      actionType="node"
      action={
        <>
          {transaction?.data?.status === "IN_PROGRESS" && (
            <Button
              variant={markReady.isPending ? "disabled" : "primary"}
              onClick={() =>
                transaction?.data?.id &&
                markReady.mutate({ id: transaction.data.id })
              }
            >
              {markReady.isPending ? "Memproses..." : "Siap Diambil"}
            </Button>
          )}
          {transaction?.data?.status === TRANSACTION_STATUS.READY_TO_PICKUP && (
            <Button
              variant={markDone.isPending ? "disabled" : "success"}
              onClick={() =>
                transaction?.data?.id &&
                markDone.mutate({ id: transaction.data.id })
              }
            >
              {markDone.isPending ? "Memproses..." : "Selesai"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Info ringkas */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoItem
              label="Nama"
              value={transaction?.data?.customer?.name || "-"}
            />
            <InfoItem
              label="Email"
              value={transaction?.data?.customer?.email || "-"}
            />
            <InfoItem
              label="No Telepon"
              value={transaction?.data?.customer?.phone || "-"}
            />
            <InfoItem
              label="Tanggal Transaksi"
              value={
                transaction?.data?.createdAt
                  ? formatTime(transaction?.data?.createdAt)
                  : "-"
              }
            />
            <InfoItem
              label="Kode Transaksi"
              value={transaction?.data?.code || "-"}
            />
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">Status</div>
              <div className="mt-0.5">
                <TransactionStatusBadge
                  status={transaction?.data?.status || TRANSACTION_STATUS.CREATED}
                />
              </div>
            </div>
            <InfoItem
              label="Metode Pembayaran"
              value={transaction?.data?.paymentMethod || "-"}
            />
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">
                Total Harga
              </div>
              <div className="font-semibold mt-0.5">
                {format.format(
                  Number(
                    transaction?.data?.finalPrice || transaction?.data?.price
                  ) || 0
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
          <div className="font-semibold mb-3">Timeline</div>
          <TransactionTimeline
            status={transaction?.data?.status || "IN_PROGRESS"}
          />
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
          <div className="font-semibold mb-3">Items</div>

          {items.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada item.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {items.map((it) => (
                <ItemCard
                  estimateDay={it.estimateDay}
                  key={it.id}
                  name={it.name}
                  rackCode={it.rackCode}
                  price={it.price}
                  imgSrc={it.photoUrl}
                  currencyFormatter={format}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <div className="text-slate-500 text-xs sm:text-sm">{label}</div>
    <div className="font-medium mt-0.5 break-words">{value}</div>
  </div>
);

type ItemCardProps = {
  name?: string;
  rackCode?: string | null;
  price?: number;
  estimateDay?: number | null;
  imgSrc?: string | null;
  currencyFormatter: Intl.NumberFormat;
};

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  rackCode,
  price,
  imgSrc,
  currencyFormatter,
  estimateDay,
}) => {
  const src = imgSrc || DSC;

  return (
    <div className="border border-slate-100 rounded-lg p-3 sm:p-4 bg-white shadow-xs hover:shadow-sm transition-shadow">
      {/* layout berubah: vertikal di mobile, horizontal di >=sm */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-24 aspect-square rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <img
            src={src}
            alt={name || "Item"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (t.src !== DSC) t.src = DSC;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base leading-snug line-clamp-1">
            {name || "-"}
          </div>
          <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nomor Rak: <span className="font-medium">{rackCode || "-"}</span>
          </div>

          <div className="mt-2 text-sm">
            Harga:{" "}
            <span className="font-semibold">
              {currencyFormatter.format(Number(price || 0))}
            </span>
          </div>

          <div className="text-xs text-slate-500 mt-1">
            Estimasi: {estimateDay || 0} Hari
          </div>
        </div>
      </div>
    </div>
  );
};
