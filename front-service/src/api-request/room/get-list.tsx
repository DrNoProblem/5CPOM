
async function getRoomsList() {
    var data: any = []
    const response = await fetch("http://localhost:4100/room/", {
        method: "GET",
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getRoomsList;