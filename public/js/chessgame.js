const socket = io();
const chess = new Chess(); // Make sure Chess.js is loaded and accessible
const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = ''; // Clear the board element

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add(
                'square',
                (rowIndex + squareIndex) % 2 === 0 ? 'light' : 'dark'
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;
            if(square){
                const pieceElement  = document.createElement('div');
                pieceElement.classList.add('piece', 
                    square.color === 'w' ? 'white' : 'black');
                pieceElement.innerHTML=getPieceUnicode(square);
                pieceElement.draggable=playerRole === square.color;
                pieceElement.addEventListener("dragstart", (e)=>{
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowIndex, col: squareIndex};
                        e.dataTransfer.setData("text/plain", pieceElement.innerHTML);
                    }
                })
                pieceElement.addEventListener("dragend", (e)=>{
                    draggedPiece = null;
                    sourceSquare = null;
                })
                squareElement.appendChild(pieceElement);
            }
            squareElement.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            squareElement.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(e.target.dataset.row),
                        col: parseInt(e.target.dataset.col),
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });
            boardElement.appendChild(squareElement);
        }); 
        
    });
};
const handleMove = () => {
    const move = {
        from: `${sourceSquare.col}${sourceSquare.row}`,
        to: `${targetSquare.col}${targetSquare.row}`,
        promotion: 'q',
    };
    const moveResult = chess.move(move);
}

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
        'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };
    const key = piece.color + piece.type.toUpperCase(); // e.g., 'wP'
    return unicodePieces[key] || '';
};
renderBoard();
