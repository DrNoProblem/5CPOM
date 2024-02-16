import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../models/user-model";
import "./style.scss";

type Props = {
  currentUser: UserModel;
};

const HomePage1PROJ: FunctionComponent<Props> = ({ currentUser }) => {
  const [virtualBoard, setVirtualBoard] = useState<
    { p: number; d: string[]; ab: string }[][]
  >([
    [
      { p: 1, d: ["E", "ES", "S"], ab: "bot-right" },
      { p: 1, d: ["E", "S", "W"], ab: "bot-right" },
      { p: 1, d: ["E", "ES", "S", "SW", "W"], ab: "" },
      { p: 1, d: ["E", "S", "W"], ab: "bot-left" },
      { p: 1, d: ["S", "SW", "W"], ab: "bot-left" },
    ],
    [
      { p: 1, d: ["N", "E", "S"], ab: "bot-right" },
      { p: 1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], ab: "diag" },
      { p: 1, d: ["N", "E", "S", "W"], ab: "cross" },
      { p: 1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], ab: "diag" },
      { p: 1, d: ["N", "S", "W"], ab: "bot-left" },
    ],
    [
      { p: 1, d: ["N", "NE", "E", "ES", "S"], ab: "" },
      { p: 1, d: ["N", "E", "S", "W"], ab: "cross" },
      { p: 0, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], ab: "" },
      { p: -1, d: ["N", "E", "S", "W"], ab: "cross" },
      { p: -1, d: ["N", "S", "SW", "W", "WN"], ab: "" },
    ],
    [
      { p: -1, d: ["N", "E", "S"], ab: "top-right" },
      { p: -1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], ab: "diag" },
      { p: -1, d: ["N", "E", "S", "W"], ab: "cross" },
      { p: -1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], ab: "diag" },
      { p: -1, d: ["N", "S", "W"], ab: "top-left" },
    ],
    [
      { p: -1, d: ["N", "NE", "E"], ab: "top-right" },
      { p: -1, d: ["N", "E", "W"], ab: "top-right" },
      { p: -1, d: ["N", "NE", "E", "W", "WN"], ab: "" },
      { p: -1, d: ["N", "E", "W"], ab: "top-left" },
      { p: -1, d: ["N", "W", "WN"], ab: "top-left" },
    ],
  ]);

  const [P1score, setP1score] = useState<number>(0);
  const [P2score, setP2score] = useState<number>(0);

  const [MenuOpen, setMenuOpen] = useState<boolean>(true);

  const [PlayerTurn, setPlayerTurn] = useState<number>(0);

  const InitGame = () => {
    setMenuOpen(false);
    setPlayerTurn(1);
  };

  const NextTurn = () => {
    setPlayerTurn(PlayerTurn * -1);
  };

  const getListDirectionSelectedPawn = () => {
    if (PawnSelected) {
      const PlaceDirection: string[] =
        virtualBoard[PawnSelected.y][PawnSelected.x].d;
      if (PawnSelected.player == -1)
        return PlaceDirection.filter((direction) => !direction.includes("S"));
      else if (PawnSelected.player == 1)
        return PlaceDirection.filter((direction) => !direction.includes("N"));
      return PlaceDirection;
    }
  };

  const checkPossibleMove = () => {
    if (PawnSelected) {
      let listDirection = getListDirectionSelectedPawn();
      console.log(PawnSelected);
      console.log(listDirection);
      if (listDirection && listDirection.length > 0) {
        listDirection.map((element: string) => {
          switch (element) {
            case "N":
              if (
                virtualBoard[PawnSelected.y][PawnSelected.x + 1] &&
                virtualBoard[PawnSelected.y][PawnSelected.x + 1].p == 0
              ) {
                return true;
              }
              break;
            case "NE":
              if (
                virtualBoard[PawnSelected.y][PawnSelected.x + 1] &&
                virtualBoard[PawnSelected.y][PawnSelected.x + 1].p == 0
              ) {
                return true;
              }
              break;
          }
        });
      }
    }
  };

  const [PawnSelected, setPawnSelected] = useState<
    { x: number; y: number; player: number } | false
  >(false);

  const clickPawn = (element: any) => {
    let spanPawn = element.target;
    if (spanPawn.classList.contains("pawn")) {
      spanPawn = spanPawn.parentElement;
    }

    if (PawnSelected) {
      if (spanPawn.classList.contains("pawn-selected")) {
        setPawnSelected(false);
        spanPawn.classList.remove("pawn-selected");
      } else {
        const SelectedPawnDirection: any = getListDirectionSelectedPawn();
        console.log("selected", SelectedPawnDirection);
      }
    } else {
      if (spanPawn.dataset["player"] != 0) {
        const player = spanPawn.dataset["player"];
        const placeX: number = spanPawn.dataset["placementX"];
        const placeY: number = spanPawn.dataset["placementY"];
        setPawnSelected({ x: placeX, y: placeY, player: player });
        spanPawn.classList.add("pawn-selected");
      }
    }
  };

  return (
    <div className={`main p20 flex-col relative flex-end-align g25`}>
      <div className="flex-col g25 w100">
        <h2 className="m0">
          Projects : 1PROJ
          <i className="material-icons ml25" onClick={() => setMenuOpen(true)}>
            settings
          </i>
        </h2>
        <h1
          className={`big-dark-container scores flex-center g50  playerTurn${PlayerTurn}`}
        >
          <span className="blue">{P1score}</span>
          <span>-</span>
          <span className="red">{P2score}</span>
        </h1>
        <div
          className={`board-container flex-col flex-center g25 big-dark-container `}
        >
          <div className={`board playerTurn${PlayerTurn}`}>
            {virtualBoard.map((e, ei) =>
              e.map((f, fi) => (
                <span className={"setting-line " + f.ab}>
                  <span
                    className={"case flex-center"}
                    data-placement-y={ei}
                    data-placement-x={fi}
                    data-player={f.p}
                    onClick={(e) => clickPawn(e)}
                  >
                    {f.p !== 0 ? (
                      <span
                        onClick={(e) => clickPawn(e)}
                        className={`pawn flex-center ${
                          f.p === 1 ? "red-player" : "blue-player"
                        }`}
                      ></span>
                    ) : null}
                  </span>
                </span>
              ))
            )}
          </div>
          {MenuOpen ? (
            <div className="menu-pop-up absolute zi5 flex-center">
              <div className="small-normal-container">
                <h2 className="m0 mb25 blue txt-center">Game Menu</h2>
                <div className="flex-rox flex-between g25">
                  <div className="cta cta-blue" onClick={() => InitGame()}>
                    <span>{PlayerTurn === 0 ? "START" : "RESUME"}</span>
                  </div>

                  <Link className="cta cta-red" to={"/"}>
                    <span>BACK</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HomePage1PROJ;
