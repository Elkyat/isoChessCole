// color.js
export const Color = {
    White: 0,
    Black: 1
};

// Definición de FENChar para las piezas
export const FENChar = {
    WhitePawn: "P",
    WhiteKnight: "N",
    WhiteBishop: "B",
    WhiteRook: "R",
    WhiteQueen: "Q",
    WhiteKing: "K",
    BlackPawn: "p",
    BlackKnight: "n",
    BlackBishop: "b",
    BlackRook: "r",
    BlackQueen: "q",
    BlackKing: "k"
};

// Rutas de imágenes de las piezas
export const pieceImagePaths = Object.freeze({
    [FENChar.WhitePawn]: "assets/resource images/whitePawn.png",
    [FENChar.WhiteKnight]: "assets/resource images/whiteHorse.png",
    [FENChar.WhiteBishop]: "assets/resource images/whiteBishop.png",
    [FENChar.WhiteRook]: "assets/resource images/whiteTower.png",
    [FENChar.WhiteQueen]: "assets/resource images/whiteQueen.png",
    [FENChar.WhiteKing]: "assets/resource images/whiteKing.png",
    [FENChar.BlackPawn]: "assets/resource images/redTower.png",
    [FENChar.BlackKnight]: "assets/resource images/redHorse.png",
    [FENChar.BlackBishop]: "assets/resource images/redBishop.png",
    [FENChar.BlackRook]: "assets/resource images/redHorse.png",
    [FENChar.BlackQueen]: "assets/resource images/redQueen.png",
    [FENChar.BlackKing]: "assets/resource images/redKing.png"
});
