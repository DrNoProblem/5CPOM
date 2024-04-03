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
      if (task.id === match.params.taskid) {
        rooms.forEach((room) => {
          if (room.tasks.includes(task.id)) {
            setRoom(room);
          }
        });
        setTask(task);
      }
    });
  }, [match.params, tasks, rooms]);

  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">
            tasks <span className="blue">{Task!.title}</span> of <span className="blue">{Room!.name}</span> room
          </h2>
          <h2 className="mb0">
            Date limit : <span className="blue">{Task!.datelimit}</span>
          </h2>
        </div>
        {Task!.correction && currentUser._id === Room!.co_owner && currentUser._id === Room!.owner ? (
          <div className="big-normal-container flex-bet display-from-left border-red">
            <h2>YOU NEED TO ADD A CORRECTION FOR THIS TASK</h2>
            <div className="cta cta-red">
              <span>
                <i className="material-icons">add</i>add a correction
              </span>
            </div>
          </div>
        ) : (
          <div className="big-normal-container flex-bet display-from-left">
            <h2>Correction has been rendered</h2>
            <div className="cta cta-red">
              <span>
                <i className="material-icons">edit</i>edit the correction
              </span>
            </div>
            <div className="cta cta-red">
              <span>
                <i className="material-icons">view</i>view the correction
              </span>
            </div>
          </div>
        )}
        <div className="big-normal-container flex-col display-from-left">
          {Task!.details ? (
            <div className="task-detail">{Task!.details}</div>
          ) : (
            <div>
              <h2>YOU NEED TO ADD DETAIL FOR THIS TASK</h2>
              <div className="cta cta-red">
                <span>
                  <i className="material-icons">add</i>add a detail
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomTaskPageById;
