import React from "react";
import { Modal } from "../../_global/components/Dialog/dialog-v2";

type ConfirmationType = "ready" | "complete";

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ConfirmationType;
  transactionCode?: string;
  isPending?: boolean;
}

export const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, type, transactionCode, isPending }) => {
  const config = {
    ready: {
      title: "Konfirmasi Siap Diambil",
      description: `Apakah Anda yakin ingin mengubah status transaksi #${transactionCode} menjadi "Siap Diambil"?`,
      confirmLabel: "Ya, Siap Diambil",
      loadingLabel: "Memproses...",
      helpText:
        "Pelanggan akan menerima notifikasi bahwa pesanan sudah siap untuk diambil.",
      variant: "primary" as const,
    },
    complete: {
      title: "Konfirmasi Selesai",
      description: `Apakah Anda yakin ingin menyelesaikan transaksi #${transactionCode}?`,
      confirmLabel: "Ya, Selesaikan",
      loadingLabel: "Memproses...",
      helpText:
        "Transaksi akan ditandai sebagai selesai dan tidak dapat diubah kembali.",
      variant: "success" as const,
    },
  };

  const currentConfig = config[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentConfig.title}
      description={currentConfig.description}
      variant={type === "complete" ? "success" : undefined}
      size="md"
      actions={[
        {
          label: "Batal",
          onClick: onClose,
          variant: "secondary",
          disabled: isPending,
        },
        {
          label: isPending
            ? currentConfig.loadingLabel
            : currentConfig.confirmLabel,
          onClick: onConfirm,
          variant: currentConfig.variant,
          loading: isPending,
        },
      ]}
    >
      <div className="text-sm text-slate-600">{currentConfig.helpText}</div>
    </Modal>
  );
};
