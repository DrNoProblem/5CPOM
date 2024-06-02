import React, { FC } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../models/user-model";
import Logo from "../logo-grid";
import "./style.scss";

type Props = {
  currentUser: UserModel;
  log_out: Function;
  isLog: string | Boolean;
};

const Header5CPOM: FC<Props> = ({ currentUser, log_out, isLog }) => {
  return currentUser ? (
    <div className="display-from-top">
      <nav className="header flex-bet flex-row flex-center zi9">
        <div className="flex g20">
          <Link className="flex h100" to="">
            <Logo sizeblocs={0.5} hover={false} />
          </Link>
        </div>
        {isLog ? (
          <div className="flex-center-align flex-end-justify flex-row g25 header__user-part">
            <Link className="m0 flex-center g15 blue-h" to={`/user/${currentUser._id}`}>
              {currentUser.name}
              <i className="">account_circle</i>
            </Link>

            <i className=" red-h" onClick={() => log_out()}>
              logout
            </i>
          </div>
        ) : (
          <div></div>
        )}
      </nav>
      <div className="header__marge relative"></div>
    </div>
  ) : null;
};
export default Header5CPOM;
