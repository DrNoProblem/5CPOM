export default class CardModel {
  _id: string;
  name: string;
  description: string;
  costType: "brick" | "weapon" | "crystal";
  costValue: number;
  ownerTargetType: (
    | "generatorBrick"
    | "brick"
    | "generatorWeapon"
    | "weapon"
    | "generatorCrystal"
    | "crystal"
    | "hp"
    | "shield"
  )[];
  ownerTargetValue: number[];
  enemyTargetType: (
    | "generatorBrick"
    | "brick"
    | "generatorWeapon"
    | "weapon"
    | "generatorCrystal"
    | "crystal"
    | "hp"
    | "shield"
  )[];
  enemyTargetValue: number[];
  constructor(
    _id: string,
    name: string,
    description: string,
    costType: "brick" | "weapon" | "crystal",
    costValue: number,
    ownerTargetType: (
      | "generatorBrick"
      | "brick"
      | "generatorWeapon"
      | "weapon"
      | "generatorCrystal"
      | "crystal"
      | "hp"
      | "shield"
    )[],
    ownerTargetValue: number[],
    enemyTargetType: (
      | "generatorBrick"
      | "brick"
      | "generatorWeapon"
      | "weapon"
      | "generatorCrystal"
      | "crystal"
      | "hp"
      | "shield"
    )[],
    enemyTargetValue: number[]
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.costType = costType;
    this.costValue = costValue;
    this.ownerTargetType = ownerTargetType;
    this.ownerTargetValue = ownerTargetValue;
    this.enemyTargetType = enemyTargetType;
    this.enemyTargetValue = enemyTargetValue;
  }
}
