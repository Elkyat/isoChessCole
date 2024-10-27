import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class Bishop extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
        this._directions = [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
        ];
    }

    // Aquí podrías agregar métodos adicionales específicos para el movimiento del alfil, si lo deseas
}

// Exportar la clase Bishop
export { Bishop };
