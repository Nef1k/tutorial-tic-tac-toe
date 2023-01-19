import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


class Square extends React.Component {
    render() {
        return (
            <button
                className={ this.props.isWinner ? "square winner" : "square" }
                onClick={this.props.onClick}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, isWinner) {
        return (
            <Square
                key={ i }
                value={this.props.squares[i]}
                isWinner = { isWinner }
                onClick={() => {
                    this.props.onClick(i)
                }}
            />
        );
    }

    renderRow(i) {
        const rows = [];
        for (let j = 0; j < 3; j++) {
            let isWinner = false;
            if (this.props.winnerSquares && this.props.winnerSquares.includes(i * 3 + j)){
                isWinner = true;
            }
            rows.push(
                this.renderSquare(i * 3 + j, isWinner)
            );
        }

        return (
            <div className="board-row" key={i}>
                { rows }
            </div>
        );
    }

    renderBoard() {
        const board = [];
        for (let i = 0; i < 3; i++) {
            board.push(
                this.renderRow(i)
            );
        }

        return (
            <div>
                { board }
            </div>
        )
    }

    render() {
        return this.renderBoard();
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isMovesReversed: true,
        };
    }

    handleClick(squareIdx) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[squareIdx]) {
            return;
        }
        squares[squareIdx] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(moveIdx) {
        this.setState({
            stepNumber: moveIdx,
            xIsNext: (moveIdx % 2) === 0,
        })
    }

    setSorting(isReversed) {
        this.setState({
            isMovesReversed: isReversed,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const isGameEnd = calculateGameEnded(current.squares);
        const winner = calculateWinner(current.squares);
        const winnerSquares = calculateWinnerSquares(current.squares);

        const moves = history.map((step, move) => {
            let desc = move
                ? 'Go to move #' + move
                : 'Go to game start';

            return (
                <li key={ move }>
                    <button
                        onClick={() => this.jumpTo(move)}
                    >
                        { move === this.state.stepNumber ? <b> { desc }</b> : desc }
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner is ' + winner;
        } else if (!winner && isGameEnd){
            status = 'Draw!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        winnerSquares = { winnerSquares }
                        onClick={(square) => {
                            this.handleClick(square)
                        }}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <div className="mb-1 mt-1">
                        <button
                            onClick={() => {this.setSorting(true)}}
                        >
                            { this.state.isMovesReversed ? <b>Sort ASC</b> : "Sort ASC" }
                        </button>
                        <button
                            onClick={() => {this.setSorting(false)}}
                            className="ml-1"
                        >
                            { !this.state.isMovesReversed ? <b>Sort DESC</b> : "Sort DESC" }
                        </button>
                    </div>
                    <ol>
                        { !this.state.isMovesReversed ? moves.reverse() : moves }</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculateWinnerSquares(squares) {
        const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

function calculateGameEnded(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]){
            return false;
        }
    }
    return true;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
