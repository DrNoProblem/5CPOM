async function GetMediaSelection(siteID: number, mediaIDs: string) {
    var data: any = ''
    try {
        const response = await fetch(`http://localhost:4000/site/${siteID}/media/${mediaIDs}`, {
            method: "GET",
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
export default GetMediaSelection;