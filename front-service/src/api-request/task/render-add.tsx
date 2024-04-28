async function addRenderToTask(taskId: string, render: string, roomId: string, token: string) {
    const response = await fetch(`http://localhost:4100/task/addRender/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ render, roomId })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default addRenderToTask;