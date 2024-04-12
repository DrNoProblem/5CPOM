import React, { FC, useRef, useState } from "react";

type Props = {
  script: string;
};

const FileManagementComponent: FC<Props> = ({ script }) => {
  const [SelectedFileToUpload, setSelectedFileToUpload] = useState<Array<File>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) setSelectedFileToUpload([...SelectedFileToUpload, selectedFile]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFileToUpload([...SelectedFileToUpload, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "script.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="flex-col file-input g5">
      <div className="drag-drop-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="normal-container flex-center flex-col " onClick={() => handleUploadButtonClick()}>
          <h2 className=" flex-center-justify w100">
            <span className="mr25 w30 txt-end">Drag & Drop</span>|<span className="ml25 w30">Click here</span>
          </h2>
          <span>to import a media file</span>
          <input type="file" accept="*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
        </div>
      </div>

      <div className="flex-wrap g5">
        <div className="cta cta-blue" onClick={() => console.log("import script")}>
          <i className="material-icons">keyboard_tab</i>
          <span>Import script</span>
        </div>

        <div className="cta cta-blue" onClick={() => console.log("export script to clipboard")}>
          <i className="material-icons">content_copy</i>
          <span>Copy script on clipboard</span>
        </div>

        <div className="cta cta-blue" onClick={downloadScript}>
          <i className="material-icons">download</i>
          <span>Download script</span>
        </div>
      </div>
    </div>
  );
};

export default FileManagementComponent;
