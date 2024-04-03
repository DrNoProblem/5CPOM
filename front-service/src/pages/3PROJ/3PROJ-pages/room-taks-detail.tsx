import React, { FunctionComponent, useEffect, useState } from "react";
import "../3P-style.scss";
import { Link, RouteComponentProps, match } from "react-router-dom";
import UserModel from "../../../models/user-model";
import TaskModel from "../../../models/tasks-model";
import voidTask from "../../../models/mocks/void-task";
import RoomModel from "../../../models/room-model";

interface Props extends RouteComponentProps<{ roomid: string; taskid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
}

const RoomTaskPageById: FunctionComponent<Props> = ({ match, currentUser, SetLog, rooms, tasks }) => {
  const [Task, setTask] = useState<TaskModel>();
  const [Room, setRoom] = useState<RoomModel>();

  useEffect(() => {
    tasks.forEach((task) => {
      if (task._id === match.params.taskid) {
        rooms.forEach((room) => {
          if (room.tasks.includes(task._id)) {
            setRoom(room);
          }
        });
        setTask(task);
      }
    });
  }, [match.params, tasks, rooms]);

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
          </h2>
          <h2 className="mb0 txt-end w50">
            Date limit : <span className="blue">{Task.datelimit}</span>
          </h2>
        </div>
        <div className="flex g25">
          <div className="small-dark-container flex-col display-from-left w50">
            {Task.details ? (
              <div className="task-detail">{Task.details}</div>
            ) : (
              <div className="flex-center flex-col">
                <h2 className="red flex-center ">
                  <i className="material-icons red mr25">warning</i>YOU NEED TO ADD DETAIL FOR THIS TASK
                  <i className="material-icons red ml25">warning</i>
                </h2>
                <div className="cta cta-blue">
                  <span className="add-user flex-row flex-center-align flex-start-justify g15">
                    <i className="material-icons">add</i>add a detail
                  </span>
                </div>
              </div>
            )}
          </div>
          {Task.correction && currentUser._id === Room.co_owner && currentUser._id === Room.owner ? (
            <div className="small-dark-container flex-bet display-from-left border-red">
              <h2>YOU NEED TO ADD A CORRECTION FOR THIS TASK</h2>
              <div className="cta normal-bg-h blue-h">
                <span className="add-user flex-row flex-center-align flex-start-justify g15">
                  <i className="material-icons">add</i>add a correction
                </span>
              </div>
            </div>
          ) : (
            <div className="small-dark-container display-from-left w50">
              <h2>Correction has been rendered</h2>
              <div className="flex g25">
                <div className="cta normal-bg blue-h">
                  <span className="add-user flex-row flex-center-align flex-start-justify g15">
                    <i className="material-icons">edit</i>edit the correction
                  </span>
                </div>
                <div className="cta normal-bg blue-h">
                  <span className="add-user flex-row flex-center-align flex-start-justify g15">
                    <i className="material-icons">edit</i>view the correction
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default RoomTaskPageById;
