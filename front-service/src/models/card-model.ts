export default class CardModel {
  _id: string;
  name: string;
  description: string;
  costType: "brick"  | "weapon"  | "crystal";
  costValue: number;
  ownerTargetType: ( | "generatorBrick" | "brick" | "generatorWeapon" | "weapon" | "generatorCrystal" | "crystal" | "hp" | "shield" | "all" );
  ownerTargetValue: number;
  opponentTargetType: ( | "generatorBrick" | "brick" | "generatorWeapon" | "weapon" | "generatorCrystal" | "crystal" | "hp" | "shield" | "all"  );
  opponentTargetValue: number;
  constructor(
    _id: string,
    name: string,
    description: string,
    costType: "brick"  | "weapon"  | "crystal",
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
    ),
    ownerTargetValue: number,
    opponentTargetType: (
       | "generatorBrick"
       | "brick"
       | "generatorWeapon"
       | "weapon"
       | "generatorCrystal"
       | "crystal"
       | "hp"
       | "shield"
    ),
    opponentTargetValue: number
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.costType = costType;
    this.costValue = costValue;
    this.ownerTargetType = ownerTargetType;
    this.ownerTargetValue = ownerTargetValue;
    this.opponentTargetType = opponentTargetType;
    this.opponentTargetValue = opponentTargetValue;
  }
}
