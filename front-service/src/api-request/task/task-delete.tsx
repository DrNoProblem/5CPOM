async function DeleteTaskById(token:string, id: string) {
    var data: any = []
    const response = await fetch(`http://localhost:4100/task/deleteTask/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // token d'authentification
        },
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default DeleteTaskById;