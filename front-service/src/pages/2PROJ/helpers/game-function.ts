import CardModel from "../../../models/card-model";

interface PlayerDataModel2PROJ {
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

export const cardCanBePlayed = (CardHandValue: CardModel, Owner: PlayerDataModel2PROJ) => {
  if (Owner.statRessources[CardHandValue.costType] >= CardHandValue.costValue) {
    return true;
  } else {
    return false;
  }
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
    if (card.ownerTargetType !== "all")
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
    if (card.enemyTargetType !== "all") {
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
