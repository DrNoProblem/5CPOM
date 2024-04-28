const addTask = async (title: string, details: string, datelimit: Date, roomId: string, token: string) => {
    const response = await fetch("http://localhost:4100/task/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, details, datelimit, roomId })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default addTask;