import { getToken } from "../../helpers/token-verifier";

async function getCompleteUsersList() {
    var data: any = []
    const response = await fetch("http://localhost:4000/users/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getToken()}`,
        },
    });
    data = {response : await response.json(), status: response.status};
    return data
}

export default getCompleteUsersList;