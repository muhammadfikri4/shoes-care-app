import { TRANSACTION_STATUS, TransactionModel } from "@core/model/transaction";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { MasterTable } from "../../_global/components/MasterTable";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Poppins } from "../../_global/components/Text";
import { formatTime } from "../../_global/lib/format-time";
import { useTransactionsList } from "../hooks/useTransactions";
import { TransactionStatusBadge } from "../components/TransactionStatusBadge";

export const TransactionsAdmin: React.FC = () => {
  const navigate = useNavigate();

  const { data, isFetching } = useTransactionsList();
  const items: TransactionModel[] = (data?.data ?? []) as TransactionModel[];

  return (
    <BaseLayout
      title="Transaksi"
      action={{
        children: "Tambah Transaksi",
        onClick: () => navigate("/admin/transactions/create"),
      }}
    >
      <CustomSection
        className="w-full"
        inputProps={{}}
        filterButton={[
          {
            key: "minPrice",
            inputProps: {
              placeholder: "Min Harga",
            },
          },
          {
            key: "maxPrice",
            inputProps: {
              placeholder: "Max Harga",
            },
          },
          {
            key: "status",
            widthClass: "w-40",
            dropdownProps: {
              placeholder: "Status",
              list: [
                {
                  label: "Semua",
                  value: "",
                },
                {
                  label: "Menunggu",
                  value: "CREATED",
                },
                {
                  label: "Diproses",
                  value: "IN_PROGRESS",
                },
                {
                  label: "Siap Diambil",
                  value: TRANSACTION_STATUS.READY_TO_PICKUP,
                },
                {
                  label: "Selesai",
                  value: "COMPLETED",
                },
              ],
            },
          },
        ]}
      >
        {/* Mobile cards - tampil di layar kecil */}
        <div className="block md:hidden space-y-3">
          {items.length > 0 ? (
            items.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Poppins className="text-sm font-semibold text-slate-900">
                      {t.code}
                    </Poppins>
                    <div className="mt-1 text-xs text-slate-600">
                      {t.customerName || t.customerEmail || "-"}
                    </div>
                  </div>
                  <TransactionStatusBadge status={t.status} />
                </div>

                <div className="text-xs text-slate-500 mb-3">
                  {formatTime(new Date(t.createdAt), false)}
                </div>

                <div className="flex justify-end">
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => navigate(`/admin/transactions/${t.id}`)}
                  >
                    Detail
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-slate-500 py-8 bg-white rounded-lg border border-slate-200">
              Tidak ada transaksi.
            </div>
          )}
        </div>

        {/* Desktop table - tampil di layar besar */}
        <div className="hidden md:block">
          <MasterTable
            isLoading={isFetching}
            rounded={{
              "bottom-left": false,
              "bottom-right": false,
              "top-left": false,
              "top-right": false,
            }}
            data={items || []}
            title={["Kode", "Pelanggan", "Tanggal", "Status", "Aksi"]}
            columnTable={[
              {
                return: ({ code }) => (
                  <Poppins className="text-sm">{code}</Poppins>
                ),
              },
              {
                return: ({ customerName }) => (
                  <Poppins className="text-sm">{customerName}</Poppins>
                ),
              },
              {
                return: ({ createdAt }) => (
                  <Poppins className="text-sm">
                    {formatTime(new Date(createdAt), false)}
                  </Poppins>
                ),
              },
              {
                return: ({ status }) => (
                  <TransactionStatusBadge status={status} />
                ),
              },
              {
                return: ({ id }) => (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/admin/transactions/${id}`)}
                  >
                    Detail
                  </Button>
                ),
              },
            ]}
            notFoundMessage={["Tidak ada transaksi."]}
          />
        </div>
      </CustomSection>
    </BaseLayout>
  );
};
