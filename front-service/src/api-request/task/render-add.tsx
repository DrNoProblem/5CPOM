import { getToken } from "../../helpers/token-verifier";

async function addRenderToTask(taskId: string, render: string, roomId: string) {
    const response = await fetch(`http://localhost:4100/task/addRender/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ render, roomId })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default addRenderToTask;