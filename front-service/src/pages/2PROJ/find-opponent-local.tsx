import React, { FunctionComponent, useState } from "react";



const FindOpponentLocal: FunctionComponent = () => {
  const [MenuOpen, setMenuOpen] = useState("start");
  const [Pseudo, setPseudo] = useState("");


  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h2 className="">Find Opponent in local network :</h2>
        <div className="flex-wrap g20 w80 mb15 flex-center-align">
        </div>
        {MenuOpen === "start" ? (
          <div className="add-item-popup">
            <div className="dark-background zi1"></div>
            <div className="dark-container zi1 g15 w30 flex-col mt50">
              <h2 className="m0">Choose a Pseudo :</h2>
              <input type="text" onChange={(e) => setPseudo(e.target.value)} />
              <div className="cta cta-blue mrauto" onClick={() => setMenuOpen("")}>
                <span className="flex-center g10">Choose</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default FindOpponentLocal;
