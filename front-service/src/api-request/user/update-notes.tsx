import { getToken } from "../../helpers/token-verifier";

async function UserNotesUpdate(
  value: {
    userId: string;
    notes: {
      note: number;
      script: string;
      taskId: string;
      roomId: string;
    };
  }[]
) {
  var data: any = [];
  const response = await fetch("http://localhost:4000/users/updateNoteUsers", {
    method: "POST",
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
