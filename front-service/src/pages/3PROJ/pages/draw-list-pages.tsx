import React, { FC } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import TableDraw from "../components/draw-list";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
};

const DrawnListPage: FC<Props> = ({ currentUser }) => {

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">Draw list :</h2>
        </div>

        <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
          <h2 className="">List of script saved online :</h2>
          <TableDraw currentUser={currentUser} returnFunction={false} />
        </div>
      </div>
    </div>
  );
};

export default DrawnListPage;
