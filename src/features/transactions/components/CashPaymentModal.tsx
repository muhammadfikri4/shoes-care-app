import React, { useCallback, useMemo, useState } from "react";
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
  const [cashPaidInput, setCashPaidInput] = useState<string>("");

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  const cashPaidNumber = useMemo(() => {
    return Number(cashPaidInput) || 0;
  }, [cashPaidInput]);

  const change = useMemo(() => {
    return Math.max(0, cashPaidNumber - totalPrice);
  }, [cashPaidNumber, totalPrice]);

  const handleConfirm = useCallback(() => {
    // Validasi: uang yang dibayar harus >= total harga
    if (cashPaidNumber < totalPrice) {
      toast.error(
        `Uang yang dibayarkan kurang! Minimal ${format.format(totalPrice)}`
      );
      return;
    }

    // Jika validasi lolos, jalankan callback
    onConfirm(cashPaidNumber);
  }, [cashPaidNumber, totalPrice, format, onConfirm]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setCashPaidInput("");
      onClose();
    }
  }, [isLoading, onClose]);

  const modalActions = useMemo(
    () => [
      {
        label: "Batal",
        onClick: handleClose,
        variant: "secondary" as const,
        disabled: isLoading,
      },
      {
        label: isLoading ? "Memproses..." : "Konfirmasi Pembayaran",
        onClick: handleConfirm,
        variant: "primary" as const,
        disabled: isLoading || cashPaidNumber === 0,
        loading: isLoading,
      },
    ],
    [handleClose, handleConfirm, isLoading, cashPaidNumber]
  );

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
      actions={modalActions}
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
            inputMode="decimal"
            currency
            value={cashPaidInput}
            onChange={(e) => setCashPaidInput(e.target.value)}
            placeholder="Masukkan jumlah uang"
            disabled={isLoading}
          />
        </div>

        {/* Kembalian (auto-calculated) */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Kembalian
          </label>
          <Input disabled value={format.format(change)} />
        </div>

        {/* Warning jika uang kurang */}
        {cashPaidNumber > 0 && cashPaidNumber < totalPrice && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Uang yang dibayarkan kurang{" "}
              <span className="font-semibold">
                {format.format(totalPrice - cashPaidNumber)}
              </span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
