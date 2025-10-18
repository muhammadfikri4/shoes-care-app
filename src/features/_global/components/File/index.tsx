import { DragEvent, KeyboardEvent, useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import { Poppins } from "../Text";
import { InputFileAttachmentProps } from "./types";
import {
  Trash,
  UploadCloud,
  Download,
  Eye,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  FileArchive,
  File as FileGeneric,
} from "lucide-react";
import { formatSize } from "@features/_global/helper";

const initZebraBg = "bg-gradient-to-br from-slate-50 via-white to-slate-50";

function getIconByMimeOrName(name?: string, type?: string) {
  const mime = (type || "").toLowerCase();
  const ext = (name?.split(".").pop() || "").toLowerCase();

  if (
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
  ) {
    return <ImageIcon className="w-5 h-5 text-blue-500" />;
  }
  if (mime.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext)) {
    return <Video className="w-5 h-5 text-purple-500" />;
  }
  if (["pdf"].includes(ext) || mime === "application/pdf") {
    return <FileText className="w-5 h-5 text-rose-500" />;
  }
  if (["zip", "rar", "7z"].includes(ext)) {
    return <FileArchive className="w-5 h-5 text-amber-600" />;
  }
  return <FileGeneric className="w-5 h-5 text-slate-500" />;
}

export const InputFile = ({
  supportFile,
  handleFileChange,
  selectedFile = [],
  handleDeleteSelectedFile,
  handleDownloadSelectedFile,
  errorMessage,
  defaultValue,
  isMultiple,
  isLoading,
  resetDefaultImage,
  max,
  handlePreviewSelectedFile,
}: InputFileAttachmentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptAttr = useMemo(
    () =>
      supportFile?.length
        ? supportFile.map((ext) => "." + ext.toLowerCase()).join(", ")
        : undefined,
    [supportFile]
  );

  const hasSelection = !!selectedFile?.length || !!defaultValue;

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (!handleFileChange) return;
    if (!isMultiple && e.dataTransfer.files?.length > 1) {
      // jika single tapi user drop banyak file, ambil yang pertama
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      handleFileChange(dt.files);
      return;
    }
    handleFileChange(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onKeyUpload = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const containerPad = 'p-2';

  return (
    <div className="flex items-center gap-4 w-full">
      {/* Hidden input */}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        multiple={isMultiple}
        onChange={(e) => handleFileChange?.(e.target.files || [])}
        accept={acceptAttr}
      />

      {/* Upload Dropzone */}
      <div className="w-full">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload file"
          onKeyDown={onKeyUpload}
          onClick={handleFileChange ? openPicker : undefined}
          onDrop={handleFileChange ? onDrop : undefined}
          onDragOver={handleFileChange ? onDragOver : undefined}
          onDragLeave={handleFileChange ? onDragLeave : undefined}
          className={[
            "relative w-full rounded-xl border border-dashed transition-all duration-200",
            dragOver
              ? "border-blue-400 bg-blue-50/60"
              : errorMessage
              ? "border-red-300"
              : "border-slate-300",
            initZebraBg,
            "outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer",
            containerPad, // <<— padding dinamis
          ].join(" ")}
        >
          {/* Header inside dropzone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!hasSelection && !isLoading ? (
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    dragOver ? "bg-blue-100" : "bg-slate-100",
                  ].join(" ")}
                >
                  <UploadCloud
                    className={[
                      "w-6 h-6",
                      dragOver ? "text-blue-500" : "text-slate-500",
                      isLoading ? "animate-pulse" : "",
                    ].join(" ")}
                  />
                </div>
              ) : null}
              <div>
                {!hasSelection && !isLoading ? (
                  <Poppins className="text-sm font-medium">
                    {hasSelection
                      ? "File terpilih"
                      : "Klik untuk pilih atau seret & jatuhkan berkas di sini"}
                  </Poppins>
                ) : null}
                {!selectedFile?.length ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {supportFile?.length ? (
                      <span>Tipe: {supportFile.join(", ")}</span>
                    ) : (
                      <span>Semua tipe diizinkan</span>
                    )}
                    {max ? <span>• Maks {formatSize(max)}</span> : null}
                  </div>
                ) : null}
              </div>
            </div>

            {/* {!hasSelection && !isLoading ? (
              <Button size="sm" variant="secondary" onClick={openPicker}>
                Pilih File
              </Button>
            ) : null} */}
          </div>

          {/* Selected / Default file summary */}
          {hasSelection && (
            <div className="">
              {/* Single default file (non-File object) */}
              {!!defaultValue && !selectedFile?.length && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/70 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {getIconByMimeOrName(defaultValue.name, "")}
                    <div className="min-w-0">
                      <Poppins
                        className="text-sm font-medium truncate max-w-[60vw]"
                        title={defaultValue.name}
                      >
                        {defaultValue.name}
                      </Poppins>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {handlePreviewSelectedFile && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewSelectedFile();
                        }}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {handleDownloadSelectedFile && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSelectedFile?.(0);
                        }}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {resetDefaultImage && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetDefaultImage();
                        }}
                        title="Hapus"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Multiple / selected File[] */}
              {selectedFile?.length ? (
                <ul className="px-0">
                  {Array.from(selectedFile).map((file, idx) => (
                    <li
                      key={`${file.name}-${idx}`}
                      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white/70 px-3 py-2 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getIconByMimeOrName(file.name, file.type)}
                        <div className="min-w-0">
                          <Poppins
                            className="text-sm font-medium truncate max-w-[54vw]"
                            title={file.name}
                          >
                            {file.name}
                          </Poppins>
                          <div className="text-xs text-slate-500">
                            {formatSize(file.size || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                        {handlePreviewSelectedFile && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewSelectedFile(0);
                            }}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {handleDownloadSelectedFile && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSelectedFile(idx);
                            }}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {handleDeleteSelectedFile ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSelectedFile(0);
                            }}
                            title="Hapus"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        ) : (
                          resetDefaultImage && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                resetDefaultImage();
                              }}
                              title="Hapus"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="mt-4 text-sm text-slate-500">Mengunggah…</div>
          )}
        </div>

        {/* Error messages */}
        <div className="flex flex-col gap-2 mt-2">
          {typeof errorMessage === "string" && !!errorMessage && (
            <Poppins className="text-xs text-red-500">{errorMessage}</Poppins>
          )}
          {Array.isArray(errorMessage) &&
            errorMessage.length > 0 &&
            errorMessage.map((msg, i) => (
              <Poppins key={`error-${i}`} className="text-xs text-red-500">
                {msg}
              </Poppins>
            ))}
        </div>
      </div>

      {/* Global clear if any selection */}
      {selectedFile?.length ? (
        <div className="pt-1">
          <Button
            variant="danger"
            onClick={() => resetDefaultImage?.()}
            title="Bersihkan semua"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
