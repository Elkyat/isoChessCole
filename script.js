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

const selectedTile = new Image();
selectedTile.src = 'assets/resource images/selectedTile.png'; // Imagen para tile seleccionado

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

// Función para dibujar piezas en la cuadrícula isométrica
function drawPieces() {
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4;

    const pieces = [
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

    pieces.forEach(piece => {
        const isoPos = toIso(piece.x, piece.y);
        ctx.drawImage(
            piece.img,
            offsetX + isoPos.x - tileSize / 2,
            offsetY + isoPos.y - tileHeight / 2,
            tileSize,
            tileHeight
        );
    });
}

// Eventos del mouse para la detección de tiles
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    hoveredTile = toGrid(mouseX, mouseY);
    drawGrid();
    drawPieces();
});

// Inicializar el juego dibujando la cuadrícula y las piezas
drawGrid();
drawPieces();
