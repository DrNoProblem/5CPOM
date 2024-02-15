async function SignUp(email:string, username:string, password:string, role:string ) {
    var data: any = ''
    try {
        const response = await fetch("http://localhost:4000/users/signup", {
            method: "POST",
            body: JSON.stringify({ email, username, password, role }),
            headers: { "Content-Type": "application/json"}

        });
        data = {response : await response.json(), status: response.status};
    } catch {
        return false
    }
    return data
}
export default SignUp;