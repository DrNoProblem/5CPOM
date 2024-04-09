import React, { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  limite: number;
  tableList: renderModel[];
  submit: boolean;
}

interface renderModel {
  taskId: string;
  roomId: string;
  roomName: string;
  taskTitle: string;
  taskDate: Date;
  renderStatus: boolean;
}

const TableRenderSubmitStatusComp: FC<Props> = ({ limite, tableList, submit }) => {
  return (
    <ul className="table-list flex-col mb0 ">
      <li className="legend">
        <div className="flex-row">
          <div className="flex-row flex-start-align flex-bet w100">
            <p className="w30">ROOM</p>
            <p className="w30">TASK</p>
            <p className="w40">DATE</p>
          </div>
          <i className="material-icons mtbauto flex-center op0">expand_more</i>
        </div>
      </li>

      {tableList
        ? tableList.map((e, index) =>
            index < limite && submit === e.renderStatus ? (
              <li key={e.taskId}>
                <Link to={`/3PROJ/room/${e.roomId}/task/${e.taskId}`} className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-bet w100">
                    <p className="w30">{e.roomName}</p>
                    <p className="w30">{e.taskTitle}</p>
                    <p className="w40">{e.taskDate instanceof Date ? e.taskDate.toLocaleDateString() : e.taskDate}</p>
                  </div>
                  {e.renderStatus ? <i className="material-icons mtbauto flex-center green">task_alt</i> : <i className="material-icons mtbauto flex-center red">close</i>}
                </Link>
              </li>
            ) : null
          )
        : null}
    </ul>
  );
};

export default TableRenderSubmitStatusComp;
