async function DeleteMedia(fileUrl : string) {
    var data: any = ''
    try {
        const response = await fetch(`http://localhost:4200/delete`, {
            method: "DELETE",
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
export default DeleteMedia;