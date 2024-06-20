import CardModel from "../../../models/card-model";
import PlayerDataModel2PROJ from "../../../models/player-model";
import { v4 as uuidv4 } from "uuid";

export const cardCanBePlayed = (CardHandValue: CardModel, Owner: PlayerDataModel2PROJ) => {
  return Owner.statRessources[CardHandValue.costType] >= CardHandValue.costValue;
};

export const shuffleDeck = (deck: string[]): string[] => {
  let shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const AddCardToHand = (cardDeck: string[], cardHand: string[]) => {
  if (cardDeck.length !== 0) {
    const card = cardDeck.pop()!;
    cardHand.push(card);
  }
  return { cardDeck: cardDeck, cardHand: cardHand };
};

export const RemoveCardFromHand = (cardHand: string[], cardId: string) => {
  cardHand = cardHand.filter((card) => card !== cardId);
  return cardHand;
};

export const ReturnCardInDeck = (cardDeck: string[], cardId: string) => {
  cardDeck.push(cardId);
  return cardDeck;
};

export const ApplyPlayerCardEffect = (
  card: CardModel,
  OwnerTempoData: PlayerDataModel2PROJ,
  OpponentTempoData: PlayerDataModel2PROJ
) => {
  let returnPlayerData = OwnerTempoData;
  let returnOpponentData = OpponentTempoData;
  if (OwnerTempoData && OpponentTempoData) {
    if (card.ownerTargetType !== "all" && card.ownerTargetType !== null)
      returnPlayerData = {
        ...OwnerTempoData,
        statRessources: {
          ...OwnerTempoData.statRessources,
          [card.costType]:
            OwnerTempoData.statRessources[card.costType] - card.costValue === 0
              ? 0
              : OwnerTempoData.statRessources[card.costType] - card.costValue,
          [card.ownerTargetType]:
            OwnerTempoData.statRessources[card.ownerTargetType] + card.ownerTargetValue === 0
              ? 0
              : OwnerTempoData.statRessources[card.ownerTargetType] + card.ownerTargetValue,
        },
      };
    if (card.enemyTargetType !== "all" && card.enemyTargetType !== null) {
      if (card.enemyTargetType === "health") {
        let tempoShield = OpponentTempoData.statRessources.shield - card.enemyTargetValue;
        let tempoAttack = card.enemyTargetValue;
        let tempoHealth = OpponentTempoData.statRessources.health;
        if (tempoAttack <= tempoShield) {
          tempoShield -= tempoAttack;
        } else {
          tempoAttack -= tempoShield;
          tempoShield = 0;
          tempoHealth -= tempoAttack;
        }
        returnOpponentData = {
          ...OpponentTempoData,
          statRessources: {
            ...OpponentTempoData.statRessources,
            health: tempoHealth,
            shield: tempoShield,
          },
        };
      } else {
        returnOpponentData = {
          ...OpponentTempoData,
          statRessources: {
            ...OpponentTempoData.statRessources,
            [card.enemyTargetType]:
              OpponentTempoData.statRessources[card.enemyTargetType] + card.enemyTargetValue === 0
                ? 0
                : OpponentTempoData.statRessources[card.enemyTargetType] + card.enemyTargetValue,
          },
        };
      }
    }
  }
  return {
    player: returnPlayerData,
    enemy: returnOpponentData,
  };
};

export const initGame = (playersInfo: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ }) => {
  if (playersInfo) {
    let BluePlayerInfo: PlayerDataModel2PROJ = {
      ...playersInfo.blue,
      cardDeck: playersInfo.blue.cardDeck.map((cardId) => addSuffix(cardId, "blue")),
    };
    let RedPlayerInfo: PlayerDataModel2PROJ = {
      ...playersInfo.red,
      cardDeck: playersInfo.red.cardDeck.map((cardId) => addSuffix(cardId, "red")),
    };
    let blueDraw: { cardDeck: string[]; cardHand: string[] };
    let RedDraw: { cardDeck: string[]; cardHand: string[] };
    for (let i = 0; i < 8; i++) {
      blueDraw = AddCardToHand(shuffleDeck(BluePlayerInfo.cardDeck), BluePlayerInfo.cardHand);
      RedDraw = AddCardToHand(shuffleDeck(RedPlayerInfo.cardDeck), RedPlayerInfo.cardHand);
      BluePlayerInfo = { ...BluePlayerInfo, cardDeck: blueDraw.cardDeck, cardHand: blueDraw.cardHand };
      RedPlayerInfo = { ...RedPlayerInfo, cardDeck: RedDraw.cardDeck, cardHand: RedDraw.cardHand };
    }
    return { blue: BluePlayerInfo, red: RedPlayerInfo };
  }
};

export const addSuffix = (cardId: string, owner: "blue" | "red"): string => {
  return `${cardId}-${owner}-${uuidv4()}`;
};

export const getCardIdSuffixLess = (cardIdWithSuffix: string): string => {
  return cardIdWithSuffix.split("-")[0];
};

export const getCardInfoByIdWithSuffix = (cardIdWithSuffix: string, cards: CardModel[]): CardModel | undefined => {
  const cardId = getCardIdSuffixLess(cardIdWithSuffix);
  return cards.find((card) => card._id === cardId);
};
