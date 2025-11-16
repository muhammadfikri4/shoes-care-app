import React from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Dialog } from "../../_global/components/Dialog";
import { Button } from "../../_global/components/Button";
import { Poppins } from "../../_global/components/Text";

interface ValidTransactionResultProps {
  show: boolean;
  onViewDetails: () => void;
  onClose: () => void;
}

export const ValidTransactionResult: React.FC<ValidTransactionResultProps> = ({
  show,
  onViewDetails,
  onClose,
}) => {
  return (
    <Dialog show={show} onHide={onClose}>
      <div className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900">
            Kode Transaksi Valid
          </h3>

          {/* Info Box */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm mb-1">
                  Kode Transaksi Valid
                </h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  Untuk mengetahui informasi lengkap seperti status, waktu
                  pemrosesan, serta detail pembayaran, silakan klik tombol
                  berikut.{" "}
                </p>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            onClick={onViewDetails}
          >
            <div className="flex items-center justify-center gap-2">
            <ExternalLink size={16} />
            <Poppins className="font-medium">Detail Transaksi</Poppins>
            </div>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
