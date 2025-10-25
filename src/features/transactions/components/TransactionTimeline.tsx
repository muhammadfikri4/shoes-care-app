import React from "react";

type Step =
  | "CREATED"
  | "IN_PROGRESS"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "CANCELLED";

const steps: { key: Exclude<Step, "CANCELLED">; label: string }[] = [
  { key: "CREATED", label: "Pending" },
  { key: "IN_PROGRESS", label: "On Process" },
  { key: "READY_FOR_PICKUP", label: "Ready to Pick Up" },
  { key: "PICKED_UP", label: "Completed" },
];

const colorClassIdx = (
  index: number,
  targetIndex: number,
  isCancelled: boolean
) => {
  isCancelled
    ? index < targetIndex
      ? "bg-red-600"
      : "bg-slate-200"
    : index < targetIndex
    ? "bg-blue-600"
    : "bg-slate-200";
};

export const TransactionTimeline: React.FC<{ status: Step }> = ({ status }) => {
  const isCancelled = status === "CANCELLED";
  const currentIndex = steps.findIndex((s) => s.key === status);
  // default ke step 0 bila status tidak ditemukan; jika CANCELLED kita tetap tandai node merah di step 0
  const idx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full">
      {/* mobile */}
      <ol className="relative sm:hidden border-s border-slate-200">
        {steps.map((s, i) => {
          const done = !isCancelled && i < idx;
          const active = !isCancelled && i === idx;
          const nodeClass =
            isCancelled && i === idx
              ? "bg-red-600 ring-red-100"
              : active || done
              ? "bg-blue-600 ring-blue-100"
              : "bg-slate-300 ring-slate-100";

          return (
            <li key={s.key} className="ms-4 py-3">
              <span
                className={`absolute -start-1.5 mt-1.5 size-3 rounded-full ring-2 ${nodeClass}`}
                aria-hidden
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "text-sm font-medium",
                      isCancelled && i === idx
                        ? "text-red-700"
                        : active
                        ? "text-slate-900"
                        : done
                        ? "text-slate-700"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>

                  {isCancelled && i === idx && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] bg-red-50 text-red-700">
                      Dibatalkan
                    </span>
                  )}
                  {active && !isCancelled && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700">
                      Berjalan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {s.key === "CREATED" && "Transaksi dibuat"}
                  {s.key === "IN_PROGRESS" && "Sedang diproses"}
                  {s.key === "READY_FOR_PICKUP" && "Siap diambil"}
                  {s.key === "PICKED_UP" && "Selesai"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* desktop */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((s, i) => {
          const done = !isCancelled && i < idx;
          const active = !isCancelled && i === idx;
          const cancelledHere = isCancelled && i === idx;

          const nodeClass = cancelledHere
            ? "bg-red-600 border-red-600 text-white"
            : active
            ? "bg-primary border-blue-600 text-white"
            : done
            ? "bg-white border-blue-600 text-blue-600"
            : "bg-white border-slate-300 text-slate-400";

          const connectorClass = colorClassIdx(i, idx, isCancelled);

          return (
            <>
              <div className="flex flex-col items-center text-center min-w-0 px-2">
                <div
                  className={`size-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${nodeClass}`}
                  aria-current={active || cancelledHere ? "step" : undefined}
                >
                  {done ? "✓" : i + 1}
                </div>

                <div
                  className={[
                    "mt-3 text-sm font-medium line-clamp-1",
                    cancelledHere ? "text-red-700" : "text-slate-800",
                  ].join(" ")}
                  title={s.label}
                >
                  {s.label}
                </div>

                <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                  {s.key === "CREATED" && "Transaksi dibuat"}
                  {s.key === "IN_PROGRESS" && "Sedang diproses"}
                  {s.key === "READY_FOR_PICKUP" && "Siap diambil"}
                  {s.key === "PICKED_UP" && "Selesai"}
                  {cancelledHere && " — Dibatalkan"}
                </div>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className={`h-0.5 w-full ${connectorClass}`} />
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};
