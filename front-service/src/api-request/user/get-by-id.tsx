
async function getUserById(user_id:string) {
    var data: any = []
    const response = await fetch(`http://localhost:4000/users/${user_id}`, {
        method: "GET",
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getUserById;