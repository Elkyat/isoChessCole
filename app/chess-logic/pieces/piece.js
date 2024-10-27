import { FENChar, Color } from "../models.js"; // Asegúrate de que la ruta sea correcta

class Piece {
    constructor(color) {
        this._color = color;
    }

    get FENChar() {
        return this._FENChar;
    }

    get directions() {
        return this._directions;
    }
}

// Exportar la clase Piece
export { Piece };
