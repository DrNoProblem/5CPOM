import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../api-request/user/sign-up";
import isHttpStatusValid from "../../helpers/check-status";
import displayStatusRequest from "../../helpers/display-status-request";
import UserModel from "../../models/user-model";
import "./3P-style.scss";
import RoomModel from "../../models/room-model";
import MiniUserModel from "../../models/mini-user-model";
import { runInThisContext } from "vm";

type Props = {
  currentUser: UserModel;
  SetLog: Function;
};

const UserList: MiniUserModel[] = [
  { id: "0", name: "test0" },
  { id: "1", name: "test1" },
  { id: "2", name: "test2" },
  { id: "3", name: "test3" },
];

const HomePage3PROJ: FunctionComponent<Props> = ({ currentUser, SetLog }) => {
  const [OwnerRooms, setOwnerRooms] = useState<RoomModel[]>();

  const [AddActive, setAddActive] = useState<Boolean>(false);
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
      SignUp(body.email, body.pseudo, body.password, body.role).then((result) => {
        if (isHttpStatusValid(result.status)) {
          displayStatusRequest("user added successfully", false);
          SetLog();
          setAddActive(false);
        } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
      });
    } else displayStatusRequest("error : ", true);
  };

  function IsSelectedUser(id: string) {
    return SelectUsers.some((user) => user.id === id);
  }
  return (
    <div className="main p20 flex-col flex-end-align g25">
      <div className="flex-col g25 w100">
        <div className="g25 flex-center-align">
          <Link to={`/`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="m0">3PROJ :</h2>
        </div>
        <div className="flex-col big-dark-container display-from-left">
          <div className="flex-wrap g25">
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
                setAddActive(!AddActive);
                setSelectCoOwner(null);
                setSelectUsers([]);
              }}
            >
              <i className="material-icons">add</i>
              <span>Create room</span>
            </div>
            {/*
            <div className="cta cta-normal cta-blue-h" onClick={() => setOwnedRoomActive(!OwnedRoomActive)}>
              <i className="material-icons">engineering</i>
              <span>Show owned room</span>
            </div>
            <div className="cta cta-normal cta-blue-h" onClick={() => setRoomctive(!Roomctive)}>
              <i className="material-icons">groups</i>
              <span>Show all room</span>
            </div> 
            */}
          </div>
        </div>
        {OwnedRoomActive ? (
          <div className="table-list flex-col p50 dark-bg big-dark-container display-from-left">
            <h2>List of owned rooms :</h2>
            <ul className="table-list flex-col mb0">
              <li className="legend">
                <div className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w80">
                    <p className="w20">ROOM NAME</p>
                    <p className="w20">OWNER</p>
                    <p className="w20">CO-OWNER</p>
                    <p className="w10">USERS COUNT</p>
                    <p className="w10">TASKS COUNT</p>
                  </div>
                  <i className={`material-icons mtbauto`}>expand_more</i>
                </div>
              </li>
              {OwnerRooms
                ? OwnerRooms.map((room: RoomModel) =>
                    room.owner === currentUser._id || room.co_owner === currentUser._id ? (
                      <li key={room.id + "userlist"}>
                        <div className="flex-row flex-bet">
                          <div className="flex-row flex-start-align flex-start-justify w80">
                            <p className="w20">{room.name}</p>
                            <p className="w20">{room.owner}</p>
                            <p className="w20">{room.co_owner}</p>
                            <p className="w10">{room.users.length}</p>
                            <p className="w10">{room.tasks.length}</p>
                          </div>
                          <Link to={`/room/` + room.id} className="icon">
                            <i className="material-icons ml10 blue-h">edit</i>
                          </Link>
                        </div>
                      </li>
                    ) : null
                  )
                : null}
            </ul>
          </div>
        ) : null}

        {Roomctive ? (
          <div className="table-list flex-col p50 dark-bg big-dark-container display-from-left">
            <h2>List of all rooms :</h2>
            <ul className="table-list flex-col mb0">
              <li className="legend">
                <div className="flex-row flex-bet">
                  <div className="flex-row flex-start-align flex-start-justify w80">
                    <p className="w20">ROOM NAME</p>
                    <p className="w20">OWNER</p>
                    <p className="w20">CO-OWNER</p>
                    <p className="w10">USERS COUNT</p>
                    <p className="w10">TASKS COUNT</p>
                  </div>
                  <i className={`material-icons mtbauto`}>expand_more</i>
                </div>
              </li>
              {OwnerRooms
                ? OwnerRooms.map((room: RoomModel) =>
                    room.owner !== currentUser._id || room.co_owner !== currentUser._id ? (
                      <li key={room.id + "userlist"}>
                        <div className="flex-row flex-bet">
                          <div className="flex-row flex-start-align flex-start-justify w80">
                            <p className="w20">{room.name}</p>
                            <p className="w20">{room.owner}</p>
                            <p className="w20">{room.co_owner}</p>
                            <p className="w10">{room.users.length}</p>
                            <p className="w10">{room.tasks.length}</p>
                          </div>
                          <Link to={`/room/` + room.id} className="icon">
                            <i className="material-icons ml10 blue-h">edit</i>
                          </Link>
                        </div>
                      </li>
                    ) : null
                  )
                : null}
            </ul>
          </div>
        ) : null}

        {AddActive ? (
          <div className="add-item-popup">
            <div
              className="dark-background"
              onClick={() => {
                setAddActive(false);
              }}
            ></div>
            <div className="big-dark-container flex-col w25 relative display-from-left zi2">
              <i
                className="material-icons red-h absolute r0 mr50"
                onClick={() => {
                  setAddActive(false);
                }}
              >
                close
              </i>
              <h2 className="mt0">Add new User :</h2>
              <div className="flex-col">
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

              {SelectUsersActive ? (
                <div className="SelectUsersWindow small-dark-container w50">
                  <p className="mt0 flex-center flex-bet">
                    Select users :
                    <i className="material-icons" onClick={() => setSelectUsersActive(!SelectUsersActive)}>
                      close
                    </i>
                  </p>
                  <ul className="SelectUsersList">
                    {UserList
                      ? UserList.map((user) =>
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
                    {UserList
                      ? UserList.map((user) =>
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
        ) : null}
      </div>
    </div>
  );
};

export default HomePage3PROJ;
