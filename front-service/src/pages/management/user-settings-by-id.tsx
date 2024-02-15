import Cookies from 'js-cookie';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import DeleteUserById from '../../api-request/user/delete';
import userUpdate from '../../api-request/user/update-by-id';
import isHttpStatusValid from '../../helpers/check-status';
import displayStatusRequest from '../../helpers/display-status-request';
import voidUser from '../../models/mocks/void-user';
import UserModel from '../../models/user-model';



interface Props extends RouteComponentProps<{ id: string }> {
    userList: Array<UserModel>
    SetLog: Function
}

const UserSettings: FunctionComponent<Props> = ({ match, userList, SetLog }) => {

    useEffect(() => {
        userList.forEach(element => {
            if (element._id == match.params.id) {
                setUser(element)
            }
        });
    }, [match.params.id, userList])


    const history = useHistory();

    const [ValueToSend, setValueToSend] = useState<string | boolean>(false);


    const [user, setUser] = useState<UserModel>(voidUser);





    const [EditMode, setEditMode] = useState<string | boolean>(false);
    useEffect(() => {
        setValueToSend(false)
        setRandomNumber(generateRandomNumber())
    }, [EditMode])

    const [SelectPassword, setSelectPassword] = useState<string>("");
    const [SelectValidpassword, setSelectValidpassword] = useState<string>("");
    let objPassWord: any = {
        'password': SelectPassword,
        'validpassword': SelectValidpassword
    }
    useEffect(() => {
        setValueToSend((isCorrectPassword(objPassWord.password, objPassWord.validpassword)) ? objPassWord.password : false)
    }, [SelectPassword, SelectValidpassword])

    const [EditUserName, setEditUserName] = useState<string>("");
    useEffect(() => {
        setValueToSend((EditUserName === '') ? false : EditUserName)
    }, [EditUserName])

    const [EditMail, setEditMail] = useState<string>("");
    useEffect(() => {
        setValueToSend(isCorrectEmail(EditMail) ? EditMail : false)
    }, [EditMail])



    const isCorrectEmail = (email: string) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
    }

    const isCorrectPassword = (password: string, validpassword: string) => {
        return validpassword === password && password.length >= 8;
    }

    const SendRequestUpdateUser = () => {
        if (typeof (EditMode) === "string" && typeof (ValueToSend) === "string") UpdateUserById(match.params.id, (EditMode === 'choosen site') ? 'site' : EditMode, ValueToSend)
    }

    const generateRandomNumber = () => {
        const random = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
        return (random.toString());
    };
    const [randomNumber, setRandomNumber] = useState<string>(generateRandomNumber());
    const [CorrectCode, setCorrectCode] = useState<string | boolean>(false);
    useEffect(() => {
        if (CorrectCode !== randomNumber) {
            setCorrectCode(false)
        }
    }, [CorrectCode])

    const SendRequestDeleteUser = (id: string) => {
        DeleteUser(id)
        history.push("/manage-users")
    }

    const UpdateUserById = (userID: string, valueType: string, value: string) => {
        const token = Cookies.get('token')
        if (token) {
            userUpdate(userID, token, valueType, value).then(result => {
                if (isHttpStatusValid(result.response)) {
                    displayStatusRequest(result.response.message, false)
                    SetLog();
                    setEditMode(false);
                } else displayStatusRequest("error " + result.status + " : " + result.response.message, true)
            })
        }
    }

    const DeleteUser = (target: string) => {
        const token = Cookies.get('token')
        if (token) {
            DeleteUserById(token, target).then(result => {
                if (isHttpStatusValid(result.response)) {
                    displayStatusRequest(result.response.message, false)
                    SetLog();
                    setEditMode(false);
                } else displayStatusRequest("error " + result.status + " : " + result.response.message, true)
            })
        }
    }

    return (
        <div className='main p20 flex-col relative flex-end-align '>
            <div className="flex-col g10 w100" >
                <div>
                    <Link to='/manage-users' className='cta cta-blue '><span>Back to users list</span></Link>
                </div>
                <div className="flex-row g50">
                    <div className='big-dark-container flex-col flex-start-align flex-start-justify w35 display-from-left zi2'>
                        <h2 className='mt0'>Edit user :</h2>
                        <div className="flex-col w100">
                            <div className="item flex-row flex-center-align normal-bg-h">
                                <p className='pr10 txt-end w25'>username :</p>
                                <p className=''>{user.pseudo}</p>
                                <i className='material-icons blue-h mlauto mr15' onClick={() => setEditMode('username')}>edit</i>
                            </div>

                            <div className="item flex-row flex-center-align normal-bg-h">
                                <p className='pr10 txt-end w25'>email :</p>
                                <p className=''>{user.email}</p>
                                <i className='material-icons blue-h mlauto mr15' onClick={() => setEditMode('email')}>edit</i>
                            </div>


                            <div className="item flex-row flex-center-align normal-bg-h">
                                <p className='pr10 txt-end w25'>password :</p>
                                <p className=''>********</p>
                                <i className='material-icons blue-h mlauto mr15' onClick={() => setEditMode('password')}>edit</i>
                            </div>

                            <div className="item flex-row flex-center-align">
                                <p className='pr10 txt-end w25'>role :</p>
                                <p className=''>{user.role}</p>
                            </div>
                        </div>

                        <div className="cta cta-red mt25" onClick={() => setEditMode('deleteUser')}><span>Delete this user</span></div>
                    </div>
                    {EditMode ? (
                        <div className="edit-mode big-dark-container flex-col flex-start-align flex-bet w35 relative display-from-left">
                            <div className='mb20'>
                                <i className='material-icons red-h absolute r0 mr50' onClick={() => setEditMode(false)}>close</i>
                                {EditMode !== 'deleteUser' ? (
                                    <h2 className='mt0'>Edit {EditMode} :</h2>
                                ) : (
                                    <h2 className='mt0'>Confirm to delete this user :</h2>
                                )}
                                

                                {EditMode === 'password' ? (
                                    <div className="w100">
                                        <p>new {EditMode}:</p>
                                        <input type="text" onChange={(e) => setSelectPassword(e.target.value)} />
                                        <p>confirm new {EditMode}:</p>
                                        <input type="text" onChange={(e) => setSelectValidpassword(e.target.value)} />
                                    </div>
                                ) : null}

                                {EditMode === 'email' ? (
                                    <div className="w100">
                                        <p>new {EditMode}:</p>
                                        <input type="text" onChange={(e) => setEditMail(e.target.value)} />
                                    </div>
                                ) : null}

                                {EditMode === 'username' ? (
                                    <div className="w100">
                                        <p>new {EditMode}:</p>
                                        <input type="text" onChange={(e) => setEditUserName(e.target.value)} />
                                    </div>
                                ) : null}


                                {EditMode === 'deleteUser' ? (
                                    <div className="w100">
                                        <span className="code-to-delete small-normal-container flex-center">{randomNumber}</span>
                                        <p>Enter the code :</p>
                                        <input type="text" onChange={(e) => setCorrectCode(e.target.value)} />
                                    </div>
                                ) : null}

                            </div>
                            {EditMode !== 'deleteUser' ? (
                                <div className='mlauto'>

                                    {ValueToSend ? (
                                        <div className="cta cta-blue to-right-bottom" onClick={() => { SendRequestUpdateUser() }}><span>valid changement</span></div>
                                    ) : (
                                        <div className="cta cta-disable to-right-bottom"><span>can not valid</span></div>
                                    )}
                                </div>
                            ) : (

                                <div className='mlauto'>
                                    {
                                        CorrectCode ? (
                                            <div className="cta cta-blue to-right-bottom" onClick={() => { SendRequestDeleteUser(user._id) }}><span>delete the user</span></div>
                                        ) : (
                                            <div className="cta cta-disable to-right-bottom"><span>code is not correct</span></div>
                                        )}
                                </div>
                            )}



                        </div>
                    ) : null}
                </div>

            </div>


        </div >
    );
}

export default UserSettings;