async function addDetailToTask(taskId: string, correctionDetails: any, token: string) {
    const response = await fetch(`http://localhost:4100/task/addDetail/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(correctionDetails)
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default addDetailToTask;