import { getToken } from "../../helpers/token-verifier";

const addTask = async (title: string, details: string, datelimit: Date, roomId: string) => {
    const response = await fetch("http://localhost:4100/task/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, details, datelimit, roomId })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default addTask;