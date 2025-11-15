import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  TransactionCreationDTO,
  TransactionItem,
} from "../../../core/model/transaction";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { DropdownRevamp } from "../../_global/components/Dropdown/DropdownRevamp";
import { InputFile } from "../../_global/components/File";
import { Input } from "../../_global/components/Input";
import { Poppins } from "../../_global/components/Text";
import { TextArea } from "../../_global/components/TextArea";
import { SidebarAtom } from "../../_global/store";
import { useRacksList } from "../../rack/hooks/useRacks";
import { CashPaymentModal } from "../components/CashPaymentModal";
import { defaultValue } from "../const";
import { usePromoVerify, useTransactionCreate } from "../hooks/useTransactions";
import { buildFormData } from "../utils/build-form-data";

export const TransactionCreate: React.FC = () => {
  const [form, setForm] = useState<TransactionCreationDTO>(defaultValue);
  const [showCashModal, setShowCashModal] = useState(false);
  const createMutation = useTransactionCreate();
  const promoVerify = usePromoVerify();
  const { data: racksData } = useRacksList();
  const [sidebar] = useAtom(SidebarAtom);
  const format = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }),
    []
  );
  const total = useMemo(
    () => form.items.reduce((a, it) => a + (Number(it.price) || 0), 0),
    [form.items]
  );

  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          rack: { id: "", name: "" },
          name: "",
          price: 0,
          estimateDay: 0,
          file: undefined,
          note: undefined,
        },
      ],
    }));
  const removeSection = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const updateItem = (idx: number, patch: Partial<TransactionItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const submit = async () => {
    if (!form.customerName.trim() || !form.customerEmail.trim()) {
      toast.error("Nama dan Email Pelanggan wajib diisi");
      return;
    }
    const firstRack = form.items.find((i) => i.rack?.id);
    if (!firstRack?.rack.id) {
      toast.error("Pilih minimal satu Nomor Rak pada Items");
      return;
    }

    // Jika pakai promo, langsung submit tanpa modal (auto CASH)
    if (form.usePromo) {
      const formData = buildFormData({
        ...form,
        paymentMethod: "CASH",
        cashPaid: 0,
      });
      createMutation.mutate(formData);
      return;
    }

    // Jika payment method CASH (tanpa promo), tampilkan modal
    if (form.paymentMethod === "CASH") {
      setShowCashModal(true);
      return;
    }

    // Jika QRIS, langsung submit
    const formData = buildFormData(form);
    createMutation.mutate(formData);
  };

  const handleCashPaymentConfirm = (cashPaid: number) => {
    // Update form dengan cashPaid
    const updatedForm = { ...form, cashPaid };
    const formData = buildFormData(updatedForm);
    createMutation.mutate(formData);
  };

  // Auto set payment method to CASH when using promo
  useEffect(() => {
    if (form.usePromo) {
      setForm((p) => ({ ...p, paymentMethod: "CASH" }));
    }
  }, [form.usePromo]);

  // Close modal when mutation is successful
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowCashModal(false);
    }
  }, [createMutation.isSuccess]);

  return (
    <BaseLayout
      title="Tambah Transaksi"
      backButton={{
        title: "Transaksi",
        navigateTo: "/admin/transactions",
      }}
    >
      <div className="pb-24 flex flex-col gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Nama Pelanggan <span className="text-red-500">(Wajib)</span>
              </div>
              <Input
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                placeholder="Nama Pelanggan"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Email Pelanggan <span className="text-red-500">(Wajib)</span>
              </div>
              <Input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerEmail: e.target.value }))
                }
                placeholder="Email Pelanggan"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Nomor Telepon <span className="text-red-500">(Wajib)</span>
              </div>
              <Input
                value={form.customerPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerPhone: e.target.value }))
                }
                placeholder="Nomor Telepon"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Metode Pembayaran
              </div>
              <DropdownRevamp
                defaultValue={{
                  label:
                    form.paymentMethod === "CASH"
                      ? "Tunai"
                      : form.paymentMethod,
                  value: form.paymentMethod,
                }}
                list={[
                  { label: "QRIS", value: "QRIS" },
                  { label: "Cash", value: "CASH" },
                ]}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    paymentMethod: e.value as "QRIS" | "CASH",
                  }))
                }
                disabled={form.usePromo}
              />
            </div>
            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.usePromo}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, usePromo: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Gunakan Kode Promo
                </span>
              </label>
            </div>
            {form.usePromo && (
              <div className="md:col-span-2">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="text-sm font-medium text-slate-700 mb-3">
                    Kode Promo
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        value={form.promoCode}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, promoCode: e.target.value }))
                        }
                        placeholder="Masukkan kode promo"
                        className="w-full"
                      />
                    </div>
                    <div className="sm:w-auto w-full">
                      <Button
                        onClick={() =>
                          promoVerify.mutate({
                            email: form.customerEmail,
                            code: form.promoCode,
                          })
                        }
                        disabled={
                          !form.customerEmail ||
                          !form.promoCode ||
                          promoVerify.isPending
                        }
                        variant={
                          !form.customerEmail || !form.promoCode
                            ? "disabled"
                            : "primary"
                        }
                        className="w-full sm:w-auto whitespace-nowrap"
                      >
                        {promoVerify.isPending ? "Mengecek..." : "Cek Kode"}
                      </Button>
                    </div>
                  </div>
                  {promoVerify.isSuccess && (
                    <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Kode valid! Diskon{" "}
                        {promoVerify.data?.data?.discountPercent ?? 0}%
                      </span>
                    </div>
                  )}
                  {promoVerify.isError && (
                    <div className="mt-3 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Kode promo tidak valid
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <Poppins className="text-lg font-semibold mb-4">
            Item Transaksi
          </Poppins>
          <div className="space-y-4">
            {form.items.map((it, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-600 text-sm">{idx + 1}.</div>
                  {form.items.length > 1 && (
                    <div>
                      <Button
                        variant="danger"
                        onClick={() => removeSection(idx)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
                  <div>
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Nomor Rak
                    </Poppins>
                    <DropdownRevamp
                      placeholder="Pilih Rak"
                      defaultValue={
                        it.rack?.id
                          ? { label: it.rack?.name || "", value: it.rack?.id }
                          : undefined
                      }
                      list={(racksData?.data ?? []).map((r) => ({
                        label: `${r.code}${r.name ? " - " + r.name : ""}`,
                        value: r.id,
                      }))}
                      onChange={(e) =>
                        updateItem(idx, {
                          rack: { id: e.value, name: e.label },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Nama Sepatu
                    </Poppins>
                    <Input
                      className="border p-2 rounded w-full"
                      value={it.name}
                      onChange={(e) =>
                        updateItem(idx, { name: e.target.value })
                      }
                      placeholder="Contoh: Nike Air"
                    />
                  </div>
                  <div>
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Harga (Rp)
                    </Poppins>
                    <Input
                      currency
                      onChange={(e) =>
                        updateItem(idx, { price: Number(e.target.value) })
                      }
                      placeholder="Rp 0"
                    />
                  </div>
                  <div>
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Estimasi (Hari)
                    </Poppins>
                    <Input
                      inputMode="decimal"
                      type="number"
                      value={it.estimateDay || undefined}
                      onChange={(e) =>
                        updateItem(idx, { estimateDay: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Unggah Foto
                    </Poppins>

                    <InputFile
                      selectedFile={it.file ? [it.file] : []}
                      resetDefaultImage={() =>
                        updateItem(idx, { file: undefined })
                      }
                      handleFileChange={(e) =>
                        updateItem(idx, { file: e?.[0] || null })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-600 mb-1">Catatan</div>
                    <TextArea
                      onChange={(e) =>
                        updateItem(idx, { note: e.target.value })
                      }
                      style={{ resize: "none" }}
                      placeholder="Catatan tambahan"
                    >
                      {it.note}
                    </TextArea>
                  </div>
                </div>
              </div>
            ))}
            <div className="md:w-40">
              <Button onClick={addSection} variant="secondary">
                <Poppins className="text-primary">+ Tambah</Poppins>
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md z-30 duration-300">
          <div
            className={`max-w-6xl mx-auto ${
              sidebar ? "pl-24" : "pl-0"
            } py-3 flex items-center justify-between duration-300`}
          >
            <div className="font-semibold">Total: {format.format(total)}</div>
            <div>
              <Button
                onClick={submit}
                variant={createMutation.isPending ? "disabled" : "primary"}
              >
                {createMutation.isPending ? "Memproses..." : "Buat Transaksi"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pembayaran Cash */}
      <CashPaymentModal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        totalPrice={total}
        onConfirm={handleCashPaymentConfirm}
        isLoading={createMutation.isPending}
      />
    </BaseLayout>
  );
};
