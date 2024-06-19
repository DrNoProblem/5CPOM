import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import PlayerDataModel2PROJ from "../../models/player-model";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import "./2P-style.scss";
import GameBoard from "./components/game-board";
import { lvl1TurnAi, lvl2TurnAi, lvl3TurnAi } from "./helpers/ai-opponent";
import { JsonPlayerData } from "./data/players-data";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
};



const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser, Data }) => {
  const [OpponentType, setOpponentType] = useState<Function | null>(null);

  let players: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ } = JsonPlayerData
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
