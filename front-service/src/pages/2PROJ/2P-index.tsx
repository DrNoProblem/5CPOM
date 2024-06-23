import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
  const [OpponentType, setOpponentType] = useState<number | null>(null);

  const history = useHistory();

  useEffect(() => {
    if (OpponentType) {
      history.push("/2PROJ/" + OpponentType);
    }
  }, [OpponentType]);

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <Link to={`/`} className="cta cta-dark cta-blue-h">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Projects : 2PROJ</h2>
        </div>
        <div className="flex-wrap g20 flex-start-align">
          <div className="dark-container g20 flex-col">
            <h2 className="m0">Start Game</h2>
            <h4 className="m0">Select AI opponent level :</h4>
            <div className="g20">
              <div className="cta cta-normal blue-h " onClick={() => setOpponentType(1)}>
                <span className="ml15 mr15">level 1</span>
              </div>
              <div className="cta cta-normal blue-h " onClick={() => setOpponentType(2)}>
                <span className="ml15 mr15">level 2</span>
              </div>
              <div className="cta cta-disable ">
                <span className="ml15 mr15">level 3</span>
              </div>
            </div>
            <h4 className="m0">Search local opponent :</h4>
            <Link className="home-tile normal-container mrauto" to={"/2PROJ/find-local"}>
              <span className="ml15 mr15">Start search</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage2PROJ;
