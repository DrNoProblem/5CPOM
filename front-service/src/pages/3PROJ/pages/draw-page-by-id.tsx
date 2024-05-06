import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import DeleteDrawById from "../../../api-request/draw/draw-delete";
import CurrentUserDrawsUpdate from "../../../api-request/user/update-draw";
import isHttpStatusValid from "../../../helpers/check-status";
import displayStatusRequest from "../../../helpers/display-status-request";
import DataModel from "../../../models/data-model";
import DrawModel from "../../../models/draw-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ModalConfirmDelete from "../components/confirmation-delete";
import ConsoleDrawComponent from "../components/console-draw";

interface Props extends RouteComponentProps<{ drawid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  Data: DataModel;
}

const DrawPageById: FC<Props> = ({ match, currentUser, Data, SetLog }) => {
  const [Draw, setDraw] = useState<DrawModel>();
  const [user, setUser] = useState<UserModel>();
  const [IsOwner, setIsOwner] = useState<Boolean>(false);

  const [ParamsActive, setParamsActive] = useState<false | string>(false);

  let history = useHistory();

  useEffect(() => {
    console.log("okkk");
    Data.draws.forEach((draw) => {
      if (draw._id === match.params.drawid) {
        setUser(currentUser)
        setDraw(draw);
        console.log(draw);
        setIsOwner(currentUser.draws.includes(draw._id));
      }
    });
  }, [match.params, Data, currentUser]);

  const ConfirmToDeleteDraw = (value: boolean) => {
    if (value) {
      ProcessToDeleteDraw()
    }
    setParamsActive(false);
  };


  const ProcessToDeleteDraw = () => {
    if (Draw && user && Draw._id) {
      Promise.all([DeleteDrawById(Draw._id), CurrentUserDrawsUpdate(user.draws.filter(e => e !== Draw._id))]).then((results) => {
        const [DeleteDrawResult, UpdateUserResult] = results;
        if (isHttpStatusValid(DeleteDrawResult.status) && isHttpStatusValid(UpdateUserResult.status)) {
          SetLog();
          history.push(`/3PROJ`);
          displayStatusRequest(`Draw deleted successfully`, false);
        }
        else displayStatusRequest(`error`, true);
      })
    }
  };

  return Draw ? (
    <div className="main p20 flex-col flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align ">
          <Link to={`/3PROJ`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">Draw :</h2>
          <i className="mt5" onClick={() => setParamsActive("setting")}>
            settings
          </i>
        </div>

        <div className="flex-row g50">
          <ConsoleDrawComponent
            DefaultScript={Draw.script}
            correction={false}
            returnedScript={false}
            currentUser={currentUser}
            SetLog={SetLog}
          />
        </div>
        {ParamsActive ? (
          <div className="add-item-popup">
            <div
              className="dark-background"
              onClick={() => {
                setParamsActive(false);
              }}
            ></div>
            {ParamsActive === "setting" ? (
              <div className="flex-col p50 dark-bg dark-container display-from-top g15 w50">
                <h2 className="mb0">
                  Settings :
                  <i
                    className=" red-h absolute r0 mr20"
                    onClick={() => {
                      setParamsActive(false);
                    }}
                  >
                    close
                  </i>
                </h2>
                <div className="g15">
                  <div className="cta cta-blue" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <span className="flex-center g10">
                      <i>content_copy</i>Copy URL
                    </span>
                  </div>
                  {IsOwner ? (
                    <div className="cta cta-red" onClick={() => setParamsActive('delete')}>
                      <span className="flex-center g10">
                        <i>delete</i>Delete
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {ParamsActive === "delete" ? (
              <ModalConfirmDelete functionReturned={ConfirmToDeleteDraw} itemTitle={"the draw"} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default DrawPageById;
