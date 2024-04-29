import { getToken } from "../../helpers/token-verifier";

async function updateRenderNotes(taskId: string, roomId: string, updates: Array<{ userId: string, note: number }>) {
    const response = await fetch(`http://localhost:4100/task/updateNote/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ roomId, updates })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default updateRenderNotes;