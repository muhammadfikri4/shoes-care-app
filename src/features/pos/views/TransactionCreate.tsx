import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { DropdownRevamp } from "../../_global/components/Dropdown/DropdownRevamp";
import { InputFile } from "../../_global/components/File";
import { Input } from "../../_global/components/Input";
import { Poppins } from "../../_global/components/Text";
import { TextArea } from "../../_global/components/TextArea";
import { useRacksList } from "../hooks/useRacks";
import { usePromoVerify, useTransactionCreate } from "../hooks/useTransactions";

type ItemForm = {
  rack: {
    id: string;
    name: string;
  };
  shoeName: string;
  price: number;
  days: number;
  photo?: File | null;
  note?: string;
};

export const TransactionCreate: React.FC = () => {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    paymentMethod: "QRIS" as "QRIS" | "CASH" | "TRANSFER",
    usePromo: false,
    cashPaid: 0,
    promoCode: "",
    items: [
      {
        rack: { id: "", name: "" },
        shoeName: "",
        price: 0,
        days: 7,
        photo: null as File | null,
        note: "",
      },
    ] as ItemForm[],
  });
  const createMutation = useTransactionCreate();
  const promoVerify = usePromoVerify();
  const { data: racksData } = useRacksList();

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
          shoeName: "",
          price: 0,
          days: 7,
          photo: null,
          note: "",
        },
      ],
    }));
  const removeSection = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const updateItem = (idx: number, patch: Partial<ItemForm>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const submit = async () => {
    if (!form.customerName.trim() || !form.customerEmail.trim()) {
      toast.error("Customer Name dan Email wajib diisi");
      return;
    }
    const firstRack = form.items.find((i) => i.rack?.id);
    if (!firstRack?.rack.id) {
      toast.error("Pilih minimal satu Nomor Rak pada Items");
      return;
    }
    const formData = new FormData();
    formData.append("customerEmail", form.customerEmail);
    formData.append("customerName", form.customerName);
    formData.append("customerPhone", form.customerPhone);
    formData.append("paymentMethod", form.paymentMethod);
    formData.append("usePromo", String(form.usePromo));
    formData.append("promoCode", form.promoCode);
    formData.append("cashPaid", String(form.cashPaid));
    form.items.forEach((it, i) => {
      formData.append(`items[${i}][name]`, it.shoeName);
      formData.append(`items[${i}][price]`, String(it.price));
      formData.append(`items[${i}][estimateDay]`, String(it.days));
      if (it.note) formData.append(`items[${i}][note]`, it.note);
      if (it.photo) formData.append(`items[${i}][file]`, it.photo);
    });
    createMutation.mutate(formData);
  };

  return (
    <BaseLayout
      title="Tambah Transaksi"
      backButton={{
        title: "Transaksi",
        navigateTo: "/admin/transactions",
      }}
    >
      <div className="max-w-6xl mx-auto pb-24">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Customer Name <span className="text-red-500">(Required)</span>
              </div>
              <Input
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                placeholder="Nama Customer"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Customer Email <span className="text-red-500">(Required)</span>
              </div>
              <Input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerEmail: e.target.value }))
                }
                placeholder="Email Customer"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">
                Customer Phone <span className="text-red-500">(Required)</span>
              </div>
              <Input
                value={form.customerPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerPhone: e.target.value }))
                }
                placeholder="No. HP"
              />
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Payment Method</div>
              <DropdownRevamp
                defaultValue={{
                  label: form.paymentMethod,
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
              />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <label className="inline-flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={form.usePromo}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, usePromo: e.target.checked }))
                  }
                />
                <span className="text-sm text-slate-700">Use Promo?</span>
              </label>
            </div>
            {form.usePromo && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2">
                  <div className="text-sm text-slate-600 mb-1">Promo Code</div>
                  <Input
                    value={form.promoCode}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, promoCode: e.target.value }))
                    }
                    placeholder="Masukkan kode promo"
                  />
                </div>
                <div>
                  <Button
                    onClick={() =>
                      promoVerify.mutate({
                        email: form.customerEmail,
                        code: form.promoCode,
                      })
                    }
                    disabled={!form.customerEmail || !form.promoCode}
                  >
                    Cek Kode
                  </Button>
                </div>
                {promoVerify.isError && (
                  <div className="text-red-600 text-sm md:col-span-3">
                    {promoVerify.error?.message || "Kode tidak valid"}
                  </div>
                )}
                {promoVerify.isSuccess && (
                  <div className="text-emerald-600 text-sm md:col-span-3">
                    Kode valid. Diskon{" "}
                    {promoVerify.data?.data?.discountPercent ?? 0}%
                  </div>
                )}
              </div>
            )}
            {form.paymentMethod === "CASH" && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <div className="text-sm text-slate-600 mb-1">
                    Uang Diterima
                  </div>
                  <Input
                    type="number"
                    value={form.cashPaid || undefined}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        cashPaid: Number(e.target.value || 0),
                      }))
                    }
                    placeholder="Jumlah uang"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-slate-600 mb-1">Kembalian</div>
                  <div className="border rounded px-3 py-2 bg-slate-50">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(
                      Math.max(0, Number(form.cashPaid || 0) - (total || 0))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <Poppins className="text-lg font-semibold mb-4">
            Items Transaction
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
                      value={it.shoeName}
                      onChange={(e) =>
                        updateItem(idx, { shoeName: e.target.value })
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
                      onChange={(e) =>
                        updateItem(idx, { days: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Poppins className="text-sm text-slate-600 mb-1">
                      Upload Photo
                    </Poppins>

                    <InputFile
                      selectedFile={it.photo ? [it.photo] : []}
                      resetDefaultImage={() => updateItem(idx, { photo: null })}
                      handleFileChange={(e) =>
                        updateItem(idx, { photo: e?.[0] || null })
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

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-md z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Total: {format.format(total)}</div>
            <div>
              <Button onClick={submit} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
