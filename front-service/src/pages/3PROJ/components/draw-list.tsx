import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import ConsoleDrawComponent from "./console-draw";

type Props = {
  currentUser: UserModel;
  title: string;
  returnFunction: Function | false;
};
const TableDraw: FC<Props> = ({ currentUser, returnFunction, title }) => {
  const [ActiveRow, setActiveRow] = useState<string>("");
  const [DrawView, setDrawView] = useState<string | false>(false);
  let counter = 0;
  return (
    <div className="table-list flex-col p50 dark-bg dark-container display-from-left w100">
      {title !== "" ? <h2 className="">{title}</h2> : null}
      <ul className="table-list flex-col mb0">
        <li className="legend">
          <div className="flex-row flex-bet">
            <div className="flex-row flex-start-align flex-start-justify w100">
              <p className="w10">N°</p>
              <p className="w90">SCRIPT</p>
              <i className="material-icons op0">add</i>
            </div>
          </div>
        </li>
        {currentUser.draws
          ? currentUser.draws.map((draws: { url: string; script: string }) => {
              counter++;
              return (
                <li key={draws.url + "-" + draws.script} className={`no-hover${ActiveRow === draws.url ? " active-row" : ""}`}>
                  <div className="flex-col">
                    <div className="flex-row flex-start-align flex-start-justify w100">
                      <p className="w10">{counter}</p>
                      <p className="w90">{draws.script}</p>
                      <i
                        className="material-icons mtauto mbauto blue-h"
                        onClick={() => {
                          ActiveRow === draws.url ? setActiveRow("") : setActiveRow(draws.url);
                        }}
                      >
                        add
                      </i>
                    </div>
                    {ActiveRow === draws.url ? (
                      <div className="border-top-normal flex-start-justify g15 pt15 pb5 row-detail">
                        <div className="flex-col g15">
                          <div className="cta normal-bg mrauto blue-h" onClick={() => (draws.script === DrawView ? setDrawView(false) : setDrawView(draws.script))}>
                            {draws.script === DrawView ? (
                              <span className="add-user flex-center g15">
                                <i className="material-icons">visibility_off</i>
                                Hide
                              </span>
                            ) : (
                              <span className="add-user flex-center g15">
                                <i className="material-icons">visibility</i>
                                View
                              </span>
                            )}
                          </div>

                          {returnFunction ? (
                            <div className="cta cta-blue mrauto" onClick={() => returnFunction(draws.script)}>
                              <span className="flex-center g15">
                                <i className="material-icons">task_alt</i>
                                Choose
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="mlauto">
                          {DrawView ? <ConsoleDrawComponent DefaultScript={DrawView} correction={true} returnedScript={false} currentUser={currentUser} start={true} /> : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default TableDraw;
