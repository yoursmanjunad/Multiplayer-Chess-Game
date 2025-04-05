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
                pieceElement.innerHTML=""
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
const handleMove = () => {}

const getPieceUnicode=(piece)=>{
    const unicodePieces = {
        'wP': '&#9817;', 'wR': '&#9814;', 'wN': '&#9816;', 'wB': '&#9815;', 'wQ': '&#9813;', 'wK': '&#9812;',
        'bP': '&#9823;', 'bR': '&#9820;', 'bN': '&#9822;', 'bB': '&#9821;', 'bQ': '&#9819;', 'bK': '&#9818;'
    };
    return unicodePieces[piece.type] || "";
}
renderBoard();
