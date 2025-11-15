import React from "react";
import { Modal } from "../../_global/components/Dialog/dialog-v2";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  transactionCode?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeUrl,
  transactionCode,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code ${transactionCode ? ` - #${transactionCode}` : ""}`}
      size="md"
      actions={[
        {
          label: "Tutup",
          onClick: onClose,
          variant: "secondary",
        },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-sm text-slate-600 text-center">
          Scan QR Code di bawah ini untuk melakukan pembayaran
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <img
            src={qrCodeUrl}
            alt="QR Code Pembayaran"
            className="w-64 h-64 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "";
              target.alt = "QR Code tidak dapat dimuat";
              target.className = "w-64 h-64 flex items-center justify-center text-slate-400 text-sm";
            }}
          />
        </div>
        <div className="text-xs text-slate-500 text-center max-w-sm">
          Pastikan Anda melakukan pembayaran sesuai dengan nominal yang tertera
          pada transaksi
        </div>
      </div>
    </Modal>
  );
};
