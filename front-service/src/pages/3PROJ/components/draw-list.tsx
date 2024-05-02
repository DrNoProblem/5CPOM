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
              <i className=" op0">add</i>
            </div>
          </div>
        </li>
        {currentUser.draws
          ? currentUser.draws.map((draws: { date: Date; script: string }) => {
              counter++;
              return (
                <li
                  key={draws.date + "-" + draws.script}
                  className={`no-hover${ActiveRow === draws.date + "" ? " active-row" : ""}`}
                >
                  <div className="flex-col">
                    <div className="flex-row flex-start-align flex-start-justify w100">
                      <p className="w10">{counter}</p>
                      <p className="w90">{draws.script}</p>
                      <i
                        className=" mtauto mbauto blue-h expand"
                        onClick={() => {
                          ActiveRow === draws.date + ""
                            ? setActiveRow("")
                            : setActiveRow(draws.date + "");
                        }}
                      >
                        chevron_right
                      </i>
                    </div>
                    {ActiveRow === draws.date + "" ? (
                      <div className="border-top-normal flex-start-justify g15 pt15 pb5 row-detail">
                        <div className="flex-col g15">
                          <div
                            className="cta normal-bg mrauto blue-h"
                            onClick={() =>
                              draws.script === DrawView
                                ? setDrawView(false)
                                : setDrawView(draws.script)
                            }
                          >
                            {draws.script === DrawView ? (
                              <span className="add-user flex-center g15">
                                <i className="">visibility_off</i>
                                Hide
                              </span>
                            ) : (
                              <span className="add-user flex-center g15">
                                <i className="">visibility</i>
                                View
                              </span>
                            )}
                          </div>

                          {returnFunction ? (
                            <div
                              className="cta cta-blue mrauto"
                              onClick={() => returnFunction(draws.script)}
                            >
                              <span className="flex-center g10">
                                <i className="">task_alt</i>
                                Choose
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="mlauto">
                          {DrawView ? (
                            <ConsoleDrawComponent
                              DefaultScript={DrawView}
                              correction={true}
                              returnedScript={false}
                              currentUser={currentUser}
                              start={true}
                            />
                          ) : null}
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