import React, { FunctionComponent, useState } from "react";
import UserModel from "../../models/user-model";
import "./2P-style.scss";

type Props = {
  currentUser: UserModel;
};

interface PlayerDataMode2PROJ {
  username: string;
  cardDeck: string[];
  cardHand: string[];
  statRessources: {
    generatorBrick: number;
    brick: number;
    generatorWeapon: number;
    weapon: number;
    generatorCrystal: number;
    crystal: number;
    hp: number;
    shield: number;
  };
  turnInfo: {
    trash: string | null;
    played: string | null;
  };
}

const AddCardToHand = (cardDeck: string[], cardHand: string[]) => {
  if (cardDeck.length !== 0) {
    const card = cardDeck.pop()!;
    cardHand.push(card);
  }
  return { cardDeck: cardDeck, cardHand: cardHand };
};

const RemoveCardFromHand = (cardHand: string[], cardId: string) => {
  cardHand = cardHand.filter((card) => card !== cardId);
  return cardHand;
};

const ReturnCardInDeck = (cardDeck: string[], cardId: string) => {
  cardDeck.push(cardId);
  return cardDeck;
};

const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser }) => {
  const [user, setUser] = useState<UserModel>(currentUser);

  const [PlayerData, setPlayerData] = useState<PlayerDataMode2PROJ>();
  const [AIData, setAIData] = useState<PlayerDataMode2PROJ>();

  const SelectCardToPlay = (cardId: string, player: PlayerDataMode2PROJ) => {
    return { ...player, cardHand: RemoveCardFromHand(player.cardHand, cardId), turnInfo: { played: cardId, trash: null } };
  };

  const SelectCardToTrash = (cardId: string, player: PlayerDataMode2PROJ) => {
    return { ...player, cardHand: RemoveCardFromHand(player.cardHand, cardId), turnInfo: { played: null, trash: cardId } };
  };

  const ApplyCardEffect = (cardId: string, cardOwner: PlayerDataMode2PROJ) => {
    switch (cardId) {
      case "brick":
        console.log("brick");
        break;
      case "magic":
        console.log("magic");
        break;
    }
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="">Projects : 2PROJ</h2>
        <div className="flex-wrap g20 w80 mb15 flex-center-align">
          <i>handyman</i>
          <i>view_quilt</i>
        </div>
      </div>
    </div>
  );
};

export default HomePage2PROJ;
