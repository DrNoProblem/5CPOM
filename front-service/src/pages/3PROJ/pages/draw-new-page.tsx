import React, { FC, FunctionComponent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ConsoleDrawComponent from "../components/console-draw";
import DataModel from "../../../models/data-model";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
  script: string;
  Data: DataModel;
};

const DrawPage: FC<Props> = ({ currentUser, script, SetLog, Data }) => {
  const [user, setUser] = useState<UserModel>(currentUser);

  return (
    <div className="main p20 flex-col flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align ">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Draw :</h2>
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
      </div>
    </div>
  );
};

export default DrawPage;
