import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../api-request/user/sign-up";
import isHttpStatusValid from "../../helpers/check-status";
import displayStatusRequest from "../../helpers/display-status-request";
import UserModel from "../../models/user-model";
import "./3P-style.scss";
import RoomModel from "../../models/room-model";

type Props = {
  currentUser: UserModel
  SetLog: Function
};

const HomePage3PROJ: FunctionComponent<Props> = ({ currentUser, SetLog }) => {

  const [OwnerRoom, setOwnerRoom] = useState<RoomModel[]>();
  const [AddActive, setAddActive] = useState<Boolean>(false);


  const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

  const [SelectRoomName, setSelectRoomName] = useState<string | boolean>(false);
  const [SelectCoOwner, setSelectCoOwner] = useState<string | boolean>(false);

  var objectFiledAddUser: Object = {
    "name": SelectRoomName,
    "owner": currentUser._id,
    "co_owner": SelectCoOwner,
  };




  useEffect(() => {
    setReadyToSend(areAllPropertiesEmpty(objectFiledAddUser))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectRoomName, SelectRoomName])


  const areAllPropertiesEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj[key] === "" || obj[key] === false) {
        return false;
      }
    }
    return true;
  }

  const AddNewRoom = (body: any) => {
    console.log(body)
    SignUp(body.email, body.pseudo, body.password, body.role).then(result => {
      if (isHttpStatusValid(result.status)) {
        displayStatusRequest("user added successfully", false)
        SetLog();
        setAddActive(false)
      } else displayStatusRequest("error " + result.status + " : " + result.response.message, true)
    })
  }


  return (
    <div className="main p20 flex-col relative flex-end-align g25">
      <div className="flex-col g25 w100">
        <Link to={`/`} className='cta cta-blue'><span>Back</span></Link>
        <h2 className="m0">3PROJ :</h2>
        <div className="table-list flex-col p50 dark-bg big-dark-container display-from-left">
          <h2>List of owned room :</h2>
          <ul className='table-list flex-col mb0'>
            <li className='legend'>
              <div className='flex-row flex-bet'>
                <div className='flex-row flex-start-align flex-start-justify w80'>
                  <p className='w20'>ROOM NAME</p>
                  <p className='w20'>OWNER</p>
                  <p className='w20'>CO-OWNER</p>
                  <p className='w10'>USERS COUNT</p>
                  <p className='w10'>TASKS COUNT</p>
                </div>
                <i className={`material-icons mtbauto`}>expand_more</i>
              </div>
            </li>
            {OwnerRoom ? OwnerRoom.map((room: RoomModel) => (room.owner === currentUser._id || room.co_owner === currentUser._id ? (
              <li key={room.id + "userlist"}>
                <div className='flex-row flex-bet'>
                  <div className='flex-row flex-start-align flex-start-justify w80'>
                    <p className='w20'>{room.name}</p>
                    <p className='w20'>{room.owner}</p>
                    <p className='w20'>{room.co_owner}</p>
                    <p className='w10'>{room.users.length}</p>
                    <p className='w10'>{room.tasks.length}</p>
                  </div>
                  <Link to={`/room/` + room.id} className='icon'><i className='material-icons ml10 blue-h'>edit</i></Link>
                </div>

              </li>
            ) : null)) : null}
          </ul>
          <div className='flex-row flex-bet normal-bg-h cta mrauto blue-h' onClick={() => setAddActive(!AddActive)}>
            <span className='add-user flex-row flex-center-align flex-start-justify g15'>
              <i className='material-icons'>add</i>
              Add new User
            </span>
          </div>
        </div>

        <div className="table-list flex-col p50 dark-bg big-dark-container display-from-left">
          <h2>List of not owned room :</h2>
          <ul className='table-list flex-col mb0'>
            <li className='legend'>
              <div className='flex-row flex-bet'>
                <div className='flex-row flex-start-align flex-start-justify w80'>
                  <p className='w20'>ROOM NAME</p>
                  <p className='w20'>OWNER</p>
                  <p className='w20'>CO-OWNER</p>
                  <p className='w10'>USERS COUNT</p>
                  <p className='w10'>TASKS COUNT</p>
                </div>
                <i className={`material-icons mtbauto`}>expand_more</i>
              </div>
            </li>
            {OwnerRoom ? OwnerRoom.map((room: RoomModel) => (room.owner !== currentUser._id || room.co_owner !== currentUser._id ? (
              <li key={room.id + "userlist"}>
                <div className='flex-row flex-bet'>
                  <div className='flex-row flex-start-align flex-start-justify w80'>
                    <p className='w20'>{room.name}</p>
                    <p className='w20'>{room.owner}</p>
                    <p className='w20'>{room.co_owner}</p>
                    <p className='w10'>{room.users.length}</p>
                    <p className='w10'>{room.tasks.length}</p>
                  </div>
                  <Link to={`/room/` + room.id} className='icon'><i className='material-icons ml10 blue-h'>edit</i></Link>
                </div>

              </li>
            ) : null)) : null}
          </ul>

        </div>

        {AddActive ? (
          <div className='flex-row g50'>
            <div className='big-dark-container flex-col mt50 mb50 w35 h5 relative display-from-left zi2'>
              <i className='material-icons red-h absolute r0 mr50' onClick={() => { setAddActive(false) }}>close</i>
              <h2 className='mt0'>Add new User :</h2>
              <div className='flex-col'>

                <p className='title'>Room name :</p>
                <input className='input'
                  name='username'
                  type="text"
                  autoComplete="no-chrome-autofill"
                  onChange={(e) => setSelectRoomName(e.target.value)}
                />

                <p className='title'>Choose Co-Owner :</p>
                <input className='input'
                  name='validpassword'
                  type="password"
                  autoComplete="no-chrome-autofill"
                  onChange={(e) => setSelectCoOwner(e.target.value)}
                />
                <p className='title'>Role :</p>
                <p className="m0 pl20 ">user</p>
                {ReadyToSend ? (
                  <div className="cta mtauto mlauto cta-blue to-right-bottom" onClick={() => AddNewRoom(objectFiledAddUser)}><span>ADD THIS NEW USER</span></div>
                ) : (
                  <div className="cta mtauto mlauto cta-disable to-right-bottom"><span>ADD THIS NEW USER</span></div>
                )}

              </div>
            </div>

          </div>) : null}
      </div >
    </div>
  );
};

export default HomePage3PROJ;
