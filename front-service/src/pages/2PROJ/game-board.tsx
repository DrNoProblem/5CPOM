import React, { FunctionComponent, useEffect, useState } from "react";
import getCardInfoById from "../../helpers/getCardInfoById";
import CardModel from "../../models/card-model";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import CustomIcons from "./components/Custom-Icons";
import Card from "./components/card";

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

  const initGame = () => {
    let TempoPlayer1Data: PlayerDataMode2PROJ = {
      username: "Player1",
      cardDeck: currentUser!.deck,
      cardHand: ["664278bfe74300c36269666f", "6642974ee74300c3627c8b4e"],
      statRessources: {
        generatorBrick: 1,
        brick: 5,
        generatorWeapon: 1,
        weapon: 0,
        generatorCrystal: 1,
        crystal: 5,
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

  const ClickCard = (cardId: string) => {
    SelectedCard === cardId ? setSelectedCard(null) : setSelectedCard(cardId);
  };

  const cardCanBePlayed = (CardHandValue: CardModel, Owner: PlayerDataMode2PROJ) => {
    if (Owner.statRessources[CardHandValue.costType] >= CardHandValue.costValue) {
      return true;
    } else {
      return false;
    }
  };

  const NextTurnClick = () => {
    if (Player1Data && Player2Data) {
      let tempoPlayerInfo: { blue: PlayerDataMode2PROJ; red: PlayerDataMode2PROJ } = { blue: Player1Data, red: Player2Data };
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
    owner: PlayerDataMode2PROJ,
    enemy: PlayerDataMode2PROJ,
    card: CardModel
  ): { owner: PlayerDataMode2PROJ; enemy: PlayerDataMode2PROJ } => {
    if (card.ownerTargetType !== "all") {
      owner = {
        ...owner,
        statRessources: {
          ...owner.statRessources,
          [card.ownerTargetType]: owner.statRessources[card.ownerTargetType] + card.ownerTargetValue,
        },
      };
    }
    if (card.enemyTargetType !== "all") {
      enemy = {
        ...enemy,
        statRessources: {
          ...enemy.statRessources,
          [card.enemyTargetType]: enemy.statRessources[card.enemyTargetType] + card.enemyTargetValue,
        },
      };
    }
    return { owner, enemy };
  };

  const SelectCardToPlay = (cardId: string | null, target: "trash" | "played", player: "blue" | "red") => {
    if (player === "blue") {
      if (target === "trash") {
        console.log(cardId);
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
                          console.log("test");
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
            <div className="PlayerBoard flex-center flex-col w100">
              <div className="card-hand flex-center w80 g5 player-blue">
                {Player1Data && Player1Data.cardHand
                  ? Player1Data.cardHand.map((cardId) => {
                      let CardHandValue = getCardInfoById(cardId, Cards);
                      console.log(CardHandValue);
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
                  {`weapons (+${
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
