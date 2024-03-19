import React, { FunctionComponent, useEffect, useState } from "react";
import "../3P-style.scss";

type Props = {};

const ConsoleDrawComponent: FunctionComponent<Props> = () => {
  const [ScriptValue, setScriptValue] = useState<string[]>();

  useEffect(() => {
    console.log(ScriptValue);
  }, [ScriptValue]);
  return (
    <div className="flex-col g15 dark-bg small-dark-container display-from-left">
      <div id="viewDraft"></div>
      <div className="flex-center">
        <textarea name="draw-script" className="input" onKeyUp={(e) => setScriptValue(e.currentTarget.value.split(/\r?\n/))} />
        <div className="b0 flex-col flex-end-justify g15 p15 bg_black" >
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
