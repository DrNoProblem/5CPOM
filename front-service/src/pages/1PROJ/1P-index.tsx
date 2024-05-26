import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserModel from "../../models/user-model";
import "./1P-style.scss";
import { X_OK } from "constants";

type Props = {
  currentUser: UserModel;
};

interface Pawn {
  x: number;
  y: number;
  player: number;
}

interface Board {
  p: number;
  d: string[];
  css: string;
}

const initGameBoard: Board[][] = [
  [
    { p: 1, d: ["E", "ES", "S"], css: "bot-right" },
    { p: 1, d: ["E", "S", "W"], css: "bot-right" },
    { p: 1, d: ["E", "ES", "S", "SW", "W"], css: "" },
    { p: 1, d: ["E", "S", "W"], css: "bot-left" },
    { p: 1, d: ["S", "SW", "W"], css: "bot-left" },
  ],
  [
    { p: 1, d: ["N", "E", "S"], css: "bot-right" },
    { p: 1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], css: "diag" },
    { p: 1, d: ["N", "E", "S", "W"], css: "cross" },
    { p: 1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], css: "diag" },
    { p: 1, d: ["N", "S", "W"], css: "bot-left" },
  ],
  [
    { p: 1, d: ["N", "NE", "E", "ES", "S"], css: "" },
    { p: 1, d: ["N", "E", "S", "W"], css: "cross" },
    { p: 0, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], css: "" },
    { p: -1, d: ["N", "E", "S", "W"], css: "cross" },
    { p: -1, d: ["N", "S", "SW", "W", "WN"], css: "" },
  ],
  [
    { p: -1, d: ["N", "E", "S"], css: "top-right" },
    { p: -1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], css: "diag" },
    { p: -1, d: ["N", "E", "S", "W"], css: "cross" },
    { p: -1, d: ["N", "NE", "E", "ES", "S", "SW", "W", "WN"], css: "diag" },
    { p: -1, d: ["N", "S", "W"], css: "top-left" },
  ],
  [
    { p: -1, d: ["N", "NE", "E"], css: "top-right" },
    { p: -1, d: ["N", "E", "W"], css: "top-right" },
    { p: -1, d: ["N", "NE", "E", "W", "WN"], css: "" },
    { p: -1, d: ["N", "E", "W"], css: "top-left" },
    { p: -1, d: ["N", "W", "WN"], css: "top-left" },
  ],
];

const HomePage1PROJ: FunctionComponent<Props> = ({ currentUser }) => {
  const [VirtualBoardRender, setVirtualBoardRender] = useState<Board[][]>(initGameBoard);
  const [MenuOpen, setMenuOpen] = useState<string | false>("start");

  const [PlayerTurn, setPlayerTurn] = useState<number>(0);

  const [ListOfPwnCanEat, setListOfPwnCanEat] = useState<Pawn[]>([]);
  const [PawnSelected, setPawnSelected] = useState<Pawn | false>(false);

  const InitGame = () => {
    setVirtualBoardRender(initGameBoard);
    setMenuOpen(false);
    setPlayerTurn(-1);
  };

  useEffect(() => {
    let instanceListOfPwnCanEat: Pawn[] = [];
    VirtualBoardRender.forEach((y, yIndex) => {
      y.forEach((x, xIndex) => {
        if (x.p === PlayerTurn) {
          const listOfPossibleEat = checkPossibleEat({ x: xIndex, y: yIndex, player: PlayerTurn }, VirtualBoardRender);
          if (listOfPossibleEat.length !== 0) {
            instanceListOfPwnCanEat.push({ x: xIndex, y: yIndex, player: PlayerTurn });
          }
        }
      });
    });
    setListOfPwnCanEat(instanceListOfPwnCanEat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PlayerTurn]);

  function countPlayerPawns(virtualBoard: Board[][]): { P1: number; P2: number } {
    let countP1 = 0;
    let countP2 = 0;
    virtualBoard.forEach((y, yIndex) => {
      y.forEach((x, xIndex) => {
        if (x.p === 1) {
          countP2++;
        } else if (x.p === -1) {
          countP1++;
        }
      });
    });
    return { P1: countP1, P2: countP2 };
  }

  const getListDirectionSelectedPawn = (Pawn: Pawn, virtualBoard: Board[][]) => {
    const PlaceDirection: string[] = virtualBoard[Pawn.y][Pawn.x].d;
    if (Pawn.player === -1) return PlaceDirection.filter((direction) => !direction.includes("S"));
    else if (Pawn.player === 1) return PlaceDirection.filter((direction) => !direction.includes("N"));
    return PlaceDirection;
  };

  const checkOnceWin = (virtualBoard: Board[][]) => {
    const PawnsAlive: { P1: number; P2: number } = countPlayerPawns(virtualBoard);
    if (PawnsAlive.P1 === 0 && PawnsAlive.P2 !== 0) return "red win";
    else if (PawnsAlive.P1 !== 0 && PawnsAlive.P2 === 0) return "blue win";
    else if (PawnsAlive.P1 === 0 && PawnsAlive.P2 === 0) return "equality";
    else {
      let NbrRedCanMove: number = 0;
      let NbrBlueCanMove: number = 0;
      virtualBoard.forEach((y, yIndex) => {
        y.forEach((x, xIndex) => {
          if (x.p !== 0) {
            const listOfPossibleEat: string[] = checkPossibleEat({ x: xIndex, y: yIndex, player: x.p }, virtualBoard);
            const listOfPossibleMove: string[] = checkPossibleMove({ x: xIndex, y: yIndex, player: x.p }, virtualBoard);
            let containsS: boolean = false;
            let containsN: boolean = false;
            if (x.p === -1) {
              containsN = listOfPossibleMove.some((element) => element.includes("N"));
              if (!(!containsN && listOfPossibleEat.length === 0)) {
                NbrRedCanMove++;
              }
            } else if (x.p === 1) {
              containsS = listOfPossibleMove.some((element) => element.includes("S"));
              if (!(!containsS && listOfPossibleEat.length === 0)) {
                NbrBlueCanMove++;
              }
            }
          }
        });
      });

      if (NbrRedCanMove === 0 && NbrBlueCanMove === 0) return "equality";
    }
    return "continue";
  };

  const nextTurn = (pawn: Pawn, virtualBoard: Board[][]) => {
    let PawnListToRemoveByNoCapture: Pawn[] = [];

    ListOfPwnCanEat.forEach((e) => {
      if (!(e.x === pawn.x && e.y === pawn.y)) {
        if (virtualBoard[e.y][e.x].p === e.player) {
          if (checkPossibleEat({ x: e.x, y: e.y, player: e.player }, virtualBoard).length !== 0) {
            PawnListToRemoveByNoCapture.push(e);
          }
        }
      }
    });

    /*
      virtualBoard.forEach((line, yIndex) => {
        line.forEach((row, xIndex) => {
          if (!(xIndex === pawn.x && yIndex === pawn.y)) {
            if (row.p === PlayerTurn) {
              const ListOfEat = checkPossibleEat({ x: xIndex, y: yIndex, player: PlayerTurn });
              if (ListOfEat.length !== 0) PawnListToRemoveByNoCapture.push({ x: xIndex, y: yIndex, player: PlayerTurn });
            }
          }
        });
      }); 
    */

    const newBoard = JSON.parse(JSON.stringify(virtualBoard));
    PawnListToRemoveByNoCapture.forEach((target) => {
      newBoard[target.y][target.x].p = 0;
    });
    setVirtualBoardRender(newBoard);

    if (document.querySelector(".pawn-selected")) document.querySelector(".pawn-selected")!.classList.remove("pawn-selected");
    setPawnSelected(false);
    const winState: string = checkOnceWin(newBoard);
    if (winState === "continue") setPlayerTurn(PlayerTurn * -1);
    else setMenuOpen(winState);
  };

  const getListOfPositionPossible = (MoveDirection: string[], EatDirection: string[]): { move: string[]; eat: string[] } => {
    let EatPositionPossible: string[] = [];
    let MovePositionPossible: string[] = [];
    if (PawnSelected) {
      MoveDirection.forEach((e) => {
        switch (e) {
          case "N":
            MovePositionPossible.push(PawnSelected.x + "&" + (PawnSelected.y - 1));
            break;
          case "E":
            MovePositionPossible.push(PawnSelected.x + 1 + "&" + PawnSelected.y);
            break;
          case "S":
            MovePositionPossible.push(PawnSelected.x + "&" + (PawnSelected.y + 1));
            break;
          case "W":
            MovePositionPossible.push(PawnSelected.x - 1 + "&" + PawnSelected.y);
            break;
          case "NE":
            MovePositionPossible.push(PawnSelected.x + 1 + "&" + (PawnSelected.y - 1));
            break;
          case "WN":
            MovePositionPossible.push(PawnSelected.x - 1 + "&" + (PawnSelected.y - 1));
            break;
          case "ES":
            MovePositionPossible.push(PawnSelected.x + 1 + "&" + (PawnSelected.y + 1));
            break;
          case "SW":
            MovePositionPossible.push(PawnSelected.x - 1 + "&" + (PawnSelected.y + 1));
            break;
        }
      });
      EatDirection.forEach((e) => {
        switch (e) {
          case "N":
            EatPositionPossible.push(PawnSelected.x + "&" + (PawnSelected.y - 2));
            break;
          case "E":
            EatPositionPossible.push(PawnSelected.x + 2 + "&" + PawnSelected.y);
            break;
          case "S":
            EatPositionPossible.push(PawnSelected.x + "&" + (PawnSelected.y + 2));
            break;
          case "W":
            EatPositionPossible.push(PawnSelected.x - 2 + "&" + PawnSelected.y);
            break;
          case "NE":
            EatPositionPossible.push(PawnSelected.x + 2 + "&" + (PawnSelected.y - 2));
            break;
          case "WN":
            EatPositionPossible.push(PawnSelected.x - 2 + "&" + (PawnSelected.y - 2));
            break;
          case "ES":
            EatPositionPossible.push(PawnSelected.x + 2 + "&" + (PawnSelected.y + 2));
            break;
          case "SW":
            EatPositionPossible.push(PawnSelected.x - 2 + "&" + (PawnSelected.y + 2));
            break;
        }
      });
    }
    return { move: MovePositionPossible, eat: EatPositionPossible };
  };

  const checkPossibleEat = (Pawn: Pawn, virtualBoard: Board[][]): string[] => {
    let EatPossbile: string[] = [];
    virtualBoard[Pawn.y][Pawn.x].d.forEach((e) => {
      switch (e) {
        case "N":
          if (virtualBoard[Pawn.y - 1][Pawn.x] && virtualBoard[Pawn.y - 1][Pawn.x].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y - 1][Pawn.x].d.includes("N")) {
              if (virtualBoard[Pawn.y - 2][Pawn.x] && virtualBoard[Pawn.y - 2][Pawn.x].p === 0) {
                EatPossbile.push("N");
              }
            }
          }
          break;

        case "E":
          if (virtualBoard[Pawn.y][Pawn.x + 1] && virtualBoard[Pawn.y][Pawn.x + 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y][Pawn.x + 1].d.includes("E")) {
              if (virtualBoard[Pawn.y][Pawn.x + 2] && virtualBoard[Pawn.y][Pawn.x + 2].p === 0) {
                EatPossbile.push("E");
              }
            }
          }
          break;

        case "S":
          if (virtualBoard[Pawn.y + 1][Pawn.x] && virtualBoard[Pawn.y + 1][Pawn.x].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y + 1][Pawn.x].d.includes("S")) {
              if (virtualBoard[Pawn.y + 2][Pawn.x] && virtualBoard[Pawn.y + 2][Pawn.x].p === 0) {
                EatPossbile.push("S");
              }
            }
          }
          break;

        case "W":
          if (virtualBoard[Pawn.y][Pawn.x - 1] && virtualBoard[Pawn.y][Pawn.x - 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y][Pawn.x - 1].d.includes("W")) {
              if (virtualBoard[Pawn.y][Pawn.x - 2] && virtualBoard[Pawn.y][Pawn.x - 2].p === 0) {
                EatPossbile.push("W");
              }
            }
          }
          break;

        case "NE":
          if (virtualBoard[Pawn.y - 1][Pawn.x + 1] && virtualBoard[Pawn.y - 1][Pawn.x + 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y - 1][Pawn.x + 1].d.includes("NE")) {
              if (virtualBoard[Pawn.y - 2][Pawn.x + 2] && virtualBoard[Pawn.y - 2][Pawn.x + 2].p === 0) {
                EatPossbile.push("NE");
              }
            }
          }
          break;

        case "WN":
          if (virtualBoard[Pawn.y - 1][Pawn.x - 1] && virtualBoard[Pawn.y - 1][Pawn.x - 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y - 1][Pawn.x - 1].d.includes("WN")) {
              if (virtualBoard[Pawn.y - 2][Pawn.x - 2] && virtualBoard[Pawn.y - 2][Pawn.x - 2].p === 0) {
                EatPossbile.push("WN");
              }
            }
          }
          break;

        case "ES":
          if (virtualBoard[Pawn.y + 1][Pawn.x + 1] && virtualBoard[Pawn.y + 1][Pawn.x + 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y + 1][Pawn.x + 1].d.includes("ES")) {
              if (virtualBoard[Pawn.y + 2][Pawn.x + 2] && virtualBoard[Pawn.y + 2][Pawn.x + 2].p === 0) {
                EatPossbile.push("ES");
              }
            }
          }
          break;

        case "SW":
          if (virtualBoard[Pawn.y + 1][Pawn.x - 1] && virtualBoard[Pawn.y + 1][Pawn.x - 1].p === PlayerTurn * -1) {
            if (virtualBoard[Pawn.y + 1][Pawn.x - 1].d.includes("SW")) {
              if (virtualBoard[Pawn.y + 2][Pawn.x - 2] && virtualBoard[Pawn.y + 2][Pawn.x - 2].p === 0) {
                EatPossbile.push("SW");
              }
            }
          }
          break;
      }
    });
    return EatPossbile;
  };

  const checkPossibleMove = (Pawn: Pawn, virtualBoard: Board[][]): string[] => {
    let MovePossible: string[] = [];
    let listDirection = getListDirectionSelectedPawn(Pawn, virtualBoard);
    if (listDirection && listDirection.length > 0) {
      listDirection.forEach((element: string) => {
        switch (element) {
          case "N":
            if (virtualBoard[Pawn.y - 1][Pawn.x] && virtualBoard[Pawn.y - 1][Pawn.x].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "NE":
            if (virtualBoard[Pawn.y - 1][Pawn.x + 1] && virtualBoard[Pawn.y - 1][Pawn.x + 1].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "E":
            if (virtualBoard[Pawn.y][Pawn.x + 1] && virtualBoard[Pawn.y][Pawn.x + 1].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "ES":
            if (virtualBoard[Pawn.y + 1][Pawn.x + 1] && virtualBoard[Pawn.y + 1][Pawn.x + 1].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "S":
            if (virtualBoard[Pawn.y + 1][Pawn.x] && virtualBoard[Pawn.y + 1][Pawn.x].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "SW":
            if (virtualBoard[Pawn.y + 1][Pawn.x - 1] && virtualBoard[Pawn.y + 1][Pawn.x - 1].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "W":
            if (virtualBoard[Pawn.y][Pawn.x - 1] && virtualBoard[Pawn.y][Pawn.x - 1].p === 0) {
              MovePossible.push(element);
            }
            break;
          case "WN":
            if (virtualBoard[Pawn.y - 1][Pawn.x - 1] && virtualBoard[Pawn.y - 1][Pawn.x - 1].p === 0) {
              MovePossible.push(element);
            }
            break;
        }
      });
    }
    return MovePossible;
  };

  const MovePawn = (target: Pawn, virtualBoard: Board[][]) => {
    if (!PawnSelected) return false;
    const newBoard = JSON.parse(JSON.stringify(virtualBoard));
    newBoard[PawnSelected.y][PawnSelected.x].p = 0;
    newBoard[target.y][target.x].p = PlayerTurn;
    setPawnSelected(false);
    return newBoard;
  };

  const EatPawn = (target: Pawn, virtualBoard: Board[][]) => {
    if (!PawnSelected) return false;
    let xEat: number = target.x - PawnSelected.x;
    let yEat: number = target.y - PawnSelected.y;
    const targetEat: { x: number; y: number } = {
      x: (xEat !== 0 ? xEat / 2 : xEat) + PawnSelected.x,
      y: (yEat !== 0 ? yEat / 2 : yEat) + PawnSelected.y,
    };
    const newBoard = JSON.parse(JSON.stringify(virtualBoard));
    newBoard[PawnSelected.y][PawnSelected.x].p = 0;
    newBoard[target.y][target.x].p = PlayerTurn;
    newBoard[targetEat.y][targetEat.x].p = 0;
    return newBoard;
  };

  const clickPawn = (element: any) => {
    let InstanceVirtualBoard: Board[][] = VirtualBoardRender;
    let spanPawn = element.target;
    if (spanPawn.classList.contains("pawn")) spanPawn = spanPawn.parentElement;

    const tempoPawn = {
      x: parseInt(spanPawn.dataset["placementX"]),
      y: parseInt(spanPawn.dataset["placementY"]),
      player: parseInt(spanPawn.dataset["player"]),
    };

    if (PawnSelected) {
      if (spanPawn.children.length !== 0) {
        spanPawn.classList.remove("pawn-selected");
        if (document.querySelector(".pawn-selected")) document.querySelector(".pawn-selected")!.classList.remove("pawn-selected");
        setPawnSelected(false);
        return false;
      }

      const possibleMove = checkPossibleMove(PawnSelected, InstanceVirtualBoard); //! list direction possible move
      const possibleEat = checkPossibleEat(PawnSelected, InstanceVirtualBoard); //! list direction possibleeat

      if (document.querySelector(".pawn-selected")) document.querySelector(".pawn-selected")!.classList.remove("pawn-selected");

      const listOfPossiblePosition: { move: string[]; eat: string[] } = getListOfPositionPossible(possibleMove, possibleEat);
      if (listOfPossiblePosition.move.includes(`${tempoPawn.x}&${tempoPawn.y}`)) {
        InstanceVirtualBoard = MovePawn(tempoPawn, InstanceVirtualBoard);
        nextTurn(tempoPawn, InstanceVirtualBoard);
      } else if (listOfPossiblePosition.eat.includes(`${tempoPawn.x}&${tempoPawn.y}`)) {
        InstanceVirtualBoard = EatPawn(tempoPawn, InstanceVirtualBoard);
        const NewPossibleEat = checkPossibleEat(tempoPawn, InstanceVirtualBoard);
        if (NewPossibleEat.length !== 0) {
          setVirtualBoardRender(InstanceVirtualBoard);
          spanPawn.classList.add("pawn-selected");
          setPawnSelected(tempoPawn);
        } else nextTurn(tempoPawn, InstanceVirtualBoard);
      } else {
        setPawnSelected(false);
        return false;
      }
    } else {
      if (spanPawn.children.length === 0) return false;
      if (parseInt(spanPawn.dataset["player"]) !== PlayerTurn) return false;
      const possibleMove = checkPossibleMove(tempoPawn, InstanceVirtualBoard);
      const possibleEat = checkPossibleEat(tempoPawn, InstanceVirtualBoard);
      if (possibleMove.length === 0 && possibleEat.length === 0) return false;
      spanPawn.classList.add("pawn-selected");
      setPawnSelected(tempoPawn);
    }
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      <div className="flex-col g20 w100">
        <h1
          className={`dark-container scores flex-bet flex-center-align g50  playerTurn${PlayerTurn}`}
          onClick={() => console.log(VirtualBoardRender)} //!
        >
          <i className=" blue" onClick={() => setMenuOpen("red win")}>
            flag
          </i>
          <i className="" onClick={() => setMenuOpen("pause")}>
            settings
          </i>
          <i className=" red" onClick={() => setMenuOpen("blue win")}>
            flag
          </i>
        </h1>
        <div className="board-container flex-col flex-center g20 dark-container">
          <div className={`board playerTurn${PlayerTurn}`}>
            {VirtualBoardRender.map((e, ei) =>
              e.map((f, fi) => (
                <span key={"case-" + ei + "-" + fi} className={"setting-line " + f.css}>
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
                        className={`pawn flex-center ${f.p === 1 ? "red-player" : "blue-player"}`}
                      ></span>
                    ) : null}
                  </span>
                </span>
              ))
            )}
          </div>
          {MenuOpen ? (
            <div className="menu-pop-up absolute zi5 flex-center">
              <div className="dark-background zi1"></div>
              <div className="normal-container  zi1">
                <h2 className=" blue txt-center">Game Menu</h2>
                {MenuOpen === "blue win" ? <h2 className={`winner${PlayerTurn}`}>CONGRATULATION BLUE PLAYER</h2> : null}
                {MenuOpen === "red win" ? <h2 className={`winner${PlayerTurn}`}>CONGRATULATION RED PLAYER</h2> : null}
                {MenuOpen === "equality" ? <h2 className={`winner${PlayerTurn}`}>EQUALITY</h2> : null}

                <div className="flex-rox flex-between g20">
                  {MenuOpen === "start" || MenuOpen === "blue win" || MenuOpen === "red win" || MenuOpen === "equality" ? (
                    <div className="cta cta-blue" onClick={() => InitGame()}>
                      <span>START NEW GAME</span>
                    </div>
                  ) : null}

                  {MenuOpen === "pause" ? (
                    <div className="cta cta-blue" onClick={() => InitGame()}>
                      <span>RESUME GAME</span>
                    </div>
                  ) : null}

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
