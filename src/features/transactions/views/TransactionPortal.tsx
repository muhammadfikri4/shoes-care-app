import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingFallback } from "../../_global/components/Loading";
import { NotFound } from "../../_global/components/NotFound";
import { formatTime } from "../../_global/lib/format-time";
import { TransactionStatusBadge } from "../components/TransactionStatusBadge";
import { TransactionTimeline } from "../components/TransactionTimeline";
import DSC from "@core/assets/logo/DSC.svg";
import { TRANSACTION_STATUS } from "@core/model/transaction";
import { usePortalTransaction } from "../hooks/useTransactions";

export const TransactionPortal: React.FC = () => {
  const { id } = useParams();
  const [, setShowImageIndex] = useState<number | null>(null);

  const { data, isFetching, error } = usePortalTransaction(id);

  const trx = data?.data;
  const items = trx?.items ?? [];
  const format = useMemo(
    () => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  if (isFetching) {
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingFallback />
      </div>
    );
  }
  if (error || !trx) {
    return (
      <div className="min-h-screen grid place-items-center p-4">
        <NotFound withBackButton={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Simple header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">
            Detail Transaksi #{trx.code}
          </h1>
          <p className="text-slate-500 text-sm">
            Dibuat {trx.createdAt ? formatTime(trx.createdAt) : "-"}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Info label="Nama" value={trx.customer?.name || "-"} />
            <Info label="Email" value={trx.customer?.email || "-"} />
            <Info label="No Telepon" value={trx.customer?.phone || "-"} />
            <Info label="Kode Transaksi" value={trx.code || "-"} />
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">Status</div>
              <div className="mt-1">
                <TransactionStatusBadge status={trx.status || TRANSACTION_STATUS.CREATED} />
              </div>
            </div>
            <Info label="Metode Pembayaran" value={trx.paymentMethod || "-"} />
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">Total Harga</div>
              <div className="font-semibold mt-0.5">
                {format.format(Number(trx.finalPrice || trx.price) || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm mt-4">
          <div className="font-semibold mb-3">Timeline</div>
          <TransactionTimeline status={trx.status || "IN_PROGRESS"} />
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm mt-4">
          <div className="font-semibold mb-3">Items</div>
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada item.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {items.map((it, idx) => (
                <ItemCard
                  key={it.id}
                  name={it.name}
                  rackCode={it.rackCode}
                  price={it.price}
                  estimateDay={it.estimateDay}
                  imgSrc={it.photoUrl}
                  currencyFormatter={format}
                  onClickImage={() => setShowImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
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
  onClickImage?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  rackCode,
  price,
  imgSrc,
  currencyFormatter,
  estimateDay,
  onClickImage,
}) => {
  const src = imgSrc || DSC;
  return (
    <div className="border border-slate-100 rounded-lg p-3 sm:p-4 bg-white shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative w-full sm:w-24 aspect-square rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <img
            src={src}
            alt={name || "Item"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onClick={onClickImage}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (t.src !== DSC) t.src = DSC;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base leading-snug line-clamp-1">
            {name || "-"}
          </div>
          <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nomor Rak: <span className="font-medium">{rackCode || "-"}</span>
          </div>
          <div className="mt-2 text-sm">
            Harga: <span className="font-semibold">{currencyFormatter.format(Number(price || 0))}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Estimasi: {estimateDay || 0} Hari</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPortal;

