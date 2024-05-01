import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { isDatePast } from "../../../helpers/check-date-passed";
import { formatDate } from "../../../helpers/display-date-format";
import getNameById from "../../../helpers/getNameById";
import MiniUserModel from "../../../models/mini-user-model";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import EditTaskInfo from "../components/fields-task-info";
import EditRoomInfo from "../components/fields-room-info";

interface Props extends RouteComponentProps<{ roomid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
  usersList: MiniUserModel[];
}

const countUserRenders = (userId: string, tasks: TaskModel[]) => {
  return tasks.reduce((acc, task) => {
    // Ajouter au compteur pour chaque occurrence de userId dans task.renders
    const count = task.renders.filter((render) => render.id === userId).length;
    return acc + count;
  }, 0);
};

const countTaskPassed = (tasks: TaskModel[]) => {
  return tasks.reduce((acc, task) => {
    // Ajouter au compteur pour chaque occurrence de userId dans task.renders
    const count = isDatePast(task.datelimit) ? 1 : 0;
    return acc + count;
  }, 0);
};

const RoomPageById: FC<Props> = ({ match, currentUser, rooms, tasks, usersList, SetLog }) => {
  const [IsOwner, setIsOwner] = useState<boolean>(false);

  const [Room, setRoom] = useState<RoomModel>();
  const [PopUpActive, setPopUpActive] = useState<boolean | string>();

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
        setIsOwner(room.co_owner === currentUser._id || room.owner === currentUser._id);
      }
    });
  }, [match.params, tasks, rooms]);

  const SuccessInfoSubmited = (update: boolean) => {
    if (update) SetLog();
    setPopUpActive(false);
  };

  return Room ? (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">
            Room{" "}
            <span className="blue" onClick={() => setPopUpActive("edit room")}>
              {Room!.name}
            </span>{" "}
            :
          </h2>
        </div>
        <div className="flex-col g20 mb15">
          <div className="flex g20">
            <div className="flex-col w30 g20">
              <div className="dark-container relative">
                <h2>{Room.name} Informations :</h2>
                {IsOwner ? (
                  <i className="material-icons blue-h absolute t0 r0 mt25 mr25" onClick={() => setPopUpActive("edit room")}>
                    settings
                  </i>
                ) : null}
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
                    {Room.tasks.length - countTaskPassed(tasks.filter((task) => Room.tasks.includes(task._id)))}
                  </p>
                  <p className="flex">
                    <strong className="w40">Ended Task : </strong>
                    {countTaskPassed(tasks.filter((task) => Room.tasks.includes(task._id)))}
                  </p>
                </div>
              </div>

              {IsOwner ? (
                <div className="dark-container relative">
                  <h2>List of users :</h2>
                  <i className="material-icons blue-h absolute t0 r0 mt25 mr25" onClick={() => setPopUpActive("edit room")}>
                    settings
                  </i>
                  <ul className="table-list flex-col mb0 ">
                    <li className="legend">
                      <div className="flex-row">
                        <div className="flex-row flex-center-align w100">
                          <p className="w75">NAME</p>
                          <p className="w20">SUBMITED RENDERS</p>
                        </div>
                      </div>
                    </li>

                    {Room.co_owner === currentUser._id || Room.owner === currentUser._id
                      ? Room.users.map((userId) => (
                          <li key={userId}>
                            <div className="flex-row flex-bet">
                              <div className="flex-row flex-center-align w100">
                                <p className="w75">{getNameById(userId, usersList)}</p>
                                <p className="w20 pl20">
                                  {countUserRenders(
                                    userId,
                                    tasks.filter((task) => Room.tasks.includes(task._id))
                                  )}
                                  / {Room.tasks.length}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="flex-col w70 g20">
              <div className="dark-container relative">
                <div className="flex-center-align flex-bet mb10">
                  <h2 className="m0">List of Tasks :</h2>
                  {IsOwner ? (
                    <div className="flex-row flex-bet normal-bg-h cta  blue-h" onClick={() => setPopUpActive("add task")}>
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="material-icons">add</i>
                        Add new Task
                      </span>
                    </div>
                  ) : null}
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
                                <p className="w40">{formatDate(task.datelimit)}</p>
                                <p className="w20 pl20">
                                  {IsOwner ? (
                                    `${task.renders.length} / ${Room.users.length}`
                                  ) : task.renders.some((r) => r.id === currentUser._id) ? (
                                    <i className="material-icons green">done</i>
                                  ) : (
                                    <i className="material-icons red">close</i>
                                  )}
                                </p>
                                <p className="w10">
                                  <i className="material-icons">{!!task.correction ? "done" : "close"}</i>
                                </p>
                              </div>
                              {isTaskProblem(task) && IsOwner ? (
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
            </div>
          </div>

          {PopUpActive ? (
            <div className="add-item-popup">
              <div className="dark-background" onClick={() => setPopUpActive(false)} />
              {PopUpActive === "add task" ? (
                <EditTaskInfo
                  defaultValues={{
                    title: "",
                    detail: "",
                    date: false,
                  }}
                  functionReturned={SuccessInfoSubmited}
                  CurrentRoom={Room}
                  Add={true}
                />
              ) : null}
              {PopUpActive === "edit room" ? (
                <EditRoomInfo
                  defaultValues={{
                    name: Room.name,
                    co_owner: Room.co_owner,
                    users: Room.users,
                  }}
                  functionReturned={SuccessInfoSubmited}
                  CurrentUser={currentUser}
                  usersList={usersList}
                  Add={false}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default RoomPageById;
