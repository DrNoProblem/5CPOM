import CardModel from "../models/card-model";

const getCardInfoById = (id: string, cards: CardModel[]) => {
    return cards.find((card: CardModel) => card._id === id)
}
export default getCardInfoById;