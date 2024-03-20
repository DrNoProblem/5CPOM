import MiniUserModel from "../models/mini-user-model";

const getNameById = (id: string, userList: MiniUserModel[]) => {
    return userList.map((user: MiniUserModel) => user.id === id ? user.name : "unnamed")
}
export default getNameById;