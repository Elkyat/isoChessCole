const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const coordinatesDisplay = document.createElement('div');
coordinatesDisplay.style.position = 'fixed';
coordinatesDisplay.style.bottom = '10px';
coordinatesDisplay.style.left = '10px';
coordinatesDisplay.style.fontSize = '16px';
coordinatesDisplay.style.color = '#333';
coordinatesDisplay.textContent = "Coordenadas: (x, y)";
document.body.appendChild(coordinatesDisplay);

const tileRed = new Image();
tileRed.src = 'assets/resource images/tileRed.png';
const tileWhite = new Image();
tileWhite.src = 'assets/resource images/tileWhite.png';
const selectedTile = new Image();
selectedTile.src = 'assets/resource images/tileWhite.png';

const pieceImagePaths = {
    'wQ': 'assets/resource images/whiteQueen.png',
    'bQ': 'assets/resource images/blackQueen.png',
    // Agrega las rutas para otras piezas
};

const tileSize = 36;
const tileHeight = 36;
const gridWidth = 8;
const gridHeight = 8;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chessBoardView = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

let hoveredTile = { x: -1, y: -1 };

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
    const det = 1 / (a * d - b * c);

    const inv = { a: det * d, b: det * -b, c: det * -c, d: det * a };
    const gridX = (screenX - offsetX) * inv.a + (screenY - offsetY) * inv.b;
    const gridY = (screenX - offsetX) * inv.c + (screenY - offsetY) * inv.d;

    return { x: Math.floor(gridX), y: Math.floor(gridY) };
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const isoPos = toIso(x, y);
            const tileToDraw = (x + y) % 2 === 0 ? tileWhite : tileRed;

            ctx.drawImage(
                tileToDraw,
                offsetX + isoPos.x - tileSize / 2,
                offsetY + isoPos.y,
                tileSize,
                tileHeight
            );

            if (hoveredTile.x === x && hoveredTile.y === y) {
                ctx.drawImage(
                    selectedTile,
                    offsetX + isoPos.x - tileSize / 2,
                    offsetY + isoPos.y,
                    tileSize,
                    tileHeight
                );
            }

            const piece = chessBoardView[y][x];
            if (piece) {
                const img = new Image();
                img.src = pieceImagePaths[piece];
                img.onload = () => {
                    ctx.drawImage(
                        img,
                        offsetX + isoPos.x - tileSize / 2,
                        offsetY + isoPos.y - tileHeight / 2,
                        tileSize,
                        tileHeight
                    );
                };
            }
        }
    }
}

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const gridPos = toGrid(mouseX, mouseY);

    if (gridPos.x >= 0 && gridPos.x < gridWidth && gridPos.y >= 0 && gridPos.y < gridHeight) {
        hoveredTile = { x: gridPos.x, y: gridPos.y };
        coordinatesDisplay.textContent = `Coordenadas: (${hoveredTile.x}, ${hoveredTile.y})`;
    } else {
        hoveredTile = { x: -1, y: -1 };
        coordinatesDisplay.textContent = "Coordenadas: Fuera del tablero";
    }

    drawGrid();
});

tileRed.onload = tileWhite.onload = () => {
    drawGrid();
};
