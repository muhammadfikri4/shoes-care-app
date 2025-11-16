import React from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Button } from "../../_global/components/Button";
import { Input } from "../../_global/components/Input";

interface ManualQRCheckProps {
  input?: string;
  runLookup: VoidFunction;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
}

export const ManualQRCheck: React.FC<ManualQRCheckProps> = ({
  runLookup,
  setInput,
  input,
  isLoading,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {/* <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg> */}
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
        </div>
      </div>
    </div>
  );
};
