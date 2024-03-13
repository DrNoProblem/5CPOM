import React, { FunctionComponent, useEffect, useState } from "react";
import "../3P-style.scss";
import { Link, RouteComponentProps, match } from "react-router-dom";
import UserModel from "../../../models/user-model";
import TasksModel from "../../../models/tasks-model";
import voidTask from "../../../models/mocks/void-task";

interface Props extends RouteComponentProps<{ roomid: string; taskid: string }> { 
  currentUser: UserModel;
  SetLog: Function;
};

const RoomTaskPageById: FunctionComponent<Props> = ({ currentUser }) => {
  let Tasks: TasksModel = voidTask;
  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">tasks {Tasks.title} :</h2>
        </div>
        <div className="big-normal-container flex-col display-from-left">
          <div className="task-detail">{Tasks.details}</div>
        </div>
      </div>
    </div>
  );
};

export default RoomTaskPageById;
