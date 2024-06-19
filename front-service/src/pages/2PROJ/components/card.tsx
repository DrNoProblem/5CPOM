import React, { FunctionComponent } from "react";
import CardModel from "../../../models/card-model";
import CustomIcons from "./custom-icons";

type Props = {
  card: CardModel;
  color: string;
  AddedClass: string;
  ClickFunction: Function;
};
const Card: FunctionComponent<Props> = ({ card, color, AddedClass, ClickFunction }) => {
  let colorClass = "";
  if ((color = "#0084ff")) {
    colorClass = "blue";
  }
  const formTxt = (txt: string) => {
    if (txt === "generatorBrick") return "brick generator";
    else if (txt === "generatorWeapon") return "weapon generator";
    else if (txt === "generatorCrystal") return "crystal generator";
    else return txt;
  };
  return (
    <div
      className={`card ${AddedClass}`}
      onClick={() => {
        ClickFunction(card._id);
      }}
    >
      <div className={`${colorClass}-player-border flex-col g5`}>
        <div className="g15 flex-center pb5 border-bot-light">
          <CustomIcons icon={card.costType} color={color} />
          <p className={`m0 ${colorClass}`}>{card.costValue}</p>
        </div>
        {card.enemyTargetType && card.enemyTargetValue !== 0 ? (
          <p className="m0 fs10 pb5 border-bot-light">
            <span className="fs10">On enemy&nbsp;:</span>
            <br />
            {card.enemyTargetValue > 0 ? "+" : ""}
            {card.enemyTargetValue} {formTxt(card.enemyTargetType)}
          </p>
        ) : null}

        {card.ownerTargetType && card.ownerTargetValue !== 0 ? (
          <p className="m0 fs10">
            <span className="fs10">On you&nbsp;:</span>
            <br />
            {card.ownerTargetValue > 0 ? "+" : ""}
            {card.ownerTargetValue} {formTxt(card.ownerTargetType)}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
