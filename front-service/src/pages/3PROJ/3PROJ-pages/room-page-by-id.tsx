import React, { FunctionComponent, useEffect, useState } from "react";
import "../3P-style.scss";
import { Link, RouteComponentProps, match } from "react-router-dom";
import UserModel from "../../../models/user-model";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";

interface Props extends RouteComponentProps<{ roomid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
}

const RoomPageById: FunctionComponent<Props> = ({ match, currentUser, rooms, tasks }) => {
  const [Room, setRoom] = useState<RoomModel>();

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
        <div className="flex-wrap g25 w80 mb15 flex-center-align"></div>
      </div>
    </div>
  ) : null;
};

export default RoomPageById;
