import CardModel from "../../models/card-model";

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

export const ApplyPlayerCardEffect = (card: CardModel, OwnerTempoData: PlayerDataMode2PROJ, OpponentTempoData: PlayerDataMode2PROJ) => {
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
    if (card.opponentTargetType !== "all") {
      if (card.opponentTargetType === "health") {
        let tempoShield = OpponentTempoData.statRessources.shield - card.opponentTargetValue;
        let tempoAttack = card.opponentTargetValue;
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
            [card.opponentTargetType]:
              OpponentTempoData.statRessources[card.opponentTargetType] + card.opponentTargetValue === 0
                ? 0
                : OpponentTempoData.statRessources[card.opponentTargetType] + card.opponentTargetValue,
          },
        };
      }
    }
  }
  return {
    player: returnPlayerData,
    opponent: returnOpponentData,
  };
};
