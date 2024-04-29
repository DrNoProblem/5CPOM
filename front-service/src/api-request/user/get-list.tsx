import { getToken } from "../../helpers/token-verifier";

async function getUsersList() {
    var data: any = []
    const response = await fetch("http://localhost:4000/users/mini", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getUsersList;