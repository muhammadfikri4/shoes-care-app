import React from "react";
import { Modal } from "../../_global/components/Dialog/dialog-v2";

interface TransactionItemConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isPending?: boolean;
}

export const TransactionItemConfirmationModal: React.FC<
  TransactionItemConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, itemName, isPending }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Selesai Item"
      description={`Apakah Anda yakin ingin menandai item "${itemName}" sebagai selesai?`}
      variant="success"
      size="md"
      actions={[
        {
          label: "Batal",
          onClick: onClose,
          variant: "secondary",
          disabled: isPending,
        },
        {
          label: isPending ? "Memproses..." : "Ya, Tandai Selesai",
          onClick: onConfirm,
          variant: "success",
          loading: isPending,
        },
      ]}
    >
      <div className="text-sm text-slate-600">
        Item akan ditandai sebagai selesai dalam sistem.
      </div>
    </Modal>
  );
};
