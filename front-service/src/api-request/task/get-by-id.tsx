async function getTaskById(taskId: string) {
    const response = await fetch(`http://localhost:4100/task/${taskId}`, {
        method: "GET",
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default getTaskById;