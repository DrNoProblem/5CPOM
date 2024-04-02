

export default class RoomModel {
  _id: string;
  name: string;
  owner: string;
  co_owner: string;
  users: string[];
  tasks: string[];
    constructor(
        _id: string,
        name: string,
        owner: string,
        co_owner: string,
        users: string[],
        tasks: string[]
    ) {
        this._id = _id;
        this.name = name;
        this.owner = owner;
        this.co_owner = co_owner;
        this.users = users;
        this.tasks = tasks;
    }
}