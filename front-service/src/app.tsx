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
import getCompleteUsersList from "./api-request/user/get-list-complete";
import logOut from "./api-request/user/log-out";

//? helpers
import isHttpStatusValid from "./helpers/check-status";
import displayStatusRequest from "./helpers/display-status-request";
import { getToken, removeToken } from "./helpers/token-verifier";

//? components
import Header5CPOM from "./components/header";
import SideMenu from "./components/side-menu";
import UserLogIn from "./components/user-login";
import UserRecover from "./components/user-recover";

//? pages
import HomePage1PROJ from "./pages/1PROJ/1P-index";
import HomePage2PROJ from "./pages/2PROJ/2P-index";
import HomePage3PROJ from "./pages/3PROJ/3P-index";
import DrawnListPage from "./pages/3PROJ/pages/draw-list-pages";
import DrawPage from "./pages/3PROJ/pages/draw-page";
import RoomPageById from "./pages/3PROJ/pages/room-page-by-id";
import RoomPageManagementById from "./pages/3PROJ/pages/room-page-management-by-id";
import RoomTaskPageById from "./pages/3PROJ/pages/task-page-by-id";
import HomePage from "./pages/home";
import ManageUsers from "./pages/management/manage-users";
import UserSettings from "./pages/management/user-settings-by-id";
import PageNotFound from "./pages/not-found";
import Unauthorized from "./pages/unauthorized";

//? models
import MiniUserModel from "./models/mini-user-model";
import RoomModel from "./models/room-model";
import TaskModel from "./models/tasks-model";
import UserModel from "./models/user-model";

//? mocks
import voidRoom from "./models/mocks/void-room";
import voidTask from "./models/mocks/void-task";
import voidUser from "./models/mocks/void-user";
import getRoomsList from "./api-request/room/get-all";
import getTasksList from "./api-request/task/get-all";

const App: FunctionComponent = () => {
  const [isLog, setIsLog] = useState<string | Boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserModel>(voidUser);
  const [usersList, setUsersList] = useState<MiniUserModel[]>([]);

  const [CompleteUsersList, setCompleteUsersList] = useState<UserModel[]>([voidUser]);
  const [TasksList, setTasksList] = useState<TaskModel[]>([voidTask]);
  const [RoomsList, setRoomsList] = useState<RoomModel[]>([voidRoom]);

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
          getRoomsList().then((result) => {
            if (isHttpStatusValid(result.status)) setRoomsList(result.response);
          })
          getTasksList().then((result) => {
            if (isHttpStatusValid(result.status)) setTasksList(result.response);
          })
          
          if (result.response.role === "admin" || result.response.role === "superAdmin") {
            getCompleteUsersList(token).then((users) => {
              if (isHttpStatusValid(users.status)) {
                setCompleteUsersList(users.response);
                setUsersList(
                  users.response.map((user: UserModel) => ({
                    _id: user._id,
                    name: user.name,
                  }))
                );
              } else displayStatusRequest("error " + users.status + " : " + users.response.message, true);
            });
          } else if (result.response.role === "user") {
            getCompleteUsersList(token).then((users) => {
              if (isHttpStatusValid(users.status)) {
                getUsersList(users.response);
              } else displayStatusRequest("error " + users.status + " : " + users.response.message, true);
            });
          } else displayStatusRequest("error  : Unreconized User", true);
        } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
      });
    }
    console.log(CompleteUsersList);
    console.log(usersList);
    console.log(RoomsList);
    console.log(TasksList);
    setIsLog(token);
  };

  const checklog = () => {
    const token = getToken();
    return token ? token : false;
  };

  const log_out = () => {
    removeToken();
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
          <Header5CPOM currentUser={currentUser} log_out={log_out} isLog={isLog} />
          <div className="flex-row">
            <div className={`w20-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <SideMenu miniMenu={toggleSizeMenu} />
            </div>
            <div className={`w80-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <Switch>
                <Route exact path="/" render={() => <HomePage currentUser={currentUser} />} />
                <Route exact path="/1PROJ" render={() => <HomePage1PROJ currentUser={currentUser} />} />{" "}
                <Route exact path="/2PROJ" render={() => <HomePage2PROJ currentUser={currentUser} />} />{" "}
                <Route
                  path="/3PROJ/room/:roomid/task/:taskid"
                  render={(props) => (
                    <RoomTaskPageById {...props} currentUser={currentUser} SetLog={SetLog} tasks={TasksList} rooms={RoomsList} userList={usersList} />
                  )}
                />
                <Route
                  path="/3PROJ/room/:roomid/manage"
                  render={(props) => (
                    <RoomPageManagementById
                      {...props}
                      currentUser={currentUser}
                      SetLog={SetLog}
                      tasks={TasksList}
                      rooms={RoomsList}
                    />
                  )}
                />
                <Route
                  path="/3PROJ/room/:roomid"
                  render={(props) => (
                    <RoomPageById {...props} currentUser={currentUser} SetLog={SetLog} tasks={TasksList} rooms={RoomsList} usersList={usersList}/>
                  )}
                />
                <Route path="/3PROJ/draw/" render={(props) => <DrawPage currentUser={currentUser} SetLog={SetLog} script={""} />} />
                <Route
                  path="/3PROJ/draw-history/"
                  render={(props) => <DrawnListPage currentUser={currentUser} SetLog={SetLog} />}
                />
                <Route
                  exact
                  path="/3PROJ"
                  render={() => (
                    <HomePage3PROJ
                      currentUser={currentUser}
                      usersList={usersList}
                      SetLog={SetLog}
                      tasks={TasksList}
                      rooms={RoomsList}
                    />
                  )}
                />
                {currentUser ? (
                  <Route
                    exact
                    path="/manage-users"
                    render={() =>
                      currentUser.role === "user" ? (
                        <Unauthorized />
                      ) : (
                        <ManageUsers users={CompleteUsersList} currentUser={currentUser} SetLog={SetLog} />
                      )
                    }
                  />
                ) : null}
                <Route
                  path="/user/:id"
                  render={(props) => (
                    <UserSettings
                      {...props}
                      userList={currentUser.role === "user" ? [currentUser] : CompleteUsersList}
                      SetLog={SetLog}
                    />
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
