

export default class UserModel {

    // 1. Typage des propiétés d'un user.
    pseudo: string;
    email: string;
    password: string;
    role: string;
    _id: string;

    // 2. Définition des valeurs par défaut des propriétés d'un user.
    constructor(
        pseudo: string,
        email: string,
        password: string,
        role: string,
        _id: string
    ) {
        // 3. Initialisation des propiétés d'un user.
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.role = role;
        this._id = _id;
    }
}