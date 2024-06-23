import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import ConsoleDrawComponent from "./console-draw";
import DrawModel from "../../../models/draw-model";

type Props = {
  currentUser: UserModel;
  title: string;
  returnFunction: Function | false;
  deleteFunction: Function;
  DrawsList: DrawModel[];
};
const TableDraw: FC<Props> = ({ currentUser, returnFunction, title, DrawsList, deleteFunction }) => {
  const [ActiveRow, setActiveRow] = useState<string>("");
  const [DrawView, setDrawView] = useState<string | false>(false);
  let counter = 0;
  return (
    <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
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
            <li
              key={draw._id}
              className={`no-hover${ActiveRow === draw._id + "" ? " active-row" : ""}`}
              onClick={() => {
                ActiveRow === draw._id + "" ? setActiveRow("") : setActiveRow(draw._id + "");
              }}
            >
              <div className="flex-col">
                <div className="flex-row flex-start-align flex-start-justify w100">
                  <p className="w10">{counter}</p>
                  <p className="w90">{draw.script}</p>
                  <i className=" mtauto mbauto blue-h expand">chevron_right</i>
                </div>
                {ActiveRow === draw._id + "" ? (
                  <div className="border-top-normal flex-start-justify g15 pt15 pb5 row-detail">
                    <div className="flex-wrap g15">
                      <Link to={`/3PROJ/draw/${draw._id}`} className="cta cta-blue-h cta-normal mrauto">
                        <span className="add-user flex-center g15">
                          <i className="">visibility</i>
                          View
                        </span>
                      </Link>

                      {returnFunction ? (
                        <div className="cta cta-blue mrauto" onClick={() => returnFunction(draw.script)}>
                          <span className="flex-center g10">
                            <i className="">task_alt</i>
                            Choose
                          </span>
                        </div>
                      ) : null}
                      <div className="cta cta-red" onClick={() => deleteFunction(draw._id)}>
                        <span className="flex-center g10">
                          <i>delete</i>
                          Delete
                        </span>
                      </div>
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
