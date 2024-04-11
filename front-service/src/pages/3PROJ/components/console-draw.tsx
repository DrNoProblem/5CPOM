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

interface RocketDataModel {
  posX: number;
  posY: number;
  rotation: number;
  draw: boolean;
  visiblity: boolean;
  tarceColor: Color
}
type Props = {};

const ConsoleDrawComponent: FC<Props> = () => {
  const [ScriptValue, setScriptValue] = useState<string[]>();
  const [RocketData, setRocketData] = useState<RocketDataModel>({
    posX: 225,
    posY: 225,
    rotation: 0,
    draw: true,
    visiblity: true,
    tarceColor: "#000"
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyRocketDataFront = (newData: RocketDataModel) => {
    const rocketElement = document.getElementById("cursor");
    if (rocketElement) {
      rocketElement.style.left = `${newData.posX}px`;
      rocketElement.style.top = `${newData.posY}px`; 
      rocketElement.style.transform = `rotate(${-newData.rotation}deg) translate(-50%, calc(-50% + 2px))`; 
      rocketElement.style.opacity = `${newData.visiblity ? 1 : 0}`;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 450, 450); 
        ctx.moveTo(RocketData.posX, RocketData.posY);
        console.log("test");
        applyRocketDataFront(RocketData);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateRocket = (
    command: ICommand,
    ctx: CanvasRenderingContext2D | null,
    TempoRocketData: RocketDataModel
  ): RocketDataModel => {
    if (!ctx) return TempoRocketData;

    switch (command.command) {
      case "AV"://!
        console.log(`La tortue avance de ${command.params[0]} pixels`);
        const distance_AV = command.params[0];
        const newX_AV = TempoRocketData.posX - distance_AV * Math.sin((TempoRocketData.rotation * Math.PI) / 180);
        const newY_AV = TempoRocketData.posY - distance_AV * Math.cos((TempoRocketData.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(TempoRocketData.posX, TempoRocketData.posY);
        ctx.lineTo(newX_AV, newY_AV);
        ctx.stroke();

        TempoRocketData.posX = newX_AV;
        TempoRocketData.posY = newY_AV;
        applyRocketDataFront(TempoRocketData);
        break;
      case "RE"://!
        console.log(`La tortue avance de ${command.params[0]} pixels`);
        const distance_RE = command.params[0];
        const newX_RE = TempoRocketData.posX + distance_RE * Math.sin((TempoRocketData.rotation * Math.PI) / 180);
        const newY_RE = TempoRocketData.posY + distance_RE * Math.cos((TempoRocketData.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(TempoRocketData.posX, TempoRocketData.posY);
        ctx.lineTo(newX_RE, newY_RE);
        ctx.stroke();
        TempoRocketData.posX = newX_RE;
        TempoRocketData.posY = newY_RE;
        applyRocketDataFront(TempoRocketData);
        break;
      case "TD"://!
        console.log(`La tortue tourne à droite de ${command.params[0]} degrés`);

        let tempoRotationRight = TempoRocketData.rotation;
        tempoRotationRight -= command.params[0];
        tempoRotationRight = (tempoRotationRight + 360) % 360;
        TempoRocketData.rotation = tempoRotationRight;
        applyRocketDataFront(TempoRocketData);
        break;
      case "TG"://!
        console.log(`La tortue tourne à gauche de ${command.params[0]} degrés`);
        let tempoRotationLeft = TempoRocketData.rotation;
        tempoRotationLeft += command.params[0];
        tempoRotationLeft = tempoRotationLeft % 360;
        TempoRocketData.rotation = tempoRotationLeft;
        applyRocketDataFront(TempoRocketData);
        break;
      case "LC"://!
        console.log("La tortue ne laisse pas de trace");
        TempoRocketData.draw = false;
        applyRocketDataFront(TempoRocketData);

        break;
      case "BC"://!
        console.log("La tortue laisse une trace");
        TempoRocketData.draw = true;
        applyRocketDataFront(TempoRocketData);
        break;
      case "CT"://!
        console.log("La tortue est cachée");
        TempoRocketData.visiblity = false;
        applyRocketDataFront(TempoRocketData);
        break;
      case "MT"://!
        console.log("La tortue est visible");
        TempoRocketData.visiblity = true;
        applyRocketDataFront(TempoRocketData);
        break;
      case "VE"://!
        console.log("Efface l'écran et replace la tortue au centre");
        ctx.fillRect(0, 0, 450, 450); 
        ctx.moveTo(225, 225);
        
        TempoRocketData.posX = 225;
        TempoRocketData.posY = 225;
        applyRocketDataFront(TempoRocketData);
        break;
      case "NETTOIE"://!
        console.log("Efface l'écran sans changer la position de la tortue");
        ctx.fillRect(0, 0, 450, 450); 
        ctx.moveTo(TempoRocketData.posX, TempoRocketData.posY);
        break;
      case "ORIGINE"://!
        console.log("Replace la tortue au centre");
        ctx.moveTo(225, 225);
        
        TempoRocketData.posX = 225;
        TempoRocketData.posY = 225;
        applyRocketDataFront(TempoRocketData);
        break;
      case "VT":
        console.log("Efface la console");
        applyRocketDataFront(TempoRocketData);
        break;
      case "FCC":
        console.log(`Change la couleur du trait en ${command.params[0]}`);
        applyRocketDataFront(TempoRocketData);
        break;
      case "FCB":
        console.log(`Change la couleur du fond en ${command.params[0]}`);
        applyRocketDataFront(TempoRocketData);
        break;
      case "FCAP":
        console.log(`Fixe l'angle de la tortue à ${command.params[0]} degrés`);
        applyRocketDataFront(TempoRocketData);
        break;
      case "CAP"://!
        console.log("Retourne l'angle de la tortue");
        TempoRocketData.rotation += 180;
        applyRocketDataFront(TempoRocketData);
        break;
      case "FPOS":
        console.log(`Positionne la tortue au point (${command.params[0]}, ${command.params[1]})`);
        
        TempoRocketData.posX = command.params[0];
        TempoRocketData.posY = command.params[1];
        applyRocketDataFront(TempoRocketData);
        break;
      case "POSITION":
      case "POS":
        console.log("Retourne la position de la tortue");
        applyRocketDataFront(TempoRocketData);
        break;
      default:
        console.log(`Commande non reconnue: ${command.command}`);
        applyRocketDataFront(TempoRocketData);
        break;
    }
    return TempoRocketData;
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const procedures: { [key: string]: IProcedure } = {};

  const parseAndExecuteLogoScript = async (lines: string[], lineIndex = 0, localParams: { [key: string]: number } = {}) => {
    const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

    if (!ctx) return;

    let TempoRocketData: RocketDataModel = RocketData;

    while (lineIndex < lines.length) {
      await delay(250); //  0.25s

      let line = lines[lineIndex].toUpperCase().trim();
      const parts = line.split(/\s+/);
      let command = parts.shift();

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
        const params = parts.map(Number).filter((param) => !isNaN(param));
        TempoRocketData = simulateRocket({ command, params }, ctx, TempoRocketData);
        setRocketData(TempoRocketData);
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
          <div
            className="edit-title-button normal-bg"
            onClick={() => (ScriptValue ? parseAndExecuteLogoScript(ScriptValue) : null)}
          >
            <i className="material-icons">publish</i>
          </div>
          <div className="edit-title-button normal-bg" onClick={() => console.log("reset script")}>
            <i className="material-icons">restart_alt</i>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsoleDrawComponent;
