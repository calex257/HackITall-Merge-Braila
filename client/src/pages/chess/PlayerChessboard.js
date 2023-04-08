import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

const PlayerChessboard = ({ socket, username, room }) => {
    // let game = new Chess();
    const [game, setGame] = useState(new Chess());
    const [is_state_updated, set_is_state_updated] = useState(false);
    const [moveFrom, setMoveFrom] = useState("");
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveSquares, setMoveSquares] = useState({});
    const [optionSquares, setOptionSquares] = useState({});
    const mounted = useRef(false);
    // useEffect(() => {
    //     // do componentDidUpdate logic
    //     console.log(game);
    //     if (game != {}) {
    //         socket.emit("send_game_move", {
    //             game: game,
    //             username,
    //             room,
    //         });
    //     }
    // }, [game]);
    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
        // const update = { ...game };
        // modify(game);
        // return game;
    }
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            socket.on("receive_game_move", (data) => {
                console.log(data);
                // setGame((state) => [
                //     ...state,
                //     {
                //         message: data.message,
                //         username: data.username,
                //         __createdtime__: data.__createdtime__,
                //     },
                // ]);
                console.log("on receive");
                console.log(data);
                if (data.game != {}) {
                    setGame((state) => data.game);
                }
            });
        }

        // Remove event listener on component unmount
        return () => socket.off("receive_game_move");
    }, [socket]);

    function getMoveOptions(square) {
        const moves = game.moves({
            square,
            verbose: true,
        });
        if (moves.length === 0) {
            return false;
        }

        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to) &&
                    game.get(move.to).color !== game.get(square).color
                        ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                        : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%",
            };
            return move;
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newSquares);
        return true;
    }

    function makeRandomMove() {
        const possibleMoves = game.moves();

        // exit if the game is over
        if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
            return;

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        safeGameMutate((game) => {
            game.move(possibleMoves[randomIndex]);
        });
    }

    function onSquareClick(square) {
        setRightClickedSquares({});

        function resetFirstMove(square) {
            const hasOptions = getMoveOptions(square);
            if (hasOptions) setMoveFrom(square);
        }

        // from square
        if (!moveFrom) {
            resetFirstMove(square);
            return;
        }

        // attempt to make move
        // const gameCopy = { ...game };
        // const move = gameCopy.move({
        //     from: moveFrom,
        //     to: square,
        //     promotion: "q", // always promote to a queen for example simplicity
        // });
        // setGame((state) => {
        //     socket.emit("send_game_move", {
        //         game: state,
        //         move,
        //         username,
        //         room,
        //     });
        //     return gameCopy;
        // });
        const gameCopy = { ...game };
        const move = gameCopy.move({
            from: moveFrom,
            to: square,
            promotion: "q", // always promote to a queen for example simplicity
        });
        console.log(gameCopy);
        gameCopy.fen();
        console.log(gameCopy.ascii());
        console.log(JSON.stringify(gameCopy));
        socket.emit("send_game_move", {
            game: gameCopy.fen(),
            move,
            username,
            room,
        });
        // setGame((state) => {
        //     console.log("DUPA EMIT");
        //     console.log(gameCopy);
        //     return gameCopy;
        // });
        // if invalid, setMoveFrom and getMoveOptions
        // if (move === null) {
        //     resetFirstMove(square);
        //     return;
        // }

        setTimeout(makeRandomMove, 300);
        setMoveFrom("");
        setOptionSquares({});
        // socket.emit("send_game_move", {
        //     game: game,
        //     move,
        //     username,
        //     room,
        // });
        set_is_state_updated(true);
    }

    function onSquareRightClick(square) {
        const colour = "rgba(0, 0, 255, 0.4)";
        setRightClickedSquares({
            ...rightClickedSquares,
            [square]:
                rightClickedSquares[square] &&
                rightClickedSquares[square].backgroundColor === colour
                    ? undefined
                    : { backgroundColor: colour },
        });
    }

    return (
        <div style={{}}>
            <Chessboard
                id="ClickToMove"
                animationDuration={200}
                arePiecesDraggable={false}
                position={game.fen()}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
                customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                }}
            />
            <button
                style={{}}
                onClick={() => {
                    safeGameMutate((game) => {
                        game.reset();
                    });
                    setMoveSquares({});
                    setRightClickedSquares({});
                }}
            >
                reset
            </button>
            <button
                style={{}}
                onClick={() => {
                    safeGameMutate((game) => {
                        game.undo();
                    });
                    setMoveSquares({});
                    setRightClickedSquares({});
                }}
            >
                undo
            </button>
        </div>
    );
};

export default PlayerChessboard;
