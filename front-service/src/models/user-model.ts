

export default class UserModel {
    _id: string;
    pseudo: string;
    email: string;
    password: string;
    role: string;
    draws: {date: Date, script: string}[];
    constructor(
        _id: string,
        pseudo: string,
        email: string,
        password: string,
        role: string,
        draws: {date: Date, script: string}[]
    ) {
        this._id = _id;
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.role = role;
        this.draws = draws;
    }
}