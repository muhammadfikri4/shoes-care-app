import { useMemo, useState } from "react";
import { useRackCreate, useRackRemove, useRackUpdate } from "./useRacks";
import { RackModel } from "@core/model/rack";
import { DrawerMode, RackPayload } from "../components/RackForm";

export const useRackCreationForm = (refetch: () => void) => {
    const mutationCreate = useRackCreate();
    const mutationUpdate = useRackUpdate();
    const mutationDelete = useRackRemove();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<RackPayload>({ code: "" });
    const [saving, setSaving] = useState(false);

    const titleDrawer = useMemo(
        () => (drawerMode === "create" ? "Tambah Rak" : "Ubah Rak"),
        [drawerMode]
    );

    const openCreate = () => {
        setDrawerMode("create");
        setEditingId(null);
        setForm({ code: "", name: "", description: "" });
        setDrawerOpen(true);
    };

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

    const closeDrawer = () => {
        if (saving) return;
        setDrawerOpen(false);
        setEditingId(null);
        setForm({ code: "" });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!form.code?.trim()) return;

        setSaving(true);
        try {
            if (drawerMode === "create") {
                await mutationCreate.mutateAsync({
                    code: form.code,
                    name: form.name || undefined,
                    description: form.description || undefined,
                });
            } else if (drawerMode === "edit" && editingId) {
                await mutationUpdate.mutateAsync({
                    id: editingId,
                    code: form.code,
                    name: form.name,
                    description: form.description,
                });
            }
            refetch();
            closeDrawer();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        await mutationDelete.mutateAsync(id);
        refetch();
        closeDrawer();

    };

    return {
        form,
        setForm,
        drawerOpen,
        drawerMode,
        openCreate,
        openEdit,
        closeDrawer,
        handleSubmit,
        saving,
        handleDelete,
        titleDrawer,
        mutationDelete,
    };
};
