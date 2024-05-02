import React, { FunctionComponent, useEffect, useState } from "react";

//? assets

//? API
import logIn from "../api-request/user/log-in";

//? helpers
import SignUp from "../api-request/user/sign-up";
import Logo from "../components/logo-grid";
import isHttpStatusValid from "../helpers/check-status";
import displayStatusRequest from "../helpers/display-status-request";
import { storeToken } from "../helpers/token-verifier";

//? components

//? pages

//? models

//? mocks

type Props = {
  ValidLogIn: Function;
};
const UserHeader: FunctionComponent<Props> = ({ ValidLogIn }) => {
  const [PartActive, setPartActive] = useState<string>("Log In");
  const [PasswordSame, setPasswordSame] = useState<boolean>(false);

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [CheckPassword, setCheckPassword] = useState("");
  const [UserName, setUserName] = useState("");

  const signIn = (email: string, password: string) => {
    logIn(email, password).then((result) => {
      if (isHttpStatusValid(result.status)) {
        ValidLogIn();
        storeToken(result.response.token);
      }
    });
  };

  const signUp = (email: string, password: string, name: string) => {
    SignUp(email, password, name, "user").then((result) => {
      if (isHttpStatusValid(result.status)) {
        ValidLogIn();
        storeToken(result.response.token);
      }
    });
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setUserName("");
  }, [PartActive]);

  useEffect(() => {
    setPasswordSame(CheckPassword === Password && Password.length > 7 && CheckEmail(Email) && UserName.length > 2);
  }, [CheckPassword, Password, Email, UserName]);

  const CheckEmail = (email: string): boolean => {
    // Expression régulière pour valider une adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="user-login flex-center-justify">
      <span className="absolute flex-center h100 blur">
        <Logo sizeblocs={7} hover={false} />
      </span>
      <div className="bloc w20">
        <div className="blur-dark-bg"></div>
        <div className="log-container flex-col g25 flex-center mb25 relative zi1">
          <Logo sizeblocs={1} hover={false} />
          <div className="flex-center flex-col w80">
            <h2 className="blue">5PCON </h2>
            <div className="flex-around flex-start-align w100 mt10">
              <div
                className={`cta ${PartActive === "Log In" ? "cta-full-blue" : "cta-blue"}`}
                onClick={() => setPartActive("Log In")}
              >
                Log In
              </div>
              <div
                className={`cta ${PartActive === "Sign Up" ? "cta-full-blue" : "cta-blue"}`}
                onClick={() => setPartActive("Sign Up")}
              >
                Sign Up
              </div>
            </div>
          </div>
          {PartActive === "Log In" ? (
            <form className="flex-col g15 flex-center w100 display-from-left relative zi1">
              <div className="form flex-col w100">
                <p className="title mt0">Email</p>
                <input className="input" type="text" onChange={(e) => setEmail(e.target.value)} />
                <p className="title">Password</p>
                <input className="input" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="cta cta-blue mlauto" onClick={() => signIn(Email, Password)}>
                Log In
              </div>
            </form>
          ) : null}

          {PartActive === "Sign Up" ? (
            <form className="flex-col g15 flex-center w100 display-from-right relative zi1">
              <div className="form flex-col w100">
                <p className="title">User Name</p>
                <input className="input" type="text" onChange={(e) => setUserName(e.target.value)} />
                <p className="title">Email</p>
                <input className="input" type="text" onChange={(e) => setEmail(e.target.value)} />
                <p className="title">Password</p>
                <input className="input" type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                <p className="title">Confirm Password</p>
                <input
                  className="input"
                  type="password"
                  name="validpassword"
                  onChange={(e) => setCheckPassword(e.target.value)}
                />
              </div>

              {PasswordSame ? null : (
                <p className="red m0">
                  Password are not the same
                  <br /> Password must be a least 8 characters
                </p>
              )}

              {PasswordSame ? (
                <div className="cta cta-blue mlauto" onClick={() => signUp(Email, Password, UserName)}>
                  Sign Up
                </div>
              ) : (
                <div className="cta cta-disable mlauto" onClick={() => signUp(Email, Password, UserName)}>
                  <span>Sign Up</span>
                </div>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default UserHeader;
