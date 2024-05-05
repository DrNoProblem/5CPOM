import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import ConsoleDrawComponent from "./console-draw";
import DrawModel from "../../../models/draw-model";

type Props = {
  currentUser: UserModel;
  title: string;
  returnFunction: Function | false;
  DrawsList: DrawModel[];
};
const TableDraw: FC<Props> = ({ currentUser, returnFunction, title, DrawsList }) => {
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
        {DrawsList.map((draw: DrawModel) => {
          counter++;
          return (
            <li key={draw._id} className={`no-hover${ActiveRow === draw._id + "" ? " active-row" : ""}`}>
              <div className="flex-col">
                <div className="flex-row flex-start-align flex-start-justify w100">
                  <p className="w10">{counter}</p>
                  <p className="w90">{draw.script}</p>
                  <i
                    className=" mtauto mbauto blue-h expand"
                    onClick={() => {
                      ActiveRow === draw._id + "" ? setActiveRow("") : setActiveRow(draw._id + "");
                    }}
                  >
                    chevron_right
                  </i>
                </div>
                {ActiveRow === draw._id + "" ? (
                  <div className="border-top-normal flex-start-justify g15 pt15 pb5 row-detail">
                    <div className="flex-col g15">
                      <div
                        className="cta normal-bg mrauto blue-h"
                        onClick={() => (draw.script === DrawView ? setDrawView(false) : setDrawView(draw.script))}
                      >
                        {draw.script === DrawView ? (
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
                        <div className="cta cta-blue mrauto" onClick={() => returnFunction(draw.script)}>
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
        })}
      </ul>
    </div>
  );
};

export default TableDraw;
