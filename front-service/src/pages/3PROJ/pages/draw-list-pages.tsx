import React, { FunctionComponent, useEffect, useState } from "react";
import "./3P-style.scss";
import { Link, match } from "react-router-dom";
import UserModel from "../../../models/user-model";

type Props = {
  currentUser: UserModel;
};

const DrawPage: FunctionComponent<Props> = ({ currentUser }) => {
  const [user, setUser] = useState<UserModel>(currentUser);

  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">Draw list :</h2>
        </div>

        <div className="table-list flex-col p50 dark-bg big-dark-container display-from-left">
          <h2>List of script saved online :</h2>
          <ul className="table-list flex-col mb0">
            <li className="legend">
              <div className="flex-row flex-bet">
                <div className="flex-row flex-start-align flex-start-justify w80">
                  <p className="w20">DATE</p>
                  <p className="w20">SCRIPT</p>
                </div>
                <i className={`material-icons mtbauto`}>expand_more</i>
              </div>
            </li>
            {currentUser.draws
              ? currentUser.draws.map(
                  (draws: { date: Date; script: string }) => (
                    <li key={draws.date + "userlist"}>
                      <div className="flex-row flex-bet">
                        <div className="flex-row flex-start-align flex-start-justify w80">
                          <p className="w20">{draws.date}</p>
                          <p className="w60">{draws.script}</p>
                        </div>
                        <Link to={`/`} className="icon">
                          <i className="material-icons ml10 blue-h">edit</i>
                        </Link>
                      </div>
                    </li>
                  )
                )
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DrawPage;
