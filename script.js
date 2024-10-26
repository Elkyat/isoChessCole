// Obtener el canvas y el contexto
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
const pieceImages = {
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
    [FENChar.BlackKing]: "assets/resource images/redKing.png",
};

// Crear objetos Image para cada pieza
const pieceImagesLoaded = {};
const totalPieces = Object.keys(pieceImages).length;
let loadedPiecesCount = 0;

for (const piece in pieceImages) {
    const img = new Image();
    img.src = pieceImages[piece];
    img.onload = () => {
        loadedPiecesCount++;
        // Si todas las imágenes están cargadas, dibuja el tablero y las piezas
        if (loadedPiecesCount === totalPieces) {
            drawGrid();
            drawPieces();
        }
    };
    pieceImagesLoaded[piece] = img;
}

// Crear imágenes de los tiles
const tileBlack = new Image();
tileBlack.src = 'assets/resource images/tileRed.png';

const tileWhite = new Image();
tileWhite.src = 'assets/resource images/tileWhite.png';

const selectedTile = new Image();
selectedTile.src = 'assets/resource images/tileWhite.png'; // Imagen para tile seleccionado

// Configuración del tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 36;  // Ancho de los tiles
const tileHeight = 36; // Altura de los tiles (para vista isométrica)
const gridWidth = 8;   // Número de tiles en ancho
const gridHeight = 8;  // Número de tiles en alto

let hoveredTile = { x: -1, y: -1 };

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

    return { x: Math.floor(gridX), y: Math.floor(gridY) };
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

            ctx.drawImage(
                tileToDraw,
                offsetX + isoPos.x - tileSize / 2,
                offsetY + isoPos.y,
                tileSize,
                tileHeight
            );

            // Dibujar tile seleccionado si está bajo el cursor
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

// Instanciar el ChessBoard (asegúrate de que ChessBoard esté definido en tu entorno)
const chessBoard = new ChessBoard(); // Asegúrate de que ChessBoard esté definido

// Función para dibujar piezas en la cuadrícula isométrica desde el ChessBoard
function drawPieces() {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    const pieces = chessBoard.chessBoardView;

    pieces.forEach((row, y) => {
        row.forEach((piece, x) => {
            if (piece) {
                const isoPos = toIso(x, y);
                ctx.drawImage(
                    pieceImagesLoaded[piece],
                    offsetX + isoPos.x - tileSize / 2,
                    offsetY + isoPos.y - tileHeight / 2,
                    tileSize,
                    tileHeight
                );
            }
        });
    });
}

// Manejar el movimiento del mouse para detectar tile bajo el cursor
canvas.addEventListener('mousemove', (event) => {
    const { x, y } = toGrid(event.clientX, event.clientY);
    hoveredTile.x = x;
    hoveredTile.y = y;

    drawGrid();
    drawPieces();

    // Mostrar coordenadas en la pantalla
    const coordinatesDisplay = document.getElementById('coordinatesDisplay');
    coordinatesDisplay.innerText = `Coordenada: ${x}, ${y}`;
});

// Inicializar el dibujo del tablero y las piezas
drawGrid();
