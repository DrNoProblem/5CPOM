import React, { FC, useEffect, useRef, useState } from "react";
import "../3P-style.scss";

interface ICommand {
  command: string;
  params: any[];
}

interface IProcedure {
  parameters: string[];
  body: string[];
}

type Props = {};

const ConsoleDrawComponent: FC<Props> = () => {
  const [ScriptValue, setScriptValue] = useState<string[]>();

  let PosX = 225; // Position initiale x (au centre du canvas)
  let PosY = 225; // Position initiale y (au centre du canvas)
  let rotation = 0; // Angle initial en degrés
  let draw = true;
  let RocketVisible = true;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateRocketPosition = () => {
    const rocketElement = document.getElementById("cursor");
    if (rocketElement) {
      rocketElement.style.left = `${PosX}px`;
      rocketElement.style.top = `${PosY}px`; // 450 est la hauteur du canvas, ajustez selon vos besoins
      rocketElement.style.transform = `rotate(${-rotation}deg) translate(-50%, calc(-50% + 2px))`; // L'angle doit être négatif pour correspondre à la rotation dans le sens horaire
      rocketElement.style.opacity = `${RocketVisible ? 1 : 0}`;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 450, 450); // Initialise le fond du canvas en blanc
        ctx.moveTo(PosX, PosY);
      }
    }
  }, []);

  const simulateRocket = (command: ICommand, ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;

    switch (command.command) {
      case "AV":
        console.log(`La tortue avance de ${command.params[0]} pixels`);
        const distance_AV = command.params[0];
        const newX_AV = PosX - distance_AV * Math.sin((rotation * Math.PI) / 180);
        const newY_AV = PosY - distance_AV * Math.cos((rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(PosX, PosY);
        ctx.lineTo(newX_AV, newY_AV);
        ctx.stroke();
        PosX = newX_AV;
        PosY = newY_AV;
        updateRocketPosition();
        break;
      case "RE":
        console.log(`La tortue avance de ${command.params[0]} pixels`);
        const distance_RE = command.params[0];
        const newX_RE = PosX + distance_RE * Math.sin((rotation * Math.PI) / 180);
        const newY_RE = PosY + distance_RE * Math.cos((rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(PosX, PosY);
        ctx.lineTo(newX_RE, newY_RE);
        ctx.stroke();
        PosX = newX_RE;
        PosY = newY_RE;
        updateRocketPosition();
        break;
      case "TD":
        console.log(`La tortue tourne à droite de ${command.params[0]} degrés`);
        rotation -= command.params[0];
        rotation = (rotation + 360) % 360;
        updateRocketPosition();
        break;
      case "TG":
        console.log(`La tortue tourne à gauche de ${command.params[0]} degrés`);
        rotation += command.params[0];
        rotation = rotation % 360;
        updateRocketPosition();
        break;
      case "LC":
        console.log("La tortue ne laisse pas de trace");
        updateRocketPosition();
        break;
      case "BC":
        console.log("La tortue laisse une trace");
        updateRocketPosition();
        break;
      case "CT":
        console.log("La tortue est cachée");
        updateRocketPosition();
        RocketVisible = false;
        break;
      case "MT":
        console.log("La tortue est visible");
        RocketVisible = true;
        updateRocketPosition();
        break;
      case "VE":
        console.log("Efface l'écran et replace la tortue au centre");
        ctx.fillRect(0, 0, 450, 450); // Initialise le fond du canvas en blanc
        PosX = 225;
        PosY = 225;
        ctx.moveTo(PosX, PosY);
        updateRocketPosition();
        break;
      case "NETTOIE":
        console.log("Efface l'écran sans changer la position de la tortue");
        ctx.fillRect(0, 0, 450, 450); // Initialise le fond du canvas en blanc
        ctx.moveTo(PosX, PosY);
        break;
      case "ORIGINE":
        console.log("Replace la tortue au centre");
        PosX = 225;
        PosY = 225;
        ctx.moveTo(PosX, PosY);
        updateRocketPosition();
        break;
      case "VT":
        console.log("Efface la console");
        updateRocketPosition();
        break;
      case "FCC":
        console.log(`Change la couleur du trait en ${command.params[0]}`);
        updateRocketPosition();
        break;
      case "FCB":
        console.log(`Change la couleur du fond en ${command.params[0]}`);
        updateRocketPosition();
        break;
      case "FCAP":
        console.log(`Fixe l'angle de la tortue à ${command.params[0]} degrés`);
        updateRocketPosition();
        break;
      case "CAP":
        console.log("Retourne l'angle de la tortue");
        rotation += 180;
        updateRocketPosition();
        break;
      case "FPOS":
        console.log(`Positionne la tortue au point (${command.params[0]}, ${command.params[1]})`);
        updateRocketPosition();
        break;
      case "POSITION":
      case "POS":
        console.log("Retourne la position de la tortue");
        updateRocketPosition();
        break;
      default:
        console.log(`Commande non reconnue: ${command.command}`);
        updateRocketPosition();
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const procedures: { [key: string]: IProcedure } = {};

  const parseAndExecuteLogoScript = async (lines: string[], lineIndex = 0, localParams: { [key: string]: number } = {}) => {
    const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

    if (!ctx) return;

    while (lineIndex < lines.length) {
      await delay(250); // Délai de 0.25 seconde

      let line = lines[lineIndex].toUpperCase().trim();
      const parts = line.split(/\s+/);
      let command = parts.shift();

      if (!command || command.length === 0) {
        lineIndex++;
        continue;
      }

      // Remplacer les paramètres locaux par leurs valeurs
      parts.forEach((part, index) => {
        if (localParams[part] !== undefined) {
          parts[index] = localParams[part].toString();
        }
      });

      if (command === "REPETE") {
        const repetitions = parseInt(parts.shift() || "0");
        const subCommands: string[] = [];
        let balance = 1;

        while (lineIndex < lines.length - 1 && balance !== 0) {
          lineIndex++;
          const subLine = lines[lineIndex].toUpperCase().trim();
          if (subLine.startsWith("REPETE")) balance++;
          if (subLine === "]") balance--;
          if (balance !== 0) subCommands.push(subLine);
        }

        for (let i = 0; i < repetitions; i++) {
          await parseAndExecuteLogoScript(subCommands, 0, localParams);
        }
      } else if (command === "POUR") {
        const procedureName = parts.shift();
        const parameters = parts.filter((param) => param.startsWith(":")).map((param) => param.substring(1));
        const body: string[] = [];

        lineIndex++;
        while (lineIndex < lines.length) {
          line = lines[lineIndex].toUpperCase().trim();
          if (line === "FIN") break;
          body.push(line);
          lineIndex++;
        }

        if (procedureName) {
          procedures[procedureName] = { parameters, body };
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
        simulateRocket({ command, params }, ctx);
      }

      lineIndex++;
    }
  };

  return (
    <div className="flex-col g15 dark-bg dark-container display-from-left">
      <div className="canva-container relative">
        <i className="material-icons absolute blue pointer" id="cursor">
          rocket
        </i>
        <canvas ref={canvasRef} width="450" height="450" id="viewDraft" />
      </div>

      <form className="flex-center">
        <textarea name="draw-script" className="input" onKeyUp={(e) => setScriptValue(e.currentTarget.value.split(/\r?\n/))} />
        <div className="b0 flex-col flex-end-justify g15 p15 bg_black relative">
          <input type="color" className="color-input " />
          <div className="edit-title-button normal-bg" onClick={() => (ScriptValue ? parseAndExecuteLogoScript(ScriptValue) : null)}>
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
