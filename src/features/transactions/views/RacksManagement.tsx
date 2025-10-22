import { RackModel } from "@core/model/rack";
import { racksService } from "@core/services/pos";
import { Badge } from "@features/_global/components/Badge";
import React, { useEffect, useState } from "react";
import { useRacksList } from "../hooks/useRacks";

export const RacksManagement: React.FC = () => {
  const [items, setItems] = useState<RackModel[]>([]);
  const [form, setForm] = useState<{
    code: string;
    name?: string;
    location?: string;
  }>({ code: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    code?: string;
    name?: string;
    location?: string;
  }>({});

  const { data, refetch } = useRacksList();
  useEffect(() => {
    setItems((data?.data as RackModel[]) ?? []);
  }, [data]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await racksService.create(form);
      await refetch();
      setForm({ code: "" });
    } finally {
      setLoading(false);
    }
  };
  const remove = async (id: string) => {
    await racksService.remove(id)();
    await refetch();
  };
  const startEdit = (r: RackModel) => {
    setEditingId(r.id);
    setEditForm({
      code: r.code,
      name: r.name ?? undefined,
      location: r.location ?? undefined,
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };
  const saveEdit = async (id: string) => {
    if (!editForm.code || !editForm.code.trim()) return;
    await racksService.update(id)({
      code: editForm.code,
      name: editForm.name,
      location: editForm.location,
    });
    setEditingId(null);
    setEditForm({});
    await refetch();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manajemen Rak</h1>
        <p className="text-slate-500 text-sm">
          Kelola rak penitipan sepatu untuk proses cuci.
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
        <form
          onSubmit={create}
          className="grid md:grid-cols-5 grid-cols-1 gap-3"
        >
          <input
            className="border p-2 rounded"
            placeholder="Kode"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Nama"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Lokasi"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <div className="md:col-span-2 flex items-center">
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded p-2"
            >
              {loading ? "Menyimpan..." : "Tambah Rak"}
            </button>
          </div>
        </form>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {items.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2"
          >
            {editingId === r.id ? (
              <>
                <div className="flex items-center justify-between">
                  <input
                    className="border p-2 rounded w-40"
                    value={editForm.code || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, code: e.target.value })
                    }
                  />
                  <Badge
                    variant={
                      r.status === "AVAILABLE"
                        ? "success"
                        : r.status === "OCCUPIED"
                        ? "warning"
                        : "secondary"
                    }
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                </div>
                <input
                  className="border p-2 rounded"
                  placeholder="Nama"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Lokasi"
                  value={editForm.location || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => cancelEdit()}
                    className="text-slate-500 hover:underline text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => saveEdit(r.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Simpan
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{r.code}</div>
                  <Badge
                    variant={
                      r.status === "AVAILABLE"
                        ? "success"
                        : r.status === "OCCUPIED"
                        ? "warning"
                        : "secondary"
                    }
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600">{r.name || "-"}</div>
                <div className="text-sm text-slate-500">
                  Lokasi: {r.location || "-"}
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => startEdit(r)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
