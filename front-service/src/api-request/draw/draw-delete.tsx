import { getToken } from "../../helpers/token-verifier";

async function DeleteDrawById(id: string) {
    var data: any = []
    const response = await fetch(`http://localhost:4100/draw/deleteDraw/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default DeleteDrawById;