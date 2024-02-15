
async function getUsersList(token: string | undefined) {
    var data: any = []
    const response = await fetch("http://localhost:4000/users/", {
        method: "GET",
        headers: { "Content-Type": "application/json", "authorization": "Bearer " + token }
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getUsersList;