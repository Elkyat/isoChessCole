// Function to play sound
function playPickPiece() {
    var audio = document.getElementById('pickPiece');
    audio.play();
}

// Example event to call the function
document.addEventListener('click', playPickPiece); // Plays sound on any click on the document

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 36;  // Tile width
const tileHeight = 36; // Tile height (adjust for isometric view)
const gridWidth = 8; // Number of tiles horizontally
const gridHeight = 8; // Number of tiles vertically

// Store the current tile being hovered over
let hoveredTile = { x: -1, y: -1 };
let hoveredPiece = null; // To store hovered piece

// Function to convert 2D grid coordinates to isometric screen coordinates
function toIso(x, y) {
    const isoX = (x * 0.5 * tileSize) + (y * -0.5 * tileSize); // X transformation
    const isoY = (x * 0.25 * tileHeight) + (y * 0.25 * tileHeight); // Y transformation
    return { x: isoX, y: isoY };
}

// Function to convert screen coordinates to grid coordinates
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

    return { x: Math.floor(gridX), y: Math.floor(gridY) };
}

// Function to determine lift value based on hover
function getPieceLift(x, y) {
    return (hoveredPiece && hoveredPiece.x === x && hoveredPiece.y === y) ? -10 : 0;
}

// Function to draw the isometric grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const isoPos = toIso(x, y);

            // Alternate between black and white tiles
            const tileToDraw = (x + y) % 2 === 0 ? tileWhite : tileBlack;

            ctx.drawImage(
                tileToDraw,
                offsetX + isoPos.x - tileSize / 2,
                offsetY + isoPos.y,
                tileSize,
                tileHeight
            );

            // Draw selected tile if hovered over
            if (hoveredTile.x === x && hoveredTile.y === y) {
                ctx.drawImage(
                    selectedTile,
                    offsetX + isoPos.x - tileSize / 2,
                    offsetY + isoPos.y,
                    tileSize,
                    tileHeight
                );
            }
        }
    }
}

// Function to draw pieces
function drawPieces() {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    const pieces = [
        // Red (black side) pieces
        { img: redTower, x: 0, y: 7 },
        { img: redHorse, x: 1, y: 7 },
        { img: redBishop, x: 2, y: 7 },
        { img: redQueen, x: 3, y: 7 },
        { img: redKing, x: 4, y: 7 },
        { img: redBishop, x: 5, y: 7 },
        { img: redHorse, x: 6, y: 7 },
        { img: redTower, x: 7, y: 7 },
        { img: redPawn, x: 0, y: 6 },
        { img: redPawn, x: 1, y: 6 },
        { img: redPawn, x: 2, y: 6 },
        { img: redPawn, x: 3, y: 6 },
        { img: redPawn, x: 4, y: 6 },
        { img: redPawn, x: 5, y: 6 },
        { img: redPawn, x: 6, y: 6 },
        { img: redPawn, x: 7, y: 6 },

        // White pieces
        { img: whiteTower, x: 0, y: 0 },
        { img: whiteHorse, x: 1, y: 0 },
        { img: whiteBishop, x: 2, y: 0 },
        { img: whiteQueen, x: 3, y: 0 },
        { img: whiteKing, x: 4, y: 0 },
        { img: whiteBishop, x: 5, y: 0 },
        { img: whiteHorse, x: 6, y: 0 },
        { img: whiteTower, x: 7, y: 0 },
        { img: whitePawn, x: 0, y: 1 },
        { img: whitePawn, x: 1, y: 1 },
        { img: whitePawn, x: 2, y: 1 },
        { img: whitePawn, x: 3, y: 1 },
        { img: whitePawn, x: 4, y: 1 },
        { img: whitePawn, x: 5, y: 1 },
        { img: whitePawn, x: 6, y: 1 },
        { img: whitePawn, x: 7, y: 1 },
    ];

    // Sort pieces so those with higher y-coordinate are drawn last
    pieces.sort((a, b) => (a.y + a.x) - (b.y + b.x));

    // Draw pieces
    pieces.forEach(piece => {
        const isoPos = toIso(piece.x, piece.y);
        const lift = getPieceLift(piece.x, piece.y); // Get lift for pieces

        ctx.drawImage(
            piece.img,
            offsetX + isoPos.x - tileSize / 2,
            offsetY + isoPos.y + lift - tileHeight / 2,
            tileSize,
            tileHeight
        );
    });

    // Draw the hovered piece last to ensure it appears in front
    if (hoveredPiece) {
        const isoPos = toIso(hoveredPiece.x, hoveredPiece.y);
        const lift = getPieceLift(hoveredPiece.x, hoveredPiece.y); // Get lift for the hovered piece

        ctx.drawImage(
            hoveredPiece.img,
            offsetX + isoPos.x - tileSize / 2,
            offsetY + isoPos.y + lift - tileHeight / 2,
            tileSize,
            tileHeight
        );
    }
}

// Handle mouse move to detect hovered tile and piece
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const gridPos = toGrid(mouseX, mouseY);

    if (gridPos.x >= 0 && gridPos.x < gridWidth && gridPos.y >= 0 && gridPos.y < gridHeight) {
        hoveredTile = { x: gridPos.x, y: gridPos.y };
        
        // Check for hovered piece
        const pieces = [
            { img: redTower, x: 0, y: 7 },
            { img: redHorse, x: 1, y: 7 },
            { img: redBishop, x: 2, y: 7 },
            { img: redQueen, x: 3, y: 7 },
            { img: redKing, x: 4, y: 7 },
            { img: redBishop, x: 5, y: 7 },
            { img: redHorse, x: 6, y: 7 },
            { img: redTower, x: 7, y: 7 },
            { img: redPawn, x: 0, y: 6 },
            { img: redPawn, x: 1, y: 6 },
            { img: redPawn, x: 2, y: 6 },
            { img: redPawn, x: 3, y: 6 },
            { img: redPawn, x: 4, y: 6 },
            { img: redPawn, x: 5, y: 6 },
            { img: redPawn, x: 6, y: 6 },
            { img: redPawn, x: 7, y: 6 },
            { img: whiteTower, x: 0, y: 0 },
            { img: whiteHorse, x: 1, y: 0 },
            { img: whiteBishop, x: 2, y: 0 },
            { img: whiteQueen, x: 3, y: 0 },
            { img: whiteKing, x: 4, y: 0 },
            { img: whiteBishop, x: 5, y: 0 },
            { img: whiteHorse, x: 6, y: 0 },
            { img: whiteTower, x: 7, y: 0 },
            { img: whitePawn, x: 0, y: 1 },
            { img: whitePawn, x: 1, y: 1 },
            { img: whitePawn, x: 2, y: 1 },
            { img: whitePawn, x: 3, y: 1 },
            { img: whitePawn, x: 4, y: 1 },
            { img: whitePawn, x: 5, y: 1 },
            { img: whitePawn, x: 6, y: 1 },
            { img: whitePawn, x: 7, y: 1 },
        ];

        hoveredPiece = pieces.find(piece => piece.x === gridPos.x && piece.y === gridPos.y);
    } else {
        hoveredTile = { x: -1, y: -1 };
        hoveredPiece = null;
        
    }

    drawGrid();
    drawPieces();
});

// Initial draw
drawGrid();
drawPieces();
