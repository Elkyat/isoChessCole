// chessBoard.js
import { Color } from './models.js';
import { Bishop } from './pieces/bishop.js';
import { Knight } from './pieces/knight.js';
import { Rook } from './pieces/rook.js';
import { King } from './pieces/king.js';
import { Queen } from './pieces/queen.js';
import { Pawn } from './pieces/pawn.js';

export class ChessBoard {
    constructor() {
        this.chessBoard = [
            [
                new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White),
                new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
            ],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White),
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White)
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Rook(Color.Black), new Knight(Color.Black), new Bishop(Color.Black), new Queen(Color.Black),
                new King(Color.Black), new Bishop(Color.Black), new Knight(Color.Black), new Rook(Color.Black)
            ],
            [
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black),
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black)
            ],
        ];
        this._playerColor = Color.White;
    }

    get playerColor() {
        return this._playerColor;
    }

    get chessBoardView() {
        return this.chessBoard.map(row => {
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        });
    }
}
