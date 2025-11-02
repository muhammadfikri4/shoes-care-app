import React from "react";
import { XCircle, RefreshCcw } from "lucide-react";
import { Dialog } from "../../_global/components/Dialog";

interface InvalidQRResultProps {
  show: boolean;
  error: string;
  onRetry?: () => void;
}

export const InvalidQRResult: React.FC<InvalidQRResultProps> = ({
  show,
  error,
  onRetry,
}) => {
  const handleClose = () => {
    if (onRetry) onRetry();
  };

  return (
    <Dialog show={show} onHide={handleClose}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="bg-red-100 rounded-full p-4">
            <XCircle className="text-red-600" size={48} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900">
            Transaksi Tidak Ditemukan
          </h3>

          {/* Error Message */}
          <p className="text-sm text-slate-600 max-w-md">{error}</p>

          {/* Suggestions */}
          <div className="bg-slate-50 rounded-lg p-4 text-left w-full space-y-2">
            <p className="text-xs font-medium text-slate-700 mb-2">
              Pastikan:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Kode transaksi atau QR code yang Anda masukkan benar</li>
              <li>Transaksi sudah terdaftar dalam sistem</li>
              <li>Tidak ada kesalahan pengetikan pada kode transaksi</li>
            </ul>
          </div>

          {/* Retry Button */}
          <button
            onClick={handleClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <RefreshCcw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    </Dialog>
  );
};
