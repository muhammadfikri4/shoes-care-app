import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { transactionsService } from "@core/services/pos";
import { Badge } from "@features/_global/components/Badge";
import { TransactionLookupModel } from "@core/model/transaction";
import { useQrScanner } from "../hooks/useQrScanner";
import { Button } from "../../_global/components/Button";

type Mode = "manual" | "scan";

export const CheckQR: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>(
    searchParams.get("invoice") || searchParams.get("qr") || ""
  );
  const [data, setData] = useState<TransactionLookupModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("manual");

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );

  const runLookup = async (q?: string) => {
    const raw = (q ?? input)?.trim();
    if (!raw) return;
    setLoading(true);
    setError(null);
    try {
      const isQr = raw.includes(":"); // contoh: sc-pos:tx:INV-...
      const res = await transactionsService.lookup(
        isQr ? { qr: raw } : { invoice: raw }
      );
      setData(res?.data as TransactionLookupModel);
      setSearchParams(isQr ? { qr: raw } : { invoice: raw }, { replace: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup gagal");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto run dari URL param
  useEffect(() => {
    const iv = searchParams.get("invoice");
    const qr = searchParams.get("qr");
    if (iv || qr) {
      runLookup(iv || qr || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- QR Scanner integration ---
  const {
    videoRef,
    cameras,
    currentCamId,
    start,
    stop,
    switchFacing, // <<— baru
    facing, // <<— baru
    active,
    hasTorch,
    torchOn,
    toggleTorch,
    switchCamera,
    error: camError,
  } = useQrScanner((text) => {
    // Ketika QR terbaca
    setInput(text);
    runLookup(text);
  });

  useEffect(() => {
    if (mode === "scan") {
      start(); // default pakai environment/back camera jika ada
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="p-4 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Check Transaksi</h1>
          <p className="text-slate-500 text-sm">
            Cek menggunakan <span className="font-medium">kode/invoice</span>{" "}
            atau <span className="font-medium">scan QR</span>.
          </p>
        </div>

        <div className="bg-slate-100 rounded-xl p-1 flex w-full items-center gap-4">
          <Button
            variant={mode === "manual" ? "primary" : "secondary"}
            onClick={() => setMode("manual")}
          >
            Manual
          </Button>
          <Button
            variant={mode === "scan" ? "primary" : "secondary"}
            onClick={() => setMode("scan")}
          >
            Scan
          </Button>
        </div>
      </div>

      {/* Manual Mode */}
      {mode === "manual" && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex gap-3">
            <input
              className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Masukkan QR (sc-pos:tx:INV-...) atau nomor invoice"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runLookup();
              }}
            />
            <button
              onClick={() => runLookup()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition text-white rounded px-4"
            >
              {loading ? "Mengecek..." : "Cek"}
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
      )}

      {/* Scan Mode */}
      {mode === "scan" && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={currentCamId || ""}
              onChange={(e) => switchCamera(e.target.value)}
              title="Pilih kamera"
            >
              {cameras.length ? (
                cameras.map((c) => (
                  <option key={c.id} value={c.id || ""}>
                    {c.label || c.id}
                  </option>
                ))
              ) : (
                <option>Pilih Kamera</option>
              )}
            </select>

            <button
              onClick={() =>
                active ? stop() : start(currentCamId || undefined)
              }
              className="px-3 py-1.5 text-sm rounded border"
            >
              {active ? "Stop" : "Start"}
            </button>

            <button
              onClick={switchFacing}
              className="px-3 py-1.5 text-sm rounded border"
              title="Ganti kamera depan/belakang"
            >
              {facing === "user" ? "Ke Belakang" : "Ke Depan"}
            </button>

            <button
              onClick={toggleTorch}
              disabled={!hasTorch || !active}
              className="px-3 py-1.5 text-sm rounded border disabled:opacity-50"
              title="Flash"
            >
              {torchOn ? "Matikan Flash" : "Nyalakan Flash"}
            </button>

            <span className="text-xs text-slate-500 ml-2">
              Facing: <span className="font-medium">{facing}</span>
            </span>
          </div>

          {camError && <div className="text-red-600 text-sm">{camError}</div>}

          <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden border">
            {/* Mirror diatur oleh hook lewat style.transform */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
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
      {data && (
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
      )}
    </div>
  );
};
