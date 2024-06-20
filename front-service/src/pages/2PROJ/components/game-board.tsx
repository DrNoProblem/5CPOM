import { FunctionComponent, default as React, useEffect, useState } from "react";
import CardModel from "../../../models/card-model";
import DataModel from "../../../models/data-model";
import PlayerDataModel2PROJ from "../../../models/player-model";
import UserModel from "../../../models/user-model";
import { lvl1TurnAi, lvl2TurnAi, lvl3TurnAi } from "../helpers/ai-opponent";
import "./../2P-style.scss";
import { ApplyPlayerCardEffect, cardCanBePlayed, getCardInfoByIdWithSuffix, initGame } from "./../helpers/game-function";
import Card from "./card";
import CustomIcons from "./custom-icons";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
  OpponentTurn: number;
  playersInfo: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ } | null;
};

const GameBoard: FunctionComponent<Props> = ({ currentUser, Data, OpponentTurn, playersInfo }) => {
  const [MenuOpen, setMenuOpen] = useState<string | false>("start");
  const [user, setUser] = useState<UserModel>(currentUser);
  const [Cards, setCards] = useState<CardModel[]>(Data!.cards);
  const [Player1Data, setPlayer1Data] = useState<PlayerDataModel2PROJ>();
  const [Player2Data, setPlayer2Data] = useState<PlayerDataModel2PROJ>();
  const [SelectedCard, setSelectedCard] = useState<string | null>(null);

  const [TurnTempo, setTurnTempo] = useState<boolean>(false);

  useEffect(() => {
    console.log("ok");//! attention il faut mettre les player dans des variable temporaire pour interagir avec 
    if (TurnTempo && Player2Data && Player2Data.turnInfo.played && Player1Data && Player1Data.turnInfo.played) {
      console.log("blue");
      console.log(
        ApplyPlayerCardEffect(getCardInfoByIdWithSuffix(Player1Data.turnInfo.played, Cards)!, Player1Data, Player2Data)
      );
      console.log("red");
      console.log(
        ApplyPlayerCardEffect(getCardInfoByIdWithSuffix(Player2Data.turnInfo.played, Cards)!, Player2Data, Player1Data)
      );
    }
  }, [TurnTempo, Player1Data, Player2Data, Cards]);

  const PlayerEndTurn = () => {
    let infoRedPlayer: { cardId: string; placement: string } | "" = "";
    switch (OpponentTurn) {
      case 1:
        infoRedPlayer = lvl1TurnAi({ blue: Player1Data!, red: Player2Data! }, Cards);
        break;
      case 2:
        infoRedPlayer = lvl2TurnAi({ blue: Player1Data!, red: Player2Data! }, Cards);
        break;
      case 3:
        infoRedPlayer = lvl3TurnAi({ blue: Player1Data!, red: Player2Data! }, Cards);
        break;
      default:
        console.log(OpponentTurn);
        break;
    }
    if (infoRedPlayer !== "")
      Player2Data!.turnInfo = { ...Player2Data!.turnInfo, [infoRedPlayer.placement]: infoRedPlayer.cardId };

    setPlayer1Data((prevData) => ({
      ...prevData!,
      turnInfo: Player1Data!.turnInfo,
    }));
    setPlayer2Data((prevData) => ({
      ...prevData!,
      turnInfo: Player2Data!.turnInfo,
    }));
    setTurnTempo(true);
  };

  useEffect(() => {
    setPlayer1Data((prevData) => ({
      ...prevData!,
      turnInfo: { trash: null, played: null },
    }));
  }, [SelectedCard]);

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
      /* else if (tempoPlayerInfo.blue.turnInfo.trash && !tempoPlayerInfo.blue.turnInfo.played)
        blueCardId = tempoPlayerInfo.blue.turnInfo.trash; */
      if (tempoPlayerInfo.red.turnInfo.played && !tempoPlayerInfo.red.turnInfo.trash)
        redCardId = tempoPlayerInfo.red.turnInfo.played;
      /* else if (tempoPlayerInfo.red.turnInfo.trash && !tempoPlayerInfo.red.turnInfo.played)
        redCardId = tempoPlayerInfo.red.turnInfo.trash; */

      if (redCardId) {
        let result = ApplyPlayerCardEffect(
          getCardInfoByIdWithSuffix(redCardId, Cards)!,
          tempoPlayerInfo.red,
          tempoPlayerInfo.blue
        );
        tempoPlayerInfo = { blue: result.enemy, red: result.player };
      }

      if (blueCardId) {
        let result = ApplyPlayerCardEffect(
          getCardInfoByIdWithSuffix(blueCardId, Cards)!,
          tempoPlayerInfo.blue,
          tempoPlayerInfo.red
        );
        tempoPlayerInfo = { blue: result.player, red: result.enemy };
      }
    }
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

  const TurnButton: FunctionComponent<{ Player1Data: PlayerDataModel2PROJ; SelectedCard: string }> = ({
    Player1Data,
    SelectedCard,
  }) => {
    return (
      <>
        {Player1Data && (Player1Data.turnInfo.played || Player1Data.turnInfo.trash) ? (
          <div className="cta cta-full-green absolute t0 turn-btn" onClick={PlayerEndTurn}>
            <span className="flex-center g15">
              <i>done</i>NEXT TURN
            </span>
          </div>
        ) : SelectedCard ? (
          <div className="cta cta-blue absolute t0 turn-btn">
            <span className="flex-center g15 blue">
              <i className="blue">info</i>place card
            </span>
          </div>
        ) : (
          <div className="cta cta-blue absolute t0 turn-btn">
            <span className="flex-center g15 blue">
              <i className="blue">info</i>choose card
            </span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="dark-container flex-col flex-center m20 container-board">
      <div className="PlayerBoard flex-center flex-col w100">
        <div className="card-hand flex-center w80 g5 player-red">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card red-player-border can-not-play"></div>
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
        <TurnButton Player1Data={Player1Data!} SelectedCard={SelectedCard!} />
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
                        setSelectedCard(null);
                      }
                    }}
                  >
                    delete
                  </i>
                  {Player1Data.turnInfo.trash ? (
                    <Card
                      color={"#0084ff"}
                      card={getCardInfoByIdWithSuffix(Player1Data.turnInfo.trash, Cards)!}
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
                    card={getCardInfoByIdWithSuffix(Player1Data.turnInfo.played, Cards)!}
                    AddedClass={""}
                    ClickFunction={() => {
                      SelectCardToPlay(null, "played", "blue");
                      setSelectedCard(null);
                    }}
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
                    color={"#ff2768"}
                    card={getCardInfoByIdWithSuffix(Player2Data.turnInfo.played, Cards)!}
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
                      color={"#ff2768"}
                      card={getCardInfoByIdWithSuffix(Player2Data.turnInfo.trash, Cards)!}
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
                let CardHandValue = getCardInfoByIdWithSuffix(cardId, Cards);
                return CardHandValue ? (
                  <Card
                    key={cardId}
                    color={"#0084ff"}
                    card={CardHandValue}
                    AddedClass={`${SelectedCard === cardId ? "selected-card" : ""} ${
                      cardCanBePlayed(CardHandValue, Player1Data) ? "" : "can-not-play"
                    } ${Player1Data.turnInfo.trash === cardId || Player1Data.turnInfo.played === cardId ? "op0" : ""}`}
                    ClickFunction={cardCanBePlayed(CardHandValue, Player1Data) ? () => ClickCard(cardId) : () => {}}
                  />
                ) : null;
              })
            : null}
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
                const initialisePlayer = initGame(playersInfo!);
                if (initialisePlayer) {
                  setPlayer1Data(initialisePlayer.blue);
                  setPlayer2Data(initialisePlayer.red);
                }
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
