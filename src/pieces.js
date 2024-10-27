// pieces.js

class Piece {
    constructor(imageSrc) {
        this.image = new Image();
        this.image.src = imageSrc;
    }
}

// Subclasses for specific pieces
class WhitePawn extends Piece {
    constructor() {
        super('resources/whitePawn.png');
    }
}

class BlackPawn extends Piece {
    constructor() {
        super('resources/redPawn.png'); // Adjust path if necessary
    }
}

export { WhitePawn, BlackPawn };


    //{ img: redTower, x: 0, y: 7 },
    //{ img: redHorse, x: 1, y: 7 },
    //{ img: redBishop, x: 2, y: 7 },
    //{ img: redQueen, x: 3, y: 7 },
    //{ img: redKing, x: 4, y: 7 },
    //{ img: redBishop, x: 5, y: 7 },
    //{ img: redHorse, x: 6, y: 7 },
    //{ img: redTower, x: 7, y: 7 },
    //{ img: redPawn, x: 0, y: 6 },
    //{ img: redPawn, x: 1, y: 6 },
    //{ img: redPawn, x: 2, y: 6 },
    //{ img: redPawn, x: 3, y: 6 },
    //{ img: redPawn, x: 4, y: 6 },
    //{ img: redPawn, x: 5, y: 6 },
    //{ img: redPawn, x: 6, y: 6 },
    //{ img: redPawn, x: 7, y: 6 },

    //{ img: whiteTower, x: 0, y: 0 },
    //{ img: whiteHorse, x: 1, y: 0 },
    //{ img: whiteBishop, x: 2, y: 0 },
    //{ img: whiteQueen, x: 3, y: 0 },
    //{ img: whiteKing, x: 4, y: 0 },
    //{ img: whiteBishop, x: 5, y: 0 },
    //{ img: whiteHorse, x: 6, y: 0 },
    //{ img: whiteTower, x: 7, y: 0 },
    //{ img: whitePawn, x: 0, y: 1 },
    //{ img: whitePawn, x: 1, y: 1 },
    //{ img: whitePawn, x: 2, y: 1 },
    //{ img: whitePawn, x: 3, y: 1 },
    //{ img: whitePawn, x: 4, y: 1 },
    //{ img: whitePawn, x: 5, y: 1 },
    //{ img: whitePawn, x: 6, y: 1 },
    //{ img: whitePawn, x: 7, y: 1 },


