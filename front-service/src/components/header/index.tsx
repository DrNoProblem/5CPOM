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

const Header5CPOM: FunctionComponent<Props> = ({ currentUser, log_out, isLog }) => {
  return currentUser ? (
    <div>
      <nav className="header flex-bet flex-row flex-center zi9">
        <div className="flex g20">
          <Link className="flex h100" to="">
            <Logo sizeblocs={0.5} hover={false} />
          </Link>
        </div>
        {isLog ? (
          <div className="header__user-part flex-row w60-tab flex-center g25 blue-h ">
            <h3 className="m0 flex-center g15">
              <Link to={`/user/${currentUser._id}`}>{currentUser.name}</Link>
              <i className="material-icons">account_circle</i>
            </h3>

            <i className="material-icons red-h" onClick={() => log_out()}>
              logout
            </i>
          </div>
        ) : (
          <div></div>
        )}
      </nav>
      {/* 
      <div className="absolute normal-container t0 r0 m15">
        <p className='mt0'></p>{currentUser.name}</p>
        <Link to={`/user/${currentUser._id}`}>view profile</Link>
        <p className="flex-center g15">
          Logout
          <i className="material-icons blue-h" onClick={() => log_out()}>
            logout
          </i>
        </p>
      </div> 
      */}
      <div className="header__marge relative"></div>
    </div>
  ) : null;
};
export default Header5CPOM;
