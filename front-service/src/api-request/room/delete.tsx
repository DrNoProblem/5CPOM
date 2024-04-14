async function deleteRoomById(roomId: string) {
    const response = await fetch(`http://localhost:4100/room/deleteRoom/${roomId}`, {
        method: "DELETE",
    });
    const data = { response: await response.json(), status: response.status };
    return data;
}
export default deleteRoomById;