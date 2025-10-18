export interface SelectedFile {
  type: string;
  name: string;
  size?: number;
}

export interface DefaultValue {
  name?: string;
  filesize?: string;
  date?: string;
}

export interface InputFileAttachmentProps {
  supportFile?: string[];
  handleFileChange?: (files: FileList | never[]) => void;
  selectedFile?: SelectedFile[];
  isMultiple?: boolean;
  handleDeleteSelectedFile?: (index?: string | number) => void;
  handleDownloadSelectedFile?: (index?: string | number) => void;
  handlePreviewSelectedFile?: (index?: string | number) => void;
  errorMessage?: string | string[];
  isLoading?: boolean;
  defaultValue?: { name: string };
  resetDefaultImage: () => void;
  max?: number;
}
