import React, { FunctionComponent, useEffect, useState } from "react";
import getCardInfoById from "../../helpers/getCardInfoById";
import CardModel from "../../models/card-model";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import CustomIcons from "./custom-icons/Custom-Icons";

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

const GameBoard: FunctionComponent<Props> = ({ currentUser, Data }) => {
  const [MenuOpen, setMenuOpen] = useState<string | false>("start");
  const [user, setUser] = useState<UserModel>(currentUser);
  const [Cards, setCards] = useState<CardModel[]>(Data!.cards);
  const [Player1Data, setPlayer1Data] = useState<PlayerDataMode2PROJ>();
  const [Player2Data, setPlayer2Data] = useState<PlayerDataMode2PROJ>();

  const [SelectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    setPlayer1Data((prevData) => ({
      ...prevData!,
      turnInfo: { trash: null, played: null },
    }));
  }, [SelectedCard]);

  useEffect(() => {}, []);

  const initGame = () => {
    let TempoPlayer1Data: PlayerDataMode2PROJ = {
      username: "Player1",
      cardDeck: currentUser!.deck,
      cardHand: [],
      statRessources: {
        generatorBrick: 1,
        brick: 0,
        generatorWeapon: 1,
        weapon: 0,
        generatorCrystal: 1,
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
        generatorBrick: 1,
        brick: 0,
        generatorWeapon: 1,
        weapon: 0,
        generatorCrystal: 1,
        crystal: 0,
        health: 40,
        shield: 10,
      },
      turnInfo: {
        trash: null,
        played: null,
      },
    };
    /*     for (let i = 0; i < 8; i++) {
      TempoPlayer1Data = {
        ...TempoPlayer1Data,
        cardDeck: AddCardToHand(TempoPlayer1Data!.cardDeck, TempoPlayer1Data!.cardHand).cardDeck,
        cardHand: AddCardToHand(TempoPlayer1Data!.cardDeck, TempoPlayer1Data!.cardHand).cardHand,
      };
    }
    for (let i = 0; i < 8; i++) {
      TempoOpponentData = {
        ...TempoOpponentData,
        cardDeck: AddCardToHand(TempoOpponentData!.cardDeck, TempoOpponentData!.cardHand).cardDeck,
        cardHand: AddCardToHand(TempoOpponentData!.cardDeck, TempoOpponentData!.cardHand).cardHand,
      };
    } */
    setPlayer1Data(TempoPlayer1Data);
    setPlayer2Data(TempoOpponentData);
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="mb0">Projects : 2PROJ</h2>
        <div className="flex-wrap g20 flex-center-align">
          <div className="dark-container flex-col flex-center w100">
            <div className="PlayerBoard flex-center flex-col w100">
              <div className="card-hand flex-center w80 g5 player-red">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="card red-player-border"></div>
                ))}
              </div>
              <div className="normal-container resource-player-info w80 flex-end-justify g15 red-player-border">
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="brick" color="#dee0df" />
                  {`Bricks (+${Player2Data ? Player2Data.statRessources.generatorBrick : "0"}) : ${
                    Player2Data ? Player2Data.statRessources.brick : "0"
                  }`}
                </div>
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="bow" color="#dee0df" />
                  {`Weapons (+${Player2Data ? Player2Data.statRessources.generatorWeapon : "0"}) : ${
                    Player2Data ? Player2Data.statRessources.weapon : "0"
                  }`}
                </div>
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="crystal" color="#dee0df" />
                  {`Crystals (+${Player2Data ? Player2Data.statRessources.generatorCrystal : "0"}) : ${
                    Player2Data ? Player2Data.statRessources.crystal : "0"
                  }`}
                </div>
              </div>
            </div>
            <div className="GameBoard flex-bet flex-center-align w80 g25">
              <div className="player1-life normal-container flex-col">
                <div className="life relative flex-center p25">
                  <i className="blue absolute">favorite</i>
                  <span className="fs30">{Player2Data ? Player2Data.statRessources.health : "0"}</span>
                </div>
                <div
                  className={`shield absolute r0 b0 flex-center p25 ${
                    Player2Data && Player2Data.statRessources.shield === 0 ? "op0" : ""
                  }`}
                >
                  <i className="absolute grey">shield</i>
                  <span className="blue">{Player2Data ? Player2Data.statRessources.shield : "0"}</span>
                </div>
              </div>
              <div className="card-turn-placement g20 flex-center">
                <div
                  className={`player-blue normal-container flex-center ${
                    Player2Data && Player2Data.turnInfo.trash ? "on-delete" : ""
                  }`}
                >
                  <i className="blue">delete</i>
                </div>
                {Player1Data && Player1Data.turnInfo.played ? (
                  <div className="card"></div>
                ) : (
                  <div className="card empty-card-place blue-player-border-dash"></div>
                )}
                {Player2Data && Player2Data.turnInfo.played ? (
                  <div className="card"></div>
                ) : (
                  <div className="card empty-card-place red-player-border-dash"></div>
                )}
                <div
                  className={`player-red normal-container flex-center ${
                    Player1Data && Player1Data.turnInfo.trash ? "on-delete" : ""
                  }`}
                >
                  <i className="red">delete</i>
                </div>
              </div>
              <div className="player2-life normal-container flex-col">
                <div className="life relative flex-center p25">
                  <i className="red absolute">favorite</i>
                  <span className="fs30">{Player2Data ? Player2Data.statRessources.health : "0"}</span>
                </div>
                <div
                  className={`shield absolute l0 b0 flex-center p25 ${
                    Player2Data && Player2Data.statRessources.shield === 0 ? "op0" : ""
                  }`}
                >
                  <i className="absolute lightgrey">shield</i>
                  <span className="red">{Player2Data ? Player2Data.statRessources.shield : "0"}</span>
                </div>
              </div>
            </div>
            <div className="PlayerBoard flex-center flex-col w100">
              <div className="card-hand flex-center w80 g5 player-blue">
                {Player1Data && Player1Data.cardHand
                  ? Player1Data.cardHand.map((cardId) => {
                      let CardHandValue = getCardInfoById(cardId, Cards);
                      return CardHandValue ? (
                        <div
                          className={`card ${SelectedCard === CardHandValue._id ? "selected-card" : ""}`}
                          key={CardHandValue._id}
                          onClick={() => {
                            SelectedCard === CardHandValue!._id ? setSelectedCard(null) : setSelectedCard(CardHandValue!._id);
                          }}
                        >
                          <span className="cost">{CardHandValue.costType}</span>
                          <span className="name">{CardHandValue._id}</span>
                          <span className="effects">{CardHandValue._id}</span>
                        </div>
                      ) : null;
                    })
                  : null}
                <div className="card blue-player-border"></div>
                <div className="card blue-player-border"></div>
                <div className="card blue-player-border"></div>
                <div className="card blue-player-border"></div>
              </div>
              <div className="normal-container resource-player-info w80 flex-start-justify g15 blue-player-border flex-center-align">
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="brick" color="#dee0df" />
                  {`Bricks (+${Player1Data && Player1Data.statRessources ? Player1Data.statRessources.generatorBrick : "0"}) : ${
                    Player1Data && Player1Data.statRessources ? Player1Data.statRessources.brick : "0"
                  }`}
                </div>
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="bow" color="#dee0df" />
                  {`Weapons (+${
                    Player1Data && Player1Data.statRessources ? Player1Data.statRessources.generatorWeapon : "0"
                  }) : ${Player1Data && Player1Data.statRessources ? Player1Data!.statRessources.weapon : "0"}`}
                </div>
                <div className="dark-container resource-container flex-center g10">
                  <CustomIcons icon="crystal" color="#dee0df" />
                  {`Crystals (+${
                    Player1Data && Player1Data.statRessources ? Player1Data.statRessources.generatorCrystal : "0"
                  }) : ${Player1Data && Player1Data.statRessources ? Player1Data!.statRessources.crystal : "0"}`}
                </div>
                {Player1Data && (Player1Data.turnInfo.played || Player1Data.turnInfo.trash) ? (
                  <div className="cta cta-full-green mlauto next-turn">
                    <span className="flex-center g15">
                      <i>done</i>NEXT TURN
                    </span>
                  </div>
                ) : SelectedCard ? (
                  <div className="cta mlauto next-turn blue-player-border dark-bg">
                    <span className="flex-center g15 blue">
                      <i className="blue">info</i>
                      place card
                    </span>
                  </div>
                ) : (
                  <div className="cta mlauto next-turn blue-player-border dark-bg">
                    <span className="flex-center g15 blue">
                      <i className="blue">info</i>
                      choose card
                    </span>
                  </div>
                )}
              </div>
            </div>

            {MenuOpen === "start" ? (
              <div className="absolute flex-center menu-pop-up">
                <div className="dark-background zi1"></div>
                <div className="dark-container zi1 w50">
                  <h2>Start a new game :</h2>
                  <div
                    className="cta cta-blue"
                    onClick={() => {
                      setMenuOpen("");
                      initGame();
                    }}
                  >
                    <span className="flex-center g10">
                      <i>play_circle_outline</i>Start
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
