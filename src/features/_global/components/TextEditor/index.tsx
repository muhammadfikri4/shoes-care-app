import { useRef } from "react";
import SunEditor from "suneditor-react";
import { SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";

interface ITextEditor {
  onChange: (res: string) => void;
  value?: string;
  textEditorProps?: SunEditorReactProps;
}

export const TextEditor = (props: ITextEditor) => {
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  return (
    <div className="flex justify-center">
      <SunEditor
        setContents={props.value}
        onChange={props.onChange}
        {...props.textEditorProps}
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["bold", "underline", "italic", "strike"],
            ["formatBlock", "fontSize"],
            ["paragraphStyle", "blockquote"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list"],
          ],
        }}
        getSunEditorInstance={getSunEditorInstance}
        
      />
    </div>
  );
};
