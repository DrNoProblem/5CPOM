import React, { FC, useEffect, useRef, useState } from "react";
import "../3P-style.scss";
import { Color } from "aws-sdk/clients/lookoutvision";

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
}
type Props = {};

const ConsoleDrawComponent: FC<Props> = () => {
  const [ScriptValue, setScriptValue] = useState<string[]>();
  const [DrawProperties, setDrawProperties] = useState<DrawPropertiesModel>({
    posX: 225,
    posY: 225,
    rotation: 0,
    draw: true,
    visiblity: true,
    traceColor: "#000",
    backgroundColor: "#fff",
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
    };
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 450, 450);
      }
    }
    applyRocketDataFront(resetedValue);
    setDrawProperties(resetedValue);
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
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.moveTo(DrawProperties.posX, DrawProperties.posY);
        console.log("test");
        applyRocketDataFront(DrawProperties);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateRocket = (command: ICommand, ctx: CanvasRenderingContext2D | null, TempoDrawData: DrawPropertiesModel): DrawPropertiesModel => {
    if (!ctx) return TempoDrawData;

    switch (command.command) {
      case "AV": //!
        console.log(`rocket advances by ${command.params[0]} pixels`);
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
        console.log(`rocket moves back by ${command.params[0]} pixels`);
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
        console.log(`rocket turns right by ${command.params[0]} degrees`);

        let tempoRotationRight = TempoDrawData.rotation;
        tempoRotationRight -= command.params[0];
        tempoRotationRight = (tempoRotationRight + 360) % 360;
        TempoDrawData.rotation = tempoRotationRight;
        applyRocketDataFront(TempoDrawData);
        break;
      case "TG": //!
        console.log(`rocket turns left by ${command.params[0]} degrees`);
        let tempoRotationLeft = TempoDrawData.rotation;
        tempoRotationLeft += command.params[0];
        tempoRotationLeft = tempoRotationLeft % 360;
        TempoDrawData.rotation = tempoRotationLeft;
        applyRocketDataFront(TempoDrawData);
        break;
      case "LC": //!
        console.log("rocket stops drawing");
        TempoDrawData.draw = false;

        break;
      case "BC": //!
        console.log("rocket starts drawing");
        TempoDrawData.draw = true;
        break;
      case "CT": //!
        console.log("rocket is hidden");
        TempoDrawData.visiblity = false;
        applyRocketDataFront(TempoDrawData);
        break;
      case "MT": //!
        console.log("rocket is visible");
        TempoDrawData.visiblity = true;
        applyRocketDataFront(TempoDrawData);
        break;
      case "VE": //!
        console.log("rocket is repositioned at the center");
        ctx.moveTo(225, 225);

        TempoDrawData.posX = 225;
        TempoDrawData.posY = 225;
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCC": //!
        console.log(`stroke color is set to ${command.params[0]}`);
        TempoDrawData.traceColor = command.params[0];
        if (ctx) {
          ctx.strokeStyle = command.params[0];
        }
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCB": //!
        console.log(`background color is set to ${command.params[0]}`);
        TempoDrawData.backgroundColor = command.params[0];
        applyRocketDataFront(TempoDrawData);
        break;
      case "FCAP": //!
        console.log(`Set the rocket's angle to ${command.params[0]} degrees`);
        let fixedAngle = command.params[0] % 360;
        if (fixedAngle < 0) fixedAngle += 360;
        TempoDrawData.rotation = fixedAngle;
        applyRocketDataFront(TempoDrawData);
        break;
      case "FPOS": //!
        console.log("Clear the screen and reposition the rocket at the center");
        ctx.clearRect(0, 0, 450, 450);
        ctx.moveTo(225, 225);

        TempoDrawData.posX = 225;
        TempoDrawData.posY = 225;
        applyRocketDataFront(TempoDrawData);
        break;
      case "NETTOIE": //!
        console.log("Clear the screen without changing the rocket's position");
        ctx.clearRect(0, 0, 450, 450);
        ctx.moveTo(TempoDrawData.posX, TempoDrawData.posY);
        break;
      case "ORIGINE": //!
        console.log(`Position the rocket at the point (${command.params[0]}, ${command.params[1]})`);
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
        console.log("Clear the console");
        applyRocketDataFront(TempoDrawData);
        break;
      default:
        console.log(`UNKNOW command: ${command.command}`);
        applyRocketDataFront(TempoDrawData);
        break;
    }
    return TempoDrawData;
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const procedures: { [key: string]: IProcedure } = {};

  const parseAndExecuteLogoScript = async (lines: string[], lineIndex = 0, localParams: { [key: string]: number } = {}) => {
    const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

    if (!ctx) return;

    let TempoDrawData: DrawPropertiesModel = DrawProperties;

    while (lineIndex < lines.length) {
      await delay(250); //  0.25s

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
        console.log(parts); //!
        const params = parts.map((part) => {
          const num = Number(part);
          return isNaN(num) ? part : num;
        });
        console.log(params); //!
        TempoDrawData = simulateRocket({ command, params }, ctx, TempoDrawData);
        setDrawProperties(TempoDrawData);
      }

      lineIndex++;
    }
  };

  return (
    <div className="flex-col g25 dark-bg dark-container display-from-left">
      <div className="canva-container relative">
        <i className="material-icons pointer" id="cursor">
          rocket
        </i>
        <canvas ref={canvasRef} width="450" height="450" id="viewDraft" />
      </div>

      <form className="flex-center">
        <textarea name="draw-script" className="input" onKeyUp={(e) => setScriptValue(e.currentTarget.value.split(/\r?\n/))} />
        <div className="b0 flex-col flex-end-justify g15 p15 bg_black relative">
          <div className="edit-title-button normal-bg" onClick={() => (ScriptValue ? parseAndExecuteLogoScript(ScriptValue) : null)}>
            <i className="material-icons">publish</i>
          </div>
          <div className="edit-title-button normal-bg" onClick={() => resetDraw()}>
            <i className="material-icons">restart_alt</i>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsoleDrawComponent;
