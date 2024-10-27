import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class Rook extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._hasMoved = false;
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
        this._directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
    }

    get hasMoved() {
        return this._hasMoved;
    }

    set hasMoved(_) {
        this._hasMoved = true;
    }
}

// Exportar la clase Rook
export { Rook };
