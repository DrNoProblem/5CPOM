async function logOut() {
    var data: any = ''
    try {
        const response = await fetch("http://localhost:4000/users/logout", {
            method: "GET",
        });
        data = {response : await response.json(), status: response.status};
    } catch {
        return false
    }
    return data
}
export default logOut;