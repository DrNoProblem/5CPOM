import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../api-request/user/sign-up";
import isHttpStatusValid from "../../helpers/check-status";
import displayStatusRequest from "../../helpers/display-status-request";
import getNameById from "../../helpers/getNameById";
import MiniUserModel from "../../models/mini-user-model";
import RoomModel from "../../models/room-model";
import TaskModel from "../../models/tasks-model";
import UserModel from "../../models/user-model";
import "./3P-style.scss";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
  usersList: MiniUserModel[];
  rooms: RoomModel[];
  tasks: TaskModel[];
};

interface renderModel {
  taskId: string;
  roomName: string;
  taskTitle: string;
  taskDate: Date;
  renderStatus: boolean;
}

const RenderTableComponent: FunctionComponent<{
  limite: number;
  tableList: renderModel[];
}> = ({ limite, tableList }) => {
  return (
    <ul className="table-list flex-col mb0 ">
      <li className="legend">
        <div className="flex-row">
          <div className="flex-row flex-start-align flex-bet w100">
            <p className="w40">ROOM</p>
            <p className="w40">TASK</p>
            <p className="w20">DATE</p>
          </div>
          <i className={`material-icons mtbauto flex-center op0`}>expand_more</i>
        </div>
      </li>

      {tableList
        ? tableList.map((e, index) =>
            index < limite ? (
              <li key={e.taskId}>
                <Link to="" className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-bet w100">
                    <p className="w40">{e.roomName}</p>
                    <p className="w40">{e.taskTitle}</p>
                    <p className="w20">{e.taskDate instanceof Date ? e.taskDate.toLocaleDateString() : e.taskDate}</p>
                  </div>
                  <i className={`material-icons mtbauto flex-center`}>task_alt</i>
                </Link>
              </li>
            ) : null
          )
        : null}
    </ul>
  );
};

const RoomsTableViewComponent: FunctionComponent<{
  limite: number;
  RoomList: RoomModel[];
  usersList: MiniUserModel[];
  currentUser: UserModel;
  owner: boolean;
}> = ({ limite, RoomList, usersList, currentUser, owner }) => {
  let count: number = 0;
  return (
    <ul className="table-list flex-col mb0">
      <li className="legend">
        <div className="flex-row flex-bet">
          <div className="flex-row flex-start-align flex-start-justify w100">
            <p className="w20">ROOM NAME</p>
            <p className="w20">OWNER</p>
            <p className="w20">CO-OWNER</p>
            <p className="w20">USERS COUNT</p>
            <p className="w20">TASKS COUNT</p>
          </div>
        </div>
      </li>
      {RoomList &&
        RoomList.map((room: RoomModel) => {
          if ((room.owner === currentUser._id || room.co_owner === currentUser._id) && count < limite && owner) {
            count++;
            return (
              <li key={room._id + "userlist"}>
                <Link to={`/3PROJ/room/` + room._id} className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w100">
                    <p className="w20">{room.name}</p>
                    <p className="w20">{getNameById(room.owner, usersList)}</p>
                    <p className="w20">{getNameById(room.co_owner, usersList)}</p>
                    <p className="w20">{room.users.length}</p>
                    <p className="w20">{room.tasks.length}</p>
                  </div>
                </Link>
              </li>
            );
          }

          if ((room.owner !== currentUser._id || room.co_owner !== currentUser._id) && count < limite && !owner) {
            count++;
            return (
              <li key={room._id + "userlist"}>
                <Link to={`/3PROJ/room/` + room._id} className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w100">
                    <p className="w20">{room.name}</p>
                    <p className="w20">{getNameById(room.owner, usersList)}</p>
                    <p className="w20">{getNameById(room.co_owner, usersList)}</p>
                    <p className="w20">{room.users.length}</p>
                    <p className="w20">{room.tasks.length}</p>
                  </div>
                </Link>
              </li>
            );
          }
          return null; // Retourner null si les conditions ne sont pas remplies
        })}
    </ul>
  );
};

const HomePage3PROJ: FunctionComponent<Props> = ({ currentUser, SetLog, usersList, tasks, rooms }) => {
  const [RoomList, setRoomList] = useState<RoomModel[]>(rooms);
  const [TaskList, setTaskList] = useState<TaskModel[]>(tasks);

  const [PopUpActive, setPopUpActive] = useState<false | { check: string; title: string; second: false | string }>(false);
  const [SelectUsersActive, setSelectUsersActive] = useState<Boolean>(false);
  const [ChooseCoOwnerActive, setChooseCoOwnerActive] = useState<Boolean>(false);

  const [OwnedRoomActive, setOwnedRoomActive] = useState<Boolean>(true);
  const [Roomctive, setRoomctive] = useState<Boolean>(true);

  const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

  const [SelectRoomName, setSelectRoomName] = useState<string | "">("");
  const [SelectCoOwner, setSelectCoOwner] = useState<MiniUserModel | null>(null);
  const [SelectUsers, setSelectUsers] = useState<MiniUserModel[]>([]);

  var objectFiledAddUser: any = {
    name: SelectRoomName,
    owner: currentUser._id,
    co_owner: SelectCoOwner ? SelectCoOwner.name : null,
    users: SelectUsers.map((e) => e.id),
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
    return SelectUsers.some((user) => user.id === id);
  }

  const renderList: renderModel[] = RoomList.flatMap((room: RoomModel) =>
    room.users.some((user) => user === currentUser._id)
      ? room.tasks.map((taskid) => {
          const task = TaskList.find((e) => e.id === taskid);
          if (!task) {
            console.error(`Task with id ${taskid} not found`);
            return null;
          }
          return {
            taskId: taskid,
            roomName: room.name,
            taskTitle: task.title,
            taskDate: task.datelimit,
            renderStatus: !!task.renders.find((r) => r.id === currentUser._id),
          };
        })
      : []
  ).filter((item) => item !== null) as renderModel[]; // Add a type assertion here

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
          <div className="flex-col small-dark-container display-from-left w25">
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

          <div className="small-dark-container table-list w75">
            <h2>
              List of renders :
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
            <RenderTableComponent limite={3} tableList={renderList} />
          </div>
        </div>

        <div className="table-list flex-col p50 dark-bg small-dark-container display-from-left">
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
          <RoomsTableViewComponent limite={3} RoomList={RoomList} usersList={usersList} currentUser={currentUser} owner={true} />
        </div>

        <div className="table-list flex-col p50 dark-bg small-dark-container display-from-left">
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
          <RoomsTableViewComponent limite={3} RoomList={RoomList} usersList={usersList} currentUser={currentUser} owner={false} />
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
            <div className="small-dark-container flex-col relative display-from-left zi2 w100">
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
                  <input
                    className="input"
                    name="username"
                    type="text"
                    autoComplete="no-chrome-autofill"
                    onChange={(e) => setSelectRoomName(e.target.value)}
                  />

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
                            <li key={user.id}>
                              <span title={user.name}>{user.name}</span>
                              <i
                                className="material-icons mlauto"
                                onClick={() => setSelectUsers(SelectUsers.filter((e) => e.id !== user.id))}
                              >
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

              {PopUpActive.check === "owner_room" ? (
                <RoomsTableViewComponent
                  limite={9999999999}
                  RoomList={RoomList}
                  usersList={usersList}
                  currentUser={currentUser}
                  owner={true}
                />
              ) : null}
              {PopUpActive.check === "all_room" ? (
                <RoomsTableViewComponent
                  limite={9999999999}
                  RoomList={RoomList}
                  usersList={usersList}
                  currentUser={currentUser}
                  owner={false}
                />
              ) : null}
              {PopUpActive.check === "render" ? (
                <div className="flex-col">
                  <RenderTableComponent limite={9999999999} tableList={renderList} />
                  <h2 className="mt30">{PopUpActive.second} :</h2>
                  <RenderTableComponent limite={9999999999} tableList={renderList} />
                </div>
              ) : null}
              {SelectUsersActive ? (
                <div className="SelectUsersWindow small-dark-container w50">
                  <p className="mt0 flex-center flex-bet">
                    Select users :
                    <i className="material-icons" onClick={() => setSelectUsersActive(!SelectUsersActive)}>
                      close
                    </i>
                  </p>
                  <ul className="SelectUsersList">
                    {usersList
                      ? usersList.map((user) =>
                          user.id !== (SelectCoOwner ? SelectCoOwner.id : null) ? (
                            IsSelectedUser(user.id) ? (
                              <li
                                key={user.id}
                                className="blue flex-center-align"
                                onClick={() => setSelectUsers(SelectUsers.filter((e) => e.id !== user.id))}
                              >
                                <i className="material-icons blue mr10">done</i>
                                {user.name}
                              </li>
                            ) : (
                              <li
                                key={user.id}
                                className="flex-center-align"
                                onClick={() => setSelectUsers([...SelectUsers, user])}
                              >
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
                <div className="SelectUsersWindow small-dark-container w50">
                  <p className="mt0 flex-center flex-bet">
                    Choose a user :
                    <i className="material-icons" onClick={() => setChooseCoOwnerActive(!ChooseCoOwnerActive)}>
                      close
                    </i>
                  </p>
                  <ul className="SelectUsersList">
                    {usersList
                      ? usersList.map((user) =>
                          SelectCoOwner && user.id === SelectCoOwner.id ? (
                            <li key={user.id} className="blue flex-center-align" onClick={() => setSelectCoOwner(null)}>
                              <i className="material-icons blue mr10">done</i>
                              {user.name}
                            </li>
                          ) : (
                            <li
                              key={user.id}
                              className="flex-center-align"
                              onClick={() => {
                                setSelectCoOwner(user);
                                setSelectUsers(SelectUsers.filter((e) => e.id !== user.id));
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
