import React, {FC, useRef, useState} from "react";
import CurrentUserDrawsUpdate from "../../../api-request/user/update-draw";
import {getToken} from "../../../helpers/token-verifier";
import UserModel from "../../../models/user-model";
import isHttpStatusValid from "../../../helpers/check-status";
import displayStatusRequest from "../../../helpers/display-status-request";

type Props = {
  script: string;
  functionReturned: Function;
  currentUser: UserModel;
};

const FileManagementComponent: FC<Props> = ({script, functionReturned, currentUser}) => {
  const [SelectedFileToUpload, setSelectedFileToUpload] = useState<File | null>();
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

  const UploadFileContent = async () => {
    console.log(await readFileContent());
  };

  const readFileContent = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (SelectedFileToUpload) {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target && event.target.result) resolve(event.target.result as string);
        };
        reader.onerror = reject;
        reader.readAsText(SelectedFileToUpload);
      } else {
        reject("No file selected");
      }
    });
  };

  const createScriptFile = (script: string, currentUserId: string) => {
    if (script !== "") {
      const fileName = `script${currentUserId}.txt`;
      const fileBlob = new Blob([script], {type: "text/plain"});
      return {fileBlob, fileName};
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
      if (token) {/* 
        CurrentUserDrawsUpdate(currentUser, "draws", [...currentUser.draws, {date: new Date(), script: script}]).then(
          (result) => {
            if (isHttpStatusValid(result.status)) {
              functionReturned(script);
              displayStatusRequest("Script uploaded successfully", false);
            } else displayStatusRequest("error : uploading script", true);
          }
        ); */
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
          <input type="file" accept=".txt" style={{display: "none"}} ref={fileInputRef} onChange={handleFileChange} />
        </div>
      </div>
      {SelectedFileToUpload ? (
        <div className="border-bot-normal pb15">
          <div className="w100 g15 mb15 flex-center-align">
            <i className="">folder</i>
            <span>{SelectedFileToUpload.name}</span>
            <i className=" red-h mlauto normal" onClick={() => setSelectedFileToUpload(null)}>
              delete
            </i>
          </div>
          <div className="cta blue-h normal-bg" onClick={UploadFileContent}>
            <span className="add-user flex-row flex-center-align flex-start-justify g15">
              <i className="">keyboard_tab</i>
              Save imported script
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex-wrap g15">
        <div className="cta blue-h normal-bg" onClick={uploadScriptOnDataBase}>
          <span className="add-user flex-row flex-center-align flex-start-justify g15">
            <i className="">save</i>Save script
          </span>
        </div>

        <div className="cta blue-h normal-bg" onClick={downloadScript}>
          <span className="add-user flex-row flex-center-align flex-start-justify g15">
            <i className="">download</i>
            Download script
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileManagementComponent;
