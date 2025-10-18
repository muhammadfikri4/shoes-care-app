import React, { LegacyRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
  image: ArrayBuffer | string;
  isModal: boolean;
  cropperRef: LegacyRef<ReactCropperElement | HTMLImageElement> | undefined;
  getCropData: () => void;
  hanldeCancelCrop: () => void;
}

const CropperImage: React.FC<IProps> = ({
  image,
  isModal,
  cropperRef,
  getCropData,
  hanldeCancelCrop,
}) => {
  if (!image) return null;
  if (!isModal) return null;

  return (
    <div className="fixed inset-0 p-4 z-[9999] overflow-auto grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div
        data-dialog="dialog"
        className="relative w-full sm:min-w-[400px] z-[9999] sm:max-w-[40%] h-min overflow-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
      >
        <div className="flex items-center justify-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
          Crop Image
        </div>
        <div className="relative h-[300px] p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
          <Cropper
            src={image as string}
            style={{ height: "100%", width: "100%" }}
            aspectRatio={4 / 4} // 1080 / 1920 = 9 / 16
            guides={false}
            background={false} // Remove background grid
            ref={cropperRef} // ref
            viewMode={1} // Restrict the crop box to not exceed the size of the canvas
            minCropBoxWidth={8} // Set minimum width of the crop box
            minCropBoxHeight={8} // Set minimum height of the crop box
          />
        </div>
        <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
          <button
            data-ripple-dark="true"
            data-dialog-close="true"
            className="px-6 py-3 mr-1 font-sans text-xs font-bold bg-gradient-to-tr from-red-600 to-red-400 uppercase transition-all rounded-lg middle none center text-white hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="reset"
            onClick={() => hanldeCancelCrop()}
          >
            Cancel
          </button>
          <button
            type="button"
            data-ripple-light="true"
            data-dialog-close="true"
            className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={() => getCropData()}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperImage;
