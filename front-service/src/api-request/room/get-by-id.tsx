async function getRoomById(roomId: string) {
    const response = await fetch(`http://localhost:4100/room/${roomId}`, {
        method: "GET",
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default getRoomById;