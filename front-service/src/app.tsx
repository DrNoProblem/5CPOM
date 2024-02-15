import Cookies from "js-cookie";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

//? assets
import "./assets/css/animations.scss";
import "./assets/css/doc-le-roux.scss";
import "./assets/css/font.scss";
import "./assets/css/style-mob.scss";
import "./assets/css/style-tab.scss";
import "./assets/css/style.scss";

//? API REQUEST
import getCurrent from "./api-request/user/get-current";
import getUsersList from "./api-request/user/get-list";
import logOut from "./api-request/user/log-out";

//? helpers
import isHttpStatusValid from "./helpers/check-status";

//? components
import HeaderCMS from "./components/header";
import SideMenu from "./components/side-menu";
import UserLogIn from "./components/user-login";
import UserRecover from "./components/user-recover";

//? pages
import PageNotFound from "./not-found";
import HomePage1PROJ from "./pages/1PROJ/1P-index";
import HomePage2PROJ from "./pages/2PROJ/2P-index";
import HomePage3PROJ from "./pages/3PROJ/3P-index";
import HomePage from "./pages/home";
import ManageUsers from "./pages/management/manage-users";
import UserSettings from "./pages/management/user-settings-by-id";

//? models
import User from "./models/user-model";

//? mocks
import displayStatusRequest from "./helpers/display-status-request";
import voidUser from "./models/mocks/void-user";

const App: FunctionComponent = () => {
  const [isLog, setIsLog] = useState<string | Boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([voidUser]);

  useEffect(() => {
    SetLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SetLog = () => {
    const token = checklog();

    console.log(token);

    if (token) {
      getCurrent(token).then((result) => {
        if (isHttpStatusValid(result.status)) {
          setCurrentUser(result.response);
          if (result.response.role === "admin") {
            getUsersList(token).then((users) => {
              if (isHttpStatusValid(users.status)) setUsers(users.response);
              else
                displayStatusRequest(
                  "error " + users.status + " : " + users.response.message,
                  true
                );
            });
          } else if (result.response.role === "user") {
          } else displayStatusRequest("error  : Unreconized User", true);
        } else
          displayStatusRequest(
            "error " + result.status + " : " + result.response.message,
            true
          );
      });
    }
    setIsLog(token);
  };

  const checklog = () => {
    const token = Cookies.get("token");
    return token ? token : false;
  };

  const log_out = () => {
    Cookies.remove("token");
    logOut().then(() => {
      setIsLog(false);
      setCurrentUser(voidUser);
    });
  };

  const [MiniMenu, setMiniMenu] = useState<Boolean>(false);
  const toggleSizeMenu = (value: boolean) => {
    setMiniMenu(value);
  };

  if (checklog() && currentUser) {
    return (
      <Router>
        <div>
          <HeaderCMS
            currentUser={currentUser}
            log_out={log_out}
            isLog={isLog}
          />
          <div className="flex-row">
            <div className={`w20-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <SideMenu miniMenu={toggleSizeMenu} />
            </div>
            <div className={`w80-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <HomePage currentUser={currentUser} />}
                />
                <Route
                  exact
                  path="/1PROJ"
                  render={() => <HomePage1PROJ currentUser={currentUser} />}
                />{" "}
                <Route
                  exact
                  path="/2PROJ"
                  render={() => <HomePage2PROJ currentUser={currentUser} />}
                />{" "}
                <Route
                  exact
                  path="/3PROJ"
                  render={() => <HomePage3PROJ currentUser={currentUser} />}
                />
                <Route
                  exact
                  path="/manage-users"
                  render={() => (
                    <ManageUsers
                      users={users}
                      currentUser={currentUser}
                      SetLog={SetLog}
                    />
                  )}
                />
                <Route
                  path="/user/:id"
                  render={(props) => (
                    <UserSettings {...props} userList={users} SetLog={SetLog} />
                  )}
                />
                <Route component={PageNotFound}></Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/recover" render={() => <UserRecover />} />
          <Route render={() => <UserLogIn ValidLogIn={SetLog} />}></Route>
        </Switch>
      </Router>
    );
  }
};

export default App;
