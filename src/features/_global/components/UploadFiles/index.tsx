import React, { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Poppins } from "../Text";
import { bytesToMB } from "../../utils/byteToMB";

interface UploadFileProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file?: File | null;
  extensions?: string[];
  defaultFile?: {
    name: string;
    size: number;
  };
  title?: string;
  isRequired?: boolean
}

export const UploadFile: React.FC<UploadFileProps> = ({
  onChange,
  file,
  extensions,
  defaultFile,
  title = "Upload Files",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBrowseClick = () => fileInputRef.current?.click();

  const allowedExtensions = (extensions || [])
    .map((ext) => `${ext.trim()}`)
    .join(",");
  return (
    <>
      <div className="mb-6">
        <Poppins className="text-gray-700 text-sm">{title}</Poppins>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onClick={handleBrowseClick}
        >
          {file ?? defaultFile ? (
            <div className="space-y-3">
              <FaCloudUploadAlt size={48} className="mx-auto text-blue-400" />
              <p className="font-medium">File Selected</p>
              <Poppins>
                {defaultFile ? defaultFile.name : file?.name} -{" "}
                {bytesToMB(defaultFile ? defaultFile.size : file?.size || 0)} MB
              </Poppins>
            </div>
          ) : (
            <>
              <FaCloudUploadAlt
                size={48}
                className="mx-auto text-gray-400 mb-3"
              />
              <p className="text-gray-600 mb-1">Drag and drop files here</p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400 mt-3">
                Allowed: {allowedExtensions || "Any"} | Max size: 2MB
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept={allowedExtensions}
          ref={fileInputRef}
          onChange={onChange}
        />
      </div>
    </>
  );
};
