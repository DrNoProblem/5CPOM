import React, { FC, FunctionComponent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ConsoleDrawComponent from "../components/console-draw";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
  script: string;
};

const DrawPage: FC<Props> = ({ currentUser, script, SetLog }) => {
  const [ParamsActive, setParamsActive] = useState<Boolean>(false);
  const [user, setUser] = useState<UserModel>(currentUser);

  return (
    <div className="main p20 flex-col flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align ">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Draw :</h2>
          <i className="material-icons" onClick={() => setParamsActive(true)}>
            settings
          </i>
        </div>

        <div className="flex-row g50">
          <ConsoleDrawComponent DefaultScript={""} correction={false} returnedScript={false} />
        </div>
        {ParamsActive ? (
          <div className="add-item-popup">
            <div
              className="dark-background"
              onClick={() => {
                setParamsActive(false);
              }}
            ></div>

            <div className="flex-col p50 dark-bg dark-container display-from-left g15">
              <h2 className="">
                Settings :
                <i
                  className="material-icons red-h absolute r0 mr50"
                  onClick={() => {
                    setParamsActive(false);
                  }}
                >
                  close
                </i>
              </h2>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DrawPage;
