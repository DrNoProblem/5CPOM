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
  console.log(OwnerTempoData);
  console.log(OpponentTempoData);
  if (OwnerTempoData && OpponentTempoData) {
    if (card.ownerTargetType !== "all" && card.ownerTargetType !== null)
      returnPlayerData = {
        ...OwnerTempoData,
        statRessources: {
          ...OwnerTempoData.statRessources,
          [card.ownerTargetType]:
            OwnerTempoData.statRessources[card.ownerTargetType] + card.ownerTargetValue > 0
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
              OpponentTempoData.statRessources[card.enemyTargetType] + card.enemyTargetValue > 0
                ? 0
                : OpponentTempoData.statRessources[card.enemyTargetType] + card.enemyTargetValue,
          },
        };
      }
    }
  }
  return {
    player: {
      ...returnPlayerData,
      statRessources: {
        ...returnPlayerData.statRessources,
        [card.costType]:
          returnPlayerData.statRessources[card.costType] - card.costValue < 0
            ? returnPlayerData.statRessources[card.costType] - card.costValue
            : 0,
      },
    },
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

export const ExecuteTheProccess = (Player1Data: PlayerDataModel2PROJ, Player2Data: PlayerDataModel2PROJ, Cards: CardModel[]) => {
  console.log("ok"); // Attention: il faut mettre les player dans des variables temporaires pour interagir avec

  let tempoPlayerInfo: { blue: PlayerDataModel2PROJ | null; red: PlayerDataModel2PROJ | null } = { blue: null, red: null }; // Initialisation de tempoPlayerInfo

  console.log("before", tempoPlayerInfo);
  if (Player1Data && Player2Data) {
    tempoPlayerInfo = { blue: Player1Data, red: Player2Data };
  } else {
    return;
  }

  if (
    tempoPlayerInfo.blue &&
    tempoPlayerInfo.blue.turnInfo.played &&
    tempoPlayerInfo.red &&
    tempoPlayerInfo.red.turnInfo.played
  ) {
    // Premier appel à ApplyPlayerCardEffect
    let blueEffectResult = ApplyPlayerCardEffect(
      getCardInfoByIdWithSuffix(tempoPlayerInfo.blue.turnInfo.played, Cards)!,
      tempoPlayerInfo.blue,
      tempoPlayerInfo.red
    );

    // Mise à jour de tempoPlayerInfo avec les résultats du premier appel
    tempoPlayerInfo.blue = blueEffectResult.player;
    tempoPlayerInfo.red = blueEffectResult.enemy;
  }
  if (
    tempoPlayerInfo.blue &&
    tempoPlayerInfo.blue.turnInfo.played &&
    tempoPlayerInfo.red &&
    tempoPlayerInfo.red.turnInfo.played
  ) {
    // Deuxième appel à ApplyPlayerCardEffect basé sur les résultats du premier
    let redEffectResult = ApplyPlayerCardEffect(
      getCardInfoByIdWithSuffix(tempoPlayerInfo.red.turnInfo.played, Cards)!,
      tempoPlayerInfo.red,
      tempoPlayerInfo.blue
    );

    // Mise à jour finale de tempoPlayerInfo avec les résultats du deuxième appel
    tempoPlayerInfo.blue = redEffectResult.enemy;
    tempoPlayerInfo.red = redEffectResult.player;
  }

  console.log("traitement", tempoPlayerInfo);
  if (tempoPlayerInfo && tempoPlayerInfo.blue && tempoPlayerInfo.red) {
    console.log(
      "blue card",
      getCardInfoByIdWithSuffix(
        tempoPlayerInfo.blue.turnInfo.played ? tempoPlayerInfo.blue.turnInfo.played : tempoPlayerInfo.blue.turnInfo.trash!,
        Cards
      )
    );
    console.log(
      "red card",
      getCardInfoByIdWithSuffix(
        tempoPlayerInfo.red.turnInfo.played ? tempoPlayerInfo.red.turnInfo.played : tempoPlayerInfo.red.turnInfo.trash!,
        Cards
      )
    );
    console.log("2traitement", tempoPlayerInfo);

    let CardsPlayerRedData = AddCardToHand(tempoPlayerInfo.red.cardDeck, tempoPlayerInfo.red.cardHand);
    console.log("-");
    console.log(tempoPlayerInfo.red.statRessources.generatorBrick);
    console.log(tempoPlayerInfo.red.statRessources.brick);
    console.log(tempoPlayerInfo.red.statRessources.brick + tempoPlayerInfo.red.statRessources.generatorBrick);
    tempoPlayerInfo.red = {
      ...tempoPlayerInfo.red,
      cardDeck: CardsPlayerRedData.cardDeck,
      cardHand: RemoveCardFromHand(
        CardsPlayerRedData.cardHand,
        tempoPlayerInfo.red.turnInfo.played ? tempoPlayerInfo.red.turnInfo.played : tempoPlayerInfo.red.turnInfo.trash!
      ),
      statRessources: {
        ...tempoPlayerInfo.red.statRessources,
        brick: tempoPlayerInfo.red.statRessources.brick + tempoPlayerInfo.red.statRessources.generatorBrick,
        weapon: tempoPlayerInfo.red.statRessources.brick + tempoPlayerInfo.red.statRessources.generatorWeapon,
        crystal: tempoPlayerInfo.red.statRessources.brick + tempoPlayerInfo.red.statRessources.generatorCrystal,
      },
      turnInfo: { played: null, trash: null },
    };

    let CardsPlayerBlueData = AddCardToHand(tempoPlayerInfo.blue.cardDeck, tempoPlayerInfo.blue.cardHand);
    console.log(tempoPlayerInfo.blue.statRessources.generatorBrick);
    console.log(tempoPlayerInfo.blue.statRessources.brick);
    console.log(tempoPlayerInfo.blue.statRessources.brick + tempoPlayerInfo.blue.statRessources.generatorBrick);
    console.log("-");
    tempoPlayerInfo.blue = {
      ...tempoPlayerInfo.blue,
      cardDeck: CardsPlayerBlueData.cardDeck,
      cardHand: RemoveCardFromHand(
        CardsPlayerBlueData.cardHand,
        tempoPlayerInfo.blue.turnInfo.played ? tempoPlayerInfo.blue.turnInfo.played : tempoPlayerInfo.blue.turnInfo.trash!
      ),
      statRessources: {
        ...tempoPlayerInfo.blue.statRessources,
        brick: tempoPlayerInfo.blue.statRessources.brick + tempoPlayerInfo.blue.statRessources.generatorBrick,
        weapon: tempoPlayerInfo.blue.statRessources.brick + tempoPlayerInfo.blue.statRessources.generatorWeapon,
        crystal: tempoPlayerInfo.blue.statRessources.brick + tempoPlayerInfo.blue.statRessources.generatorCrystal,
      },
      turnInfo: { played: null, trash: null },
    };

    return tempoPlayerInfo;
  }
};
