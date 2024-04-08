import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import getNameById from "../../../helpers/getNameById";
import MiniUserModel from "../../../models/mini-user-model";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";

interface Props extends RouteComponentProps<{ roomid: string; taskid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
  userList: MiniUserModel[];
}

const RoomTaskPageById: FunctionComponent<Props> = ({ match, currentUser, SetLog, rooms, tasks, userList }) => {
  const [Task, setTask] = useState<TaskModel>();
  const [Room, setRoom] = useState<RoomModel>();

  const [RenderStatus, setRenderStatus] = useState<boolean>(false);

  const [IsOwner, setIsOwner] = useState<boolean>(false);
  const [IsDatePassed, setIsDatePassed] = useState<boolean>(false);

  useEffect(() => {
    tasks.forEach((task) => {
      if (task._id === match.params.taskid) {
        rooms.forEach((room) => {
          if (room.tasks.includes(task._id)) {
            setTask(task);
            setRoom(room);
            setIsOwner(room.co_owner === currentUser._id || room.owner === currentUser._id);
            setRenderStatus(task.renders.some((e) => e.id === currentUser._id));
            setIsDatePassed(task.datelimit < new Date());
          }
        });
      }
    });
  }, [match.params, tasks, rooms, currentUser]);

  return Task && Room ? (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0 w50">
            Tasks :{" "}
            <Link to={`/3PROJ`} className="blue">
              {Task.title}
            </Link>{" "}
            of{" "}
            <Link to={`/3PROJ`} className="blue">
              {Room.name}
            </Link>
          </h2>{" "}
          {IsDatePassed ? (
            <h2 className="mb0 txt-end w50">Date limit is passed</h2>
          ) : (
            <h2 className="mb0 txt-end w50">
              Date limit : <span className="blue">{Task.datelimit}</span>
            </h2>
          )}
        </div>

        <div className="flex g25">
          <div className="flex-col flex-justify-start g25 w60">
            {Task.details ? (
              <div className="dark-container flex-col display-from-left">
                <h2 className="flex-center ">Detail :</h2>
                <div className="task-detail">{Task.details}</div>
              </div>
            ) : IsOwner ? (
              <div className="dark-container flex-col display-from-left">
                <div className="flex-center flex-col">
                  <h2 className="red flex-center ">
                    <i className="material-icons red mr25">warning</i>Details needed
                    <i className="material-icons red ml25">warning</i>
                  </h2>
                  <div className="cta normal-bg blue-h">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>add a detail
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-container flex-col display-from-left">
                <div className="flex-center flex-col">
                  <h2 className="red flex-center m0">No details yet</h2>
                </div>
              </div>
            )}
          </div>
          <div className="flex-col flex-justify-start g25 w40">
            {IsOwner ? null : RenderStatus ? (
              <div className="dark-container display-from-left w50 flex-row">
                <i className="material-icons fs30 green mr50 ml25 mtauto mbauto">task_alt</i>
                <div className="flex-col">
                  <h2>Render is submited</h2>
                  <div className="flex g25">
                    <div className="cta normal-bg blue-h mrauto">
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="material-icons">open_in_new</i>View
                      </span>
                    </div>
                    {IsOwner ? (
                      <div className="cta normal-bg blue-h mrauto">
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="material-icons">edit</i>Edit the render
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                <h2 className="red">You need to submit a render</h2>
                <div className="flex-col">
                  <div className="cta normal-bg-h blue-h mrauto">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Add from new draw
                    </span>
                  </div>
                  <div className="cta normal-bg-h blue-h mrauto">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Choose from your draws
                    </span>
                  </div>
                </div>
              </div>
            )}

            {Task.correction ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                <h2>Correction for this task :</h2>
                <div className="flex g25">
                  <div className="cta normal-bg blue-h">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">open_in_new</i>View
                    </span>
                  </div>
                  {IsOwner ? (
                    <div className="cta normal-bg blue-h">
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="material-icons">edit</i>Edit the correction
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : IsOwner ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                {IsDatePassed ? (
                  <h2 className="red flex-center ">
                    <i className="material-icons red mr25">warning</i>Correction is needed
                    <i className="material-icons red ml25">warning</i>
                  </h2>
                ) : (
                  <h2>Correction is needed</h2>
                )}
                <div className={`flex g25 ${IsDatePassed ? "flex-center" : null}`}>
                  <div className="cta normal-bg blue-h">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Add from new draw
                    </span>
                  </div>
                  <div className="cta normal-bg blue-h">
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Choose from your draws
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {IsOwner ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                <h2>
                  List of Users : <span className="fs14"></span>
                </h2>

                <ul className="table-list flex-col mb0 ">
                  <li className="legend">
                    <div className="flex-row">
                      <div className="flex-row flex-center-align w100">
                        <p className="w80">USER NAME</p>
                        <p className="w20 txt-center">RENDER STATUS</p>
                      </div>
                    </div>
                  </li>

                  {Room.users.map((userId) => (
                    <li key={userId}>
                      <div className="flex-row flex-bet">
                        <div className="flex-row flex-center-align w100">
                          <p className="w80">{getNameById(userId, userList)}</p>
                          {Task.renders.some((e) => e.id === userId) ? (
                            <i className="material-icons mtbauto flex-center green w20">task_alt</i>
                          ) : (
                            <i className="material-icons mtbauto flex-center red w20">close</i>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default RoomTaskPageById;
