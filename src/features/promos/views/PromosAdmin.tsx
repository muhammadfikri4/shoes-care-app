import React, { useState } from "react";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { MasterTable } from "../../_global/components/MasterTable";
import { usePromoCheck, usePromosList } from "../hooks/usePromos";
import { PromoModel } from "@core/model/promo";
import { Poppins } from "../../_global/components/Text";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Button } from "../../_global/components/Button";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { InputLabel } from "../../_global/components/InputLabel";

export const PromosAdmin: React.FC = () => {
  const { data, isFetching } = usePromosList();
  const items: PromoModel[] = (data?.data ?? []) as PromoModel[];
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const promoCheck = usePromoCheck();

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
              "Terpakai",
              "Dibuat Pada",
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
                return: ({ isActive }) => (
                  <Poppins className="text-sm">
                    {isActive ? "Aktif" : "Tidak Aktif"}
                  </Poppins>
                ),
              },
              {
                return: ({ used }) => (
                  <Poppins className="text-sm">{used ? "Ya" : "Tidak"}</Poppins>
                ),
              },
              {
                return: ({ createdAt }) => (
                  <Poppins className="text-sm">
                    {new Date(createdAt).toLocaleString()}
                  </Poppins>
                ),
              },
            ]}
            notFoundMessage={["Tidak ada promo."]}
          />
        </div>
        <div className="md:hidden space-y-3">
          {(items || [])?.length ? (
            items.map((p) => (
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
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
            ))
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
