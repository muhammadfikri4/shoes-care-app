import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { Input } from "../../_global/components/Input";

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  onConfirm: (cashPaid: number) => void;
  isLoading?: boolean;
}

export const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
  isOpen,
  onClose,
  totalPrice,
  onConfirm,
  isLoading = false,
}) => {
  const [cashPaid, setCashPaid] = useState<number>(0);

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  const change = useMemo(() => {
    return Math.max(0, cashPaid - totalPrice);
  }, [cashPaid, totalPrice]);

  const handleConfirm = () => {
    // Validasi: uang yang dibayar harus >= total harga
    if (cashPaid < totalPrice) {
      toast.error(
        `Uang yang dibayarkan kurang! Minimal ${format.format(totalPrice)}`
      );
      return;
    }

    // Jika validasi lolos, jalankan callback
    onConfirm(cashPaid);
  };

  const handleClose = () => {
    if (!isLoading) {
      setCashPaid(0);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pembayaran Cash"
      description="Masukkan jumlah uang yang dibayarkan pelanggan"
      size="md"
      showCloseButton={!isLoading}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      actions={[
        {
          label: "Batal",
          onClick: handleClose,
          variant: "secondary",
          disabled: isLoading,
        },
        {
          label: isLoading ? "Memproses..." : "Konfirmasi Pembayaran",
          onClick: handleConfirm,
          variant: "primary",
          disabled: isLoading || cashPaid === 0,
          loading: isLoading,
        },
      ]}
    >
      <div className="space-y-4">
        {/* Total yang harus dibayar (disabled) */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Total yang Harus Dibayar
          </label>
          <Input
            value={format.format(totalPrice)}
            disabled
            className="bg-slate-50 font-semibold text-slate-800"
          />
        </div>

        {/* Input uang yang dibayar */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Uang yang Dibayar
          </label>
          <Input
            currency
            inputMode="decimal"
            value={cashPaid || undefined}
            onChange={(e) => setCashPaid(Number(e.target.value || 0))}
            placeholder="Masukkan jumlah uang"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* Kembalian (auto-calculated) */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Kembalian
          </label>
          <div className="border rounded-lg px-3 py-2.5 bg-emerald-50 border-emerald-200">
            <span
              className={`font-semibold ${
                change > 0 ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              {format.format(change)}
            </span>
          </div>
        </div>

        {/* Warning jika uang kurang */}
        {cashPaid > 0 && cashPaid < totalPrice && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Uang yang dibayarkan kurang{" "}
              <span className="font-semibold">
                {format.format(totalPrice - cashPaid)}
              </span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
