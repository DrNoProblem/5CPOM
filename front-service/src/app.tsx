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
import getRoomsList from "./api-request/room/room-get-all";
import getTasksList from "./api-request/task/task-get-all";
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
import UserRecover from "./components/user-recover";
import UserLogIn from "./pages/authentification";

//? pages
import HomePage1PROJ from "./pages/1PROJ/1P-index";
import HomePage2PROJ from "./pages/2PROJ/2P-index";
import HomePage3PROJ from "./pages/3PROJ/3P-index";
import DrawnListPage from "./pages/3PROJ/pages/draw-list-pages";
import DrawPage from "./pages/3PROJ/pages/draw-new-page";
import DrawPageById from "./pages/3PROJ/pages/draw-page-by-id";
import RoomPageById from "./pages/3PROJ/pages/room-page-by-id";
import RoomTaskPageById from "./pages/3PROJ/pages/task-page-by-id";
import HomePage from "./pages/home";
import ManageUsers from "./pages/management/manage-users";
import UserSettings from "./pages/management/user-settings-by-id";
import PageNotFound from "./pages/not-found";
import Unauthorized from "./pages/unauthorized";

//? models
import getDrawsList from "./api-request/draw/draw-get-all";
import DataModel from "./models/data-model";
import DrawModel from "./models/draw-model";
import MiniUserModel from "./models/mini-user-model";
import RoomModel from "./models/room-model";
import TaskModel from "./models/tasks-model";
import UserModel from "./models/user-model";

//? mocks
import voidUser from "./models/mocks/void-user";
import CardModel from "./models/card-model";
import DeckEdition from "./pages/2PROJ/deck-edition";
import GameBoard from "./pages/2PROJ/components/game-board";
import FindOpponentLocal from "./pages/2PROJ/find-opponent-local";
import getCardsList from "./api-request/card/card-get-all";

const App: FunctionComponent = () => {
  const [isLog, setIsLog] = useState<string | Boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserModel>(voidUser);

  const [Data, setData] = useState<DataModel>();

  useEffect(() => {
    SetLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SetLog = () => {
    const token = checklog();

    console.log(token);

    if (token) {
      getCurrent(token).then((CurrentUserResult) => {
        if (isHttpStatusValid(CurrentUserResult.status)) {
          setCurrentUser(CurrentUserResult.response);

          let usersPromise;
          if (CurrentUserResult.response.role === "admin" || CurrentUserResult.response.role === "superAdmin") {
            usersPromise = getCompleteUsersList();
          } else if (CurrentUserResult.response.role === "user") {
            usersPromise = getUsersList();
          } else displayStatusRequest("error  : Unreconized User", true);

          Promise.all([getRoomsList(), getTasksList(), getDrawsList(), getCardsList(), usersPromise])
            .then((results) => {
              const [RoomsResult, TasksResult, DrawsResult, CardsResult, UsersResult] = results;

              let RoomsList: RoomModel[] = [];
              let TasksList: TaskModel[] = [];
              let DrawsList: DrawModel[] = [];
              let CardList: CardModel[] = [];
              let UsersList: UserModel[] | MiniUserModel[] = [];

              if (isHttpStatusValid(RoomsResult.status)) RoomsList = RoomsResult.response;
              if (isHttpStatusValid(TasksResult.status)) TasksList = TasksResult.response;
              if (isHttpStatusValid(DrawsResult.status)) DrawsList = DrawsResult.response;
              if (isHttpStatusValid(DrawsResult.status)) CardList = CardsResult.response;
              if (isHttpStatusValid(UsersResult.status)) UsersList = UsersResult.response;

              console.log({
                rooms: RoomsList,
                tasks: TasksList,
                draws: DrawsList,
                cards: CardList,
                users: UsersList,
              });
              setData({
                rooms: RoomsList,
                tasks: TasksList,
                draws: DrawsList,
                cards: CardList,
                users: UsersList,
              });
            })
            .catch((error) => {
              displayStatusRequest("error : " + error, true);
            });
        } else displayStatusRequest("error " + CurrentUserResult.status + " : " + CurrentUserResult.response.message, true);
      });
    }
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

  if (checklog() && currentUser && Data) {
    return (
      <Router>
        <div>
          <Header5CPOM currentUser={currentUser} log_out={log_out} isLog={isLog} />
          <div className="flex-row">
            <div className={`menu-content-area w20-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <SideMenu miniMenu={toggleSizeMenu} />
            </div>
            <div className={`page-content-area w80-tab${MiniMenu ? " side-menu-mini" : ""}`}>
              <Switch>
                <Route exact path="/" render={() => <HomePage currentUser={currentUser} />} />
                <Route exact path="/1PROJ" render={() => <HomePage1PROJ currentUser={currentUser} />} />
                <Route exact path="/2PROJ" render={() => <HomePage2PROJ currentUser={currentUser} Data={Data} />} />
                <Route
                  exact
                  path="/2PROJ/find-local"
                  render={() => <FindOpponentLocal currentUser={currentUser} Data={Data} />}
                />
                <Route exact path="/2PROJ/deck" render={() => <DeckEdition currentUser={currentUser} />} />
                <Route
                  path="/3PROJ/room/:roomid/task/:taskid"
                  render={(props) => <RoomTaskPageById {...props} currentUser={currentUser} SetLog={SetLog} Data={Data} />}
                />
                <Route
                  path="/3PROJ/room/:roomid"
                  render={(props) => <RoomPageById {...props} currentUser={currentUser} SetLog={SetLog} Data={Data} />}
                />
                <Route
                  path="/3PROJ/draw/:drawid"
                  render={(props) => <DrawPageById {...props} currentUser={currentUser} SetLog={SetLog} Data={Data} />}
                />
                <Route
                  path="/3PROJ/draw/"
                  render={() => <DrawPage currentUser={currentUser} SetLog={SetLog} script={""} Data={Data} />}
                />
                <Route
                  path="/3PROJ/draw-history/"
                  render={() => <DrawnListPage currentUser={currentUser} SetLog={SetLog} Data={Data} />}
                />
                <Route
                  exact
                  path="/3PROJ"
                  render={() => (
                    <HomePage3PROJ
                      currentUser={currentUser}
                      SetLog={SetLog}
                      tasks={Data.tasks}
                      rooms={Data.rooms}
                      usersList={Data.users}
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
                        <ManageUsers users={Data.users as UserModel[]} currentUser={currentUser} SetLog={SetLog} />
                      )
                    }
                  />
                ) : null}
                <Route
                  path="/user/:id"
                  render={(props) => (
                    <UserSettings
                      {...props}
                      userList={currentUser.role === "user" ? [currentUser] : (Data.users as UserModel[])}
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
