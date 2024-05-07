import { getToken } from "../../helpers/token-verifier";

async function UserNotesUpdate(value: { id: string; script: string; note: number  }[]) {
  var data: any = [];
  const response = await fetch("http://localhost:4000/users/updateNotes", {
    method: "PATCH",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });
  data = { response: await response.json(), status: response.status };
  return data;
}

export default UserNotesUpdate;
