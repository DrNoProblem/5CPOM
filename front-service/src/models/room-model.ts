

export default class RoomModel {
  id: string;
  name: string;
  owner: string;
  co_owner: string;
  users: string[];
  tasks: string[];
    constructor(
        id: string,
        name: string,
        owner: string,
        co_owner: string,
        users: string[],
        tasks: string[]
    ) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.co_owner = co_owner;
        this.users = users;
        this.tasks = tasks;
    }
}