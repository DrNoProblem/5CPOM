import React, { FunctionComponent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
type Props = {
  miniMenu: Function;
};
const SideMenu: FunctionComponent<Props> = ({ miniMenu }) => {
  const location = useLocation();
  const actualPage = location.pathname;

  const [MiniMenu, setMiniMenu] = useState<Boolean>(false);

  const toggleSizeMenu = (value: boolean) => {
    miniMenu(value);
    setMiniMenu(value);
  };

  return (
    <div
      className={`side-menu dark-container relative flex-col g5 display-from-left ${
        MiniMenu ? "mini-menu" : ""
      }`}
    >
      <Link
        to={"/"}
        data-title={"Home"}
        className={`side-item after-info flex-row flex-center-align normal-bg-h p10 ${
          actualPage === "/" ? " blue" : ""
        }`}
      >
        <i className="">home</i>
        {!MiniMenu ? <p className="pl10 m0">Home</p> : null}
      </Link>

      <div className="space"></div>

      <div>
        <Link
          to={`/1PROJ`}
          data-title={"1PROJ"}
          className={`side-item after-info flex-row flex-center-align normal-bg-h p10 ${
            actualPage === "/1PROJ" ? " blue" : ""
          }`}
        >
          <i className="">web</i>
          {!MiniMenu ? <p className="pl10 m0">1PROJ</p> : null}
        </Link>
        <Link
          to={`/2PROJ`}
          data-title={"2PROJ"}
          className={`side-item after-info flex-row flex-center-align normal-bg-h p10 ${
            actualPage === "/2PROJ" ? " blue" : ""
          }`}
        >
          <i className="">web</i>
          {!MiniMenu ? <p className="pl10 m0">2PROJ</p> : null}
        </Link>
        <Link
          to={`/3PROJ`}
          data-title={"3PROJ"}
          className={`side-item after-info flex-row flex-center-align normal-bg-h p10 ${
            actualPage === "/3PROJ" ? " blue" : ""
          }`}
        >
          <i className="">web</i>
          {!MiniMenu ? <p className="pl10 m0">3PROJ</p> : null}
        </Link>
        {actualPage.includes("/3PROJ/") ? <div className="space"></div> : null}
      </div>

      <div className="space"></div>

      <Link
        to={`/manage-users`}
        data-title={"Manage Users"}
        className={`side-item after-info flex-row flex-center-align normal-bg-h p10 ${
          actualPage === "/manage-users" ? " blue" : ""
        }`}
      >
        <i className="">group</i>
        {!MiniMenu ? <p className="pl10 m0">Manage Users</p> : null}
      </Link>

      {!MiniMenu ? (
        <i
          className=" normal-bg-h blue-h retactor"
          onClick={() => toggleSizeMenu(true)}
        >
          first_page
        </i>
      ) : (
        <i
          className=" normal-bg-h blue-h retactor"
          onClick={() => toggleSizeMenu(false)}
        >
          last_page
        </i>
      )}
    </div>
  );
};

export default SideMenu;
