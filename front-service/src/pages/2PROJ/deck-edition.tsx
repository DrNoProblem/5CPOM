import React, { FunctionComponent, useState } from "react";
import UserModel from "../../models/user-model";
import Card from "./components/card";
import { JsonCardList } from "./data/cards-list";
import { JsonPlayerData } from "./data/players-data";

type Props = {
  currentUser: UserModel;
};

const DeckEdition: FunctionComponent<Props> = ({ currentUser }) => {
  const [playerDeck, setPlayerDeck] = useState(JsonPlayerData.blue.cardDeck);

  const getCardCount = (cardId: string): number => {
    return playerDeck.filter((id) => id === cardId).length;
  };

  const addCardToDeck = (cardId: string) => {
    setPlayerDeck((prevDeck) => [...prevDeck, cardId]);
  };

  const removeCardFromDeck = (cardId: string) => {
    setPlayerDeck((prevDeck) => {
      const index = prevDeck.indexOf(cardId);
      if (index !== -1) {
        const newDeck = [...prevDeck];
        newDeck.splice(index, 1);
        return newDeck;
      }
      return prevDeck;
    });
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="m0">Deck Edition :</h2>
        <div className="dark-container flex-wrap g20 mb15 flex-center-align">
          {JsonCardList.map((cardData) => (
            <div key={cardData._id} className="edit-deck-card flex-col g5">
              <Card color={"#0084ff"} card={cardData} AddedClass={""} ClickFunction={() => {}} />
              <div className="normal-container flex-bet">
                <span>
                  <i onClick={() => addCardToDeck(cardData._id)}>add</i>
                </span>
                <span id={cardData._id}>{getCardCount(cardData._id)}</span>
                <span>
                  <i onClick={() => removeCardFromDeck(cardData._id)}>remove</i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckEdition;
