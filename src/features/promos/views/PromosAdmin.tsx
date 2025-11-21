import { PromoModel } from "@core/model/promo";
import { convertQueryParamsToObject } from "@features/_global/helper";
import { formatTime } from "@features/_global/lib/format-time";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { InputLabel } from "../../_global/components/InputLabel";
import { MasterTable } from "../../_global/components/MasterTable";
import { Pagination } from "../../_global/components/Pagination";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Poppins } from "../../_global/components/Text";
import { usePromoCheck, usePromosList } from "../hooks/usePromos";

export const PromosAdmin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = convertQueryParamsToObject(searchParams?.toString());
  const { data, isFetching } = usePromosList();
  const items: PromoModel[] = (data?.data ?? []) as PromoModel[];
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const promoCheck = usePromoCheck();

  const onPageChange = (page: number) => {
    setSearchParams({ ...queries, page: page.toString() });
  };

  return (
    <BaseLayout
      title="Promos"
      actionType="node"
      action={
        <Button onClick={() => setOpen(true)} variant="secondary">
          Cek Promo
        </Button>
      }
    >
      <CustomSection>
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
            title={[
              "Kode",
              "Pelanggan",
              "Diskon",
              "Status",
              "Di Terbitkan Pada",
            ]}
            columnTable={[
              {
                return: ({ code }) => (
                  <Poppins className="text-sm">{code}</Poppins>
                ),
              },
              {
                return: ({ user }) => (
                  <Poppins className="text-sm">{user?.email || "-"}</Poppins>
                ),
              },
              {
                return: ({ discountPercent }) => (
                  <Poppins className="text-sm">{discountPercent}%</Poppins>
                ),
              },
              {
                return: ({ isUsed }) => (
                  <Poppins className="text-sm">
                    {isUsed ? "Terpakai" : "Belum Terpakai"}
                  </Poppins>
                ),
              },
              {
                return: ({ createdAt }) => (
                  <Poppins className="text-sm">
                    {formatTime(new Date(createdAt))}
                  </Poppins>
                ),
              },
            ]}
            notFoundMessage={["Tidak ada promo."]}
          />
        </div>
        <div className="md:hidden space-y-3">
          {(items || [])?.length ? (
            <>
              {items.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
                >
                  <div className="font-semibold">{p.code}</div>
                  <div className="text-sm text-slate-600">
                    {p.user?.email || "-"}
                  </div>
                  <div className="text-sm">Diskon: {p.discountPercent}%</div>
                  <div className="text-xs text-slate-500">
                    {formatTime(new Date(p.createdAt))}
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
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex-col flex justify-center items-center">
              Tidak ada data
            </div>
          )}
        </div>
      </CustomSection>
      <Modal
        isOpen={open}
        showCloseButton={false}
        onClose={() => setOpen(false)}
        title="Cek Kode Promo"
        size="md"
        actions={[
          {
            label: promoCheck.isPending ? "Mengecek..." : "Cek",
            onClick: () => {
              if (!code.trim()) return;
              promoCheck.mutate(code.trim());
            },
            variant: "primary",
            disabled: promoCheck.isPending || !code.trim(),
            loading: promoCheck.isPending,
          },
          {
            label: "Tutup",
            onClick: () => setOpen(false),
            variant: "secondary",
          },
        ]}
      >
        <div className="space-y-3">
          <div>
            <InputLabel
              title="Kode Promo"
              inputProps={{
                value: code,
                onChange: (e) => setCode(e.target.value),
              }}
            />
          </div>
          {promoCheck.isSuccess && (
            <div className="text-sm text-emerald-600">
              Kode valid. Diskon {promoCheck.data?.data?.discountPercent}%
            </div>
          )}
        </div>
      </Modal>
    </BaseLayout>
  );
};
