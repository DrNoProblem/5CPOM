import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import "../3P-style.scss";
import { Link, match } from "react-router-dom";
import UserModel from "../../../models/user-model";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
};

const DrawPage: FunctionComponent<Props> = ({ currentUser }) => {
  const [user, setUser] = useState<UserModel>(currentUser);
  const [SelectedFileToUpload, setSelectedFileToUpload] = useState<Array<File>>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile)
      setSelectedFileToUpload([...SelectedFileToUpload, selectedFile]);
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
  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">Draw :</h2>
        </div>

        <div className="flex-row g50">
          <div className="flex-col p50 dark-bg big-dark-container display-from-left">
            <div id="viewDraft"></div>
            <div className="flex-bet">
              <input type="text" name="draw-script" className="input" />

              <div
                className="edit-title-button normal-bg"
                onClick={() => console.log("execute script")}
              >
                <i className="material-icons">publish</i>
              </div>

              <div
                className="edit-title-button normal-bg"
                onClick={() => console.log("reset script")}
              >
                <i className="material-icons">restart_alt</i>
              </div>
            </div>
          </div>

          <div className="flex-col p50 dark-bg big-dark-container display-from-left">
            <div
              className="drag-drop-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div
                className="big-normal-container flex-center flex-col "
                onClick={() => handleUploadButtonClick()}
              >
                <h2 className="mt0 flex-center-justify w100">
                  <span className="mr25 w30 txt-end">Drag & Drop</span>|
                  <span className="ml25 w30">Click here</span>
                </h2>
                <span>to import a media file</span>
                <input
                  type="file"
                  accept="*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex-wrap">
              <div
                className="cta cta-blue"
                onClick={() => console.log("import script")}
              >
                <i className="material-icons">keyboard_tab</i>
                <span>Import script</span>
              </div>

              <div
                className="cta cta-blue"
                onClick={() => console.log("export script to clipboard")}
              >
                <i className="material-icons">content_copy</i>
                <span>Copy script on clipboard</span>
              </div>

              <div
                className="cta cta-blue"
                onClick={() => console.log("download script")}
              >
                <i className="material-icons">download</i>
                <span>Download script</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawPage;
