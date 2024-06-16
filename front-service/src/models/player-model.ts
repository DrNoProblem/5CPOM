export default class PlayerDataModel2PROJ {
  username: string;
  cardDeck: string[];
  cardHand: string[];
  statRessources: {
    generatorBrick: number;
    brick: number;
    generatorWeapon: number;
    weapon: number;
    generatorCrystal: number;
    crystal: number;
    health: number;
    shield: number;
  };
  turnInfo: {
    trash: string | null;
    played: string | null;
  };
  constructor(
    username: string,
    cardDeck: string[],
    cardHand: string[],
    statRessources: {
      generatorBrick: number;
      brick: number;
      generatorWeapon: number;
      weapon: number;
      generatorCrystal: number;
      crystal: number;
      health: number;
      shield: number;
    },
    turnInfo: {
      trash: string | null;
      played: string | null;
    }
  ) {
    this.username = username;
    this.cardDeck = cardDeck;
    this.cardHand = cardHand;
    this.statRessources = statRessources;
    this.turnInfo = turnInfo;
  }
}
