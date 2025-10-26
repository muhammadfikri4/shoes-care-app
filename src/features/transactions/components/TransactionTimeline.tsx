import React from "react";
import {
  TRANSACTION_STATUS,
  TransactionStatus,
} from "../../../core/model/transaction";

const steps: { key: Exclude<TransactionStatus, "CANCELLED">; label: string }[] =
  [
    { key: TRANSACTION_STATUS.CREATED, label: "Pending" },
    { key: TRANSACTION_STATUS.IN_PROGRESS, label: "On Process" },
    { key: TRANSACTION_STATUS.READY_TO_PICKUP, label: "Ready to Pick Up" },
    { key: TRANSACTION_STATUS.COMPLETED, label: "Completed" }, 
  ];

const colorClassIdx = (
  index: number,
  targetIndex: number,
  isCancelled: boolean
) => {
  if (isCancelled) {
    return index < targetIndex ? "bg-red-600" : "bg-slate-200";
  }
  return index < targetIndex ? "bg-blue-600" : "bg-slate-200";
};

export const TransactionTimeline: React.FC<{ status: TransactionStatus }> = ({
  status,
}) => {
  const isCancelled = status === "CANCELLED";
  const currentIndex = steps.findIndex((s) => s.key === status);
  const idx = currentIndex === -1 ? 0 : currentIndex;

  const atEnd = !isCancelled && idx === steps.length - 1;

  return (
    <div className="w-full">
      {/* mobile */}
      <ol className="relative sm:hidden border-s border-slate-200">
        {steps.map((s, i) => {
          const done = !isCancelled && (i < idx || (atEnd && i === idx));
          const active = !isCancelled && i === idx && !atEnd;

          const nodeClass =
            isCancelled && i === idx
              ? "bg-red-600 ring-red-100"
              : done || active
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
                {s.key === TRANSACTION_STATUS.CREATED && "Transaksi dibuat"}
                {s.key === TRANSACTION_STATUS.IN_PROGRESS && "Sedang diproses"}
                {s.key === TRANSACTION_STATUS.READY_TO_PICKUP && "Siap diambil"}
                {s.key === TRANSACTION_STATUS.COMPLETED && "Selesai"}
              </p>
            </div>
          </li>
        );
        })}
      </ol>

      {/* desktop */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((s, i) => {
          const done = !isCancelled && (i < idx || (atEnd && i === idx));
          const active = !isCancelled && i === idx && !atEnd;
          const cancelledHere = isCancelled && i === idx;

          const nodeClass = cancelledHere
            ? "bg-red-600 border-red-600 text-white"
            : active
            ? "bg-primary border-blue-600 text-white"
            : done
            ? "bg-success border-green-600 text-white"
            : "bg-white border-slate-300 text-slate-400";

          const connectorClass = colorClassIdx(i, idx, isCancelled);

          return (
            <React.Fragment key={s.key}>
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
                  {s.key === TRANSACTION_STATUS.CREATED && "Transaksi dibuat"}
                  {s.key === TRANSACTION_STATUS.IN_PROGRESS && "Sedang diproses"}
                  {s.key === TRANSACTION_STATUS.READY_TO_PICKUP && "Siap diambil"}
                  {s.key === TRANSACTION_STATUS.COMPLETED && "Selesai"}
                  {cancelledHere && " — Dibatalkan"}
                </div>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className={`h-0.5 w-full ${connectorClass}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
