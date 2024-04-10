import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import voidUser from "../models/mocks/void-user";
import UserModel from "../models/user-model";

type Props = {
  currentUser: UserModel;
};

const HomePage: FC<Props> = ({ currentUser }) => {
  const [user, setUser] = useState<UserModel>(voidUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <h2 className="">Projects :</h2>
        <div className="flex-wrap g25 w80 mb15 flex-center-align">
          <Link className="home-tile dark-container" to={"/1PROJ"}>
            <span className="ml15 mr15">1PROJ</span>
          </Link>

          <Link className="home-tile dark-container" to={"/2PROJ"}>
            <span className="ml15 mr15">2PROJ</span>
          </Link>

          <Link className="home-tile dark-container" to={"/3PROJ"}>
            <span className="ml15 mr15">3PROJ</span>
          </Link>
        </div>
      </div>

      {user && user.role === "admin" ? (
        <div className="flex-col g25 w100">
          <h2 className="">Admin management :</h2>
          <div className="flex-wrap g25 w80">
            <Link className="home-tile dark-container" to={"/manage-users"}>
              <span className="ml15 mr15">manage users</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage;
