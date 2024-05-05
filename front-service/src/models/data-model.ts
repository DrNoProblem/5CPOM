import DrawModel from "./draw-model";
import MiniUserModel from "./mini-user-model";
import RoomModel from "./room-model";
import TaskModel from "./tasks-model";
import UserModel from "./user-model";

export default class DataModel {
    rooms : RoomModel[];
    tasks : TaskModel[];
    draws : DrawModel[];
    users : UserModel[] | MiniUserModel[];
  constructor(
    rooms : RoomModel[],
    tasks : TaskModel[],
    draws : DrawModel[],
    users : UserModel[] | MiniUserModel[],
  ) {
      this.rooms = rooms;
      this.tasks = tasks;
      this.draws = draws;
      this.users = users;
  }
}