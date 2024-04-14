async function addTask(title: string, details: string, datelimit: Date, correction: string, roomId: string, token: string) {
    const response = await fetch("http://localhost:4100/task/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, details, datelimit, correction, roomId })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default addTask;