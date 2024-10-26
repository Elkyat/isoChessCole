export enum Color{
    White,
    Black
}

export type Coords = {
    x: number;
    y: number;
}

//BLACK = RED //RED = BLACK

export enum FENChar{
    WhitePawn="P",
    WhiteKnight="N",
    WhiteBishop="B",
    WhiteRook="R",
    WhiteQueen="Q",
    WhiteKing="K",
    BlackPawn="p",
    BlackKnight="n",
    BlackBishop="b",
    BlackRook="r",
    BlackQueen="q",
    BlackKing="k",
}

//BLACK = RED //RED = BLACK

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
    [FENChar.WhitePawn]: "assets\resource images\whitePawn.png",
    [FENChar.WhiteKnight]: "assets\resource images\whiteHorse.png",
    [FENChar.WhiteBishop]: "assets\resource images\whiteBishop.png",
    [FENChar.WhiteRook]: "assets\resource images\whiteTower.png",
    [FENChar.WhiteQueen]: "assets\resource images\whiteQueen.png",
    [FENChar.WhiteKing]: "assets\resource images\whiteKing.png",
    [FENChar.BlackPawn]: "assets\resource images\redTower.png",
    [FENChar.BlackKnight]: "assets\resource images\redHorse.png",
    [FENChar.BlackBishop]: "assets\resource images\redBishop.png",
    [FENChar.BlackRook]: "assets\resource images\redHorse.png",
    [FENChar.BlackQueen]: "assets\resource images\redQueen.png",
    [FENChar.BlackKing]: "assets\resource images\redKing.png"
}