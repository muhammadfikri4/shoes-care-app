import { formatSize } from "@features/_global/helper";
import { DragEvent, useRef } from "react";
import { getFileFormat } from "./helper";
import { InputFileAttachmentProps } from "./types";
import { Poppins } from "../Text";
import { Button } from "../Button";

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

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    handleFileChange && handleFileChange(e.dataTransfer.files);
  };

  const handleClickBox = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <div
      className={`flex lg:flex-row flex-col lg:items-center lg:justify-between lg:gap-2 gap-1`}
    >
      <div className={`w-full lg:min-w-[94%]`}>
        <div
          className={`flex flex-col w-full border border-solid ${
            errorMessage ? "border-red-500" : "border-gray-100"
          } rounded-md py-3 px-4`}
        >
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            multiple={isMultiple}
            onChange={(e) =>
              handleFileChange && handleFileChange(e.target.files || [])
            }
            accept={
              supportFile?.length
                ? supportFile
                    ?.map((extension) => "." + extension.toLowerCase())
                    .join(", ")
                : undefined
            }
          />

          <div
            onClick={handleFileChange ? handleClickBox : undefined}
            onDragOver={handleFileChange ? handleDragOver : undefined}
            onDrop={handleFileChange ? handleDrop : undefined}
            className="flex justify-center cursor-pointer"
          >
            {defaultValue || selectedFile?.length ? (
              <div className="max-w-full flex items-center justify-between">
                <div
                  style={{
                    minWidth: 0,
                  }}
                  className="flex gap-4 items-center"
                >
                  {/* <Icon
                    name="DocumentFilled"
                    size="lg"
                    style={{
                      color: color?.computed?.blue?.[600],
                    }}
                  /> */}
                  <div
                    className="flex flex-wrap w-full"
                    style={{
                      // maxWidth: '50%', // Sesuaikan sesuai kebutuhan
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="lg:max-w-full max-w-[50%]">
                      <Poppins
                        className="lg:w-full w-[90%]"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: "semibold",
                        }}
                      >
                        {selectedFile?.length > 0
                          ? selectedFile.length > 1
                            ? `${Array.from(selectedFile)
                                .map((item) => item.name)
                                .join(", ")}`
                            : selectedFile?.[0].name
                          : defaultValue?.name}
                      </Poppins>
                    </div>
                    {selectedFile?.length && (
                      <Poppins
                        className="text-xs"
                        style={{
                          display: "inline-block",
                          minWidth: 0,
                        }}
                      >
                        {`${Array.from(selectedFile)
                          .map((item) => getFileFormat(item.type))
                          .join(", ")}`}
                      </Poppins>
                    )}
                  </div>
                </div>
                {handleDownloadSelectedFile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDownloadSelectedFile &&
                        handleDownloadSelectedFile(0);
                      resetDefaultImage && resetDefaultImage();
                    }}
                    // iconLeft={<Icon name="Download" size="lg" />}
                  ><></></Button>
                )}
                {handlePreviewSelectedFile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePreviewSelectedFile?.();
                      resetDefaultImage && resetDefaultImage();
                    }}
                    // iconLeft={<Icon name="EyeOpen" size="lg" />}
                  ><></></Button>
                )}
              </div>
            ) : null}

            {!defaultValue && !selectedFile?.length && !isLoading && (
              <div className="flex items-center gap-2">
                {/* <Icon name="Upload" size="lg" /> */}
                <Poppins className="font-medium text-base">
                  <div className="flex gap-1 items-center">
                    <Poppins className="font-medium text-sm">
                      Upload File
                    </Poppins>
                  </div>
                  <div className="flex items-center gap-1">
                    <Poppins className="font-normal text-sm">
                      {supportFile?.join(", ")}
                    </Poppins>

                    {max ? (
                      <Poppins className="font-normal text-sm">
                        {`(Max. ${formatSize(max ?? 1024)})`}
                      </Poppins>
                    ) : null}
                  </div>
                </Poppins>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {typeof errorMessage === "string" && errorMessage && (
            <Poppins className="text-xs text-red-500">{errorMessage}</Poppins>
          )}

          {Array.isArray(errorMessage) &&
            errorMessage.length > 0 &&
            errorMessage.map((item, index) => (
              <Poppins
                key={`error-file-selected-${index + 1}`}
                className="text-xs text-red-500"
              >
                {item}
              </Poppins>
            ))}
        </div>
      </div>
      {handleDeleteSelectedFile && (selectedFile?.length || defaultValue) && (
        <Button
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteSelectedFile && handleDeleteSelectedFile(0);
            resetDefaultImage && resetDefaultImage();
          }}
          //   iconLeft={<Icon name="Trash1" size="lg" style={{ color: "red" }} />}
        >
          <></>
        </Button>
      )}
    </div>
  );
};
