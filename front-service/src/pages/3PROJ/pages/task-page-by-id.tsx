import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import addCorrectionToTask from "../../../api-request/task/correction-add";
import addRenderToTask from "../../../api-request/task/render-add";
import DeleteTaskById from "../../../api-request/task/task-delete";
import { isDatePast } from "../../../helpers/check-date-passed";
import isHttpStatusValid from "../../../helpers/check-status";
import { formatDate } from "../../../helpers/display-date-format";
import displayStatusRequest from "../../../helpers/display-status-request";
import getNameById from "../../../helpers/getNameById";
import { getToken } from "../../../helpers/token-verifier";
import RoomModel from "../../../models/room-model";
import TaskModel from "../../../models/tasks-model";
import UserModel from "../../../models/user-model";
import "../3P-style.scss";
import ModalConfirmDelete from "../components/confirmation-delete";
import ConsoleDrawComponent from "../components/console-draw";
import TableDraw from "../components/table-draw-list";
import EditTaskInfo from "../components/fields-task-info";
import DataModel from "../../../models/data-model";
import DeleteDrawById from "../../../api-request/draw/draw-delete";
import CurrentUserDrawsUpdate from "../../../api-request/user/update-draw";

interface Props extends RouteComponentProps<{ roomid: string; taskid: string }> {
  currentUser: UserModel;
  SetLog: Function;
  Data: DataModel;
}

type UserListNote = {
  id: string;
  script: string;
  note: number;
};

function countNegativeOnes(entries: UserListNote[]): number {
  return entries.reduce((acc, entry) => {
    if (entry.note === -1) acc += 1;
    return acc;
  }, 0);
}

const RoomTaskPageById: FC<Props> = ({ match, currentUser, SetLog, Data }) => {
  const [Task, setTask] = useState<TaskModel>();
  const [Room, setRoom] = useState<RoomModel>();

  const [RenderStatus, setRenderStatus] = useState<boolean>(false);

  const [TempoTaskRender, setTempoTaskRender] = useState<UserListNote[]>();

  const [IsOwner, setIsOwner] = useState<boolean>(false);
  const [IsDatePassed, setIsDatePassed] = useState<boolean>(false);
  const [WorkView, setWorkView] = useState<UserListNote | false>();

  const [PopUpActive, setPopUpActive] = useState<string | false>(false);

  useEffect(() => {
    Data.tasks.forEach((task) => {
      if (task._id === match.params.taskid) {
        Data.rooms.forEach((room) => {
          if (room.tasks.includes(task._id)) {
            setTask(task);
            setTempoTaskRender(task.renders);
            setRoom(room);

            setIsOwner(room.co_owner === currentUser._id || room.owner === currentUser._id);
            setRenderStatus(task.renders.some((e) => e.id === currentUser._id));
            setIsDatePassed(isDatePast(task.datelimit));
          }
        });
      }
    });
  }, [match.params, Data, currentUser]);

  const areAllPropertiesEmpty = (obj: any) => {
    if (obj.title === "") return false;
    const currentDate = new Date();
    const objectDate = new Date(obj.date);

    if (objectDate < currentDate) return false;
    return true;
  };

  const EditTempoNote = (userId: string, newNote: number) => {
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

  const submitUserRender = (script: string) => {
    console.log(script);
    addRenderToTask(Task!._id, script, Room!._id).then((result) => {
      if (isHttpStatusValid(result.status)) {
        displayStatusRequest("Render submited", false);
        setPopUpActive(false);
        SetLog();
      } else {
        displayStatusRequest("Render fail to sumbit", true);
      }
    });
  };

  const submitOwnerCorrection = (script: string) => {
    console.log(script);
    addCorrectionToTask(Task!._id, script).then((result) => {
      if (isHttpStatusValid(result.status)) {
        displayStatusRequest("Correction submited", false);
        setPopUpActive(false);
        SetLog();
      } else {
        displayStatusRequest("Correction fail to sumbit", true);
      }
    });
    //! function to submit correction
  };

  const submitOwnerDetail = () => {
    const detail: string = (document.querySelector("textarea[name=deatil-input]") as HTMLInputElement)
      ? (document.querySelector("textarea[name=deatil-input]") as HTMLInputElement).value
      : "";
    console.log(detail);
    //! function to submit detail
  };

  const UpdateNotes = () => {
    console.log(TempoTaskRender);
    const updatedTempoTaskRender: UserListNote[] = Room!.users.reduce((acc, userId) => {
      const existingTask = TempoTaskRender!.find((task) => task.id === userId);
      if (!existingTask) {
        acc.push({ id: userId, script: "", note: 0 });
      }
      return acc;
    }, [] as UserListNote[]);
    console.log([...TempoTaskRender!, ...updatedTempoTaskRender]);
    //! funcntion to update the notes
    setWorkView(false);
    setPopUpActive(false);
  };

  const SuccessInfoSubmited = (update: string) => {
    if (update === "succes") SetLog();
    if (update === "delete") setPopUpActive("delete task");
    else setPopUpActive(false);
  };
  let history = useHistory();

  const ConfirmToDelete = (deleteTask: boolean) => {
    if (deleteTask) {
      DeleteTaskById(getToken()!, Task!._id).then((result) => {
        if (isHttpStatusValid(result.status)) {
          displayStatusRequest("task deleted successfully", false);
          SetLog();
          history.push(`/room/${currentUser!._id}`);
        } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
      });
    } else {
      SuccessInfoSubmited("");
    }
  };

  const [deleteActive, setdeleteActive] = useState<string | false>(false);

  const SetDeleteDraw = (value: string) => {
    setdeleteActive(value);
    setPopUpActive("delete draw");
  };
  const ConfirmToDeleteDraw = (value: boolean) => {
    if (deleteActive && value) {
      Promise.all([DeleteDrawById(deleteActive), CurrentUserDrawsUpdate([""])]).then((result) => {
        const [DeleteDrawResult, UpdateUserResult] = result;

        if (!isHttpStatusValid(DeleteDrawResult.status))
          displayStatusRequest("error " + DeleteDrawResult.status + " : " + DeleteDrawResult.response.message, true);
        if (!isHttpStatusValid(UpdateUserResult.status))
          displayStatusRequest("error " + UpdateUserResult.status + " : " + UpdateUserResult.response.message, true);
        if (isHttpStatusValid(DeleteDrawResult.status) && isHttpStatusValid(UpdateUserResult.status)) {
          SetLog();
          setdeleteActive(false);
          setPopUpActive(false);
        }
      });
    } else {
      SuccessInfoSubmited("");
    }
  };

  return Task && Room ? (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="g20 flex-center-align">
          <div className="g20 flex-center-align w50">
            <Link to={`/3PROJ/room/${Room!._id}`} className="cta cta-blue">
              <span>Back</span>
            </Link>
            <h2 className="mb0 flex-center-align g15">
              Tasks :
              <span className="blue" onClick={() => (IsOwner ? setPopUpActive("edition task") : null)}>
                {Task.title}
              </span>
              of {Room.name}{" "}
              {IsOwner ? (
                <i className=" ml25 blue-h" onClick={() => setPopUpActive("edition task")}>
                  settings
                </i>
              ) : null}
            </h2>
          </div>
          {IsDatePassed ? (
            <h2 className="mb0 txt-end w50 red" onClick={() => (IsOwner ? setPopUpActive("edition task") : null)}>
              Date limit is passed
            </h2>
          ) : (
            <h2 className="mb0 txt-end w50">
              Date limit :&nbsp;
              <span className="blue" onClick={() => (IsOwner ? setPopUpActive("edition task") : null)}>
                {formatDate(Task.datelimit)}
              </span>
            </h2>
          )}
        </div>

        {!IsOwner && IsDatePassed && Task.details === "" ? (
          <h2 className="txt-center m0 mtauto  pt50 mt50">
            Date limite is passed and no details.
            <br />
            <br />
            Wait for new information
          </h2>
        ) : (
          <div className="flex g20">
            <div className="flex-col flex-justify-start g20 w60">
              {Task.details ? (
                <div className="dark-container flex-col display-from-left">
                  <h2>Detail :</h2>
                  <div className="task-detail normal-container">{Task.details}</div>
                </div>
              ) : (
                <div className="dark-container flex-col display-from-left">
                  {IsDatePassed ? (
                    IsOwner ? (
                      <div className="flex-col">
                        <h2 className="red flex-center">Move the date limit or delete this task</h2>
                        <div className="g15 flex-center">
                          <div className="cta cta-blue" onClick={() => setPopUpActive("edition task")}>
                            <span className="flex-center g10">
                              <i className="">edit</i>Redate
                            </span>
                          </div>
                          <div className="cta cta-red" onClick={() => setPopUpActive("delete task")}>
                            <span className="flex-center g10">
                              <i className="">delete</i>delete
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : IsOwner ? (
                    <div className="flex-center flex-col g20">
                      <h2 className="red flex-center m0">
                        <i className=" red mr25">warning</i>Details needed
                        <i className=" red ml25">warning</i>
                      </h2>
                      <textarea name="deatil-input" id="deatil-input" rows={15}></textarea>
                      <div className="cta normal-bg blue-h mlauto" onClick={submitOwnerDetail}>
                        <span className="add-user flex-center g15">
                          <i className="">add</i>add detail
                        </span>
                      </div>
                    </div>
                  ) : (
                    <h2 className="red flex-center m0">No details yet</h2>
                  )}
                </div>
              )}
            </div>
            <div className="flex-col flex-justify-start g20 w40">
              {IsDatePassed &&
              Task.details !== "" &&
              countNegativeOnes(Task.renders) === Room.users.length /* note submit && date passed */ ? (
                Task.correction /* correction */ ? (
                  <div className="dark-container display-from-left flex-col flex-start-justify">
                    <h2>Correction for this task :</h2>
                    <div className="flex g20">
                      <div className="cta normal-bg blue-h" onClick={() => setPopUpActive("view correction")}>
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">open_in_new</i>View
                        </span>
                      </div>
                      {IsOwner ? (
                        <div className="cta normal-bg blue-h" onClick={() => setPopUpActive("edit correction")}>
                          <span className="add-user flex-row flex-center-align flex-start-justify g15">
                            <i className="">edit</i>Edit
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="dark-container flex-col display-from-left g20">
                    <h2 className="m0">No corrections yet</h2>
                    {IsOwner ? (
                      <div>
                        <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("submit correction")}>
                          <span className="add-user flex-row flex-center-align flex-start-justify g15">
                            <i className="">add</i>Add script
                          </span>
                        </div>

                        <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("choose correction")}>
                          <span className="add-user flex-row flex-center-align flex-start-justify g15">
                            <i className="">add</i>Choose script
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              ) : null}

              {IsDatePassed && Task.details !== "" /* notes */ ? (
                IsOwner ? (
                  <div className="dark-container display-from-left flex-col flex-start-justify g20">
                    <h2 className="mb0">Note users's renders</h2>
                    <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("note")}>
                      {countNegativeOnes(Task.renders) === Room.users.length ? (
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">edit</i>Edit
                        </span>
                      ) : (
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">add</i>Note
                        </span>
                      )}
                    </div>
                  </div>
                ) : Task.renders.some((e) => e.id === currentUser._id) ? (
                  <div className="dark-container flex-col display-from-left">
                    <h2 className="m0">Notes for this tack :</h2>
                    <span className="normal-container flex-center fs20 bold">
                      {Task.renders.find((e) => e.id === currentUser._id)!.note}
                      &nbsp;/&nbsp;100
                    </span>
                  </div>
                ) : (
                  <div className="dark-container flex-col display-from-left">
                    <h2 className="m0">Notes not submited yet</h2>
                  </div>
                )
              ) : null}

              {IsOwner /* user list */ ? (
                <div className="dark-container display-from-left flex-col flex-start-justify">
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
                            <p className="w80">{getNameById(userId, Data.users)}</p>
                            {Task.renders.some((e) => e.id === userId) ? (
                              <i className=" mtbauto flex-center green w20">task_alt</i>
                            ) : (
                              <i className=" mtbauto flex-center red w20">close</i>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : RenderStatus /* ok render */ ? (
                <div className="dark-container display-from-left flex-row">
                  <div className="flex-col g20">
                    <div className="flex-center g15">
                      <i className=" fs30 green">task_alt</i>
                      <h2 className="m0">Render is submited</h2>
                    </div>
                    <div className="flex g15">
                      <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("view render")}>
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">visibility</i>View
                        </span>
                      </div>
                      <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("edit render")}>
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">edit</i>Edit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : IsDatePassed ? null : Task.details !== "" ? (
                <div className="dark-container display-from-left flex-col flex-start-justify">
                  <h2 className="red flex-center">
                    <i className=" red mr25">warning</i>You need to submit a render
                    <i className=" red ml25">warning</i>
                  </h2>
                  <div className="flex-col g15">
                    <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("submit render")}>
                      <span className="add-user flex-row flex-center-align flex-start-justify g15">
                        <i className="">add</i>Add draw
                      </span>
                    </div>
                    {currentUser.draws.length > 0 ? (
                      <div className="cta normal-bg blue-h mrauto" onClick={() => setPopUpActive("choose render")}>
                        <span className="add-user flex-row flex-center-align flex-start-justify g15">
                          <i className="">add</i>Choose draws
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {PopUpActive ? (
          <div className="add-item-popup">
            <div className="dark-background" onClick={() => setPopUpActive(false)} />

            {IsOwner && PopUpActive === "note" ? (
              <div className="flex-center-justify g20 mt50 w100">
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
                            <i className=" flex-center green op0">task_alt</i>
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
                                  <p className="w60">{getNameById(user.id, Data.users)}</p>
                                  <p className="txt-center w40">{user.note} /100</p>
                                  <i className=" flex-center green">task_alt</i>
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
                                <p className="w60">{getNameById(userId, Data.users)}</p>
                                <p className="txt-center w40">0/100</p>
                                <i className=" flex-center red">close</i>
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
                            <i className="">upload</i>update notes
                          </span>
                        </div>
                      ) : (
                        <div className="cta cta-disable mtauto mlauto">
                          <span className="flex-center g10">
                            <i className="">close</i>update notes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {WorkView ? (
                    <div className="flex g20">
                      <div className="dark-container flex-col relative display-from-bottom zi2 w100 flex-bet g15">
                        <h2 className="m0">Script of {getNameById(WorkView.id, Data.users)}</h2>
                        <div className="flex g25">
                          <span className="normal-container flex-center fs20 bold">
                            <input
                              type="number"
                              name="note"
                              className="fs20"
                              max={100}
                              min={-1}
                              value={WorkView.note}
                              onChange={(e) =>
                                setWorkView({
                                  ...WorkView,
                                  note: parseInt(e.currentTarget.value),
                                })
                              }
                            />
                            &nbsp;/&nbsp;100
                          </span>
                          <div
                            className="cta normal-bg blue-h mlauto"
                            onClick={() =>
                              EditTempoNote(
                                WorkView.id,
                                (document.querySelector("input[name=note]") as HTMLInputElement)
                                  ? parseInt((document.querySelector("input[name=note]") as HTMLInputElement).value)
                                  : 0
                              )
                            }
                          >
                            <span className="add-user flex-center g15">
                              <i className=" mt5 mb5">done</i>
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
                      SetLog={SetLog}
                    />
                  ) : (
                    <ConsoleDrawComponent
                      DefaultScript={""}
                      correction={true}
                      returnedScript={false}
                      currentUser={currentUser}
                      SetLog={SetLog}
                    />
                  )}
                </div>
              </div>
            ) : null}

            {PopUpActive === "choose render" ? (
              <TableDraw
                currentUser={currentUser}
                returnFunction={submitUserRender}
                title=""
                DrawsList={[]}
                deleteFunction={SetDeleteDraw}
              />
            ) : null}

            {PopUpActive === "submit render" ? (
              <ConsoleDrawComponent
                DefaultScript={""}
                correction={false}
                returnedScript={submitUserRender}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}
            {PopUpActive === "view render" ? (
              <ConsoleDrawComponent
                DefaultScript={Task.renders.find((e) => e.id === currentUser._id)!.script}
                correction={false}
                returnedScript={false}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}

            {PopUpActive === "choose correction" ? (
              <TableDraw
                currentUser={currentUser}
                returnFunction={submitOwnerCorrection}
                title=""
                DrawsList={[]}
                deleteFunction={SetDeleteDraw}
              />
            ) : null}
            {PopUpActive === "submit correction" ? (
              <ConsoleDrawComponent
                DefaultScript={""}
                correction={false}
                returnedScript={submitOwnerCorrection}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}
            {PopUpActive === "view correction" ? (
              <ConsoleDrawComponent
                DefaultScript={Task.correction}
                correction={false}
                returnedScript={false}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}
            {PopUpActive === "edit correction" ? (
              <ConsoleDrawComponent
                DefaultScript={Task.correction}
                correction={false}
                returnedScript={submitOwnerCorrection}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}

            {PopUpActive === "edit render" ? (
              <ConsoleDrawComponent
                DefaultScript={Task.renders.find((e) => e.id === currentUser._id)!.script}
                correction={false}
                returnedScript={submitUserRender}
                currentUser={currentUser}
                SetLog={SetLog}
              />
            ) : null}

            {PopUpActive === "edition task" ? (
              <EditTaskInfo
                defaultValues={{ title: Task.title, detail: Task.details, date: Task.datelimit }}
                functionReturned={SuccessInfoSubmited}
                CurrentRoom={Room}
                Add={false}
              />
            ) : null}

            {PopUpActive === "delete task" ? (
              <ModalConfirmDelete functionReturned={ConfirmToDelete} itemTitle={Task.title} />
            ) : null}
            {PopUpActive === "delete draw" ? (
              <ModalConfirmDelete functionReturned={ConfirmToDeleteDraw} itemTitle={"the draw"} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default RoomTaskPageById;
