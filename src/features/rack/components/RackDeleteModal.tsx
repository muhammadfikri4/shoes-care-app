import React from "react";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { RackModel } from "@core/model/rack";

interface RackDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  target: RackModel | null;
  deleting: boolean;
}

export const RackDeleteModal: React.FC<RackDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  target,
  deleting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Rak?"
      description={`Rak dengan kode "${
        target?.code || "-"
      }" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
      variant="danger"
      size="md"
      actions={[
        {
          label: "Batal",
          onClick: onClose,
          variant: "secondary",
          disabled: deleting,
        },
        {
          label: deleting ? "Menghapus..." : "Hapus",
          onClick: onConfirm,
          variant: deleting ? "disabled" : "danger",
          loading: deleting,
        },
      ]}
    >
      <div className="mt-2">
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          Pastikan rak tidak sedang dipakai sebelum menghapus.
        </div>
      </div>
    </Modal>
  );
};
