import React from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "../../_global/components/Button";
import { Input } from "../../_global/components/Input";

interface ManualQRCheckProps {
  input?: string;
  runLookup: VoidFunction;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  successTransactionId?: string | null;
  error?: string | null;
  onViewDetails?: () => void;
}

export const ManualQRCheck: React.FC<ManualQRCheckProps> = ({
  runLookup,
  setInput,
  input,
  isLoading,
  successTransactionId,
  error,
  onViewDetails,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
             
              <MdOutlineDocumentScanner className="text-3xl text-blue-800" />
            </div>
          </div>

          {/* Description */}
          <p className="text-center text-slate-600 text-sm mb-8 leading-relaxed">
            Masukkan kode transaksi anda untuk validasi keaslian dan melacak
            transaksi yang sedang berjalan
          </p>

          {/* Input Field */}
          <div className="mb-4">
            <Input
              placeholder="Contoh: TRX-20250116-XXXX"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input?.trim() && !isLoading) {
                  runLookup();
                }
              }}
              className="w-full text-center"
            />
          </div>

          {/* Button */}
          <Button
            type="button"
            onClick={() => runLookup()}
            variant={isLoading || !input?.trim() ? "disabled" : "primary"}
            className="w-full"
          >
            {isLoading ? "Mengecek..." : "Cek Transaksi"}
          </Button>

          {/* Success Alert */}
          {successTransactionId && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 text-sm mb-1">
                    Kode Transaksi Valid
                  </h4>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Untuk mengetahui informasi lengkap seperti status, waktu pemrosesan, serta
                    detail pembayaran, silakan klik tombol berikut.{" "}
                    <button
                      onClick={onViewDetails}
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Detail Transaksi
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 text-sm mb-1">
                    Kode Transaksi Tidak Valid
                  </h4>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Maaf, kami tidak menemukan transaksi dengan kode tersebut. Periksa kembali
                    ejaan kode transaksi Anda, atau pastikan transaksi sudah berhasil dibuat
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
