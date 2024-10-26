import { ChessBoard } from 'app\chess-logic\chess-board'
import { Color, FENChar } from './app/chess-logic/models';

export class ChessBoardComponent {
    private ChessBoard = new ChessBoard();
    public chessBoardView: (FENChar | null)[][] = this.chessBoardView.chessBoardView;
    public get playerColor(): Color{return this.chessBoard.playerColor;};
}
