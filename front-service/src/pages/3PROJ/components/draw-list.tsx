import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import ConsoleDrawComponent from "./console-draw";

type Props = {
  currentUser: UserModel;
  returnFunction: Function | false;
};
const TableDraw: FC<Props> = ({ currentUser, returnFunction }) => {
  const [ActiveRow, setActiveRow] = useState<string>("");
  const [DrawView, setDrawView] = useState<string | false>(false);
  let counter = 0;
  return (
    <ul className="table-list flex-col mb0">
      <li className="legend">
        <div className="flex-row flex-bet">
          <div className="flex-row flex-start-align flex-start-justify w100">
            <p className="w10">N°</p>
            <p className="w90">SCRIPT</p>
          </div>
        </div>
      </li>
      {currentUser.draws
        ? currentUser.draws.map((draws: { url: string; script: string }) => {
            counter++;
            return (
              <li
                key={draws.url + "-" + draws.script}
                onClick={() => {
                  ActiveRow === draws.url + "-" + draws.script ? setActiveRow("") : setActiveRow(draws.url + "-" + draws.script);
                }}
                className={`${ActiveRow === draws.url + "-" + draws.script ? "active-row" : ""}`}
              >
                <div className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w100">
                    <p className="w10">{counter}</p>
                    <p className="w90">{draws.script}</p>
                  </div>
                  <div className="row-detail g15 flex-start-justify">

                    <div className="flex-col g15">
                      <div className="cta normal-bg mrauto" onClick={() => setDrawView(draws.script)}>
                        <span className="flex-center g15">
                          <i className="material-icons">visibility</i>
                          View
                        </span>
                      </div>

                      {returnFunction ? (
                        <div className="cta cta-blue mrauto" onClick={() => returnFunction(draws.script)}>
                          <span className="flex-center g15">
                            <i className="material-icons">check_box</i>
                            Choose
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {DrawView ? (
                      <ConsoleDrawComponent
                        DefaultScript={DrawView}
                        correction={true}
                        returnedScript={false}
                        currentUser={currentUser}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })
        : null}
    </ul>
  );
};

export default TableDraw;
