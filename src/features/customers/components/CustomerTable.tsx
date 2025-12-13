import React from "react";
import { CustomerModel } from "@core/model/customer";
import { MasterTable } from "../../_global/components/MasterTable";
import { Pagination } from "../../_global/components/Pagination";
import { Poppins } from "../../_global/components/Text";
import { CustomSection } from "../../_global/components/SmartFilter";

interface CustomerTableProps {
  customers: CustomerModel[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <CustomSection>
      <div className="hidden md:block">
        <MasterTable
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          rounded={{
            "bottom-left": false,
            "bottom-right": false,
            "top-left": false,
            "top-right": false,
          }}
          data={customers || []}
          title={[
            "Nama",
            "Email",
            "Total Transaksi",
            "Transaksi Berjalan",
            "Total Promo",
          ]}
          columnTable={[
            {
              return: ({ name }) => (
                <Poppins className="text-sm font-medium">{name}</Poppins>
              ),
            },
            {
              return: ({ email }) => (
                <Poppins className="text-sm text-slate-600">{email}</Poppins>
              ),
            },
            {
              return: ({ totalTransactions }) => (
                <Poppins className="text-sm">{totalTransactions}</Poppins>
              ),
            },
            {
              return: ({ totalCurrentTransactions }) => (
                <Poppins className="text-sm">
                  {totalCurrentTransactions}
                </Poppins>
              ),
            },
            {
              return: ({ totalPromos }) => (
                <Poppins className="text-sm">{totalPromos}</Poppins>
              ),
            },
          ]}
          notFoundMessage={["Tidak ada pelanggan."]}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {(customers || [])?.length ? (
          <>
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
              >
                <div className="font-semibold text-slate-900 mb-1">
                  {customer.name}
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  {customer.email}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-500">Total Transaksi</div>
                    <div className="font-semibold text-slate-900">
                      {customer.totalTransactions}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Berjalan</div>
                    <div className="font-semibold text-slate-900">
                      {customer.totalCurrentTransactions}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Promo</div>
                    <div className="font-semibold text-slate-900">
                      {customer.totalPromos}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex-col flex justify-center items-center">
            Tidak ada data
          </div>
        )}
      </div>
    </CustomSection>
  );
};
