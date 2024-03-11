import UserModel from '../user-model';

export const voidUser: UserModel = {
    '_id': "",
    'pseudo': "no-display",
    'email': "",
    'password': "",
    'role': "",
    'draws': [],
}

export default voidUser;