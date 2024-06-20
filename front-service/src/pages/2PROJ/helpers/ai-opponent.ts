import getCardInfoById from "../../../helpers/getCardInfoById";
import CardModel from "../../../models/card-model";
import PlayerDataModel2PROJ from "../../../models/player-model";
import { cardCanBePlayed, getCardIdSuffixLess } from "./game-function";

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const playRandomCard = (player: PlayerDataModel2PROJ, Cards: CardModel[]): { cardId: string; placement: string } => {
  let playableCards = player.cardHand.filter((card) =>
    cardCanBePlayed(getCardInfoById(getCardIdSuffixLess(card), Cards)!, player)
  );
  let cardToPlay: string;
  let placement: string;
  if (playableCards.length > 0) {
    cardToPlay = playableCards[getRandomNumber(0, playableCards.length - 1)];
    placement = "played";
  } else {
    cardToPlay = player.cardHand[getRandomNumber(0, player.cardHand.length - 1)];
    placement = "trash";
  }

  return { cardId: cardToPlay, placement: placement };
};

export const lvl1TurnAi = (
  players: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ },
  Cards: CardModel[]
): { cardId: string; placement: string } | "" => {
  return players ? playRandomCard(players.red, Cards) : "";
};

export const lvl2TurnAi = (
  players: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ },
  Cards: CardModel[]
): { cardId: string; placement: string } | "" => {
  if (!players) return "";
  let cardWillBePlayed: { cardId: string; placement: string } | null = null;
  let blue: PlayerDataModel2PROJ = players.blue;
  let red: PlayerDataModel2PROJ = players.red;
  let RestantLife: number = blue.statRessources.shield + blue.statRessources.health;

  let cardThatReduceHealth: CardModel[] = red.cardHand
    .map((cardid: string) => getCardInfoById(cardid, Cards))
    .filter((card): card is CardModel => card !== undefined && card.enemyTargetType === "health");

  cardThatReduceHealth.forEach((card: CardModel) => {
    if (cardCanBePlayed(card, red)) {
      if (RestantLife - card.enemyTargetValue <= 0) cardWillBePlayed = { cardId: card._id, placement: "played" };
    }
  });

  if (cardWillBePlayed === null) {
    let cardThatUpgradeHealth: CardModel[] = red.cardHand
      .map((cardid: string) => getCardInfoById(cardid, Cards))
      .filter(
        (card): card is CardModel =>
          card !== undefined && (card.ownerTargetType === "health" || card.ownerTargetType === "shield")
      );

    const bestCard = cardThatUpgradeHealth.reduce((maxCard, currentCard) => {
      return currentCard.ownerTargetValue > (maxCard!.ownerTargetValue || 0) ? currentCard : maxCard;
    }, null as CardModel | null);

    cardWillBePlayed = bestCard ? { cardId: bestCard._id, placement: "played" } : null;
  }

  if (cardWillBePlayed === null) cardWillBePlayed = playRandomCard(red, Cards);
  return cardWillBePlayed;
};
export const lvl3TurnAi = (
  players: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ },
  Cards: CardModel[]
): { cardId: string; placement: string } | "" => {
  return lvl3TurnAi(players, Cards);
};
