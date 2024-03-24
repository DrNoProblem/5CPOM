import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";

//? assets
import "./style.scss";

//? API
import logIn from "../../api-request/user/log-in";

//? helpers
import isHttpStatusValid from "../../helpers/check-status";
import displayStatusRequest from "../../helpers/display-status-request";
import Logo from "../logo-grid";
import { storeToken } from "../../helpers/token-verifier";

//? components

//? pages

//? models

//? mocks

type Props = {
  ValidLogIn: Function;
};
const UserHeader: FunctionComponent<Props> = ({ ValidLogIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (email: string, password: string) => {
    logIn(email, password).then((result) => {
      if (isHttpStatusValid(result.status)) {
        storeToken(result.response.token);
        ValidLogIn();
      } else
        displayStatusRequest(
          "error " + result.status + " : " + result.response.message,
          true
        );
    });
  };

  return (
    <div className="user-login flex-center">
      <div className="bloc w20 small-dark-container">
        <div className="flex-col flex-start-justify g25 flex-center mb25">
          <Logo sizeblocs={1} hover={false} />
          <div className="flex-center  flex-start-align flex-col">
            <h2 className="blue">5CPOM </h2>
            <h2 className="">Log In</h2>
          </div>
        </div>

        <form className="flex-col g15 flex-center w100">
          <div className="form flex-col w100">
            <p className="title mt0">Email</p>
            <input
              className="input"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="title">Password</p>
            <input
              className="input"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="button flex-col w100">
{/*             <Link to="/recover" className="forget mb25">
              <span>Foreget password ?</span>
            </Link> */}
            <div
              className="cta mlrauto cta-blue"
              onClick={() => signIn(email, password)}
            >
              Sign In
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserHeader;
