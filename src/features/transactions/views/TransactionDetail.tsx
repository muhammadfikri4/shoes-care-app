import DSC from "@core/assets/logo/DSC.svg";
import { ROLE } from "@core/model/profile";
import { useProfile } from "@features/profile/hooks/useProfile";
import React, { useEffect, useMemo, useState } from "react";
import {
  TRANSACTION_ITEM_STATUS,
  TRANSACTION_STATUS,
} from "../../../core/model/transaction";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { LoadingFallback } from "../../_global/components/Loading";
import { NotFound } from "../../_global/components/NotFound";
import { formatTime } from "../../_global/lib/format-time";
import { QRCodeModal } from "../components/QRCodeModal";
import { TransactionConfirmationModal } from "../components/TransactionConfirmationModal";
import { TransactionItemConfirmationModal } from "../components/TransactionItemConfirmationModal";
import { TransactionItemStatusBadge } from "../components/TransactionItemStatusBadge";
import { TransactionStatusBadge } from "../components/TransactionStatusBadge";
import { TransactionTimeline } from "../components/TransactionTimeline";
import {
  useDetailTransaction,
  useMarkCompleted,
  useMarkReadyToPickup,
  useUpdateItemStatus,
} from "../hooks/useTransactions";

export const TransactionDetail: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: transaction, isFetching, error } = useDetailTransaction();
  const markReady = useMarkReadyToPickup();
  const markDone = useMarkCompleted();
  const updateItemStatus = useUpdateItemStatus();
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  // Close modals on successful mutation
  useEffect(() => {
    if (markReady.isSuccess) {
      setShowReadyModal(false);
    }
  }, [markReady.isSuccess]);

  useEffect(() => {
    if (markDone.isSuccess) {
      setShowCompleteModal(false);
    }
  }, [markDone.isSuccess]);

  useEffect(() => {
    if (updateItemStatus.isSuccess) {
      setItemToUpdate(null);
    }
  }, [updateItemStatus.isSuccess]);

  if (isFetching) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }
  if (error)
    return (
      <>
        <div className="w-screen h-screen flex flex-col items-center justify-center p-4 text-red-600">
          <NotFound withBackButton width={"30rem"} gap={"1rem"} />
        </div>
        ;
      </>
    );

  const items = transaction?.data?.items ?? [];
  const isAdmin =
    profile?.data?.role === ROLE.ADMIN ||
    profile?.data?.role === ROLE.SUPERADMIN;

  return (
    <BaseLayout
      title={`Detail Transaksi #${transaction?.data?.code}`}
      backButton={{
        title: "Kembali",
      }}
      actionType="node"
      action={
        <div className="flex md:flex-row flex-col gap-2">
          {transaction?.data?.qrCodeUrl && (
            <div className="md:w-40 w-full">
              <Button variant="secondary" onClick={() => setShowQRModal(true)}>
                Lihat QR Code
              </Button>
            </div>
          )}
          {transaction?.data?.status === "IN_PROGRESS" && isAdmin && (
            <div className="md:w-40 w-full">
              <Button variant="primary" onClick={() => setShowReadyModal(true)}>
                Siap Diambil
              </Button>
            </div>
          )}
          {transaction?.data?.status === TRANSACTION_STATUS.READY_TO_PICKUP &&
            isAdmin && (
              <div className="md:w-40 w-full">
                <Button
                  variant="success"
                  onClick={() => setShowCompleteModal(true)}
                >
                  Selesai
                </Button>
              </div>
            )}
        </div>
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
                  status={
                    transaction?.data?.status || TRANSACTION_STATUS.CREATED
                  }
                />
              </div>
            </div>
            <InfoItem
              label="Metode Pembayaran"
              value={transaction?.data?.paymentMethod || "-"}
            />
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">Harga</div>
              <div className="font-semibold mt-0.5">
                {format.format(Number(transaction?.data?.price) || 0)}
              </div>
            </div>
            {transaction?.data?.discount && transaction.data.discount > 0 ? (
              <div>
                <div className="text-slate-500 text-xs sm:text-sm">Diskon</div>
                <div className="font-semibold mt-0.5 text-green-600">
                  {transaction.data.discount}%
                </div>
              </div>
            ) : null}
            <div>
              <div className="text-slate-500 text-xs sm:text-sm">
                Total Harga
              </div>
              <div className="font-semibold mt-0.5 text-blue-600">
                {format.format(Number(transaction?.data?.finalPrice) || 0)}
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
                  itemId={it.id}
                  name={it.name}
                  rackCode={it.rackCode}
                  price={it.price}
                  imgSrc={it.photoUrl}
                  status={it.status}
                  currencyFormatter={format}
                  transactionId={transaction?.data?.id}
                  transactionStatus={transaction?.data?.status}
                  isAdmin={isAdmin}
                  onUpdateStatus={(itemId, itemName) => {
                    setItemToUpdate({ id: itemId, name: itemName });
                  }}
                  isUpdating={updateItemStatus.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Siap Diambil */}
      <TransactionConfirmationModal
        isOpen={showReadyModal}
        onClose={() => setShowReadyModal(false)}
        onConfirm={() => {
          if (transaction?.data?.id) {
            markReady.mutate({ id: transaction.data.id });
          }
        }}
        type="ready"
        transactionCode={transaction?.data?.code}
        isPending={markReady.isPending}
      />

      {/* Modal Konfirmasi Selesai */}
      <TransactionConfirmationModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={() => {
          if (transaction?.data?.id) {
            markDone.mutate({ id: transaction.data.id });
          }
        }}
        type="complete"
        transactionCode={transaction?.data?.code}
        isPending={markDone.isPending}
      />

      {/* Modal Konfirmasi Selesai Item */}
      <TransactionItemConfirmationModal
        isOpen={!!itemToUpdate}
        onClose={() => setItemToUpdate(null)}
        onConfirm={() => {
          if (itemToUpdate) {
            updateItemStatus.mutate({
              itemId: itemToUpdate.id,
            });
          }
        }}
        itemName={itemToUpdate?.name}
        isPending={updateItemStatus.isPending}
      />

      {/* Modal QR Code */}
      {transaction?.data?.qrCodeUrl && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          qrCodeUrl={transaction.data.qrCodeUrl}
          transactionCode={transaction.data.code}
        />
      )}
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
  itemId: string;
  name?: string;
  rackCode?: string | null;
  price?: number;
  estimateDay?: number | null;
  imgSrc?: string | null;
  status?: string;
  currencyFormatter: Intl.NumberFormat;
  transactionId?: string;
  transactionStatus?: string;
  isAdmin?: boolean;
  onUpdateStatus?: (itemId: string, itemName: string) => void;
  isUpdating?: boolean;
};

const ItemCard: React.FC<ItemCardProps> = ({
  itemId,
  name,
  rackCode,
  price,
  imgSrc,
  status,
  currencyFormatter,
  estimateDay,
  transactionStatus,
  isAdmin,
  onUpdateStatus,
  isUpdating,
}) => {
  const src = imgSrc || DSC;
  const showUpdateButton =
    status === TRANSACTION_ITEM_STATUS.IN_PROGRESS &&
    transactionStatus === TRANSACTION_STATUS.IN_PROGRESS &&
    isAdmin;

  return (
    <div className="border border-slate-100 rounded-lg p-3 sm:p-4 bg-white shadow-xs hover:shadow-sm transition-shadow">
      {/* layout berubah: vertikal di mobile, horizontal di >=sm */}
      <div className="flex flex-col gap-3">
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

        {/* Status Badge */}
        {status && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <TransactionItemStatusBadge
              status={status as "INCOMING" | "IN_PROGRESS" | "COMPLETED"}
            />
          </div>
        )}

        {showUpdateButton && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onUpdateStatus?.(itemId, name || "Item")}
            disabled={isUpdating}
          >
            {isUpdating ? "Memperbarui..." : "Tandai Selesai"}
          </Button>
        )}
      </div>
    </div>
  );
};
