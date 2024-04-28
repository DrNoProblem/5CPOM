async function updateTaskById(taskId: string, updates: any) {
    const response = await fetch(`http://localhost:4100/task/updateTask/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default updateTaskById;