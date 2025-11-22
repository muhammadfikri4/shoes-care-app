import { RackModel } from "@core/model/rack";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseLayout } from "../../_global/components/BaseLayout";
import { Button } from "../../_global/components/Button";
import { Drawer } from "../../_global/components/Drawer";
import { MasterTable } from "../../_global/components/MasterTable";
import { Pagination } from "../../_global/components/Pagination";
import { CustomSection } from "../../_global/components/SmartFilter";
import { Poppins } from "../../_global/components/Text";
import { RackDeleteModal } from "../components/RackDeleteModal";
import { RackForm } from "../components/RackForm";
import { useRackCreationForm } from "../hooks/useRackCreationForm";
import { useRacksList } from "../hooks/useRacks";

export const RacksManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = convertQueryParamsToObject(searchParams?.toString());
  const { data, refetch, isFetching } = useRacksList();

  const {
    form,
    setForm,
    mutationDelete,
    drawerOpen,
    drawerMode,
    openCreate,
    openEdit,
    closeDrawer,
    handleSubmit,
    saving,
    handleDelete,
    titleDrawer,
  } = useRackCreationForm(refetch);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RackModel | null>(null);

  const racks = data?.data || [];

  const askDelete = (r: RackModel) => {
    setDeleteTarget(r);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const onPageChange = (page: number) => {
    setSearchParams({ ...queries, page: page.toString() });
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
        <div className="block md:hidden space-y-3">
          {racks.length > 0 ? (
            <>
              {racks.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{r.code}</div>
                      <div className="text-sm text-slate-600">
                        {r.name || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                  </div>
                  <div className="text-sm text-slate-500">
                    {r.description || "-"}
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
              Tidak ada rak.
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <MasterTable
            border={{ bottom: true, top: true, left: true, right: true }}
            title={["Kode", "Nama", "Deskripsi", "Aksi"]}
            isLoading={isFetching}
            pagination={{
              currentPage: data?.meta?.page || 1,
              totalPages: data?.meta?.totalPages || 1,
              onPageChange: onPageChange,
            }}
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
        </div>
      </CustomSection>

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

      <RackDeleteModal
        isOpen={deleteOpen}
        onClose={closeDelete}
        onConfirm={() => handleDelete(deleteTarget?.id || "")}
        target={deleteTarget}
        deleting={mutationDelete.isPending}
      />
    </BaseLayout>
  );
};
