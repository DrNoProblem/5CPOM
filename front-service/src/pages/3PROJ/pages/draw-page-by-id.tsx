import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ConsoleDrawComponent from "../components/console-draw";
import DataModel from "../../../models/data-model";
import DrawModel from "../../../models/draw-model";

interface Props extends RouteComponentProps<{ drawid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  Data: DataModel;
}

const DrawPageById: FC<Props> = ({ match, currentUser, Data, SetLog }) => {
  const [Draw, setDraw] = useState<DrawModel>();
  const [IsOwner, setIsOwner] = useState<Boolean>(false);
  
  const [ParamsActive, setParamsActive] = useState<Boolean>(false);
  const [user, setUser] = useState<UserModel>(currentUser);


  useEffect(() => {
    Data.draws.forEach((draw) => {
      if (draw._id === match.params.drawid) {
        setDraw(draw);
        setIsOwner(currentUser.draws.includes(draw._id));
      }
    });
  }, [match.params, Data, currentUser]);


  return (
    <div className="main p20 flex-col flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align ">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Draw :</h2>
          <i className="" onClick={() => setParamsActive(true)}>
            settings
          </i>
        </div>

        <div className="flex-row g50">
          <ConsoleDrawComponent
            DefaultScript={""}
            correction={false}
            returnedScript={false}
            currentUser={currentUser}
            start={false}
          />
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
                  className=" red-h absolute r0 mr50"
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

export default DrawPageById;
