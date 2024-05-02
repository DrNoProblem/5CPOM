import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SignUp from '../../api-request/user/sign-up';
import isHttpStatusValid from '../../helpers/check-status';
import displayStatusRequest from '../../helpers/display-status-request';
import UserModel from '../../models/user-model';

type Props = {
    users: Array<UserModel>
    currentUser: UserModel
    SetLog: Function
};

const ManageUsers: FunctionComponent<Props> = ({ users, currentUser, SetLog }) => {

    const [TableActive, setTableActive] = useState<Boolean>(true);
    const [AddActive, setAddActive] = useState<Boolean>(false);
    const [ReadyToSend, setReadyToSend] = useState<Boolean>(false);

    const [SelectEmail, setSelectEmail] = useState<string | boolean>(false);
    const [SelectUsername, setSelectUsername] = useState<string | boolean>(false);
    const [SelectPassword, setSelectPassword] = useState<string | boolean>(false);
    const [SelectValidpassword, setSelectValidpassword] = useState<string | boolean>(false);

    var objectFiledAddUser: Object = {
        "email": SelectEmail,
        "username": SelectUsername,
        "password": SelectPassword,
        "validpassword": SelectValidpassword,
        "role": "user"
    };




    useEffect(() => {
        setReadyToSend(areAllPropertiesEmpty(objectFiledAddUser))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectEmail, SelectUsername, SelectPassword, SelectValidpassword])


    const areAllPropertiesEmpty = (obj: any) => {
        for (const key in obj) {
            if (obj[key] === "" || obj[key] === false) {
                return false;
            }
        }
        if (!isCorrectEmail(obj.email)) {
            return false;
        }
        if (!isCorrectPassword(obj.password, obj.validpassword)) {
            return false;
        }
        return true;
    }

    const isCorrectEmail = (email: string) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    }

    const isCorrectPassword = (password: string, validpassword: string) => {
        return validpassword === password && password.length >= 8;
    }

    const SendAddUserRequest = () => {
        register(objectFiledAddUser)
    }






    const register = (body: any) => {
        console.log(body)
        SignUp(body.email, body.name, body.password, body.role).then(result => {
            if (isHttpStatusValid(result.status)) {
                displayStatusRequest("user added successfully", false)
                SetLog();
                setAddActive(false)
            } else displayStatusRequest("error " + result.status + " : " + result.response.message, true)
        })
    }

    return (
        <div className='main p20 flex-col relative flex-end-align '>
            <div className="flex-col g10 w100" >
                <div className="table-list flex-col p50 dark-bg dark-container display-from-left">
                    <h2 className="">List of users :</h2>
                    <ul className='table-list flex-col mb0'>
                        <li className='legend' onClick={() => setTableActive(!TableActive)}>
                            <div className='flex-row flex-bet'>
                                <div className='flex-row flex-start-align flex-start-justify w80'>
                                    <p className='w15'>USER NAME</p>
                                    <p className='w15'>ROLE</p>
                                    <p className='w30'>EMAIL</p>
                                    <p className='w30'>ID</p>
                                </div>
                                <i className={` mtbauto ${TableActive ? 'table-active' : 'table-no-active'}`}>expand_more</i>
                            </div>
                        </li>
                        {TableActive ? (
                            users.map((user: UserModel) => (user._id !== currentUser._id ? (
                                <li key={user._id + "userlist"}>
                                    <div className='flex-row flex-bet'>
                                        <div className='flex-row flex-start-align flex-start-justify w80'>
                                            <p className='w15'>{user.name}</p>
                                            <p className='w15'>{user.role}</p>
                                            <p className='w30'>{user.email}</p>
                                            <p className='w30'>{user._id}</p>
                                        </div>
                                        <Link to={`/user/` + user._id} className='icon'><i className=' ml10 blue-h'>edit</i></Link>
                                    </div>

                                </li>
                            ) : null))
                        ) : null}



                    </ul>
                    <div className='flex-row flex-bet normal-bg-h cta mrauto blue-h' onClick={() => setAddActive(!AddActive)}>
                        <span className='add-user flex-row flex-center-align flex-start-justify g15'>
                            <i className=''>add</i>
                            Add new User
                        </span>
                    </div>
                </div>

                {AddActive ? (
                    <div className='flex-row g50'>
                        <div className='dark-container flex-col mt50 mb50 w35 h5 relative display-from-left zi2'>
                            <i className=' red-h absolute r0 mr50' onClick={() => { setAddActive(false)}}>close</i>
                            <h2 className='mt0'>Add new User :</h2>
                            <div className='flex-col'>
                                <p className='title mt0'>Email :</p>
                                <input className='input'
                                    name='email'
                                    type="text"
                                    autoComplete="no-chrome-autofill"
                                    onChange={(e) => setSelectEmail(e.target.value)}
                                />
                                <p className='title'>User name :</p>
                                <input className='input'
                                    name='username'
                                    type="text"
                                    autoComplete="no-chrome-autofill"
                                    onChange={(e) => setSelectUsername(e.target.value)}
                                />
                                <p className='title'>Password :</p>
                                <input className='input'
                                    name='password'
                                    type="password"
                                    autoComplete="no-chrome-autofill"
                                    onChange={(e) => setSelectPassword(e.target.value)}
                                />
                                <p className='title'>Confirm password :</p>
                                <input className='input'
                                    name='validpassword'
                                    type="password"
                                    autoComplete="no-chrome-autofill"
                                    onChange={(e) => setSelectValidpassword(e.target.value)}
                                />
                                <p className='title'>Role :</p>
                                <p className="m0 pl20 ">user</p>
                                {ReadyToSend ? (
                                    <div className="cta mtauto mlauto cta-blue to-right-bottom" onClick={() => SendAddUserRequest()}><span>ADD THIS NEW USER</span></div>
                                ) : (
                                    <div className="cta mtauto mlauto cta-disable to-right-bottom"><span>ADD THIS NEW USER</span></div>
                                )}

                            </div>
                        </div>
                        
                    </div>) : null}
            </div >
        </div >
    );
}

export default ManageUsers;