import React from "react";
import { Button } from "../../_global/components/Button";
import { Input } from "../../_global/components/Input";

interface ManualQRCheckProps {
  input?: string;
  runLookup: VoidFunction;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  error?: string;
}

export const ManualQRCheck: React.FC<ManualQRCheckProps> = ({
  runLookup,
  setInput,
  input,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex justify-between gap-3 w-full">
        <div>
          <Input
            placeholder="Masukkan Kode Transaksi"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runLookup();
            }}
          />
        </div>
        <div>
          <Button
            type="button"
            onClick={() => runLookup()}
            variant={isLoading || !input?.trim() ? "disabled" : "primary"}
          >
            {isLoading ? "Mengecek..." : "Cek"}
          </Button>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
};
