import React, { FunctionComponent, useState } from "react";
import "../3P-style.scss";

type Props = {};

const ConsoleDrawComponent: FunctionComponent<Props> = () => {
  return (
    <div className="flex-col p50 dark-bg big-dark-container display-from-left">
      <div id="viewDraft"></div>
      <div className="flex-col g15">
        <input type="text" name="draw-script" className="input" />
        <div className="flex-end-justify g15">
          <div className="edit-title-button normal-bg" onClick={() => console.log("execute script")}>
            <i className="material-icons">publish</i>
          </div>

          <div className="edit-title-button normal-bg" onClick={() => console.log("reset script")}>
            <i className="material-icons">restart_alt</i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleDrawComponent;
