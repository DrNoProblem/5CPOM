import React, { FunctionComponent, useState } from "react";
import Card from "./components/card";
import { JsonCardList } from "./data/cards-list";
import { JsonPlayerData } from "./data/players-data";

type Props = {
  returnFunction: Function;
};

const DeckEdition: FunctionComponent<Props> = ({ returnFunction }) => {
  const [playerDeck, setPlayerDeck] = useState(JsonPlayerData.blue.cardDeck);

  const getCardCount = (cardId: string): number => {
    return playerDeck.filter((id) => id === cardId).length;
  };

  const addCardToDeck = (cardId: string) => {
    if (getCardCount(cardId) < 5 && playerDeck.length < 60) {
      setPlayerDeck((prevDeck) => [...prevDeck, cardId]);
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    if (getCardCount(cardId) > 0 && playerDeck.length > 20) {
      setPlayerDeck((prevDeck) => {
        const index = prevDeck.indexOf(cardId);
        if (index !== -1) {
          const newDeck = [...prevDeck];
          newDeck.splice(index, 1);
          return newDeck;
        }
        return prevDeck;
      });
    }
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <div className="flex-center-align flex-bet">
          <div className="flex-center-align g20">
            <div className="cta cta-normal blue-h" onClick={() => returnFunction(JsonPlayerData.blue.cardDeck)}>
              <span className="flex-center g10">
                <i>close</i>close
              </span>
            </div>
            <h2 className="m0">Deck Edition :</h2>
            <h3 className="m0">
              Cards count :
              <span className={playerDeck.length > 20 && playerDeck.length < 60 ? "blue" : "red"}>
                {" "}
                {playerDeck.length} cards
              </span>
            </h3>
            {playerDeck.length > 20 && playerDeck.length < 60 ? null : <span>( min: 20 | max: 60 )</span>}
          </div>
          <div className="cta cta-blue" onClick={() => returnFunction(playerDeck)}>
            <span className="flex-center g10">
              <i>done</i>Valide deck
            </span>
          </div>
        </div>
        <div className="dark-container flex-wrap g20 mb15 flex-center-align">
          {JsonCardList.map((cardData) => (
            <div key={cardData._id} className="edit-deck-card flex-col g5">
              <Card color={"#0084ff"} card={cardData} AddedClass={""} ClickFunction={() => {}} />
              <div className="normal-container flex-bet">
                <span>
                  <i
                    className={`${getCardCount(cardData._id) > 4 ? "red" : "blue-h "}`}
                    onClick={() => addCardToDeck(cardData._id)}
                  >
                    add
                  </i>
                </span>
                <span id={cardData._id}>{getCardCount(cardData._id)}</span>
                <span>
                  <i
                    className={`${getCardCount(cardData._id) < 1 ? "red" : "blue-h "}`}
                    onClick={() => removeCardFromDeck(cardData._id)}
                  >
                    remove
                  </i>
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
