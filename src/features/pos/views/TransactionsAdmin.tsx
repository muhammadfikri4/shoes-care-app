import { TransactionModel } from "@core/model/transaction";
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

  const { data } = useTransactionsList();
  const items: TransactionModel[] = (data?.data ?? []) as TransactionModel[];
  const tableData = items.map((t: TransactionModel) => ({
    code: t.invoice,
    customer: { name: t.customerName || t.customerEmail || "-" },
    date: t.createdAt,
    status: t.status,
    id: t.invoice,
  }));

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
                  label: "Pending",
                  value: "CREATED",
                },
                {
                  label: "On Process",
                  value: "IN_PROGRESS",
                },
                {
                  label: "Ready to Pick Up",
                  value: "READY_FOR_PICKUP",
                },
                {
                  label: "Completed",
                  value: "COMPLETED",
                },
              ],
            },
          },
        ]}
      >
        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <Poppins className="text-sm font-semibold">{t.invoice}</Poppins>
                <TransactionStatusBadge status={t.status} />
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {t.customerName || t.customerEmail || "-"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {formatTime(new Date(t.createdAt), false)}
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => navigate(`/admin/transactions/${t.invoice}`)}
                >
                  Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!items.length && (
          <div className="text-center text-sm text-slate-500 py-6">
            Tidak ada transaksi.
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden md:block">
          <MasterTable
            rounded={{
              "bottom-left": false,
              "bottom-right": false,
              "top-left": false,
              "top-right": false,
            }}
            data={tableData}
            title={["Code", "Customer", "Tanggal", "Status", "Aksi"]}
            columnTable={[
              {
                return: ({ code }) => (
                  <Poppins className="text-sm">{code}</Poppins>
                ),
              },
              {
                return: ({ customer }) => (
                  <Poppins className="text-sm">{customer?.name}</Poppins>
                ),
              },
              {
                return: ({ date }) => (
                  <Poppins className="text-sm">
                    {formatTime(new Date(date), false)}
                  </Poppins>
                ),
              },
              {
                return: ({ status }) => (
                  <Poppins className="text-sm">{status}</Poppins>
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
          />
        </div>
      </CustomSection>
    </BaseLayout>
  );
};
