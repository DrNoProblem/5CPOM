import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import PlayerDataModel2PROJ from "../../models/player-model";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import GameBoard from "./components/game-board";
import { lvl1TurnAi, lvl2TurnAi, lvl3TurnAi } from "./helpers/ai-opponent";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
};



const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser, Data }) => {
  const [OpponentType, setOpponentType] = useState<Function | null>(null);

  let players: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ } = {
    blue: {
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
    },
    red: {
      username: "Player2",
      cardDeck: [],
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
    },
  };
  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      {OpponentType !== null ? (
        <GameBoard currentUser={currentUser} Data={Data} OpponentTurn={OpponentType} playersInfo={players} />
      ) : (
        <div className="flex-col g20 w100">
          <h2 className="mb0">Projects : 2PROJ</h2>
          <div className="flex-wrap g20 flex-start-align">
            <div className="dark-container g20 flex-col">
              <h2 className="m0">Start Game</h2>
              <h4 className="m0">Select AI opponent level :</h4>
              <div className="g20">
                <div
                  className="home-tile normal-container"
                  onClick={() => setOpponentType(lvl1TurnAi)}
                >
                  <span className="ml15 mr15">level 1</span>
                </div>
                <div
                  className="home-tile normal-container"
                  onClick={() => setOpponentType(lvl2TurnAi)}
                >
                  <span className="ml15 mr15">level 2</span>
                </div>
                <div
                  className="home-tile normal-container red-h"
                  onClick={() => setOpponentType(lvl3TurnAi)}
                >
                  <span className="ml15 mr15">level 3</span>
                </div>
              </div>
              <h4 className="m0">Search local opponent :</h4>
              <Link className="home-tile normal-container mrauto" to={"/2PROJ/find-local"}>
                <span className="ml15 mr15">Start search</span>
              </Link>
            </div>

            <Link className="home-tile dark-container blue-h" to={"/2PROJ/deck"}>
              <span className="ml15 mr15 g25 flex-center">
                <i>settings</i>
                Edit Deck
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage2PROJ;
