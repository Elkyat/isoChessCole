import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class Queen extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteQueen : FENChar.BlackQueen;
        this._directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: 0 },
            { x: -1, y: 1 },
            { x: -1, y: -1 }
        ];
    }
}

// Exportar la clase Queen
export { Queen };
