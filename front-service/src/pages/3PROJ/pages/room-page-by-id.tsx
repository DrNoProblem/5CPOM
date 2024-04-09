import React, { FC, FunctionComponent, useEffect, useState } from "react";
import "../3P-style.scss";
import { Link, RouteComponentProps } from "react-router-dom";
import UserModel from "../../../models/user-model";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import getNameById from "../../../helpers/getNameById";
import MiniUserModel from "../../../models/mini-user-model";

interface Props extends RouteComponentProps<{ roomid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
  usersList: MiniUserModel[];
}

const RoomPageById: FC<Props> = ({ match, currentUser, rooms, tasks, usersList }) => {
  const [Room, setRoom] = useState<RoomModel>();

  const isTaskProblem = (task: TaskModel) => {
    let message: string = "";
    if (!task.details) message += "- need to add detail";
    if (task.datelimit < new Date() && !!task.correction) message += "- need to add correction";
    return message;
  };

  useEffect(() => {
    rooms.forEach((room) => {
      if (room._id === match.params.roomid) {
        setRoom(room);
      }
    });
  }, [match.params, tasks, rooms]);

  return Room ? (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Room {Room!.name} :</h2>
        </div>
        <div className="flex-col g25 mb15">
          <div className="flex g25">
            <div className="dark-container w100">
              <div className="flex-center-align flex-bet mb10">
                <h2 className="m0">List of Tasks :</h2>
                <div className="flex-row flex-bet normal-bg-h cta  blue-h">
                  <span className="add-user flex-row flex-center-align flex-start-justify g15">
                    <i className="material-icons">add</i>
                    Add new Task
                  </span>
                </div>
              </div>
              <ul className="table-list flex-col mb0 ">
                <li className="legend">
                  <div className="flex-row">
                    <div className="flex-row flex-center-align w100">
                      <p className="w20">NAME</p>
                      <p className="w40">DATE</p>
                      <p className="w20">
                        SUBMITED
                        <br />
                        RENDERS
                      </p>
                      <p className="w10">CORRECTION</p>
                    </div>
                    <i className="material-icons mtbauto flex-center op0 padded">expand_more</i>
                  </div>
                </li>

                {tasks
                  ? tasks.map((task) =>
                      Room.tasks.includes(task._id) ? (
                        <li key={task._id}>
                          <Link to={`/3PROJ/room/${Room._id}/task/${task._id}`} className="flex-row flex-bet">
                            <div className="flex-row flex-center-align w100">
                              <p className="w20">{task.title}</p>
                              <p className="w40">{task.datelimit instanceof Date ? task.datelimit.toLocaleDateString() : task.datelimit}</p>
                              <p className="w20">
                                {task.renders.length} / {Room.users.length}
                              </p>
                              <p className="w10">
                                <i className="material-icons">{!!task.correction ? "done" : "close"}</i>
                              </p>
                            </div>
                            {isTaskProblem(task) ? (
                              <i className="material-icons warning red" data-title={isTaskProblem(task)}>
                                warning
                              </i>
                            ) : (
                              <i className="material-icons warning op0">warning</i>
                            )}
                          </Link>
                        </li>
                      ) : null
                    )
                  : null}
              </ul>
            </div>

            <div className="dark-container w30 relative">
              <h2>{Room.name} Informations :</h2>
              <i className="material-icons blue-h absolute t0 r0 mt25 mr25">settings</i>
              <div className="flex-col">
                <p className="flex">
                  <strong className="w40">Owner : </strong>
                  {getNameById(Room.owner, usersList)}
                </p>
                <p className="flex">
                  <strong className="w40">Co-Owner : </strong>
                  {getNameById(Room.co_owner, usersList)}
                </p>
                <p className="flex">
                  <strong className="w40">Running Task : </strong>
                  {Room.name}
                </p>
                <p className="flex">
                  <strong className="w40">Ended Task : </strong>
                  {Room.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex g25">
            <div className="dark-container w60 relative">
              <h2>List of users :</h2>
            </div>
            <div className="dark-container w40 relative">
              <h2>List of users :</h2>
              <i className="material-icons blue-h absolute t0 r0 mt25 mr25">settings</i>
              <ul className="table-list flex-col mb0 ">
                <li className="legend">
                  <div className="flex-row">
                    <div className="flex-row flex-center-align w100">
                      <p className="w80">NAME</p>
                      <p className="w20">SUBMITED RENDERS</p>
                    </div>
                  </div>
                </li>

                {Room.co_owner === currentUser._id || Room.owner === currentUser._id
                  ? Room.users.map((userId) => (
                      <li key={userId}>
                        <div className="flex-row flex-bet">
                          <div className="flex-row flex-center-align w100">
                            <p className="w80">{getNameById(userId, usersList)}</p>
                            <p className="w20">
                              0 / {Room.tasks.length}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default RoomPageById;
