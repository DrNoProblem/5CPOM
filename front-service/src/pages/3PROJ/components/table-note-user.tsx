import { title } from "process";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import UserModel from "../../../models/user-model";

type Props = {
  RoomList: RoomModel[];
  TaskList: TaskModel[];
  currentUser: UserModel;
};
const TableNoteUser: FC<Props> = ({ RoomList, TaskList, currentUser }) => {
  const [ActiveRow, setActiveRow] = useState<string>("");
  return (
    <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
      <h2 className="">Notes fr tasks :</h2>
      <ul className="table-list flex-col mb0">
        <li className="legend">
          <div className="flex-row flex-bet">
            <div className="flex-row flex-start-align flex-start-justify w100">
              <p className="w30">TASK</p>
              <p className="w30">ROOM</p>
              <p className="w30">SCRIPT</p>
              <p className="w10">NOTE</p>
              <i className=" op0">add</i>
            </div>
          </div>
        </li>
        {currentUser.notes.map((note: { taskId: string; roomId: string; script: string; note: number }) => {
          return (
            <li
              key={note.taskId}
              className={`no-hover${ActiveRow === note.taskId + "" ? " active-row" : ""}`}
              onClick={() => {
                ActiveRow === note.taskId + "" ? setActiveRow("") : setActiveRow(note.taskId + "");
              }}
            >
              <div className="flex-col">
                <div className="flex-row flex-start-align flex-start-justify w100">
              <p className="w30">{TaskList.find(e => e._id === note.taskId)!.title}</p>
              <p className="w30">{RoomList.find(e => e._id === note.roomId)!.name}</p>
              <p className="w30">{note.script}</p>
              <p className="w10">{note.note}/100</p>
                  <i className=" mtauto mbauto blue-h expand">chevron_right</i>
                </div>
                {ActiveRow === note.taskId + "" ? (
                  <div className="border-top-normal flex-start-justify g15 pt15 pb5 row-detail">
                    <div className="flex-wrap g15">
                      <Link to={`/3PROJ/draw/${note.taskId}`} className="cta cta-blue-h cta-normal mrauto">
                        <span className="add-user flex-center g15">
                          <i className="">visibility</i>
                          View
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableNoteUser;
