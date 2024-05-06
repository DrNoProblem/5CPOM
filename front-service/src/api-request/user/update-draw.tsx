import { getToken } from "../../helpers/token-verifier";
import UserModel from "../../models/user-model";

async function CurrentUserDrawsUpdate(
  value: string[],
) {
  var data: any = [];
  const response = await fetch("http://localhost:4000/users/updateDraws", {
    method: "PATCH",
    body: JSON.stringify({ draws: value }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  data = { response: await response.json(), status: response.status };
  return data;
}

export default CurrentUserDrawsUpdate;
