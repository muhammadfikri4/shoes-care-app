import React from "react";
import { Button } from "../../_global/components/Button";
import { InputLabel } from "../../_global/components/InputLabel";
import { Poppins } from "@features/_global/components/Text";
import { LoadingSpinner } from "@features/_global/components/Dialog/dialog-v2";

export type RackPayload = {
  code: string;
  name?: string;
  description?: string;
};

export type DrawerMode = "create" | "edit";

interface RackFormProps {
  form: RackPayload;
  setForm: React.Dispatch<React.SetStateAction<RackPayload>>;
  onSubmit: (e?: React.FormEvent) => void;
  submitting?: boolean;
  mode: DrawerMode;
}

export const RackForm: React.FC<RackFormProps> = ({
  form,
  setForm,
  onSubmit,
  submitting,
  mode,
}) => {
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
          <div className="flex items-center justify-center gap-2">
            {submitting && <LoadingSpinner />}
            <Poppins>
              {submitting
                ? isEdit
                  ? "Menyimpan..."
                  : "Menambahkan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Tambah Rak"}
            </Poppins>
          </div>
        </Button>
      </div>
    </form>
  );
};
