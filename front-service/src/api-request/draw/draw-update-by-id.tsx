async function updateDrawById(drawId: string, updates: any) {
    const response = await fetch(`http://localhost:4100/draw/updateDraw/${drawId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}

export default updateDrawById;