import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import DeleteDrawById from "../../../api-request/draw/draw-delete";
import CurrentUserDrawsUpdate from "../../../api-request/user/update-draw";
import isHttpStatusValid from "../../../helpers/check-status";
import DataModel from "../../../models/data-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ModalConfirmDelete from "../components/confirmation-delete";
import TableDraw from "../components/table-draw-list";
import displayStatusRequest from "../../../helpers/display-status-request";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
  Data: DataModel;
};

const DrawnListPage: FC<Props> = ({ currentUser, Data, SetLog }) => {
  let DrawsList = Data.draws.filter((draw) => currentUser.draws.includes(draw._id));

  const [deleteActive, setdeleteActive] = useState<string | false>(false);

  const SetDeleteDraw = (value: string) => {
    setdeleteActive(value);
  };
  const ConfirmToDeleteDraw = () => {
    console.log('test');

    if (deleteActive) {
      Promise.all([DeleteDrawById(deleteActive), CurrentUserDrawsUpdate(currentUser.draws.filter(e => e !== deleteActive))]).then((results) => {
        const [DeleteDrawResult, UpdateUserResult] = results;
        if (isHttpStatusValid(DeleteDrawResult.status) && isHttpStatusValid(UpdateUserResult.status)) {
          SetLog();
          SuccessInfoSubmited("succes");
          displayStatusRequest(`Draw deleted successfully`, false);
        }
        else displayStatusRequest(`error`, true);
      })
    }
    SuccessInfoSubmited("");
  };
  const SuccessInfoSubmited = (update: string) => {
    if (update === "succes") SetLog();
    else setdeleteActive(false);
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">Draw list :</h2>
        </div>

        <TableDraw
          currentUser={currentUser}
          returnFunction={false}
          title="List of script saved online :"
          DrawsList={DrawsList}
          deleteFunction={SetDeleteDraw}
        />
      </div>

      {deleteActive ? (
        <div className="add-item-popup">
          <div className="dark-background" onClick={() => setdeleteActive(false)} />

          <ModalConfirmDelete functionReturned={ConfirmToDeleteDraw} itemTitle={"the draw"} />
        </div>
      ) : null}
    </div>
  );
};

export default DrawnListPage;
