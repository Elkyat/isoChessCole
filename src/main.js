const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isWhiteTurn = true;

let selectedPiece = null;


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

const pieceImagesLoaded = {};
for (const piece in pieceImagePaths) {
    pieceImagesLoaded[piece] = new Image();
    pieceImagesLoaded[piece].src = pieceImagePaths[piece];
}

const tileBlack = new Image();
tileBlack.src = 'assets/resource images/tileRed.png'; 

const tileWhite = new Image();
tileWhite.src = 'assets/resource images/tileWhite.png'; 

const selectedTileImage = new Image();
selectedTileImage.src = 'assets/resource images/selectedTile.png';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 36; 
const tileHeight = 36; 
const gridWidth = 8;   
const gridHeight = 8; 

let hoveredTile = { x: -1, y: -1 };
let pieces = null
let selectedTile = null

function toIso(x, y) {
    const isoX = (x * 0.5 * tileSize) + (y * -0.5 * tileSize);
    const isoY = (x * 0.25 * tileHeight) + (y * 0.25 * tileHeight);
    return { x: isoX, y: isoY };
}

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

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const isoPos = toIso(x, y);
            const tileToDraw = (x + y) % 2 === 0 ? tileWhite : tileBlack;

            if (hoveredTile.x === x && hoveredTile.y === y && (
                !selectedTile || selectedTile.x !== x || selectedTile.y !== y
            )) {
                const highlightOffsetY = -5; 
                const highlightScale = 1.1; 

                ctx.drawImage(
                    tileToDraw,
                    offsetX + isoPos.x - (tileSize * highlightScale) / 2,
                    offsetY + isoPos.y + highlightOffsetY,
                    tileSize * highlightScale,
                    tileHeight * highlightScale
                );
            } else { 
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
            const highlightOffsetY = -25; 
            const highlightScale = 1.1; 

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
    // Check if it's the correct turn for this king's color
    if ((isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhiteKing]) ||
        (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackKing])) {
        return false; // Wrong turn for this piece color
    }

    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // The king can move only one square in any direction
    if (dx > 1 || dy > 1) return false;

    // Check if the target tile is occupied by a piece of the same color
    const targetPiece = pieces.find(p => p.x === targetX && p.y === targetY);
    if (targetPiece && ((isWhiteTurn && targetPiece.img === pieceImagesLoaded[FENChar.WhiteKing]) ||
        (!isWhiteTurn && targetPiece.img === pieceImagesLoaded[FENChar.BlackKing]))) {
        return false; // Target occupied by same color
    }

    // Move is valid; toggle the turn
    isWhiteTurn = !isWhiteTurn;
    return true;
}

function isQueenMoveValid(piece, targetX, targetY) {
    // Check if it's the correct turn for this queen's color
    if ((isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhiteQueen]) ||
        (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackQueen])) {
        return false; // Wrong turn for this piece color
    }

    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // The queen can move any number of squares in a straight line, either vertically, horizontally, or diagonally
    if (dx !== 0 && dy !== 0 && dx !== dy) {
        return false; // Not a straight-line move (invalid for queen)
    }

    // Determine direction of movement
    const xDirection = targetX > piece.x ? 1 : targetX < piece.x ? -1 : 0;
    const yDirection = targetY > piece.y ? 1 : targetY < piece.y ? -1 : 0;

    // Check for obstacles in the queen's path
    let x = piece.x + xDirection;
    let y = piece.y + yDirection;
    while (x !== targetX || y !== targetY) {
        if (pieces.some(p => p.x === x && p.y === y)) return false; // Path is blocked
        x += xDirection;
        y += yDirection;
    }

    // Check if the target tile is occupied by a piece of the same color
    const targetPiece = pieces.find(p => p.x === targetX && p.y === targetY);
    if (targetPiece && ((isWhiteTurn && targetPiece.img === pieceImagesLoaded[FENChar.WhiteQueen]) ||
        (!isWhiteTurn && targetPiece.img === pieceImagesLoaded[FENChar.BlackQueen]))) {
        return false; // Target occupied by same color
    }

    // Move is valid; toggle the turn
    isWhiteTurn = !isWhiteTurn;
    return true;
}

function isBishopMoveValid(piece, targetX, targetY) {
    // Check if it's the correct turn for this bishop's color
    if ((isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhiteBishop]) ||
        (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackBishop])) {
        return false; // Wrong turn for this piece color
    }

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

    // Move is valid; toggle the turn
    isWhiteTurn = !isWhiteTurn; // Toggle the turn after a valid move
    return true;
}


function isKnightMoveValid(piece, targetX, targetY) {
    // Check if it's the correct turn
    if ((isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhiteKnight]) ||
        (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackKnight])) {
        return false; // Wrong turn for this piece color
    }

    const dx = Math.abs(targetX - piece.x);
    const dy = Math.abs(targetY - piece.y);

    // Knight moves in an L shape: two squares in one direction, one square in the other
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
        // Toggle the turn after a valid move
        isWhiteTurn = !isWhiteTurn;
        return true;
    }

    return false;
}

function isRookMoveValid(piece, targetX, targetY) {
    // Check if it's the correct turn for this rook's color
    if ((isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhiteRook]) ||
        (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackRook])) {
        return false; // Wrong turn for this piece color
    }

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

    // Toggle the turn after a valid move
    isWhiteTurn = !isWhiteTurn;
    return true; // Valid rook move
}

function isPawnMoveValid(piece, targetX, targetY) {
    // Check if it's the correct turn based on pawn color
    if (isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.WhitePawn]) {
        return false;  // It's white's turn, but this piece is not a white pawn
    } else if (!isWhiteTurn && piece.img !== pieceImagesLoaded[FENChar.BlackPawn]) {
        return false;  // It's black's turn, but this piece is not a black pawn
    }

    // White pawn moves
    if (piece.img === pieceImagesLoaded[FENChar.WhitePawn]) {
        if (targetX === piece.x && targetY === piece.y + 1) {
            isWhiteTurn = false;  // Switch to black's turn after a valid move
            return true;  // Move forward by one
        }
        if (piece.y === 1 && targetX === piece.x && targetY === piece.y + 2) {
            isWhiteTurn = false;  // Switch to black's turn after a valid move
            return true;  // Move forward by two from starting position
        }
    } 
    // Black pawn moves
    else if (piece.img === pieceImagesLoaded[FENChar.BlackPawn]) {
        if (targetX === piece.x && targetY === piece.y - 1) {
            isWhiteTurn = true;  // Switch to white's turn after a valid move
            return true;  // Move forward by one
        }
        if (piece.y === 6 && targetX === piece.x && targetY === piece.y - 2) {
            isWhiteTurn = true;  // Switch to white's turn after a valid move
            return true;  // Move forward by two from starting position
        }
    }

    return false;  // Invalid move
}

// Function to check if it's the current piece's turn
function canMoveThisTurn(piece) {
    // Check if the piece's color matches the current turn
    return (isWhiteTurn && piece.color === "white") || (!isWhiteTurn && piece.color === "red");
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



































drawGrid();
drawPieces();