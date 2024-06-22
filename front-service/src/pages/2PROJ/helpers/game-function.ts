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

export const addCardToHand = (cardDeck: string[], cardHand: string[]) => {
  if (cardDeck.length !== 0) {
    const card = cardDeck.pop()!;
    if (card) cardHand.push(card);
    else return 8 - cardHand.length;
  }
  return { cardDeck: cardDeck, cardHand: cardHand };
};

export const removeCardFromHand = (cardHand: string[], cardId: string) => {
  cardHand = cardHand.filter((card) => card !== cardId);
  return cardHand;
};

export const initGame = (playersInfo: { blue: PlayerDataModel2PROJ; red: PlayerDataModel2PROJ }) => {
  if (playersInfo) {
    let BluePlayerInfo: PlayerDataModel2PROJ = {
      ...playersInfo.blue,
      cardDeck: playersInfo.blue.cardDeck.map((cardId) => addSuffix(cardId, "blue")),
      cardHand: [],
    };
    let RedPlayerInfo: PlayerDataModel2PROJ = {
      ...playersInfo.red,
      cardDeck: playersInfo.red.cardDeck.map((cardId) => addSuffix(cardId, "red")),
      cardHand: [],
    };
    let blueDraw: { cardDeck: string[]; cardHand: string[] } | number;
    let RedDraw: { cardDeck: string[]; cardHand: string[] } | number;
    for (let i = 0; i < 8; i++) {
      blueDraw = addCardToHand(shuffleDeck(BluePlayerInfo.cardDeck), BluePlayerInfo.cardHand);
      RedDraw = addCardToHand(shuffleDeck(RedPlayerInfo.cardDeck), RedPlayerInfo.cardHand);
      if (typeof blueDraw !== "number")
        BluePlayerInfo = { ...BluePlayerInfo, cardDeck: blueDraw.cardDeck, cardHand: blueDraw.cardHand };
      if (typeof RedDraw !== "number")
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

export const ExecuteTheProccess = (blueData: PlayerDataModel2PROJ, redData: PlayerDataModel2PROJ, Cards: CardModel[]) => {
  let tempoPlayerInfo: { blue: PlayerDataModel2PROJ | null; red: PlayerDataModel2PROJ | null } = { blue: null, red: null };
  let redFinalyRessources;
  let blueFinalyRessources;

  let blueCardsPlayerData;
  let redCardsPlayerData;

  let blueNewHand;
  let redNewHand;

  if (blueData && redData) {
    tempoPlayerInfo = { blue: blueData, red: redData };
  } else {
    return;
  }

  if (tempoPlayerInfo.red && tempoPlayerInfo.blue && tempoPlayerInfo.blue.turnInfo.played) {
    let blueEffectResult = getPlayersNewStatRessources(
      getCardInfoByIdWithSuffix(tempoPlayerInfo.blue.turnInfo.played, Cards)!,
      tempoPlayerInfo.blue.statRessources,
      tempoPlayerInfo.red.statRessources
    );
    tempoPlayerInfo.blue.statRessources = blueEffectResult.player;
    tempoPlayerInfo.red.statRessources = blueEffectResult.enemy;
  }
  if (tempoPlayerInfo.blue && tempoPlayerInfo.red && tempoPlayerInfo.red.turnInfo.played) {
    let redEffectResult = getPlayersNewStatRessources(
      getCardInfoByIdWithSuffix(tempoPlayerInfo.red.turnInfo.played, Cards)!,
      tempoPlayerInfo.red.statRessources,
      tempoPlayerInfo.blue.statRessources
    );
    tempoPlayerInfo.blue.statRessources = redEffectResult.enemy;
    tempoPlayerInfo.red.statRessources = redEffectResult.player;
  }

  let resetTurnInfo = { played: null, trash: null };

  if (tempoPlayerInfo.red && tempoPlayerInfo.blue) {
    redFinalyRessources = applyRessourcesGeneration(tempoPlayerInfo.red.statRessources);
    blueFinalyRessources = applyRessourcesGeneration(tempoPlayerInfo.blue.statRessources);

    blueCardsPlayerData = addCardToHand(tempoPlayerInfo.blue.cardDeck, tempoPlayerInfo.blue.cardHand);
    redCardsPlayerData = addCardToHand(tempoPlayerInfo.red.cardDeck, tempoPlayerInfo.red.cardHand);

    if (typeof blueCardsPlayerData === "number")
      blueFinalyRessources = { ...blueFinalyRessources, health: blueFinalyRessources.health - blueCardsPlayerData };

    if (typeof redCardsPlayerData === "number")
      redFinalyRessources = { ...redFinalyRessources, health: redFinalyRessources.health - redCardsPlayerData };

    blueNewHand = removeCardFromHand(
      typeof blueCardsPlayerData === "number" ? tempoPlayerInfo.blue.cardHand : blueCardsPlayerData.cardHand,
      tempoPlayerInfo.blue.turnInfo.played ? tempoPlayerInfo.blue.turnInfo.played : tempoPlayerInfo.blue.turnInfo.trash!
    );
    redNewHand = removeCardFromHand(
      typeof redCardsPlayerData === "number" ? tempoPlayerInfo.red.cardHand : redCardsPlayerData.cardHand,
      tempoPlayerInfo.red.turnInfo.played ? tempoPlayerInfo.red.turnInfo.played : tempoPlayerInfo.red.turnInfo.trash!
    );

    return {
      blue: {
        ...tempoPlayerInfo.blue,
        statRessources: blueFinalyRessources,
        cardDeck: typeof blueCardsPlayerData === "number" ? [] : blueCardsPlayerData.cardDeck,
        cardHand: blueNewHand,
        turnInfo: resetTurnInfo,
      },
      red: {
        ...tempoPlayerInfo.red,
        statRessources: redFinalyRessources,
        cardDeck: typeof redCardsPlayerData === "number" ? [] : redCardsPlayerData.cardDeck,
        cardHand: redNewHand,
        turnInfo: resetTurnInfo,
      },
    };
  }
};

export const getPlayersNewStatRessources = (
  card: CardModel,
  OwnerTempoData: PlayerDataModel2PROJ["statRessources"],
  OpponentTempoData: PlayerDataModel2PROJ["statRessources"]
) => {
  console.log(card);
  let returnPlayerData = OwnerTempoData;
  let returnOpponentData = OpponentTempoData;

  let returnPlayerStatRessources: PlayerDataModel2PROJ["statRessources"] = returnPlayerData;
  let returnOpponentStatRessources: PlayerDataModel2PROJ["statRessources"] = returnOpponentData;

  if (OwnerTempoData && OpponentTempoData) {
    if (card.ownerTargetType !== "all" && card.ownerTargetType !== null) {
      returnPlayerStatRessources = {
        ...OwnerTempoData,
        [card.ownerTargetType]:
          OwnerTempoData[card.ownerTargetType] + card.ownerTargetValue > 0
            ? OwnerTempoData[card.ownerTargetType] + card.ownerTargetValue
            : 0,
      };
    } else if (card.ownerTargetType === "all") {
      returnPlayerStatRessources = {
        ...OwnerTempoData,
        brick: OwnerTempoData.brick + card.enemyTargetValue > 0 ? OwnerTempoData.brick + card.enemyTargetValue : 0,
        weapon: OwnerTempoData.weapon + card.enemyTargetValue > 0 ? OwnerTempoData.weapon + card.enemyTargetValue : 0,
        crystal: OwnerTempoData.crystal + card.enemyTargetValue > 0 ? OwnerTempoData.crystal + card.enemyTargetValue : 0,
        generatorBrick:
          OwnerTempoData.generatorBrick + card.enemyTargetValue > 0 ? OwnerTempoData.generatorBrick + card.enemyTargetValue : 0,
        generatorWeapon:
          OwnerTempoData.generatorWeapon + card.enemyTargetValue > 0 ? OwnerTempoData.generatorWeapon + card.enemyTargetValue : 0,
        generatorCrystal:
          OwnerTempoData.generatorCrystal + card.enemyTargetValue > 0
            ? OwnerTempoData.generatorCrystal + card.enemyTargetValue
            : 0,
      };
    }
    if (card.enemyTargetType !== "all" && card.enemyTargetType !== null) {
      if (card.enemyTargetType === "health") {
        const AttackAndShield = getHealthShieldAfterAttack(
          card.enemyTargetValue * -1,
          OpponentTempoData.shield,
          OpponentTempoData.health
        );
        returnOpponentStatRessources = {
          ...OpponentTempoData,
          health: AttackAndShield.health,
          shield: AttackAndShield.shield,
        };
      } else {
        returnOpponentStatRessources = {
          ...OpponentTempoData,
          [card.enemyTargetType]:
            OpponentTempoData[card.enemyTargetType] + card.enemyTargetValue > 0
              ? OpponentTempoData[card.enemyTargetType] + card.enemyTargetValue
              : 0,
        };
      }
    } else if (card.enemyTargetType === "all") {
      returnOpponentStatRessources = {
        ...OpponentTempoData,
        brick: OpponentTempoData.brick + card.enemyTargetValue > 0 ? OpponentTempoData.brick + card.enemyTargetValue : 0,
        weapon: OpponentTempoData.weapon + card.enemyTargetValue > 0 ? OpponentTempoData.weapon + card.enemyTargetValue : 0,
        crystal: OpponentTempoData.crystal + card.enemyTargetValue > 0 ? OpponentTempoData.crystal + card.enemyTargetValue : 0,
        generatorBrick:
          OpponentTempoData.generatorBrick + card.enemyTargetValue > 0
            ? OpponentTempoData.generatorBrick + card.enemyTargetValue
            : 0,
        generatorWeapon:
          OpponentTempoData.generatorWeapon + card.enemyTargetValue > 0
            ? OpponentTempoData.generatorWeapon + card.enemyTargetValue
            : 0,
        generatorCrystal:
          OpponentTempoData.generatorCrystal + card.enemyTargetValue > 0
            ? OpponentTempoData.generatorCrystal + card.enemyTargetValue
            : 0,
      };
    }
  }
  return {
    player: {
      ...returnPlayerStatRessources,
      [card.costType]:
        returnPlayerStatRessources[card.costType] - card.costValue > 0
          ? returnPlayerStatRessources[card.costType] - card.costValue
          : 0,
    },
    enemy: returnOpponentStatRessources,
  };
};

const applyRessourcesGeneration = (statRessources: PlayerDataModel2PROJ["statRessources"]) => {
  return {
    ...statRessources,
    brick: statRessources.generatorBrick + statRessources.brick,
    crystal: statRessources.generatorCrystal + statRessources.crystal,
    weapon: statRessources.generatorWeapon + statRessources.weapon,
  };
};

const getHealthShieldAfterAttack = (attack: number, shield: number, health: number) => {
  if (attack <= shield) {
    shield -= attack;
  } else {
    attack -= shield;
    health -= attack;
    shield = 0;
  }
  return { health: health, shield: shield };
};
