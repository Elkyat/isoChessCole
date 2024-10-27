import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta
import { Piece } from "./piece.js"; // Asegúrate de que la ruta sea correcta

class Pawn extends Piece {
    constructor(pieceColor) {
        super(pieceColor);
        this._hasMoved = false; // Inicializar la propiedad
        this._FENChar = pieceColor === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn;

        this._directions = [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 }
        ];

        if (pieceColor === Color.Black) this.setBlackPawnDirections();
    }

    setBlackPawnDirections() {
        this._directions = this._directions.map(({ x, y }) => ({ x: -1 * x, y }));
    }

    get hasMoved() {
        return this._hasMoved;
    }

    set hasMoved(_) {
        this._hasMoved = true;
        this._directions = [
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 }
        ];
        if (this.pieceColor === Color.Black) this.setBlackPawnDirections();
    }
}

// Exportar la clase Pawn
export { Pawn };
