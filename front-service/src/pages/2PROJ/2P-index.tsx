import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import "./2P-style.scss";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
};
const HomePage2PROJ: FunctionComponent<Props> = ({ currentUser, Data }) => {
  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="mb0">Projects : 2PROJ</h2>
        <div className="flex-wrap g20 flex-center-align">
          <Link className="home-tile dark-container" to={"/2PROJ/game"}>
            <span className="ml15 mr15">Start Game vs AI</span>
          </Link>

          <Link className="home-tile dark-container" to={"/2PROJ/find-local"}>
            <span className="ml15 mr15">Start Game vs Local opponent</span>
          </Link>

          <Link className="home-tile dark-container" to={"/2PROJ/deck"}>
            <span className="ml15 mr15">Edit Deck</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage2PROJ;
