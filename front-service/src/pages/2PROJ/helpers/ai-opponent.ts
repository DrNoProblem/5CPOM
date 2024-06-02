import { NumberLiteralType } from "typescript";
import getCardInfoById from "../../../helpers/getCardInfoById";
import CardModel from "../../../models/card-model";
import { cardCanBePlayed } from "./game-function";

interface PlayerDataMode2PROJ {
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
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const playRandomCard = (player: PlayerDataMode2PROJ, Cards: CardModel[]) => {
  let playableCards = player.cardHand.filter((card) => cardCanBePlayed(getCardInfoById(card, Cards)!, player));
  return playableCards[getRandomNumber(0, playableCards.length)];
};

export const lvl1TurnAi = (player: PlayerDataMode2PROJ, Cards: CardModel[]) => {
  return playRandomCard(player, Cards);
};

export const lvl2TurnAi = (players: { blue: PlayerDataMode2PROJ; red: PlayerDataMode2PROJ }, Cards: CardModel[]) => {
  let cardWillBePlayed: string | null = null;
  let blue: PlayerDataMode2PROJ = players.blue;
  let red: PlayerDataMode2PROJ = players.red;
  let RestantLife: number = blue.statRessources.shield + blue.statRessources.health;

  let cardThatReduceHealth: CardModel[] = red.cardHand
    .map((cardid: string) => getCardInfoById(cardid, Cards))
    .filter((card): card is CardModel => card !== undefined && card.enemyTargetType === "health");

  cardThatReduceHealth.forEach((card: CardModel) => {
    if (cardCanBePlayed(card, red)) {
      if (RestantLife - card.enemyTargetValue <= 0) cardWillBePlayed = card._id;
    }
  });
  if (cardWillBePlayed === null) {
    let cardThatUpgradeHealth: CardModel[] = red.cardHand
      .map((cardid: string) => getCardInfoById(cardid, Cards))
      .filter(
        (card): card is CardModel =>
          card !== undefined && (card.ownerTargetType === "health" || card.ownerTargetType === "shield")
      );

    cardWillBePlayed = cardThatUpgradeHealth.reduce((maxCard, currentCard) => {
      return currentCard.ownerTargetValue > (maxCard!.ownerTargetValue || 0) ? currentCard : maxCard;
    }, null as CardModel | null)!._id;
  }

  if (cardWillBePlayed === null) cardWillBePlayed = playRandomCard(red, Cards);
  return cardWillBePlayed;
};
export const lvl3TurnAi = (players: { blue: PlayerDataMode2PROJ; red: PlayerDataMode2PROJ }, Cards: CardModel[]) => {
  return playRandomCard(players.red, Cards);
};
