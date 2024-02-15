import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Logo from "../logo-grid";
import "./style.scss";

const UserHeader: FunctionComponent = () => {
  return (
    <div className="user-recover flex-center">
      <div className="bloc w20">
        <div className="flex-col flex-start-justify g25 flex-center mb25 mt25">
          <Logo sizeblocs={1} hover={false} />
          <div className="flex-center  flex-start-align flex-col">
            <h2 className="m0 blue">CMS HD</h2>
            <h2 className="m0">Recover password</h2>
          </div>
        </div>

        <form className="flex-col g15 flex-center w100">
          <div className="form flex-col w100">
            <p className="title mt0">Email</p>
            <input
              className="input"
              type="text"
              onChange={(e) => console.log(e)}
            />
          </div>

          <div className="button flex-row mt35 w100">
            <Link to="/login" className="cta mlrauto cta-blue">
              Back to Sign In
            </Link>
            <div
              className="cta mlrauto cta-blue"
              onClick={(e) => console.log(e)}
            >
              Send email
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserHeader;
