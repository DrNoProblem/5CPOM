import React, { FunctionComponent, useState } from "react";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import CardModel from "../../models/card-model";

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
  const [OpponentData, setOpponentData] = useState<PlayerDataMode2PROJ>();

  const ApplyPlayerCardEffect = (card: CardModel, cardOwner: PlayerDataMode2PROJ) => {
    if (PlayerData && OpponentData) {
      if (card.ownerTargetType !== "all")
        setPlayerData({
          ...PlayerData,
          statRessources: {
            ...PlayerData.statRessources,
            [card.costType]:
              PlayerData.statRessources[card.costType] - card.costValue === 0
                ? 0
                : PlayerData.statRessources[card.costType] - card.costValue,
            [card.ownerTargetType]:
              PlayerData.statRessources[card.ownerTargetType] + card.ownerTargetValue === 0
                ? 0
                : PlayerData.statRessources[card.ownerTargetType] + card.ownerTargetValue,
          },
        });
      if (card.opponentTargetType !== "all") {
        let dataOpponentTarget: string = "";
        if (card.opponentTargetType === "hp") {
          if (OpponentData.statRessources.shield - card.opponentTargetValue > 0) {
            let hpToSubstract = card.opponentTargetValue - OpponentData.statRessources.shield;
            //! revview here function decrease hp and shield calculate
          }
        }

        setOpponentData({
          ...OpponentData,
          statRessources: {
            ...OpponentData.statRessources,
            [card.opponentTargetType]:
              OpponentData.statRessources[card.opponentTargetType] + card.opponentTargetValue === 0
                ? 0
                : OpponentData.statRessources[card.opponentTargetType] + card.opponentTargetValue,
          },
        });
      }
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
