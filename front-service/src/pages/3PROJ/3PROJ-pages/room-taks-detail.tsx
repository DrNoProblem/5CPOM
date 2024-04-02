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
          <h2 className="">
            tasks {Task!.title} of {Room!.name} room :
          </h2>
        </div>
        <div className="big-normal-container flex-col display-from-left">
          <div className="task-detail">{Task!.details}</div>
        </div>
      </div>
    </div>
  );
};

export default RoomTaskPageById;
