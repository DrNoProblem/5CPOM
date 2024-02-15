async function logIn(email: string, password: string) {
    var data: any = ''
    try {
        const response = await fetch("http://localhost:4000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        data = {response : await response.json(), status: response.status};
    } catch {
        return false
    }
    return data
}
export default logIn;