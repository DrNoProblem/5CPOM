import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../api-request/user/sign-up";
import isHttpStatusValid from "../../helpers/check-status";
import displayStatusRequest from "../../helpers/display-status-request";
import MiniUserModel from "../../models/mini-user-model";
import voidRoom from "../../models/mocks/void-room";
import voidTask from "../../models/mocks/void-task";
import voidUser from "../../models/mocks/void-user";
import RoomModel from "../../models/room-model";
import TaskModel from "../../models/tasks-model";
import UserModel from "../../models/user-model";
import "./3P-style.scss";

import TableRenderSubmitStatusComp from './components/table-render-submit-status';
import TableRoomUsersComp from './components/table-room-users';

type Props = {
  currentUser: UserModel;
  SetLog: Function;
  usersList: MiniUserModel[];
  rooms: RoomModel[];
  tasks: TaskModel[];
};

interface renderModel {
  taskId: string;
  roomId: string;
  roomName: string;
  taskTitle: string;
  taskDate: Date;
  renderStatus: boolean;
}

const HomePage3PROJ: FC<Props> = ({ currentUser, SetLog, usersList, tasks, rooms }) => {
  const [CurrentUser, setCurrentUser] = useState<UserModel>(voidUser);
  const [RoomList, setRoomList] = useState<RoomModel[]>([voidRoom]);
  const [TaskList, setTaskList] = useState<TaskModel[]>([voidTask]);

  useEffect(() => {
    setCurrentUser(currentUser);
    setRoomList(rooms);
    setTaskList(tasks);
  }, [currentUser, tasks, rooms]);

  const [PopUpActive, setPopUpActive] = useState<false | { check: string; title: string; second: false | string }>(false);
  const [SelectUsersActive, setSelectUsersActive] = useState<Boolean>(false);
  const [ChooseCoOwnerActive, setChooseCoOwnerActive] = useState<Boolean>(false);

  const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

  const [SelectRoomName, setSelectRoomName] = useState<string | "">("");
  const [SelectCoOwner, setSelectCoOwner] = useState<MiniUserModel | null>(null);
  const [SelectUsers, setSelectUsers] = useState<MiniUserModel[]>([]);

  var objectFiledAddUser: any = {
    name: SelectRoomName,
    owner: CurrentUser._id,
    co_owner: SelectCoOwner ? SelectCoOwner.name : null,
    users: SelectUsers.map((e) => e._id),
  };

  useEffect(() => {
    setReadyToSend(areAllPropertiesEmpty(objectFiledAddUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectRoomName, SelectCoOwner, SelectUsers]);

  const areAllPropertiesEmpty = (obj: any) => {
    if (obj.name === "") return false;
    if (obj.co_owner === null) return false;
    return true;
  };

  const AddNewRoom = (body: any) => {
    console.log(body);
    if (areAllPropertiesEmpty(body)) {
      SignUp(body.email, body.name, body.password, body.role).then((result) => {
        if (isHttpStatusValid(result.status)) {
          displayStatusRequest("user added successfully", false);
          SetLog();
          setPopUpActive(false);
        } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
      });
    } else displayStatusRequest("error : ", true);
  };

  function IsSelectedUser(id: string) {
    return SelectUsers.some((user) => user._id === id);
  }
  const renderList: renderModel[] = RoomList.flatMap((room: RoomModel) =>
    room.users.some((user) => user === CurrentUser._id)
      ? room.tasks.map((taskid) => {
          const task = TaskList.find((e) => e._id === taskid);
          console.log(room);
          console.log(task);
          if (!task) {
            console.error(`Task with id ${taskid} not found`);
            return null;
          }
          return {
            taskId: taskid,
            roomId: room._id,
            roomName: room.name,
            taskTitle: task.title,
            taskDate: task.datelimit,
            renderStatus: task.renders.some((r) => r.id === CurrentUser._id),
          };
        })
      : []
  ).filter((item) => item !== null) as renderModel[]; // Add a type assertion here

  console.log(renderList);

  return (
    <div className="main p20 flex-col flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">3PROJ :</h2>
        </div>

        <div className="flex-between flex-row g25">
          <div className="flex-col dark-container display-from-left w25">
            <div className="flex-wrap g15 rapid-tool mb15">
              <Link className="cta cta-normal cta-blue-h" to={"/3PROJ/draw/"}>
                <i className="material-icons">gesture</i>
                <span>Draw</span>
              </Link>
              <Link className="cta cta-normal cta-blue-h" to={"/3PROJ/draw-history"}>
                <i className="material-icons">history</i>
                <span>Draw history</span>
              </Link>
              <div
                className="cta cta-normal cta-blue-h"
                onClick={() => {
                  setPopUpActive({ title: "Create new room", check: "add_room", second: false });
                  setSelectCoOwner(null);
                  setSelectUsers([]);
                }}
              >
                <i className="material-icons">add</i>
                <span>Create room</span>
              </div>
            </div>

            <h2>Open complete List :</h2>

            <div className="flex-wrap g15">
              <div
                className="cta cta-normal cta-blue-h"
                onClick={() => {
                  setPopUpActive({ check: "render", title: "List of tasks rendered", second: "list of task to render" });
                  setSelectCoOwner(null);
                  setSelectUsers([]);
                }}
              >
                <i className="material-icons">open_in_new</i>
                <span>Renders</span>
              </div>
              <div
                className="cta cta-normal cta-blue-h"
                onClick={() => {
                  setPopUpActive({ check: "all_room", title: "List of all rooms", second: false });
                  setSelectCoOwner(null);
                  setSelectUsers([]);
                }}
              >
                <i className="material-icons">open_in_new</i>
                <span>All rooms</span>
              </div>
              <div
                className="cta cta-normal cta-blue-h"
                onClick={() => {
                  setPopUpActive({ check: "owner_room", title: "List of owned rooms", second: false });
                  setSelectCoOwner(null);
                  setSelectUsers([]);
                }}
              >
                <i className="material-icons">open_in_new</i>
                <span>Owned rooms</span>
              </div>
            </div>
          </div>

          <div className="dark-container table-list w75">
            <h2>
              List of renders to submit :
              <i
                className="material-icons absolute r0 mr25 blue-h"
                onClick={() => {
                  setPopUpActive({ check: "render", title: "List of tasks rendered", second: "list of task to render" });
                  setSelectCoOwner(null);
                  setSelectUsers([]);
                }}
              >
                open_in_new
              </i>
            </h2>
            <TableRenderSubmitStatusComp limite={3} tableList={renderList} submit={false} />
          </div>
        </div>

        <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
          <h2 className="">
            List of owned rooms :
            <i
              className="material-icons absolute r0 mr25 blue-h"
              onClick={() => {
                setPopUpActive({ check: "owner_room", title: "List of owned rooms", second: false });
                setSelectCoOwner(null);
                setSelectUsers([]);
              }}
            >
              open_in_new
            </i>
          </h2>
          <TableRoomUsersComp limite={3} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={true} />
        </div>

        <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
          <h2 className="">
            List of all rooms :
            <i
              className="material-icons absolute r0 mr25 blue-h"
              onClick={() => {
                setPopUpActive({ check: "all_room", title: "List of all rooms", second: false });
                setSelectCoOwner(null);
                setSelectUsers([]);
              }}
            >
              open_in_new
            </i>
          </h2>
          <TableRoomUsersComp limite={3} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={false} />
        </div>

        {!PopUpActive ? null : (
          <div className="add-item-popup">
            <div
              className="dark-background"
              onClick={() => {
                setPopUpActive(false);
                setChooseCoOwnerActive(false);
                setSelectUsersActive(false);
              }}
            ></div>
            <div className="dark-container flex-col relative display-from-left zi2 w100">
              <i
                className="material-icons red-h absolute r0 mr50"
                onClick={() => {
                  setPopUpActive(false);
                  setChooseCoOwnerActive(false);
                  setSelectUsersActive(false);
                }}
              >
                close
              </i>
              <h2 className="">{PopUpActive.title} :</h2>

              {PopUpActive.check === "add_room" ? (
                <div className="flex-col adding-room">
                  <p className="m0 mb20 mt20">Room name :</p>
                  <input className="input" name="username" type="text" autoComplete="no-chrome-autofill" onChange={(e) => setSelectRoomName(e.target.value)} />

                  <div className="flex-bet mb25">
                    <div className="flex-col w50">
                      <p className="m0 mb20 mt20 flex-center-align">
                        <i className="material-icons mr10">person</i>
                        Co-Owner :
                      </p>
                      {SelectCoOwner ? (
                        <ul className="m0 users-list-to-add viewnoscrool">
                          {SelectCoOwner ? (
                            <li>
                              <span title={SelectCoOwner.name}>{SelectCoOwner.name}</span>
                              <i
                                className="material-icons mlauto"
                                onClick={() => {
                                  setChooseCoOwnerActive(true);
                                  setSelectUsersActive(false);
                                }}
                              >
                                sync_alt
                              </i>
                            </li>
                          ) : null}
                        </ul>
                      ) : null}
                      {SelectCoOwner ? null : (
                        <div
                          className="cta cta-normal cta-blue-h mrauto"
                          onClick={() => {
                            setChooseCoOwnerActive(!ChooseCoOwnerActive);
                            setSelectUsersActive(false);
                          }}
                        >
                          <i className="material-icons">person_add_alt_1</i>
                          <span>Choose user</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-col w50">
                      <p className="m0 mb20 mt20 flex-center-align">
                        <i className="material-icons mr10">groups</i>
                        Users :
                      </p>
                      {SelectUsers.length !== 0 ? (
                        <ul className="m0 users-list-to-add">
                          {SelectUsers.map((user) => (
                            <li key={user._id}>
                              <span title={user.name}>{user.name}</span>
                              <i className="material-icons mlauto" onClick={() => setSelectUsers(SelectUsers.filter((e) => e._id !== user._id))}>
                                delete
                              </i>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {SelectUsers.length !== 0 ? (
                        <div
                          className="cta cta-normal cta-blue-h mrauto"
                          onClick={() => {
                            setSelectUsersActive(!SelectUsersActive);
                            setChooseCoOwnerActive(false);
                          }}
                        >
                          <i className="material-icons">person_add_alt_1</i>
                          <span>Add users</span>
                        </div>
                      ) : (
                        <div
                          className="cta cta-normal cta-blue-h mrauto"
                          onClick={() => {
                            setSelectUsersActive(!SelectUsersActive);
                            setChooseCoOwnerActive(false);
                          }}
                        >
                          <i className="material-icons">person_add_alt_1</i>
                          <span>Choose users</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {ReadyToSend ? (
                    <div className="cta mtauto mlauto cta-blue to-right-bottom" onClick={() => AddNewRoom(objectFiledAddUser)}>
                      <span>CREATE ROOM</span>
                    </div>
                  ) : (
                    <div className="cta mtauto mlauto cta-disable to-right-bottom">
                      <span>CREATE ROOM</span>
                    </div>
                  )}
                </div>
              ) : null}

              {PopUpActive.check === "all_room" ? <TableRoomUsersComp limite={9999999999} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={false} /> : null}
              {PopUpActive.check === "owner_room" ? <TableRoomUsersComp limite={9999999999} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={true} /> : null}
              {PopUpActive.check === "render" ? (
                <div className="flex-col">
                  <TableRenderSubmitStatusComp limite={9999999999} tableList={renderList} submit={false} />
                  <h2 className="mt30">{PopUpActive.second} :</h2>
                  <TableRenderSubmitStatusComp limite={9999999999} tableList={renderList} submit={true} />
                </div>
              ) : null}
              {SelectUsersActive ? (
                <div className="SelectUsersWindow dark-container w50">
                  <p className="mt0 flex-center flex-bet">
                    Select users :
                    <i className="material-icons" onClick={() => setSelectUsersActive(!SelectUsersActive)}>
                      close
                    </i>
                  </p>
                  <ul className="SelectUsersList">
                    {usersList
                      ? usersList.map((user) =>
                          user._id !== (SelectCoOwner ? SelectCoOwner._id : null) ? (
                            IsSelectedUser(user._id) ? (
                              <li key={user._id} className="blue flex-center-align" onClick={() => setSelectUsers(SelectUsers.filter((e) => e._id !== user._id))}>
                                <i className="material-icons blue mr10">done</i>
                                {user.name}
                              </li>
                            ) : (
                              <li key={user._id} className="flex-center-align" onClick={() => setSelectUsers([...SelectUsers, user])}>
                                <i className="material-icons op0 mr10">done</i>
                                {user.name}
                              </li>
                            )
                          ) : null
                        )
                      : null}
                  </ul>
                </div>
              ) : null}
              {ChooseCoOwnerActive ? (
                <div className="SelectUsersWindow dark-container w50">
                  <p className="mt0 flex-center flex-bet">
                    Choose a user :
                    <i className="material-icons" onClick={() => setChooseCoOwnerActive(!ChooseCoOwnerActive)}>
                      close
                    </i>
                  </p>
                  <ul className="SelectUsersList">
                    {usersList
                      ? usersList.map((user) =>
                          SelectCoOwner && user._id === SelectCoOwner._id ? (
                            <li key={user._id} className="blue flex-center-align" onClick={() => setSelectCoOwner(null)}>
                              <i className="material-icons blue mr10">done</i>
                              {user.name}
                            </li>
                          ) : (
                            <li
                              key={user._id}
                              className="flex-center-align"
                              onClick={() => {
                                setSelectCoOwner(user);
                                setSelectUsers(SelectUsers.filter((e) => e._id !== user._id));
                                setChooseCoOwnerActive(false);
                              }}
                            >
                              <i className="material-icons op0 mr10">done</i>
                              {user.name}
                            </li>
                          )
                        )
                      : null}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage3PROJ;
