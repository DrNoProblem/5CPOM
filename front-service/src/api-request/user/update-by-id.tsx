async function userUpdate(userID:string, token:string, valueType:string, value:string) {
    var data: any = []
    const response = await fetch("http://localhost:4000/users/"+userID, {
        method: "PATCH",
        body: JSON.stringify({[valueType]: value}),
        headers: { "Content-Type": "application/json", "authorization" : "Bearer " + token}
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default userUpdate;