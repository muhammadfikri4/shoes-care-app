import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { DropdownRevamp } from "../../_global/components/Dropdown/DropdownRevamp";
import { useLookupTransaction } from "../../transactions/hooks/useTransactions";
import { HeaderQRCheck } from "../components/HeaderQRCheck";
import { ManualQRCheck } from "../components/ManualQRCheck";
import { useQrScanner } from "../hooks/useQrScanner";

type Mode = "manual" | "scan";

export const CheckQR: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>(
    searchParams.get("invoice") || searchParams.get("qr") || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("manual");
  const mutation = useLookupTransaction();
  const navigate = useNavigate();

  const runLookup = async (q?: string) => {
    const raw = (q ?? input)?.trim();
    if (!raw) return;
    setLoading(true);
    setError(null);
    try {
      const isQr = raw.includes(":"); // contoh: sc-pos:tx:INV-...
      console.log({ isQr, raw });
      const res = await mutation.mutateAsync(
        isQr ? { qr: raw, code: "" } : { code: raw, qr: "" }
      );
      navigate(`/my/transactions/${res?.data?.id}`);
      setSearchParams(isQr ? { qr: raw } : { invoice: raw }, { replace: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup gagal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const iv = searchParams.get("invoice");
    const qr = searchParams.get("qr");
    if (iv || qr) {
      runLookup(iv || qr || undefined);
    }
  }, []);

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
      title="Check Transaksi"
      actionType="node"
      action={<HeaderQRCheck mode={mode} setMode={setMode} />}
    >
      {/* Manual Mode */}
      {mode === "manual" && (
        <ManualQRCheck
          runLookup={runLookup}
          setInput={setInput}
          error={error || undefined}
          input={input}
          isLoading={loading}
        />
      )}

      {/* Scan Mode */}
      {mode === "scan" && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-96">
              {" "}
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
                {facing === "user" ? "Ke Belakang" : "Ke Depan"}
              </Button>
            </div>

            <span className="text-xs text-slate-500 ml-2">
              Facing: <span className="font-medium">{facing}</span>
            </span>
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

      {/* Hasil pencarian */}
      {/* {data && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">{data.invoice}</div>
            <Badge
              variant={
                data.status === "PICKED_UP"
                  ? "success"
                  : data.status === "CREATED"
                  ? "warning"
                  : "secondary"
              }
              size="sm"
            >
              {data.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-slate-500">Rak</div>
              <div className="font-medium">{data.rack?.code || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Harga</div>
              <div>
                {format.format(data.price)} →{" "}
                <span className="font-semibold">
                  {format.format(data.finalPrice)}
                </span>
                {data.promoApplied && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Promo
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Customer</div>
              <div>
                {data.customerName || "-"}{" "}
                <span className="text-slate-500">
                  ({data.customerEmail || "-"})
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Dibuat</div>
              <div>{new Date(data.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Tracking Status</div>
            <div className="space-y-2">
              {data.history?.length ? (
                data.history.map((h) => (
                  <div key={h.id} className="text-sm flex items-center gap-2">
                    <Badge
                      size="sm"
                      variant={
                        h.newStatus === "PICKED_UP"
                          ? "success"
                          : h.newStatus === "READY_FOR_PICKUP"
                          ? "primary"
                          : h.newStatus === "IN_PROGRESS"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {h.newStatus}
                    </Badge>
                    <span className="text-slate-600">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                    {h.note && (
                      <span className="text-slate-500">- {h.note}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">Belum ada histori.</div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </BaseLayout>
  );
};
