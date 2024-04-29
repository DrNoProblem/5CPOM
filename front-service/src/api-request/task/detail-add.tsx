import { getToken } from "../../helpers/token-verifier";

async function addDetailToTask(taskId: string, correctionDetails: any) {
    const response = await fetch(`http://localhost:4100/task/addDetail/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(correctionDetails)
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default addDetailToTask;