
async function getTasksList() {
    var data: any = []
    const response = await fetch("http://localhost:4100/task/", {
        method: "GET",
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getTasksList;