import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import getNameById from "../../../helpers/getNameById";
import MiniUserModel from "../../../models/mini-user-model";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ConsoleDrawComponent from "../components/console-draw";
import { formatDate } from "../../../helpers/display-date-format";

interface Props extends RouteComponentProps<{ roomid: string; taskid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  rooms: RoomModel[];
  tasks: TaskModel[];
  userList: MiniUserModel[];
}

type UserListNote = {
  id: string;
  script: string;
  note: number;
};

function countNegativeOnes(entries: UserListNote[]): number {
  return entries.reduce((acc, entry) => {
    if (entry.note === -1) {
      acc += 1;
    }
    return acc;
  }, 0);
}

const RoomTaskPageById: FC<Props> = ({ match, currentUser, SetLog, rooms, tasks, userList }) => {
  const [Task, setTask] = useState<TaskModel>();
  const [Room, setRoom] = useState<RoomModel>();

  const [RenderStatus, setRenderStatus] = useState<boolean>(false);

  const [TempoTaskRender, setTempoTaskRender] = useState<UserListNote[]>();

  const [IsOwner, setIsOwner] = useState<boolean>(false);
  const [IsDatePassed, setIsDatePassed] = useState<boolean>(false);
  const [WorkView, setWorkView] = useState<UserListNote | false>();

  const [PopUpActive, setPopUpActive] = useState<boolean>(false);
  useEffect(() => {
    tasks.forEach((task) => {
      if (task._id === match.params.taskid) {
        rooms.forEach((room) => {
          if (room.tasks.includes(task._id)) {
            setTask(task);
            setTempoTaskRender(task.renders);
            setRoom(room);
            setIsOwner(room.co_owner === currentUser._id || room.owner === currentUser._id);
            setRenderStatus(task.renders.some((e) => e.id === currentUser._id));
            setIsDatePassed(task.datelimit < new Date());
          }
        });
      }
    });
  }, [match.params, tasks, rooms, currentUser]);

  const test = (script: string) => {
    console.log(script);
  };

  const EditNote = (userId: string, newNote: number) => {
    setTempoTaskRender((prevTasks) => {
      return prevTasks!.map((task) => {
        if (task.id === userId) {
          return { ...task, note: newNote };
        }
        return task;
      });
    });
    setWorkView(false);
  };

  const UpdateNotes = () => {
    console.log(TempoTaskRender);
    const updatedTempoTaskRender: UserListNote[] = Room!.users.reduce((acc, userId) => {
      const existingTask = TempoTaskRender!.find(task => task.id === userId);
      if (!existingTask) {
        acc.push({ id: userId, script: "", note: 0 });
      }
      return acc;
    }, [] as UserListNote[]);
    console.log([ ...TempoTaskRender!, ...updatedTempoTaskRender ]);
    setWorkView(false);
    setPopUpActive(false);
  };

  return Task && Room ? (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          {/* //! title */}
          <Link to={`/3PROJ/room/${Room!._id}`} className="cta cta-blue">
            <span>Back</span>
          </Link>
          <h2 className="mb0 w50">
            Tasks :{" "}
            <Link to={`/3PROJ`} className="blue">
              {Task.title}
            </Link>{" "}
            of{" "}
            <Link to={`/3PROJ`} className="blue">
              {Room.name}
            </Link>
          </h2>{" "}
          {IsDatePassed ? (
            <h2 className="mb0 txt-end w50">Date limit is passed</h2>
          ) : (
            <h2 className="mb0 txt-end w50">
              Date limit : <span className="blue">{formatDate(Task.datelimit)}</span>
            </h2>
          )}
        </div>

        <div className="flex g20">
          <div className="flex-col flex-justify-start g20 w60">
            {/* //! details */}
            {Task.details ? (
              <div className="dark-container flex-col display-from-left">
                <h2 className="flex-center ">Detail :</h2>
                <div className="task-detail normal-container">{formatDate(Task.datelimit)}</div>
              </div>
            ) : IsOwner ? (
              <div className="dark-container flex-col display-from-left">
                <div className="flex-center flex-col g20">
                  <h2 className="red flex-center m0">
                    <i className="material-icons red mr25">warning</i>Details needed
                    <i className="material-icons red ml25">warning</i>
                  </h2>
                  <textarea name="deatil-input" id="deatil-input" rows={15}></textarea>
                  <div className="cta normal-bg blue-h mlauto" onClick={() => console.log("false")}>
                    <span className="add-user flex-center g15">
                      <i className="material-icons">add</i>add a detail
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-container flex-col display-from-left">
                <h2 className="red flex-center m0">No details yet</h2>
              </div>
            )}
          </div>
          <div className="flex-col flex-justify-start g20 w40">
            {IsOwner ? null : RenderStatus ? (
              <div className="dark-container display-from-left w50 flex-row">
                {/* //! user render ok*/}
                <i className="material-icons fs30 green mr50 ml25 mtauto mbauto">task_alt</i>
                <div className="flex-col">
                  <h2>Render is submited</h2>
                  <div className="flex g20">
                    <div className="cta normal-bg blue-h mrauto" onClick={() => console.log("false")}>
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="material-icons">open_in_new</i>View
                      </span>
                    </div>
                    {IsOwner ? (
                      <div className="cta normal-bg blue-h mrauto" onClick={() => console.log("false")}>
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="material-icons">edit</i>Edit the render
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                {/* //! user no render*/}
                <h2 className="red flex-center">
                  <i className="material-icons red mr25">warning</i>You need to submit a render
                  <i className="material-icons red ml25">warning</i>
                </h2>
                <div className="flex-col g15">
                  <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive(true)}>
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Add from new draw
                    </span>
                  </div>
                  <div className="cta normal-bg blue-h mrauto" onClick={() => console.log("false")}>
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Choose from your draws
                    </span>
                  </div>
                </div>
              </div>
            )}

            {Task.correction && Task.renders.some((e) => e.id === currentUser._id) ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                {/* //! all correciton ok */}
                <h2>Correction for this task :</h2>
                <div className="flex g20">
                  <div className="cta normal-bg blue-h" onClick={() => console.log("false")}>
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">open_in_new</i>View
                    </span>
                  </div>
                  {IsOwner ? (
                    <div className="cta normal-bg blue-h" onClick={() => console.log("false")}>
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="material-icons">edit</i>Edit the correction
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : IsOwner ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                {/* //! owner no correction */}
                <h2 className="mb0">Note users's renders</h2>
                <p className="fs14">then submit a correction</p>
                <div className="flex g20 ">
                  <div className="cta normal-bg blue-h" onClick={() => setPopUpActive(true)}>
                    <span className="add-user flex-row flex-center-align flex-start-justify g15">
                      <i className="material-icons">add</i>Note renders
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-container flex-col display-from-left">
                {/* //! user no correction */}
                <h2 className="m0">No corrections and notes delivered yet</h2>
                <p className="ml25 mb5">Once the note is delivered, you will be able to see the correction</p>
              </div>
            )}

            {IsOwner ? (
              <div className="dark-container display-from-left flex-col flex-start-justify">
                {/* //! list of user */}
                <h2>
                  List of Users : <span className="fs14"></span>
                </h2>

                <ul className="table-list flex-col mb0 ">
                  <li className="legend">
                    <div className="flex-row">
                      <div className="flex-row flex-center-align w100">
                        <p className="w80">USER NAME</p>
                        <p className="w20 txt-center">RENDER STATUS</p>
                      </div>
                    </div>
                  </li>

                  {Room.users.map((userId) => (
                    <li key={userId}>
                      <div className="flex-row flex-bet">
                        <div className="flex-row flex-center-align w100">
                          <p className="w80">{getNameById(userId, userList)}</p>
                          {Task.renders.some((e) => e.id === userId) ? (
                            <i className="material-icons mtbauto flex-center green w20">task_alt</i>
                          ) : (
                            <i className="material-icons mtbauto flex-center red w20">close</i>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {PopUpActive ? (
          <div className="add-item-popup">
            <div className="dark-background" onClick={() => setPopUpActive(false)} />
            {IsOwner ? (
              <div className="flex-center-justify g20 mt50 w100">
                {/* //! owner note */}

                <div className="flex-col g20 w50">
                  <div className="dark-container flex-col relative display-from-left zi2">
                    <h2>
                      List of Users : <span className="fs14"></span>
                    </h2>

                    <ul className="table-list flex-col mb0 w100">
                      <li className="legend">
                        <div className="flex-row">
                          <div className="flex-row flex-center-align w100">
                            <p className="w60">USER NAME</p>
                            <p className="w40 txt-center">NOTE</p>
                            <i className="material-icons flex-center green op0">task_alt</i>
                          </div>
                        </div>
                      </li>

                      {TempoTaskRender
                        ? TempoTaskRender.map((user) => (
                            <li
                              key={user.id}
                              onClick={() =>
                                setWorkView({
                                  id: user.id,
                                  script: user.script,
                                  note: user.note,
                                })
                              }
                            >
                              <div className="flex-row flex-bet">
                                <div className="flex-row flex-center-align w100">
                                  <p className="w60">{getNameById(user.id, userList)}</p>
                                  <p className="txt-center w40">{user.note} /100</p>
                                  <i className="material-icons flex-center green">task_alt</i>
                                </div>
                              </div>
                            </li>
                          ))
                        : null}

                      {Room.users.map((userId) =>
                        !Task.renders.some((e) => e.id === userId || e.script === "") ? (
                          <li className="disabled-li" key={userId}>
                            <div className="flex-row flex-bet">
                              <div className="flex-row flex-center-align w100">
                                <p className="w60">{getNameById(userId, userList)}</p>
                                <p className="txt-center w40">0/100</p>
                                <i className="material-icons flex-center red">close</i>
                              </div>
                            </div>
                          </li>
                        ) : null
                      )}
                    </ul>

                    <div className="flex-row flex-center-align normal-container mt10">
                      <h2 className="mb0 ml10">
                        {Room.users.length - countNegativeOnes(TempoTaskRender!)}/{Room.users.length}
                      </h2>
                      {Room.users.length - countNegativeOnes(TempoTaskRender!) === Room.users.length ? (
                        <div className="cta cta-blue mtauto mlauto" onClick={UpdateNotes}>
                          <span className="flex-center g10">
                            <i className="material-icons">upload</i>update notes
                          </span>
                        </div>
                      ) : (
                        <div className="cta cta-disable mtauto mlauto">
                          <span className="flex-center g10">
                            <i className="material-icons">upload</i>update notes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {WorkView ? (
                    <div className="flex g20">
                      <div className="dark-container flex-col relative display-from-bottom zi2 w100 flex-bet g15">
                        <h2 className="m0">Script of {getNameById(WorkView.id, userList)}</h2>
                        <div className="flex g25">
                          <span className="normal-container flex-center fs20 bold">
                            <input
                              type="number"
                              name="note"
                              className="fs20"
                              max={100}
                              min={-1}
                              value={WorkView.note}
                              onChange={(e) => setWorkView({ ...WorkView, note: parseInt(e.currentTarget.value) })}
                            />
                            &nbsp;/&nbsp;100
                          </span>
                          <div
                            className="cta normal-bg blue-h mlauto"
                            onClick={() =>
                              EditNote(
                                WorkView.id,
                                (document.querySelector("input[name=note]") as HTMLInputElement)
                                  ? parseInt((document.querySelector("input[name=note]") as HTMLInputElement).value)
                                  : 0
                              )
                            }
                          >
                            <span className="add-user flex-center g15">
                              <i className="material-icons mt5 mb5">done</i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div>
                  {WorkView ? (
                    <ConsoleDrawComponent
                      DefaultScript={WorkView.script}
                      correction={true}
                      returnedScript={false}
                      currentUser={currentUser}
                    />
                  ) : (
                    <ConsoleDrawComponent DefaultScript={""} correction={true} returnedScript={false} currentUser={currentUser} />
                  )}
                </div>
              </div>
            ) : (
              <ConsoleDrawComponent
                DefaultScript={WorkView ? WorkView.script : ""}
                correction={false}
                returnedScript={test}
                currentUser={currentUser}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default RoomTaskPageById;
