import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { MasterTable } from "../../_global/components/MasterTable";
import { Pagination } from "../../_global/components/Pagination";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Poppins } from "../../_global/components/Text";
import { formatTime } from "../../_global/lib/format-time";
import { TransactionStatusBadge } from "../components/TransactionStatusBadge";
import { useMyTransactionsList } from "../hooks/useTransactions";
import { TRANSACTION_STATUS, TransactionModel } from "@core/model/transaction";

export const TransactionsCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = convertQueryParamsToObject(searchParams?.toString());
  const { data, isFetching } = useMyTransactionsList();
  const items: TransactionModel[] = (data?.data ?? []) as TransactionModel[];

  const onPageChange = (page: number) => {
    setSearchParams({ ...queries, page: page.toString() });
  };

  return (
    <BaseLayout title="Riwayat Transaksi">
      <CustomSection
        inputProps={{ placeholder: "Cari kode transaksi..." }}
        filterButton={[
          {
            key: "status",
            widthClass: "w-40",
            dropdownProps: {
              placeholder: "Status",
              list: [
                { label: "Semua", value: "" },
                { label: "Menunggu", value: TRANSACTION_STATUS.CREATED },
                { label: "Diproses", value: TRANSACTION_STATUS.IN_PROGRESS },
                {
                  label: "Siap Diambil",
                  value: TRANSACTION_STATUS.READY_TO_PICKUP,
                },
                { label: "Selesai", value: TRANSACTION_STATUS.COMPLETED },
                { label: "Dibatalkan", value: TRANSACTION_STATUS.CANCELLED },
              ],
            },
          },
          {
            key: "dateRange",
            widthClass: "w-full md:w-72",
            dateRange: true,
            dateRangeKeys: { startKey: "startDate", endKey: "endDate" },
          },
        ]}
      >
        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {items.length > 0 ? (
            <>
              {items.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <Poppins className="text-sm font-semibold text-slate-900">
                        {t.code}
                      </Poppins>
                      {/* Customer POV: sembunyikan info pelanggan */}
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
                      onClick={() => navigate(`/my/transactions/${t.id}`)}
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
              {data?.meta && (data.meta.totalPages || 1) > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={data.meta.page || 1}
                    totalPages={data.meta.totalPages || 1}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-sm text-slate-500 py-8 bg-white rounded-lg border border-slate-200">
              Tidak ada transaksi.
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <MasterTable
            isLoading={isFetching}
            pagination={{
              currentPage: data?.meta?.page || 1,
              totalPages: data?.meta?.totalPages || 1,
              onPageChange: onPageChange,
            }}
            rounded={{
              "bottom-left": false,
              "bottom-right": false,
              "top-left": false,
              "top-right": false,
            }}
            data={items || []}
            title={["Kode", "Tanggal", "Status", "Aksi"]}
            columnTable={[
              {
                return: ({ code }) => (
                  <Poppins className="text-sm">{code}</Poppins>
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
                    onClick={() => navigate(`/my/transactions/${id}`)}
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
