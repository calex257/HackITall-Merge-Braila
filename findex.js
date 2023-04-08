// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
import { Chess } from "./chess.js";

var board = null;
var game = new Chess();

function makeRandomMove() {
    var possibleMoves = game.moves();

    // exit if the game is over
    if (game.isGameOver()) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());

    window.setTimeout(makeRandomMove, 500);
}

board = Chessboard("myBoard", {
    draggable: true,
    snapbackSpeed: 500,
    snapSpeed: 100,
    position: "start",
    pieceTheme: "assets/{piece}.svg",
});

window.setTimeout(makeRandomMove, 500);
