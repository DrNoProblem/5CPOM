import { getToken } from "../../helpers/token-verifier";
import UserModel from "../../models/user-model";

async function CurrentUserUpdate(user: UserModel, valueType: string, value: string) {
  var data: any = [];
  const response = await fetch("http://localhost:4000/users/updateMe", {
    method: "PATCH",
    body: JSON.stringify({ ...user, [valueType]: value }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  data = { response: await response.json(), status: response.status };
  return data;
}

export default CurrentUserUpdate;
