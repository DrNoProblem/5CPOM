async function deleteTaskById(taskId: string) {
    const response = await fetch(`http://localhost:4100/task/deleteTask/${taskId}`, {
        method: "DELETE",
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default deleteTaskById;