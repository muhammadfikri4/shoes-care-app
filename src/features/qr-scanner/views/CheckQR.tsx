import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { DropdownRevamp } from "../../_global/components/Dropdown/DropdownRevamp";
import { useLookupTransaction } from "../../transactions/hooks/useTransactions";
import { HeaderQRCheck } from "../components/HeaderQRCheck";
import { ManualQRCheck } from "../components/ManualQRCheck";
import { InvalidQRResult } from "../components/InvalidQRResult";
import { ValidTransactionResult } from "../components/ValidTransactionResult";
import { useQrScanner } from "../hooks/useQrScanner";
import { ApiResponse } from "../../../core/libs/api/types";
import { MdOutlineDocumentScanner } from "react-icons/md";

type Mode = "manual" | "scan";

export const CheckQR: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTransactionId, setSuccessTransactionId] = useState<
    string | null
  >(null);
  const [mode, setMode] = useState<Mode>("manual");
  const mutation = useLookupTransaction();
  const navigate = useNavigate();

  const runLookup = async (q?: string) => {
    const raw = q || input;
    console.log({ raw });
    if (!raw) return;
    setLoading(true);
    setError(null);
    try {
      const isQr = raw.startsWith("qr-"); // contoh: qr-TRX-...
      const res = await mutation.mutateAsync(
        isQr ? { qr: raw, code: "" } : { code: raw, qr: "" }
      );
      // Show success alert instead of immediate redirect
      setSuccessTransactionId(res?.data?.id || null);
    } catch (e: unknown) {
      const err = e as ApiResponse;
      const msg = err?.message || "Lookup gagal";
      setError(msg);
      // Redirect to customer login with returnUrl if unauthorized
      if (err?.status === 401 || err?.code === "UNAUTHORIZED") {
        const returnUrl = window.location.pathname;
        window.location.href = `/login?role=CUSTOMER&returnUrl=${encodeURIComponent(
          returnUrl
        )}`;
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setInput("");
    // Restart camera jika dalam mode scan
    if (mode === "scan" && !active) {
      start(currentCamId || undefined);
    }
  };

  const handleViewDetails = () => {
    if (successTransactionId) {
      navigate(`/my/transactions/${successTransactionId}`);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessTransactionId(null);
    setInput("");
    // Restart camera jika dalam mode scan
    if (mode === "scan" && !active) {
      start(currentCamId || undefined);
    }
  };

  const {
    videoRef,
    cameras,
    currentCamId,
    start,
    stop,
    switchFacing,
    facing,
    active,
    switchCamera,
    error: camError,
  } = useQrScanner((text) => {
    // Ketika QR terbaca
    setInput(text);
    runLookup(text);
  });

  useEffect(() => {
    if (mode === "scan") {
      start();
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <BaseLayout
      title="Cek Transaksi"
      actionType="node"
      action={<HeaderQRCheck mode={mode} setMode={setMode} />}
    >
      {/* Manual Mode */}
      {mode === "manual" && (
        <ManualQRCheck
          runLookup={runLookup}
          setInput={setInput}
          input={input}
          isLoading={loading}
          successTransactionId={successTransactionId}
          error={error}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Scan Mode */}
      {mode === "scan" && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-96">
              {" "}
              <>
                <div className="md:hidden flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <MdOutlineDocumentScanner className="text-3xl text-blue-800" />
                  </div>
                </div>
                <p className="md:hidden text-center text-slate-600 text-sm mb-8 leading-relaxed">
                  Scan QR Code anda untuk melacak transaksi yang sedang berjalan
                </p>
              </>
              <DropdownRevamp
                placeholder="Pilih kamera"
                onChange={(e) => switchCamera(e.value)}
                list={cameras.map((item) => ({
                  label: item.label,
                  value: item.id,
                }))}
              />
            </div>

            <div>
              {" "}
              <Button
                onClick={() =>
                  active ? stop() : start(currentCamId || undefined)
                }
                variant="secondary"
              >
                {active ? "Stop" : "Start"}
              </Button>
            </div>

            <div>
              {" "}
              <Button
                onClick={switchFacing}
                title="Ganti kamera depan/belakang"
              >
                {facing === "user" ? "Kamera Depan" : "Kamera Belakang"}
              </Button>
            </div>
          </div>

          {camError && <div className="text-red-600 text-sm">{camError}</div>}

          <div className="relative w-full h-[65vh] sm:h-[60vh] bg-black rounded-xl overflow-hidden border">
            {/* Mirror diatur oleh hook lewat style.transform */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />

            {/* Focus overlay: kotak kecil di tengah */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 sm:w-56 sm:h-56">
                {/* Darken area outside box using a big shadow trick */}
                <div className="absolute inset-0 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                {/* Box */}
                <div className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-pulse" />
                {/* Corner accents */}
                <span className="absolute -top-1 left-2 h-6 w-0.5 bg-emerald-400" />
                <span className="absolute -top-1 right-2 h-6 w-0.5 bg-emerald-400" />
                <span className="absolute -bottom-1 left-2 h-6 w-0.5 bg-emerald-400" />
                <span className="absolute -bottom-1 right-2 h-6 w-0.5 bg-emerald-400" />
                <span className="absolute left-1 -top-2 w-6 h-0.5 bg-emerald-400" />
                <span className="absolute right-1 -top-2 w-6 h-0.5 bg-emerald-400" />
                <span className="absolute left-1 -bottom-2 w-6 h-0.5 bg-emerald-400" />
                <span className="absolute right-1 -bottom-2 w-6 h-0.5 bg-emerald-400" />
              </div>
            </div>
          </div>

          {!!input && (
            <div className="text-sm text-slate-600">
              Hasil terakhir:{" "}
              <span className="font-medium break-all">{input}</span>
            </div>
          )}
        </div>
      )}

      {/* Error Modal - Only show in scan mode */}
      {mode === "scan" && (
        <InvalidQRResult
          show={!!error}
          error={error || ""}
          onRetry={clearError}
        />
      )}

      {/* Success Modal - Only show in scan mode */}
      {mode === "scan" && (
        <ValidTransactionResult
          show={!!successTransactionId}
          onViewDetails={handleViewDetails}
          onClose={handleCloseSuccess}
        />
      )}
    </BaseLayout>
  );
};
