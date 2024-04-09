import React, { FC } from "react";
import { Link } from "react-router-dom";
import getNameById from "../../../helpers/getNameById";
import MiniUserModel from "../../../models/mini-user-model";
import RoomModel from "../../../models/room-model";
import UserModel from "../../../models/user-model";

type Props = {
  limite: number;
  RoomList: RoomModel[];
  usersList: MiniUserModel[];
  currentUser: UserModel;
  owner: boolean;
};
const TableListRoomsComp: FC<Props> = ({ limite, RoomList, usersList, currentUser, owner }) => {
  let count: number = 0;
  return (
    <ul className="table-list flex-col mb0">
      <li className="legend">
        <div className="flex-row flex-bet">
          <div className="flex-row flex-start-align flex-start-justify w100">
            <p className="w20">ROOM NAME</p>
            <p className="w20">OWNER</p>
            <p className="w20">CO-OWNER</p>
            <p className="w20">USERS COUNT</p>
            <p className="w20">TASKS COUNT</p>
          </div>
        </div>
      </li>
      {RoomList &&
        RoomList.map((room: RoomModel) => {
          if ((room.owner === currentUser._id || room.co_owner === currentUser._id) && count < limite && owner) {
            count++;
            return (
              <li key={room._id + "userlist"}>
                <Link to={`/3PROJ/room/` + room._id} className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w100">
                    <p className="w20">{room.name}</p>
                    <p className="w20">{getNameById(room.owner, usersList)}</p>
                    <p className="w20">{getNameById(room.co_owner, usersList)}</p>
                    <p className="w20">{room.users.length}</p>
                    <p className="w20">{room.tasks.length}</p>
                  </div>
                </Link>
              </li>
            );
          }

          if ((room.owner !== currentUser._id || room.co_owner !== currentUser._id) && count < limite && !owner) {
            count++;
            return (
              <li key={room._id + "userlist"}>
                <Link to={`/3PROJ/room/` + room._id} className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w100">
                    <p className="w20">{room.name}</p>
                    <p className="w20">{getNameById(room.owner, usersList)}</p>
                    <p className="w20">{getNameById(room.co_owner, usersList)}</p>
                    <p className="w20">{room.users.length}</p>
                    <p className="w20">{room.tasks.length}</p>
                  </div>
                </Link>
              </li>
            );
          }
          return null; // Retourner null si les conditions ne sont pas remplies
        })}
    </ul>
  );
};

export default TableListRoomsComp;
