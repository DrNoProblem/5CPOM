export default class CardModel {
  _id: string;
  costType: "brick" | "weapon" | "crystal";
  costValue: number;
  ownerTargetType:
    | "generatorBrick"
    | "brick"
    | "generatorWeapon"
    | "weapon"
    | "generatorCrystal"
    | "crystal"
    | "health"
    | "shield"
    | "all"
    | null;
  ownerTargetValue: number;
  enemyTargetType:
    | "generatorBrick"
    | "brick"
    | "generatorWeapon"
    | "weapon"
    | "generatorCrystal"
    | "crystal"
    | "health"
    | "shield"
    | "all"
    | null;
  enemyTargetValue: number;
  constructor(
    _id: string,
    costType: "brick" | "weapon" | "crystal",
    costValue: number,
    ownerTargetType:
      | "generatorBrick"
      | "brick"
      | "generatorWeapon"
      | "weapon"
      | "generatorCrystal"
      | "crystal"
      | "health"
      | "shield"
      | null,
    ownerTargetValue: number,
    enemyTargetType:
      | "generatorBrick"
      | "brick"
      | "generatorWeapon"
      | "weapon"
      | "generatorCrystal"
      | "crystal"
      | "health"
      | "shield"
      | null,
    enemyTargetValue: number
  ) {
    this._id = _id;
    this.costType = costType;
    this.costValue = costValue;
    this.ownerTargetType = ownerTargetType;
    this.ownerTargetValue = ownerTargetValue;
    this.enemyTargetType = enemyTargetType;
    this.enemyTargetValue = enemyTargetValue;
  }
}
