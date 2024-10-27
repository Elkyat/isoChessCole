import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class King extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._hasMoved = false; // Inicializar la propiedad
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteKing : FENChar.BlackKing;
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

    get hasMoved() {
        return this._hasMoved;
    }

    set hasMoved(_) {
        this._hasMoved = true;
    }

    // Aquí puedes agregar más métodos específicos para el movimiento del rey, si es necesario
}

// Exportar la clase King
export { King };
