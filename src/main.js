// app.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Enum para representar las piezas con FENChar
const FENChar = {
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

// Asignar imágenes a cada pieza basada en FENChar
const pieceImagePaths = {
    [FENChar.WhitePawn]: "assets/resource images/whitePawn.png",
    [FENChar.WhiteKnight]: "assets/resource images/whiteHorse.png",
    [FENChar.WhiteBishop]: "assets/resource images/whiteBishop.png",
    [FENChar.WhiteRook]: "assets/resource images/whiteTower.png",
    [FENChar.WhiteQueen]: "assets/resource images/whiteQueen.png",
    [FENChar.WhiteKing]: "assets/resource images/whiteKing.png",
    [FENChar.BlackPawn]: "assets/resource images/redPawn.png",
    [FENChar.BlackKnight]: "assets/resource images/redHorse.png",
    [FENChar.BlackBishop]: "assets/resource images/redBishop.png",
    [FENChar.BlackRook]: "assets/resource images/redTower.png",
    [FENChar.BlackQueen]: "assets/resource images/redQueen.png",
    [FENChar.BlackKing]: "assets/resource images/redKing.png"
};

// Crear objetos Image para cada pieza
const pieceImagesLoaded = {};
for (const piece in pieceImagePaths) {
    pieceImagesLoaded[piece] = new Image();
    pieceImagesLoaded[piece].src = pieceImagePaths[piece];
}

// Crear imágenes de los tiles
const tileBlack = new Image();
tileBlack.src = 'assets/resource images/tileRed.png'; // Asumí que el nombre correcto es tileBlack

const tileWhite = new Image();
tileWhite.src = 'assets/resource images/tileWhite.png'; // Asumí que el nombre correcto es tileWhite

const selectedTileImage = new Image();
selectedTileImage.src = 'assets/resource images/selectedTile.png'; // Imagen para tile seleccionado

// Configuración del tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 36;  // Ancho de los tiles
const tileHeight = 36; // Altura de los tiles (para vista isométrica)
const gridWidth = 8;   // Número de tiles en ancho
const gridHeight = 8;  // Número de tiles en alto

let hoveredTile = { x: -1, y: -1 };
let pieces = null
let selectedTile = null

// Función para convertir coordenadas de cuadrícula 2D a coordenadas isométricas
function toIso(x, y) {
    const isoX = (x * 0.5 * tileSize) + (y * -0.5 * tileSize);
    const isoY = (x * 0.25 * tileHeight) + (y * 0.25 * tileHeight);
    return { x: isoX, y: isoY };
}

// Función para convertir coordenadas de pantalla a coordenadas de cuadrícula
function toGrid(screenX, screenY) {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    const a = 0.5 * tileSize;
    const b = -0.5 * tileSize;
    const c = 0.25 * tileHeight;
    const d = 0.25 * tileHeight;

    const det = (1 / (a * d - b * c));

    const inv = {
        a: det * d,
        b: det * -b,
        c: det * -c,
        d: det * a,
    };

    const gridX = (screenX - offsetX) * inv.a + (screenY - offsetY) * inv.b;
    const gridY = (screenX - offsetX) * inv.c + (screenY - offsetY) * inv.d;

    return {
        x: Math.floor(gridX), y: Math.floor(gridY)
    };
}

// Función para dibujar la cuadrícula isométrica
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const isoPos = toIso(x, y);
            const tileToDraw = (x + y) % 2 === 0 ? tileWhite : tileBlack;

            // Si el tile está bajo el cursor, dibujar un efecto de resaltado
            if (hoveredTile.x === x && hoveredTile.y === y && (
                !selectedTile || selectedTile.x !== x || selectedTile.y !== y
            )) {
                // Usar una escala o desplazamiento para resaltar el tile
                const highlightOffsetY = -5; // Desplazamiento hacia arriba para efecto de resaltado
                const highlightScale = 1.1; // Escala del tile resaltado

                ctx.drawImage(
                    tileToDraw,
                    offsetX + isoPos.x - (tileSize * highlightScale) / 2,
                    offsetY + isoPos.y + highlightOffsetY,
                    tileSize * highlightScale,
                    tileHeight * highlightScale
                );
            } else { // Dibujar el tile normal
                ctx.drawImage(
                    tileToDraw,
                    offsetX + isoPos.x - tileSize / 2,
                    offsetY + isoPos.y,
                    tileSize,
                    tileHeight
                );
            }

            if (selectedTile && selectedTile.x === x && selectedTile.y == y) {
                ctx.drawImage(
                    selectedTileImage,
                    offsetX + isoPos.x - tileSize / 2,
                    offsetY + isoPos.y,
                    tileSize,
                    tileHeight
                );
            }
        }
    }
}

// Función para dibujar piezas en la cuadrícula isométrica
function drawPieces() {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    if (pieces == null) {
        pieces = [
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 0, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 1, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 2, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 3, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 4, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 5, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 6, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackPawn], x: 7, y: 6 },
            { img: pieceImagesLoaded[FENChar.BlackRook], x: 0, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackKnight], x: 1, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackBishop], x: 2, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackQueen], x: 3, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackKing], x: 4, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackBishop], x: 5, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackKnight], x: 6, y: 7 },
            { img: pieceImagesLoaded[FENChar.BlackRook], x: 7, y: 7 },

            { img: pieceImagesLoaded[FENChar.WhiteRook], x: 0, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteKnight], x: 1, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteBishop], x: 2, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteQueen], x: 3, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteKing], x: 4, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteBishop], x: 5, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteKnight], x: 6, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhiteRook], x: 7, y: 0 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 0, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 1, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 2, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 3, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 4, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 5, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 6, y: 1 },
            { img: pieceImagesLoaded[FENChar.WhitePawn], x: 7, y: 1 }
        ];
    }

    pieces = pieces.sort((a, b) => a.y - b.y)

    let newPieces = [],
        latestPiece = undefined
    for (i in pieces) {
        if (pieces[i].x === hoveredTile.x && pieces[i].y === hoveredTile.y) {
            latestPiece = pieces[i]
        } else {
            newPieces.push(pieces[i])
        }
    }
    pieces = !latestPiece ? [...newPieces] : [...newPieces, latestPiece]
    console.log(latestPiece ? [...newPieces] : [latestPiece, ...newPieces])

    pieces.forEach(piece => {
        const isoPos = toIso(piece.x, piece.y);

        if (hoveredTile.x == piece.x && hoveredTile.y == piece.y && (
            !selectedTile || selectedTile.x !== piece.x || selectedTile.y !== piece.y
        )) {
            // Usar una escala o desplazamiento para resaltar el tile
            const highlightOffsetY = -25; // Desplazamiento hacia arriba para efecto de resaltado
            const highlightScale = 1.1; // Escala del tile resaltado

            ctx.drawImage(
                piece.img,
                offsetX + isoPos.x - (tileSize * highlightScale) / 2,
                offsetY + isoPos.y + highlightOffsetY,
                tileSize * highlightScale,
                tileHeight * highlightScale
            );
        } else {
            ctx.drawImage(
                piece.img,
                offsetX + isoPos.x - tileSize / 2,
                offsetY + isoPos.y - tileHeight / 2,
                tileSize,
                tileHeight
            );
        }
    });
}

// Eventos del mouse para la detección de tiles
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    hoveredTile = toGrid(mouseX, mouseY);

    document.getElementById('debug1').innerText = `row: ${hoveredTile.x} - col: ${hoveredTile.y}`

    drawGrid();
    drawPieces();
});

canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    selectedTile = toGrid(mouseX, mouseY);

    document.getElementById('debug1').innerText = `row: ${hoveredTile.x} - col: ${hoveredTile.y}`

    drawGrid();
    drawPieces();
})

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Movement Logic/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Check if a move is valid for the king
function isKingMoveValid(piece, targetX, targetY) {
    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // The king can move only one square in any direction
    return (dx <= 1 && dy <= 1);
}

// Check if a move is valid for the queen
function isQueenMoveValid(piece, targetX, targetY) {
    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // The queen moves like both the rook and the bishop, so we can reuse their movement logic
    const isRookLikeMove = dx === 0 || dy === 0;
    const isBishopLikeMove = dx === dy;

    // Check if the move is either rook-like or bishop-like, and that the path is clear
    if (isRookLikeMove) return isRookMoveValid(piece, targetX, targetY);
    if (isBishopLikeMove) return isBishopMoveValid(piece, targetX, targetY);

    return false;
}


// Check if a move is valid for a bishop
function isBishopMoveValid(piece, targetX, targetY) {
    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // Check for diagonal movement
    if (dx !== dy) return false;

    // Determine direction of movement
    const xDirection = targetX > piece.x ? 1 : -1;
    const yDirection = targetY > piece.y ? 1 : -1;

    // Check path for obstacles
    let x = piece.x + xDirection;
    let y = piece.y + yDirection;
    while (x !== targetX && y !== targetY) {
        if (pieces.some(p => p.x === x && p.y === y)) return false;
        x += xDirection;
        y += yDirection;
    }

    return true;
}

// Check if a move is valid for a knight
function isKnightMoveValid(piece, targetX, targetY) {
    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // Knight moves in an L shape: two squares in one direction, one square in the other
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

// Check if a move is valid for a rook
function isRookMoveValid(piece, targetX, targetY) {
    // Rook can only move in a straight line: either the row or the column must match
    if (piece.x !== targetX && piece.y !== targetY) {
        return false; // Not a straight-line move
    }

    // Check if there’s a piece blocking the rook's path
    if (piece.x === targetX) { // Vertical move
        const minY = Math.min(piece.y, targetY);
        const maxY = Math.max(piece.y, targetY);
        for (let y = minY + 1; y < maxY; y++) {
            if (pieces.some(p => p.x === piece.x && p.y === y)) {
                return false; // Path is blocked
            }
        }
    } else if (piece.y === targetY) { // Horizontal move
        const minX = Math.min(piece.x, targetX);
        const maxX = Math.max(piece.x, targetX);
        for (let x = minX + 1; x < maxX; x++) {
            if (pieces.some(p => p.y === piece.y && p.x === x)) {
                return false; // Path is blocked
            }
        }
    }

    return true; // Valid rook move
}

let selectedPiece = null;

// Function to check if a move is valid for a pawn
function isPawnMoveValid(piece, targetX, targetY) {
    if (piece.img === pieceImagesLoaded[FENChar.WhitePawn]) {
        // White pawn moves
        if (targetX === piece.x && targetY === piece.y + 1) {
            return true; // Move forward by one
        }
        if (piece.y === 1 && targetX === piece.x && targetY === piece.y + 2) {
            return true; // Move forward by two from starting position
        }
    } else if (piece.img === pieceImagesLoaded[FENChar.BlackPawn]) {
        // Black pawn moves
        if (targetX === piece.x && targetY === piece.y - 1) {
            return true; // Move forward by one
        }
        if (piece.y === 6 && targetX === piece.x && targetY === piece.y - 2) {
            return true; // Move forward by two from starting position
        }
    }
    return false;
}

// Updated click event to include king and queen movement rules
canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert mouse coordinates to grid coordinates
    const clickedTile = toGrid(mouseX, mouseY);

    // Boundary check
    if (clickedTile.x < 0 || clickedTile.x >= gridWidth || clickedTile.y < 0 || clickedTile.y >= gridHeight) {
        return;
    }

    if (!selectedPiece) {
        selectedPiece = pieces.find(piece => piece.x === clickedTile.x && piece.y === clickedTile.y);
    } else {
        const targetPiece = pieces.find(piece => piece.x === clickedTile.x && piece.y === clickedTile.y);
        let isMoveValid = false;

        // Apply movement rules based on the selected piece type
        if (selectedPiece.img === pieceImagesLoaded[FENChar.WhitePawn] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackPawn]) {
            isMoveValid = isPawnMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        } else if (selectedPiece.img === pieceImagesLoaded[FENChar.WhiteRook] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackRook]) {
            isMoveValid = isRookMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        } else if (selectedPiece.img === pieceImagesLoaded[FENChar.WhiteKnight] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackKnight]) {
            isMoveValid = isKnightMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        } else if (selectedPiece.img === pieceImagesLoaded[FENChar.WhiteBishop] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackBishop]) {
            isMoveValid = isBishopMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        } else if (selectedPiece.img === pieceImagesLoaded[FENChar.WhiteKing] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackKing]) {
            isMoveValid = isKingMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        } else if (selectedPiece.img === pieceImagesLoaded[FENChar.WhiteQueen] || selectedPiece.img === pieceImagesLoaded[FENChar.BlackQueen]) {
            isMoveValid = isQueenMoveValid(selectedPiece, clickedTile.x, clickedTile.y);
        }

        // If the move is valid and the target tile is unoccupied, move the selected piece
        if (isMoveValid) {
            const targetTileOccupied = pieces.some(piece => piece.x === clickedTile.x && piece.y === clickedTile.y);
            if (!targetTileOccupied) {
                selectedPiece.x = clickedTile.x;
                selectedPiece.y = clickedTile.y;
                selectedPiece = null; // Deselect after moving
            }
        } else {
            selectedPiece = null; // Deselect if move is invalid
        }
    }

    // Redraw the grid and pieces to reflect any changes
    drawGrid();
    drawPieces();
});

///////////////////////////////////////////////////////////////////////////////

// Inicializar el juego dibujando la cuadrícula y las piezas
drawGrid();
drawPieces();