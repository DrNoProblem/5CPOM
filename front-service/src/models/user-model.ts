export default class UserModel {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  draws: string[];
  notes: { taskId: string; note: number }[];
  deck: string[];
  constructor(
    _id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    draws: string[],
    notes: { taskId: string; note: number }[],
    deck: string[]
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.draws = draws;
    this.notes = notes;
    this.deck = deck;
  }
}
