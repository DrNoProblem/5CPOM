import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../models/user-model";
import Logo from "../logo-grid";
import "./style.scss";

type Props = {
  currentUser: UserModel;
  log_out: Function;
  isLog: string | Boolean;
};

const HeaderCMS: FunctionComponent<Props> = ({ currentUser, log_out, isLog }) => {



  return currentUser ? (
    <div>
      <nav className="header flex-bet flex-row flex-center-x flex-center-y zi9">
        <div className="flex g20">
          <Link className="flex h100" to="">
            <Logo sizeblocs={0.5} hover={false} />
          </Link>
        </div>
        {isLog ? (
          <div className="header__user-part flex-row w60-tab flex-center g25">
            <h3 className="m0 blue">
              <Link to={`/user/${currentUser._id}`}>{currentUser.pseudo}</Link>
            </h3>
            <div className="cta mlrauto cta-red" onClick={() => log_out()}>
              <span className="flex-center g15">
                Log Out
                <i className="material-icons">power_settings_new</i>
              </span>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </nav>
      <div className="header__marge relative"></div>
    </div>
  ) : null;
};
export default HeaderCMS;
