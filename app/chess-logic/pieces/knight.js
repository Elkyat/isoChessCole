import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class Knight extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
        this._directions = [
            { x: 1, y: 2 },
            { x: 1, y: -2 },
            { x: -1, y: 2 },
            { x: -1, y: -2 },
            { x: 2, y: 1 },
            { x: 2, y: -1 },
            { x: -2, y: 1 },
            { x: -2, y: -1 }
        ];
    }

    // Aquí puedes agregar métodos específicos para el movimiento del caballo, si es necesario
}

// Exportar la clase Knight
export { Knight };
