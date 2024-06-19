import { FunctionComponent, default as React, useEffect, useState } from "react";
import getCardInfoById from "../../../helpers/getCardInfoById";
import CardModel from "../../../models/card-model";
import DataModel from "../../../models/data-model";
import PlayerDataModel2PROJ from "../../../models/player-model";
import UserModel from "../../../models/user-model";
import "./../2P-style.scss";
import { cardCanBePlayed } from "./../helpers/game-function";
import Card from "./card";
import CustomIcons from "./custom-icons";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
  OpponentTurn: Function;
  playersInfo: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ } | null;
};

const GameBoard: FunctionComponent<Props> = ({ currentUser, Data, playersInfo, OpponentTurn }) => {
  const [MenuOpen, setMenuOpen] = useState<string | false>("start");
  const [user, setUser] = useState<UserModel>(currentUser);
  const [Cards, setCards] = useState<CardModel[]>(Data!.cards);
  const [Player1Data, setPlayer1Data] = useState<PlayerDataModel2PROJ>();
  const [Player2Data, setPlayer2Data] = useState<PlayerDataModel2PROJ>();

  const [SelectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    setPlayer1Data((prevData) => ({
      ...prevData!,
      turnInfo: { trash: null, played: null },
    }));
  }, [SelectedCard]);

  const initGame = () => {
    if (playersInfo) {
      setPlayer1Data(playersInfo.blue);
      setPlayer2Data(playersInfo.red);
    }
  };

  const ClickCard = (cardId: string) => {
    SelectedCard === cardId ? setSelectedCard(null) : setSelectedCard(cardId);
  };

  const NextTurnClick = (turnPlayer1Data: PlayerDataModel2PROJ, turnPlayer2Data: PlayerDataModel2PROJ) => {
    if (turnPlayer1Data && turnPlayer2Data) {
      let tempoPlayerInfo: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ } = {
        blue: turnPlayer1Data,
        red: turnPlayer2Data,
      };
      let blueCardId: string | undefined;
      let redCardId: string | undefined;

      if (tempoPlayerInfo.blue.turnInfo.played && !tempoPlayerInfo.blue.turnInfo.trash)
        blueCardId = tempoPlayerInfo.blue.turnInfo.played;
      else if (tempoPlayerInfo.blue.turnInfo.trash && !tempoPlayerInfo.blue.turnInfo.played)
        blueCardId = tempoPlayerInfo.blue.turnInfo.trash;
      if (tempoPlayerInfo.red.turnInfo.played && !tempoPlayerInfo.red.turnInfo.trash)
        redCardId = tempoPlayerInfo.red.turnInfo.played;
      else if (tempoPlayerInfo.red.turnInfo.trash && !tempoPlayerInfo.red.turnInfo.played)
        redCardId = tempoPlayerInfo.red.turnInfo.trash;

      if (redCardId) {
        let result = ApplyCardEffect(tempoPlayerInfo.red, tempoPlayerInfo.blue, getCardInfoById(redCardId, Cards)!);
        tempoPlayerInfo = { blue: result.enemy, red: result.owner };
      }

      if (blueCardId) {
        let result = ApplyCardEffect(tempoPlayerInfo.blue, tempoPlayerInfo.red, getCardInfoById(blueCardId, Cards)!);
        tempoPlayerInfo = { blue: result.owner, red: result.enemy };
      }
    }
  };

  const ApplyCardEffect = (
    owner: PlayerDataModel2PROJ,
    enemy: PlayerDataModel2PROJ,
    card: CardModel
  ): { owner: PlayerDataModel2PROJ; enemy: PlayerDataModel2PROJ } => {
    if (card.ownerTargetType !== "all" && card.ownerTargetType !== null) {
      owner = {
        ...owner,
        statRessources: {
          ...owner.statRessources,
          [card.ownerTargetType]: owner.statRessources[card.ownerTargetType] + card.ownerTargetValue,
        },
      };
    } else if (card.ownerTargetType === "all") {
      console.log("effect all resources");
    }
    if (card.enemyTargetType !== "all" && card.enemyTargetType !== null) {
      enemy = {
        ...enemy,
        statRessources: {
          ...enemy.statRessources,
          [card.enemyTargetType]: enemy.statRessources[card.enemyTargetType] + card.enemyTargetValue,
        },
      };
    } else if (card.enemyTargetType === "all") {
      console.log("effect all resources");
    }
    return { owner, enemy };
  };

  const SelectCardToPlay = (cardId: string | null, target: "trash" | "played", player: "blue" | "red") => {
    if (player === "blue") {
      if (target === "trash") {
        setPlayer1Data((prevData) => ({
          ...prevData!,
          turnInfo: { ...prevData!.turnInfo, trash: cardId, played: null },
        }));
      } else if (target === "played") {
        setPlayer1Data((prevData) => ({
          ...prevData!,
          turnInfo: { ...prevData!.turnInfo, trash: null, played: cardId },
        }));
      }
    } else if (player === "red") {
      if (target === "trash") {
        setPlayer2Data((prevData) => ({
          ...prevData!,
          turnInfo: { ...prevData!.turnInfo, trash: cardId, played: null },
        }));
      } else if (target === "played") {
        setPlayer2Data((prevData) => ({
          ...prevData!,
          turnInfo: { ...prevData!.turnInfo, trash: null, played: cardId },
        }));
      }
    }
  };

  return (
    <div className="dark-container flex-col flex-center m20 container-board">
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
            <CustomIcons icon="weapon" color="#dee0df" />
            {`weapons (+${Player2Data ? Player2Data.statRessources.generatorWeapon : "0"}) : ${
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
      <div className="GameBoard flex-col flex-center relative w80">
        {Player1Data && (Player1Data.turnInfo.played || Player1Data.turnInfo.trash) ? (
          <div className="cta cta-full-green absolute t0 turn-btn">
            <span className="flex-center g15">
              <i>done</i>NEXT TURN
            </span>
          </div>
        ) : SelectedCard ? (
          <div className="cta cta-blue absolute t0 turn-btn">
            <span className="flex-center g15 blue">
              <i className="blue">info</i>
              place card
            </span>
          </div>
        ) : (
          <div className="cta cta-blue absolute t0 turn-btn">
            <span className="flex-center g15 blue">
              <i className="blue">info</i>
              choose card
            </span>
          </div>
        )}
        <div className="flex-bet flex-center-align g25">
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
            {Player1Data ? (
              <div className={`flex g20 ${SelectedCard ? "" : "darker"}`}>
                <div className={`player-blue flex-center `}>
                  <i
                    className={`blue fs30 normal-container zi1 absolute`}
                    onClick={() => {
                      if (SelectedCard && !Player1Data.turnInfo.trash) {
                        SelectCardToPlay(SelectedCard, "trash", "blue");
                      } else if (SelectedCard && Player1Data && Player1Data.turnInfo.trash) {
                        SelectCardToPlay(null, "trash", "blue");
                      }
                    }}
                  >
                    delete
                  </i>
                  {Player1Data.turnInfo.trash ? (
                    <Card
                      color={"#0084ff"}
                      card={getCardInfoById(Player1Data.turnInfo.trash, Cards)!}
                      AddedClass={`${Player1Data.turnInfo.trash ? "darker" : ""}`}
                      ClickFunction={() => {}}
                    />
                  ) : (
                    <div className="op0 card"></div>
                  )}
                </div>

                {Player1Data && Player1Data.turnInfo.played ? (
                  <Card
                    color={"#0084ff"}
                    card={getCardInfoById(Player1Data.turnInfo.played, Cards)!}
                    AddedClass={""}
                    ClickFunction={() => SelectCardToPlay(null, "played", "blue")}
                  />
                ) : (
                  <div
                    className="card empty-card-place blue-player-border-dash"
                    onClick={() => {
                      SelectCardToPlay(SelectedCard, "played", "blue");
                    }}
                  ></div>
                )}
              </div>
            ) : null}

            {Player2Data ? (
              <div className={`flex g20 darker`}>
                {Player2Data && Player2Data.turnInfo.played ? (
                  <Card
                    color={"#0084ff"}
                    card={getCardInfoById(Player2Data.turnInfo.played, Cards)!}
                    AddedClass={""}
                    ClickFunction={() => {}}
                  />
                ) : (
                  <div className="card empty-card-place red-player-border-dash"></div>
                )}

                <div className={`player-red flex-center `}>
                  <i className={`red fs30 normal-container zi1 absolute`}>delete</i>
                  {Player2Data.turnInfo.trash ? (
                    <Card
                      color={"#0084ff"}
                      card={getCardInfoById(Player2Data.turnInfo.trash, Cards)!}
                      AddedClass={`${Player2Data.turnInfo.trash ? "darker" : ""}`}
                      ClickFunction={() => {}}
                    />
                  ) : (
                    <div className="op0 card"></div>
                  )}
                </div>
              </div>
            ) : null}
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
      </div>
      <div className="PlayerBoard flex-center flex-col w100">
        <div className="card-hand flex-center w80 g5 player-blue">
          {Player1Data && Player1Data.cardHand
            ? Player1Data.cardHand.map((cardId) => {
                let CardHandValue = getCardInfoById(cardId, Cards);
                return CardHandValue ? (
                  <Card
                    key={cardId}
                    color={"#0084ff"}
                    card={CardHandValue}
                    AddedClass={`${SelectedCard === CardHandValue._id ? "selected-card" : ""} ${
                      cardCanBePlayed(CardHandValue, Player1Data) ? "" : "can-not-play"
                    }`}
                    ClickFunction={cardCanBePlayed(CardHandValue, Player1Data) ? ClickCard : () => {}}
                  />
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
            <CustomIcons icon="weapon" color="#dee0df" />
            {`weapons (+${Player1Data && Player1Data.statRessources ? Player1Data.statRessources.generatorWeapon : "0"}) : ${
              Player1Data && Player1Data.statRessources ? Player1Data!.statRessources.weapon : "0"
            }`}
          </div>
          <div className="dark-container resource-container flex-center g10">
            <CustomIcons icon="crystal" color="#dee0df" />
            {`Crystals (+${Player1Data && Player1Data.statRessources ? Player1Data.statRessources.generatorCrystal : "0"}) : ${
              Player1Data && Player1Data.statRessources ? Player1Data!.statRessources.crystal : "0"
            }`}
          </div>
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
  );
};

export default GameBoard;
