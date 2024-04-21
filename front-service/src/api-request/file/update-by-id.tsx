async function UpdateMediaByID(siteID: number, mediaID: number, body: any) {
    var data: any = ''
    try {
        const response = await fetch(`http://localhost:4000/site/${siteID}/media/${mediaID}`, {
            method: "POST",
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        data = { response: await response.json(), status: response.status };
    } catch {
        return false
    }
    return data
}
export default UpdateMediaByID;