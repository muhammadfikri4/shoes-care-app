import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionsService } from "@core/services/pos";
import { Badge } from "@features/_global/components/Badge";
import { TransactionModel } from "@core/model/transaction";

export const TransactionsCustomer: React.FC = () => {
  const [items, setItems] = useState<TransactionModel[]>([]);
  const load = async () => {
    const res = await transactionsService.listMine();
    setItems(res?.data ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Riwayat Transaksi</h1>
        <p className="text-slate-500 text-sm">
          Terima kasih telah menggunakan layanan ShoesCare.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.code}</div>
              <Badge
                variant={
                  t.status === "PICKED_UP"
                    ? "success"
                    : t.status === "CREATED"
                    ? "warning"
                    : "secondary"
                }
                size="sm"
              >
                {t.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Rak: <span className="font-medium">{t.rack?.code}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Harga: {format.format(t.price)}
            </div>
            <div className="mt-1 text-sm">
              Final:{" "}
              <span className="font-semibold">
                {format.format(t.finalPrice)}
              </span>{" "}
              {t.promoApplied && (
                <Badge variant="success" size="sm" className="ml-2">
                  Promo 10x
                </Badge>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {new Date(t.createdAt).toLocaleString()}
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => navigate(`/my/transactions/${t.code}`)}
                className="text-blue-600 hover:underline text-sm"
              >
                Detail & Tracking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
