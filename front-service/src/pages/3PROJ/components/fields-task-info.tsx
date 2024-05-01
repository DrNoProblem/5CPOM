import React, { FC, useEffect, useState } from "react";
import addTask from "../../../api-request/task/task-add";
import DeleteTaskById from "../../../api-request/task/task-delete";
import isHttpStatusValid from "../../../helpers/check-status";
import displayStatusRequest from "../../../helpers/display-status-request";
import formatDateForInput from "../../../helpers/formatDateForInput";
import { getToken } from "../../../helpers/token-verifier";
import RoomModel from "../../../models/room-model";
import { useHistory } from "react-router-dom";

interface TaskInfoUpload {
  title: string;
  detail: string;
  date: Date | false;
}
type Props = {
  defaultValues: TaskInfoUpload;
  functionReturned: Function;
  CurrentRoom: RoomModel;
  Add: boolean;
};
const EditTaskInfo: FC<Props> = ({ defaultValues, functionReturned, CurrentRoom, Add }) => {
  let history = useHistory();
  const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

  const [SelectTaskTitle, setSelectTaskTitle] = useState<string | "">(defaultValues.title);
  const [SelectTaskDetail, setSelectTaskDetail] = useState<string | "">(defaultValues.detail);
  const [SelectTaskDate, setSelectTaskDate] = useState<string>(formatDateForInput(defaultValues.date));

  var objectFiledAddTask: TaskInfoUpload = {
    title: SelectTaskTitle,
    detail: SelectTaskDetail,
    date: new Date(SelectTaskDate),
  };

  useEffect(() => {
    setReadyToSend(areAllPropertiesEmpty(objectFiledAddTask));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectTaskTitle, SelectTaskDetail, SelectTaskDate]);

  const AddNewTask = (obj: TaskInfoUpload) => {
    console.log(obj);
    if (areAllPropertiesEmpty(obj) && obj.date) {
      addTask(obj.title, obj.detail, obj.date, CurrentRoom!._id).then((e) => {
        if (isHttpStatusValid(e.status)) {
          displayStatusRequest("task added successfully", false);
          setSelectTaskTitle("");
          setSelectTaskDetail("");
          setSelectTaskDate(formatDateForInput(false));
          functionReturned(true);
        } else displayStatusRequest("error " + e.status + " : " + e.response.message, true);
      });
    } else displayStatusRequest("error : ", true);
  };

  const updateTask = (obj: TaskInfoUpload) => {
    console.log(obj);
  };

  const areAllPropertiesEmpty = (obj: any) => {
    if (obj.title === "") return false;
    const currentDate = new Date();
    const objectDate = new Date(obj.date);
    if (!objectDate) return false;
    if (objectDate < currentDate) return false;
    return true;
  };

  const closeModal = () => {
    functionReturned(false);
  };

  const deleteCurrentTask = () => {
    DeleteTaskById(getToken()!, CurrentRoom!._id).then((result) => {
      if (isHttpStatusValid(result.status)) {
        displayStatusRequest("task deleted successfully", false);
        setSelectTaskTitle("");
        setSelectTaskDetail("");
        setSelectTaskDate(formatDateForInput(false));
        functionReturned(true);
        history.push(`/room/${CurrentRoom!._id}`);
      } else displayStatusRequest("error " + result.status + " : " + result.response.message, true);
    });
  };

  return (
    <div className="dark-container flex-col w30">
      {Add ? <h2 className="">Add new Task :</h2> : <h2 className="">Edit Task :</h2>}
      <i className="material-icons red-h absolute r0 mr20" onClick={closeModal}>
        close
      </i>
      <h3 className="m10">
        Title <span className="red">*</span> :
      </h3>
      <input type="text" onChange={(e) => setSelectTaskTitle(e.target.value)} defaultValue={SelectTaskTitle} />
      <h3 className="m10">
        Date limit <span className="red">*</span> :
      </h3>
      <div className="g20">
        <input
          type="datetime-local"
          defaultValue={SelectTaskDate}
          className=""
          onChange={(e) => setSelectTaskDate(formatDateForInput(new Date(e.currentTarget.value)))}
        />
      </div>
      <h3 className="m10">Detail :</h3>
      <textarea onChange={(e) => setSelectTaskDetail(e.currentTarget.value)} defaultValue={SelectTaskDetail} />

      <div className="flex-row g15 mt15">
        {!Add ? (
          <div className="cta cta-full-red" onClick={() => functionReturned(false)}>
            <span className="flex-center g10">
              <i className="material-icons">delete</i>Delete
            </span>
          </div>
        ) : null}
        {ReadyToSend ? (
          <div
            className="cta cta-blue mlauto"
            onClick={() => (Add ? AddNewTask(objectFiledAddTask) : updateTask(objectFiledAddTask))}
          >
            {Add ? (
              <span className="flex-center g10">
                <i className="material-icons">add</i>
                add
              </span>
            ) : (
              <span className="flex-center g10">
                <i className="material-icons">edit</i>
                edit
              </span>
            )}
          </div>
        ) : (
          <div className="cta cta-disable mlauto">
            <span className="flex-center g10">
              <i className="material-icons">close</i>
              {Add ? "add" : "edit"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTaskInfo;
