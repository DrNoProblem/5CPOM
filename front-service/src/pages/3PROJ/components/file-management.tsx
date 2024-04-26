import React, { FC, useRef, useState } from "react";
import CurrentUserDrawsUpdate from "../../../api-request/user/update-draw";
import { getToken } from "../../../helpers/token-verifier";
import UserModel from "../../../models/user-model";

type Props = {
  script: string;
  functionReturned: Function;
  currentUser: UserModel
};

const FileManagementComponent: FC<Props> = ({ script, functionReturned, currentUser }) => {
  const [SelectedFileToUpload, setSelectedFileToUpload] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) setSelectedFileToUpload(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFileToUpload(newFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

/*   const downloadScript = () => {
    if (script !== "") {
      const element = document.createElement("a");
      const file = new Blob([script], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "script.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } 
  };

  const uploadScriptOnDataBase = () => {
    if (script !== "") {
      console.log(script);
    }
  }; */

  const createScriptFile = (script: string, currentUserId: string) => {
    if (script !== "") {
      const fileName = `script${currentUserId}.txt`;
      const fileBlob = new Blob([script], { type: "text/plain" });
      return { fileBlob, fileName };
    }
    return null;
  };
  
  const downloadScript = () => {
    const fileData = createScriptFile(script, currentUser._id);
    if (fileData) {
      const element = document.createElement("a");
      element.href = URL.createObjectURL(fileData.fileBlob);
      element.download = fileData.fileName;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element); // Clean up
    }
  };
  
  const uploadScriptOnDataBase = () => {
    const fileData = createScriptFile(script, currentUser._id);
    if (fileData) {
      console.log(fileData.fileBlob);
      const token = getToken();
      if (token) {
        
        CurrentUserDrawsUpdate(currentUser, token, 'draws', [...currentUser.draws, {url: "", script: script}]).then(result => {
          if (result.status === 200) {
            console.log("Script uploaded successfully");
          } else {
            console.error("Error uploading script");
          }
        })
      }
      
      // Logic to upload `fileData.fileBlob` to your database
    }
  };

  return (
    <div className="flex-col file-input g15">
      <div className="drag-drop-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="import-container flex-center flex-col " onClick={handleUploadButtonClick}>
          <h2 className=" flex-center-justify w100">
            <span className="mr10 w50 txt-end">Drag & Drop</span>|<span className="ml10 w50">Click here</span>
          </h2>
          <span>to import a script file</span>
          <input type="file" accept=".txt" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
        </div>
      </div>

      <div className={`flex-wrap g15${SelectedFileToUpload ? " border-bot-normal pb15" : ""}`}>
        <div className="cta blue-h normal-bg" onClick={uploadScriptOnDataBase}>
          <span className="add-user flex-row flex-center-align flex-start-justify g15">
            <i className="material-icons">save</i>Save script
          </span>
        </div>

        <div className="cta blue-h normal-bg" onClick={downloadScript}>
          <span className="add-user flex-row flex-center-align flex-start-justify g15">
            <i className="material-icons">download</i>
            Download script
          </span>
        </div>
      </div>

      {SelectedFileToUpload ? (
        <div>
          <div className="w100 g15 mb15 flex-center-align">
            <i className="material-icons">folder</i>
            <span>{SelectedFileToUpload.name}</span>
            <i className="material-icons red-h mlauto normal">close</i>
          </div>
          <div className="cta blue-h normal-bg" onClick={() => functionReturned(SelectedFileToUpload)}>
            <span className="add-user flex-row flex-center-align flex-start-justify g15">
              <i className="material-icons">keyboard_tab</i>
              Import script and apply
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileManagementComponent;
