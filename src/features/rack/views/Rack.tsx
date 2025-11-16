import { RackModel } from "@core/model/rack";
import { racksService } from "@core/services/pos";
import React, { useMemo, useState } from "react";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { Drawer } from "../../_global/components/Drawer"; // sesuaikan path jika berbeda
import { InputLabel } from "../../_global/components/InputLabel";
import { MasterTable } from "../../_global/components/MasterTable";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Poppins } from "../../_global/components/Text";
import { useRacksList } from "../hooks/useRacks";

type RackPayload = {
  code: string;
  name?: string;
  description?: string;
};

type DrawerMode = "create" | "edit";

export const RacksManagement: React.FC = () => {
  const { data, refetch, isFetching } = useRacksList();

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RackPayload>({ code: "" });
  const [saving, setSaving] = useState(false);

  // Delete modal states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RackModel | null>(null);
  const [deleting, setDeleting] = useState(false);

  const racks = data?.data || [];

  const titleDrawer = useMemo(
    () => (drawerMode === "create" ? "Tambah Rak" : "Ubah Rak"),
    [drawerMode]
  );

  // Open Drawer: Create
  const openCreate = () => {
    setDrawerMode("create");
    setEditingId(null);
    setForm({ code: "", name: "", description: "" });
    setDrawerOpen(true);
  };

  // Open Drawer: Edit
  const openEdit = (r: RackModel) => {
    setDrawerMode("edit");
    setEditingId(r.id);
    setForm({
      code: r.code,
      name: r.name ?? "",
      description: r.description ?? "",
    });
    setDrawerOpen(true);
  };

  // Close Drawer
  const closeDrawer = () => {
    if (saving) return;
    setDrawerOpen(false);
    setEditingId(null);
    setForm({ code: "" });
  };

  // Submit create/update
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.code?.trim()) return;

    setSaving(true);
    try {
      if (drawerMode === "create") {
        await racksService.create({
          code: form.code.trim(),
          name: form.name?.trim() || undefined,
          description: form.description?.trim() || undefined,
        });
      } else if (drawerMode === "edit" && editingId) {
        await racksService.update(editingId)({
          code: form.code.trim(),
          name: form.name?.trim() || undefined,
          description: form.description?.trim() || undefined,
        });
      }
      await refetch();
      closeDrawer();
    } finally {
      setSaving(false);
    }
  };

  // Delete flow
  const askDelete = (r: RackModel) => {
    setDeleteTarget(r);
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await racksService.remove(deleteTarget.id)();
      await refetch();
      closeDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <BaseLayout
      title="Manajemen Rak"
      action={{
        children: "Tambah Rak",
        onClick: openCreate,
      }}
    >
      <CustomSection>
        <MasterTable
          border={{ bottom: true, top: true, left: true, right: true }}
          title={["Kode", "Nama", "Deskripsi", "Aksi"]}
          isLoading={isFetching}
          data={racks}
          columnTable={[
            {
              return: (r: RackModel) => <Poppins>{r.code}</Poppins>,
            },
            {
              return: (r: RackModel) => <Poppins>{r.name || "-"}</Poppins>,
            },
            {
              return: (r: RackModel) => (
                <Poppins>{r.description || "-"}</Poppins>
              ),
            },
            {
              return: (r: RackModel) => (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => askDelete(r)}
                  >
                    Hapus
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </CustomSection>

      {/* Drawer Create/Edit */}
      <Drawer
        show={drawerOpen}
        onHide={closeDrawer}
        close={{ title: titleDrawer }}
      >
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-2">{titleDrawer}</h3>

          <RackForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            submitting={saving}
            mode={drawerMode}
          />
        </div>
      </Drawer>

      {/* Modal Delete */}
      <Modal
        isOpen={deleteOpen}
        onClose={closeDelete}
        title="Hapus Rak?"
        description={`Rak dengan kode "${
          deleteTarget?.code || "-"
        }" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        variant="danger"
        size="md"
        actions={[
          {
            label: "Batal",
            onClick: closeDelete,
            variant: "secondary",
            disabled: deleting,
          },
          {
            label: deleting ? "Menghapus..." : "Hapus",
            onClick: confirmDelete,
            variant: "danger",
            loading: deleting,
          },
        ]}
      >
        <div className="mt-2">
          <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
            Pastikan rak tidak sedang dipakai sebelum menghapus.
          </div>
        </div>
      </Modal>
    </BaseLayout>
  );
};

const RackForm: React.FC<{
  form: RackPayload;
  setForm: React.Dispatch<React.SetStateAction<RackPayload>>;
  onSubmit: (e?: React.FormEvent) => void;
  submitting?: boolean;
  mode: DrawerMode;
}> = ({ form, setForm, onSubmit, submitting, mode }) => {
  const isEdit = mode === "edit";
  const canSubmit = form.code?.trim();

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3"
      autoComplete="off"
    >
      <div className="grid grid-cols-1 gap-3">
        <div>
          <InputLabel
            titleSize="sm"
            gap="sm"
            title="Kode Rak"
            inputProps={{
              placeholder: "Kode rak (mis: R01)",
              value: form.code,
              onChange: (e) => setForm((s) => ({ ...s, code: e.target.value })),
            }}
          />
        </div>
        <div>
          <InputLabel
            titleSize="sm"
            gap="sm"
            title="Nama Rak"
            inputProps={{
              placeholder: "Nama rak (opsional)",
              value: form.name,
              onChange: (e) => setForm((s) => ({ ...s, name: e.target.value })),
            }}
          />
        </div>
        <div>
          <InputLabel
            titleSize="sm"
            gap="sm"
            title="Deskripsi"
            inputProps={{
              placeholder: "Deskripsi rak (opsional)",
              value: form.description,
              onChange: (e) =>
                setForm((s) => ({ ...s, description: e.target.value })),
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="submit"
          variant={!canSubmit || submitting ? "disabled" : "primary"}
        >
          {submitting
            ? isEdit
              ? "Menyimpan..."
              : "Menambahkan..."
            : isEdit
            ? "Simpan Perubahan"
            : "Tambah Rak"}
        </Button>
      </div>
    </form>
  );
};
