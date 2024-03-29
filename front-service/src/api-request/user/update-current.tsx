import UserModel from "../../models/user-model";

async function CurrentUserUpdate(user:UserModel, token:string | undefined, valueType:string, value:string) {
    var data: any = []
    const response = await fetch("http://localhost:4000/users/updateMe", {
        method: "PATCH",
        body: JSON.stringify({ ...user, [valueType]: value}),
        headers: { "Content-Type": "application/json", "authorization" : "Bearer " + token}
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default CurrentUserUpdate;