import CardModel from "./card-model";
import DrawModel from "./draw-model";
import MiniUserModel from "./mini-user-model";
import RoomModel from "./room-model";
import TaskModel from "./tasks-model";
import UserModel from "./user-model";

export default class DataModel {
    rooms : RoomModel[];
    tasks : TaskModel[];
    draws : DrawModel[];
    cards: CardModel[];
    users : UserModel[] | MiniUserModel[];
  constructor(
    rooms : RoomModel[],
    tasks : TaskModel[],
    draws : DrawModel[],
    cards: CardModel[],
    users : UserModel[] | MiniUserModel[],
  ) {
      this.rooms = rooms;
      this.tasks = tasks;
      this.draws = draws;
      this.cards = cards;
      this.users = users;
  }
}