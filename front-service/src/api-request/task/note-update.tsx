async function updateRenderNotes(taskId: string, roomId: string, updates: Array<{ userId: string, note: number }>, token: string) {
    const response = await fetch(`http://localhost:4100/task/updateNote/${taskId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId, updates })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default updateRenderNotes;