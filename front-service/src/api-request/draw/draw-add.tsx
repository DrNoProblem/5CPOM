import { getToken } from "../../helpers/token-verifier";

async function addDraw(script: string) {
    const response = await fetch("http://localhost:4100/draw/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ script })
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default addDraw;