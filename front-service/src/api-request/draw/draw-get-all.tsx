
async function getDrawsList() {
    var data: any = []
    const response = await fetch("http://localhost:4100/draw/", {
        method: "GET",
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getDrawsList;