async function getCurrent(token:string | undefined) {
    var data: any = []
    const response = await fetch(`http://localhost:4000/users/me`, {
        method: "GET",
        headers: { "authorization" : "Bearer " + token }
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getCurrent;