import React, { FunctionComponent, useState } from "react";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import CardModel from "../../models/card-model";
import { AddCardToHand } from "./game-function";
import getCardInfoById from "../../helpers/getCardInfoById";
import DataModel from "../../models/data-model";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
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
    health: number;
    shield: number;
  };
  turnInfo: {
    trash: string | null;
    played: string | null;
  };
}

const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser, Data }) => {
  const [user, setUser] = useState<UserModel>(currentUser);

  const [Cards, setCards] = useState<CardModel[]>(Data.cards);

  const [Player1Data, setPlayer1Data] = useState<PlayerDataMode2PROJ>();
  const [Player2Data, setPlayer2Data] = useState<PlayerDataMode2PROJ>();

  const initGame = () => {
    let TempoPlayer1Data: PlayerDataMode2PROJ = {
      username: "Player1",
      cardDeck: currentUser!.deck,
      cardHand: [],
      statRessources: {
        generatorBrick: 0,
        brick: 0,
        generatorWeapon: 0,
        weapon: 0,
        generatorCrystal: 0,
        crystal: 0,
        health: 30,
        shield: 10,
      },
      turnInfo: {
        trash: null,
        played: null,
      },
    };
    let TempoOpponentData: PlayerDataMode2PROJ = {
      username: "Player2",
      cardDeck: currentUser!.deck,
      cardHand: [],
      statRessources: {
        generatorBrick: 0,
        brick: 0,
        generatorWeapon: 0,
        weapon: 0,
        generatorCrystal: 0,
        crystal: 0,
        health: 30,
        shield: 10,
      },
      turnInfo: {
        trash: null,
        played: null,
      },
    };
    for (let i = 0; i < 8; i++) {
      TempoPlayer1Data = {
        ...TempoPlayer1Data,
        cardDeck: AddCardToHand(TempoPlayer1Data.cardDeck, TempoPlayer1Data.cardHand).cardDeck,
        cardHand: AddCardToHand(TempoPlayer1Data.cardDeck, TempoPlayer1Data.cardHand).cardHand,
      };
    }
    for (let i = 0; i < 8; i++) {
      TempoOpponentData = {
        ...TempoOpponentData,
        cardDeck: AddCardToHand(TempoOpponentData.cardDeck, TempoOpponentData.cardHand).cardDeck,
        cardHand: AddCardToHand(TempoOpponentData.cardDeck, TempoOpponentData.cardHand).cardHand,
      };
    }
    setPlayer1Data(TempoPlayer1Data);
    setPlayer2Data(TempoOpponentData);
  };

  return Player1Data && Player2Data ? (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="">Projects : 2PROJ</h2>
        <div className="flex-wrap g20 w80 mb15 flex-center-align">
          <div className="dark-container flex-col flex-bet">
            <div className="PlayerBoard flex-col">
              <div className="resource-player-info">
                <div className="resource-container">{`Bricks (+${Player1Data.statRessources.generatorBrick}) ${Player1Data.statRessources.brick}`}</div>
                <div className="resource-container">{`Weapons (+${Player1Data.statRessources.generatorWeapon}) ${Player1Data.statRessources.weapon}`}</div>
                <div className="resource-container">{`Crystals (+${Player1Data.statRessources.generatorCrystal}) ${Player1Data.statRessources.crystal}`}</div>
              </div>
              <div className="card-hand">
                {Player1Data.cardHand.map((cardId) => {
                  let CardHandValue = getCardInfoById(cardId, Cards);
                  return CardHandValue ? (
                    <div className="card" key={CardHandValue._id}>
                      <span className="cost">{CardHandValue.costType}</span>
                      <span className="name">{CardHandValue._id}</span>
                      <span className="effects">{CardHandValue._id}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="GameBoard flex-bet">
              <div className="player1-life"></div>
              <div className="card-turn-placement">
                {Player1Data.turnInfo.played ? <div className="card"></div> : <div className="card empty-card-place"></div>}
                {Player2Data.turnInfo.played ? <div className="card"></div> : <div className="card empty-card-place"></div>}
              </div>
              <div className="player2-life"></div>
            </div>
            <div className="PlayerBoard flex-col">
              <div className="resource-player-info">
                <div className="resource-container">{`Bricks (+${Player1Data.statRessources.generatorBrick}) ${Player1Data.statRessources.brick}`}</div>
                <div className="resource-container">{`Weapons (+${Player1Data.statRessources.generatorWeapon}) ${Player1Data.statRessources.weapon}`}</div>
                <div className="resource-container">{`Crystals (+${Player1Data.statRessources.generatorCrystal}) ${Player1Data.statRessources.crystal}`}</div>
              </div>
              <div className="card-hand">
                {Player1Data.cardHand.map((cardId) => {
                  let CardHandValue = getCardInfoById(cardId, Cards);
                  return CardHandValue ? (
                    <div className="card" key={CardHandValue._id}>
                      <span className="cost">{CardHandValue.costType}</span>
                      <span className="name">{CardHandValue._id}</span>
                      <span className="effects">{CardHandValue._id}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default HomePage2PROJ;
