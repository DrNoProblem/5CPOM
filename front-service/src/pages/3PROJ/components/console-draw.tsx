import React, { FC, useEffect, useRef, useState } from "react";
import "../3P-style.scss";
import { Color } from "aws-sdk/clients/lookoutvision";
import FileManagementComponent from "./file-management";

interface ICommand {
  command: string;
  params: any[];
}

interface IProcedure {
  parameters: string[];
  body: string[];
}

interface DrawPropertiesModel {
  posX: number;
  posY: number;
  rotation: number;
  draw: boolean;
  visiblity: boolean;
  traceColor: Color;
  backgroundColor: Color;
  speed: number;
}
type Props = {
  DefaultScript: string;
};

const ConsoleDrawComponent: FC<Props> = ({ DefaultScript }) => {
  const [ZoneTXT, setZoneTXT] = useState<Boolean>(true);
  const [ConsoleTXT, setConsoleTXT] = useState<string[]>(["> reset draw"]);

  const [SpeedPopUp, setSpeedPopUp] = useState<Boolean>(false);
  const [LoadPopUp, setLoadPopUp] = useState<Boolean>(false);

  const [ScriptValue, setScriptValue] = useState<string[]>();
  const [DrawProperties, setDrawProperties] = useState<DrawPropertiesModel>({
    posX: 225,
    posY: 225,
    rotation: 0,
    draw: true,
    visiblity: true,
    traceColor: "#000",
    backgroundColor: "#fff",
    speed: 250,
  });

  const resetDraw = () => {
    const resetedValue = {
      posX: 225,
      posY: 225,
      rotation: 0,
      draw: true,
      visiblity: true,
      traceColor: "#000",
      backgroundColor: "#fff",
      speed: 250,
    };
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 450, 450);
      }
    }
    applyRocketDataFront(resetedValue);
    setDrawProperties(resetedValue);
    setConsoleTXT([...ConsoleTXT, "reset draw"]);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyRocketDataFront = (newData: DrawPropertiesModel) => {
    const rocketElement = document.getElementById("cursor");
    if (rocketElement) {
      rocketElement.style.left = `${newData.posX}px`;
      rocketElement.style.top = `${newData.posY}px`;
      rocketElement.style.transform = `rotate(${-newData.rotation}deg) translate(-50%, calc(-50% + 2px))`;
      rocketElement.style.opacity = `${newData.visiblity ? 1 : 0}`;
      rocketElement.style.color = newData.traceColor;
    }
    const Canva = document.getElementById("viewDraft");
    if (Canva) {
      Canva.style.backgroundColor = newData.backgroundColor;
    }
  };

  useEffect(() => {
    if (document.getElementById("viewDraft")) {
      document.getElementById("viewDraft")!.nodeValue = DefaultScript;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.moveTo(DrawProperties.posX, DrawProperties.posY);
        applyRocketDataFront(DrawProperties);
      }
    }
    if (DefaultScript !== "") {
      setScriptValue(DefaultScript.split(/\r?\n/));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateRocket = (
    command: ICommand,
    ctx: CanvasRenderingContext2D | null,
    TempoDrawData: DrawPropertiesModel,
    TempoConsoleContent: string[]
  ): { TempoDrawData: DrawPropertiesModel; TempoConsoleContent: string[] } => {
    if (!ctx) return { TempoDrawData: TempoDrawData, TempoConsoleContent: TempoConsoleContent };

    switch (command.command) {
      case "AV": //!
        TempoConsoleContent.push(`rocket advances by ${command.params[0]} pixels`);
        const distance_AV = command.params[0];
        const newX_AV = TempoDrawData.posX - distance_AV * Math.sin((TempoDrawData.rotation * Math.PI) / 180);
        const newY_AV = TempoDrawData.posY - distance_AV * Math.cos((TempoDrawData.rotation * Math.PI) / 180);
        if (TempoDrawData.draw) {
          ctx.beginPath();
          ctx.moveTo(TempoDrawData.posX, TempoDrawData.posY);
          ctx.lineTo(newX_AV, newY_AV);
          ctx.stroke();
        }
        TempoDrawData.posX = newX_AV;
        TempoDrawData.posY = newY_AV;
        applyRocketDataFront(TempoDrawData);
        break;
      case "RE": //!
        TempoConsoleContent.push(`rocket moves back by ${command.params[0]} pixels`);
        const distance_RE = command.params[0];
        const newX_RE = TempoDrawData.posX + distance_RE * Math.sin((TempoDrawData.rotation * Math.PI) / 180);
        const newY_RE = TempoDrawData.posY + distance_RE * Math.cos((TempoDrawData.rotation * Math.PI) / 180);
        if (TempoDrawData.draw) {
          ctx.beginPath();
          ctx.moveTo(TempoDrawData.posX, TempoDrawData.posY);
          ctx.lineTo(newX_RE, newY_RE);
          ctx.stroke();
        }
        TempoDrawData.posX = newX_RE;
        TempoDrawData.posY = newY_RE;
        applyRocketDataFront(TempoDrawData);
        break;
      case "TD": //!
        TempoConsoleContent.push(`rocket turns right by ${command.params[0]} degrees`);

        let tempoRotationRight = TempoDrawData.rotation;
        tempoRotationRight -= command.params[0];
        tempoRotationRight = (tempoRotationRight + 360) % 360;
        TempoDrawData.rotation = tempoRotationRight;
        applyRocketDataFront(TempoDrawData);
        break;
      case "TG": //!
        TempoConsoleContent.push(`rocket turns left by ${command.params[0]} degrees`);
        let tempoRotationLeft = TempoDrawData.rotation;
        tempoRotationLeft += command.params[0];
        tempoRotationLeft = tempoRotationLeft % 360;
        TempoDrawData.rotation = tempoRotationLeft;
        applyRocketDataFront(TempoDrawData);
        break;
      case "LC": //!
        TempoConsoleContent.push("rocket stops drawing");
        TempoDrawData.draw = false;

        break;
      case "BC": //!
        TempoConsoleContent.push("rocket starts drawing");
        TempoDrawData.draw = true;
        break;
      case "CT": //!
        TempoConsoleContent.push("rocket is hidden");
        TempoDrawData.visiblity = false;
        applyRocketDataFront(TempoDrawData);
        break;
      case "MT": //!
        TempoConsoleContent.push("rocket is visible");
        TempoDrawData.visiblity = true;
        applyRocketDataFront(TempoDrawData);
        break;
      case "VE": //!
        TempoConsoleContent.push("rocket is repositioned at the center");
        ctx.moveTo(225, 225);

        TempoDrawData.posX = 225;
        TempoDrawData.posY = 225;
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCC": //!
        TempoConsoleContent.push(`stroke color is set to ${command.params[0]}`);
        TempoDrawData.traceColor = command.params[0];
        if (ctx) {
          ctx.strokeStyle = command.params[0];
        }
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCB": //!
        TempoConsoleContent.push(`background color is set to ${command.params[0]}`);
        TempoDrawData.backgroundColor = command.params[0];
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCAP": //!
        TempoConsoleContent.push(`Set the rocket's angle to ${command.params[0]} degrees`);
        let fixedAngle = command.params[0] % 360;
        if (fixedAngle < 0) fixedAngle += 360;
        TempoDrawData.rotation = fixedAngle;
        applyRocketDataFront(TempoDrawData);
        break;
      case "FPOS": //!
        TempoConsoleContent.push("Clear the screen and reposition the rocket at the center");
        ctx.clearRect(0, 0, 450, 450);
        ctx.moveTo(225, 225);

        TempoDrawData.posX = 225;
        TempoDrawData.posY = 225;
        applyRocketDataFront(TempoDrawData);
        break;
      case "NETTOIE": //!
        TempoConsoleContent.push("Clear the screen without changing the rocket's position");
        ctx.clearRect(0, 0, 450, 450);
        ctx.moveTo(TempoDrawData.posX, TempoDrawData.posY);
        break;
      case "ORIGINE": //!
        TempoConsoleContent.push(`Position the rocket at the point (${command.params[0]}, ${command.params[1]})`);
        TempoDrawData.posX = command.params[0];
        TempoDrawData.posY = command.params[1];
        applyRocketDataFront(TempoDrawData);
        break;
      case "POSITION":
      case "POS":
        console.log("Return the rocket's position");
        applyRocketDataFront(TempoDrawData);
        break;
      case "CAP":
        console.log("Return the rocket's angle");
        applyRocketDataFront(TempoDrawData);
        break;
      case "VT":
        TempoConsoleContent = ["> Clear the console"];
        applyRocketDataFront(TempoDrawData);
        break;
      default:
        TempoConsoleContent.push(`UNKNOW command: ${command.command}`);
        applyRocketDataFront(TempoDrawData);
        break;
    }
    return { TempoDrawData: TempoDrawData, TempoConsoleContent: TempoConsoleContent };
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const procedures: { [key: string]: IProcedure } = {};

  const parseAndExecuteLogoScript = async (lines: string[], lineIndex = 0, localParams: { [key: string]: number } = {}) => {
    const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

    if (!ctx) return;

    let TempoDrawData: DrawPropertiesModel = DrawProperties;
    let TempoConsoleContent: string[] = ConsoleTXT;

    while (lineIndex < lines.length) {
      await delay(DrawProperties.speed);

      let line = lines[lineIndex].toUpperCase().trim();
      const parts = line.split(/\s+/);
      let command = parts.shift();
      console.log(command); //!

      if (!command || command.length === 0) {
        lineIndex++;
        continue;
      }
      parts.forEach((part, index) => {
        if (localParams[part] !== undefined) {
          parts[index] = localParams[part].toString();
        }
      });

      if (command === "REPETE") {
        const repeter = parseInt(parts.shift() || "0");
        const subCommands: string[] = [];
        let balance = 1;

        while (lineIndex < lines.length - 1 && balance !== 0) {
          lineIndex++;
          const subLine = lines[lineIndex].toUpperCase().trim();
          if (subLine.startsWith("REPETE")) balance++;
          if (subLine === "]") balance--;
          if (balance !== 0) subCommands.push(subLine);
        }

        for (let i = 0; i < repeter; i++) {
          await parseAndExecuteLogoScript(subCommands, 0, localParams);
        }
      } else if (command === "POUR") {
        const procedureName = parts.shift();
        const param = parts.filter((param) => param.startsWith(":")).map((param) => param.substring(1));
        const body: string[] = [];

        lineIndex++;
        while (lineIndex < lines.length) {
          line = lines[lineIndex].toUpperCase().trim();
          if (line === "FIN") break;
          body.push(line);
          lineIndex++;
        }

        if (procedureName) {
          procedures[procedureName] = { parameters: param, body };
        }
      } else if (procedures[command]) {
        const procedure = procedures[command];
        const paramValues = parts.map(Number);
        const localParams: { [key: string]: number } = {};

        procedure.parameters.forEach((param, index) => {
          localParams[param] = paramValues[index] || 0;
        });

        await parseAndExecuteLogoScript(procedure.body, 0, localParams);
      } else {
        const params = parts.map((part) => {
          const num = Number(part);
          return isNaN(num) ? part : num;
        });
        let ResultValue = simulateRocket({ command, params }, ctx, TempoDrawData, TempoConsoleContent);
        TempoDrawData = ResultValue.TempoDrawData;
        TempoConsoleContent = ResultValue.TempoConsoleContent;
        setDrawProperties(TempoDrawData);
        setConsoleTXT(TempoConsoleContent);
      }

      lineIndex++;
    }
  };

  return (
    <div className="flex-col g5 dark-bg dark-container display-from-left">
      <div className="canva-container relative">
        <i className="material-icons pointer" id="cursor">
          rocket
        </i>
        {SpeedPopUp ? (
          <div className="speed-input absolute flex-center p10 w80 flex-bet">
            <i className="material-icons mr10">speed</i>
            <input
              className="w60"
              type="range"
              defaultValue={DrawProperties.speed}
              max={1000}
              min={0}
              step={50}
              onChange={(e) => setDrawProperties({ ...DrawProperties, speed: parseInt(e.currentTarget.value) })}
              onMouseUp={(e) => {
                setSpeedPopUp(!SpeedPopUp);
                setConsoleTXT([...ConsoleTXT, `Speed is set to ${e.currentTarget.value}ms`]);
              }}
            />
            <span className="mlauto">{DrawProperties.speed}ms</span>
          </div>
        ) : null}

        {LoadPopUp ? <div className="absolute b0">
              <FileManagementComponent script={"test"}/></div> : null}

        <canvas ref={canvasRef} width="450" height="450" id="viewDraft" />
      </div>

      <div className="b0  flex-start-justify g5 relative flex-center-align ">
        <div className={`mini-cta ${ZoneTXT ? "blue" : "blue-h"}`} onClick={() => setZoneTXT(true)}>
          script
        </div>
        <div className={`mini-cta ${ZoneTXT ? "blue-h" : "blue"}`} onClick={() => setZoneTXT(false)}>
          console
        </div>
        <i className={`material-icons blue-h mlauto ${SpeedPopUp ? "blue" : "blue-h"}`} onClick={() => setSpeedPopUp(!SpeedPopUp)}>
          speed
        </i>
        <i className={`material-icons ${LoadPopUp ? "blue" : "blue-h"}`} onClick={() => setLoadPopUp(!LoadPopUp)}>open_in_new</i>
        <i className="material-icons blue-h" onClick={() => resetDraw()}>
          restart_alt
        </i>
      </div>

      <div className={`${ZoneTXT ? "" : "hidden"}`}>
        <div className="flex-center mini-cta cta-blue absolute b0 r0 mb35 mr40" onClick={() => (ScriptValue ? parseAndExecuteLogoScript(ScriptValue) : console.log("No script to test"))}>
          test script
        </div>
        <textarea name="draw-script" className="input" onKeyUp={(e) => setScriptValue(e.currentTarget.value.split(/\r?\n/))} defaultValue={DefaultScript} />
      </div>

      <div className={`${ZoneTXT ? "hidden" : ""}`}>
        <textarea name="console-script" className="input" disabled value={ConsoleTXT.join("\n> ")} />
      </div>
    </div>
  );
};

export default ConsoleDrawComponent;
