import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MiniUserModel from "../../models/mini-user-model";
import voidRoom from "../../models/mocks/void-room";
import voidTask from "../../models/mocks/void-task";
import voidUser from "../../models/mocks/void-user";
import RoomModel from "../../models/room-model";
import TaskModel from "../../models/tasks-model";
import UserModel from "../../models/user-model";
import "./3P-style.scss";

import TableRenderSubmitStatusComp from "./components/table-render-submit-status";
import TableRoomUsersComp from "./components/table-room-users";
import EditRoomInfo from "./components/fields-room-info";

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

  const [PopUpActive, setPopUpActive] = useState<false | { check: string; title: string; second_title: false | string }>(false);

  const renderList: renderModel[] = RoomList.flatMap((room: RoomModel) =>
    room.users.some((user) => user === CurrentUser._id)
      ? room.tasks.map((taskid) => {
          const task = TaskList.find((e) => e._id === taskid);
          if (!task) {
            return null;
          }
          if (task.details === "") {
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

  const SuccessInfoSubmited = (update: boolean) => {
    if (update) SetLog();
    setPopUpActive(false);
  };
  return (
    <div className="main p20 flex-col flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <Link to={`/`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0">3PROJ :</h2>
        </div>

        <div className="flex-between flex-row g20">
          <div className="flex-col w25 g20">
            <div className="flex-col dark-container display-from-left">
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
                    setPopUpActive({ title: "Create new room", check: "add_room", second_title: false });
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
                    setPopUpActive({ check: "render", title: "List of tasks to render", second_title: "List of tasks rendered" });
                  }}
                >
                  <i className="material-icons">open_in_new</i>
                  <span>Renders</span>
                </div>
                <div
                  className="cta cta-normal cta-blue-h"
                  onClick={() => {
                    setPopUpActive({ check: "all_room", title: "List of all rooms", second_title: false });
                  }}
                >
                  <i className="material-icons">open_in_new</i>
                  <span>All rooms</span>
                </div>
                <div
                  className="cta cta-normal cta-blue-h"
                  onClick={() => {
                    setPopUpActive({ check: "owner_room", title: "List of owned rooms", second_title: false });
                  }}
                >
                  <i className="material-icons">open_in_new</i>
                  <span>Owned rooms</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col w75 g20">
            <div className="dark-container table-list">
              <h2>
                List of tasks to render :
                <i
                  className="material-icons absolute r0 mr25 blue-h"
                  onClick={() => {
                    setPopUpActive({ check: "render", title: "List of tasks rendered", second_title: "List of tasks rendered" });
                  }}
                >
                  open_in_new
                </i>
              </h2>
              <TableRenderSubmitStatusComp limite={3} tableList={renderList} submit={false} />
            </div>
          </div>
        </div>

        <div className="flex w100 g20">
          <div className="flex-col w50 g20">
            <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
              <h2 className="">
                List of owned rooms :
                <i
                  className="material-icons absolute r0 mr25 blue-h"
                  onClick={() => {
                    setPopUpActive({ check: "owner_room", title: "List of owned rooms", second_title: false });
                  }}
                >
                  open_in_new
                </i>
              </h2>
              <TableRoomUsersComp limite={3} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={true} />
            </div>
          </div>

          <div className="flex-col w50 g20">
            <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
              <h2 className="">
                List of all rooms :
                <i
                  className="material-icons absolute r0 mr25 blue-h"
                  onClick={() => {
                    setPopUpActive({ check: "all_room", title: "List of all rooms", second_title: false });
                  }}
                >
                  open_in_new
                </i>
              </h2>
              <TableRoomUsersComp limite={3} RoomList={RoomList} usersList={usersList} currentUser={CurrentUser} owner={false} />
            </div>
          </div>
        </div>

        {!PopUpActive ? null : (
          <div className="add-item-popup">
            <div
              className="dark-background"
              onClick={() => {
                setPopUpActive(false);
              }}
            ></div>
            {PopUpActive.check === "add_room" ? (
              <EditRoomInfo
                defaultValues={{
                  name: "",
                  co_owner: "",
                  users: [],
                }}
                functionReturned={SuccessInfoSubmited}
                CurrentUser={CurrentUser}
                usersList={usersList}
                Add={true}
              />
            ) : (
              <div className="dark-container flex-col relative display-from-left zi2 w100">
                <i
                  className="material-icons red-h absolute r0 mr20"
                  onClick={() => {
                    setPopUpActive(false);
                  }}
                >
                  close
                </i>
                <h2 className="">{PopUpActive.title} :</h2>

                {PopUpActive.check === "all_room" ? (
                  <TableRoomUsersComp
                    limite={9999999999}
                    RoomList={RoomList}
                    usersList={usersList}
                    currentUser={CurrentUser}
                    owner={false}
                  />
                ) : null}
                {PopUpActive.check === "owner_room" ? (
                  <TableRoomUsersComp
                    limite={9999999999}
                    RoomList={RoomList}
                    usersList={usersList}
                    currentUser={CurrentUser}
                    owner={true}
                  />
                ) : null}
                {PopUpActive.check === "render" ? (
                  <div className="flex-col">
                    <TableRenderSubmitStatusComp limite={9999999999} tableList={renderList} submit={false} />
                    <h2 className="mt30">{PopUpActive.second_title} :</h2>
                    <TableRenderSubmitStatusComp limite={9999999999} tableList={renderList} submit={true} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage3PROJ;
