import React, { FunctionComponent } from "react";
import UserModel from "../../models/user-model";

type Props = {
  currentUser: UserModel;
};
const DeckEdition: FunctionComponent<Props> = ({ currentUser }) => {
  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="">Deck Edition :</h2>
        <div className="flex-wrap g20 w80 mb15 flex-center-align"></div>
      </div>
    </div>
  );
};
export default DeckEdition;
