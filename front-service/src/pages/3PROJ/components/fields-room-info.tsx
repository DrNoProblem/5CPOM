import React, { FC, useEffect, useState } from "react";
import MiniUserModel from "../../../models/mini-user-model";
import UserModel from "../../../models/user-model";
import addRoom from "../../../api-request/room/room-add";
import isHttpStatusValid from "../../../helpers/check-status";
import displayStatusRequest from "../../../helpers/display-status-request";
import getNameById from "../../../helpers/getNameById";

interface RoomInfoUpload {
  name: string;
  co_owner: string;
  users: string[];
}

type Props = {
  defaultValues: RoomInfoUpload;
  functionReturned: Function;
  CurrentUser: UserModel;
  usersList: MiniUserModel[];
  Add: boolean;
};

const EditRoomInfo: FC<Props> = ({ defaultValues, functionReturned, CurrentUser, usersList, Add }) => {
  const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

  const [SelectUsersActive, setSelectUsersActive] = useState<Boolean>(false);
  const [ChooseCoOwnerActive, setChooseCoOwnerActive] = useState<Boolean>(false);

  const [SelectRoomName, setSelectRoomName] = useState<string | "">(defaultValues.name);
  const [SelectCoOwner, setSelectCoOwner] = useState<string | "">(defaultValues.co_owner);
  const [SelectUsers, setSelectUsers] = useState<string[]>(defaultValues.users);

  var objectFiledAddRoom: RoomInfoUpload = {
    name: SelectRoomName,
    co_owner: SelectCoOwner,
    users: SelectUsers,
  };

  const areAllPropertiesEmpty = (obj: any) => {
    if (obj.name === "") return false;
    if (obj.co_owner === null) return false;
    return true;
  };

  useEffect(() => {
    setReadyToSend(areAllPropertiesEmpty(objectFiledAddRoom));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectRoomName, SelectCoOwner, SelectUsers]);

  function IsSelectedUser(id: string) {
    return SelectUsers.some((user) => user === id);
  }

  const AddNewRoom = (body: RoomInfoUpload) => {
    console.log(body);
    if (areAllPropertiesEmpty(body)) {
      addRoom(body.name, body.co_owner, body.users).then((result) => {
        if (isHttpStatusValid(result.status)) {
          displayStatusRequest("user added successfully", false);
          setSelectRoomName("");
          setSelectCoOwner("");
          setSelectUsers([]);
          functionReturned(true);
        } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
      });
    } else displayStatusRequest("error : ", true);
  };

  const updateRoom = (obj: RoomInfoUpload) => {
    console.log(obj);
  };

  const closeModal = () => {
    functionReturned(false);
  };

  return (
    <div className="dark-container flex-col relative display-from-left zi2 w100">
      {Add ? <h2 className="">Add new Room :</h2> : <h2 className="">Edit Room :</h2>}
      <i className=" red-h absolute r0 mr20" onClick={closeModal}>
        close
      </i>
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
              <i className=" mr10">person</i>
              Co-Owner :
            </p>
            {SelectCoOwner ? (
              <ul className="m0 users-list-to-add viewnoscrool">
                {SelectCoOwner ? (
                  <li>
                    <span>{getNameById(SelectCoOwner, usersList)}</span>
                    <i
                      className=" mlauto"
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
                <i className="">person_add_alt_1</i>
                <span>Choose user</span>
              </div>
            )}
          </div>

          <div className="flex-col w50">
            <p className="m0 mb20 mt20 flex-center-align">
              <i className=" mr10">groups</i>
              Users :
            </p>
            {SelectUsers.length !== 0 ? (
              <ul className="m0 users-list-to-add">
                {SelectUsers.map((user) => (
                  <li key={user}>
                    <span>{getNameById(user, usersList)}</span>
                    <i className=" mlauto" onClick={() => setSelectUsers(SelectUsers.filter((e) => e !== user))}>
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
                <i className="">person_add_alt_1</i>
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
                <i className="">person_add_alt_1</i>
                <span>Choose users</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          {Add ? null : (
            <div className="cta cta-red" onClick={() => functionReturned("delete")}>
              <span className="flex-center g10">
                <i className="">delete</i>Delete
              </span>
            </div>
          )}
          {ReadyToSend ? (
            <div
              className="cta mtauto mlauto cta-blue to-right-bottom"
              onClick={() => (Add ? AddNewRoom(objectFiledAddRoom) : updateRoom(objectFiledAddRoom))}
            >
              {Add ? (
                <span className="flex-center g10">
                  <i className="">add</i>
                  create
                </span>
              ) : (
                <span className="flex-center g10">
                  <i className="">edit</i>
                  edit
                </span>
              )}
            </div>
          ) : (
            <div className="cta mtauto mlauto cta-disable to-right-bottom">
              <i className="">close</i>

              {Add ? "create" : "edit"}
            </div>
          )}
        </div>
      </div>

      {SelectUsersActive ? (
        <div className="SelectUsersWindow dark-container w50">
          <p className="mt0 flex-center flex-bet">
            Select users :
            <i className="" onClick={() => setSelectUsersActive(!SelectUsersActive)}>
              close
            </i>
          </p>
          <ul className="SelectUsersList">
            {usersList
              ? usersList.map((user) =>
                  user._id !== SelectCoOwner && user._id !== CurrentUser._id ? (
                    IsSelectedUser(user._id) ? (
                      <li
                        key={user._id}
                        className="blue flex-center-align"
                        onClick={() => setSelectUsers(SelectUsers.filter((e) => e !== user._id))}
                      >
                        <i className=" blue mr10">done</i>
                        {user.name}
                      </li>
                    ) : (
                      <li key={user._id} className="flex-center-align" onClick={() => setSelectUsers([...SelectUsers, user._id])}>
                        <i className=" op0 mr10">done</i>
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
            <i className="" onClick={() => setChooseCoOwnerActive(!ChooseCoOwnerActive)}>
              close
            </i>
          </p>
          <ul className="SelectUsersList">
            {usersList
              ? usersList.map((user) =>
                  user._id !== CurrentUser._id ? (
                    SelectCoOwner && user._id === SelectCoOwner ? (
                      <li key={user._id} className="blue flex-center-align" onClick={() => setSelectCoOwner("")}>
                        <i className=" blue mr10">done</i>
                        {user.name}
                      </li>
                    ) : (
                      <li
                        key={user._id}
                        className="flex-center-align"
                        onClick={() => {
                          setSelectCoOwner(user._id);
                          setSelectUsers(SelectUsers.filter((e) => e !== user._id));
                          setChooseCoOwnerActive(false);
                        }}
                      >
                        <i className=" op0 mr10">done</i>
                        {user.name}
                      </li>
                    )
                  ) : null
                )
              : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default EditRoomInfo;
