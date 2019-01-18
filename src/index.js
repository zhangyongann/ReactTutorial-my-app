import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick1}>
            {props.value2}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value2={this.props.squares[i]}
                onClick1={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        var index = 0;
        var rows = [];
        for (let i = 0; i < 3; i++) {
            var row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(index++));
            }
            rows.push(<div className="squares" key={i}>{row}</div>);
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                rows: [9].fill(0),
                cols: [9].fill(0),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const rows = current.rows.slice();
        const cols = current.cols.slice();
        const row = Math.floor(i / 3);
        const col = Math.floor(i % 3);
        rows[history.length - 1] = row;
        cols[history.length - 1] = col;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                rows: rows,
                cols: cols,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

        let btns = document.getElementsByClassName("moves");
        for (let btn of btns) {
            btn.style.fontWeight = "normal";
        }
        btns[step].style.fontWeight = "bold";
        // let lis = document.getElementsByTagName("li");
        // lis[step].style.fontWeight = "bold";
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const rows = history[history.length - 1].rows;
        const cols = history[history.length - 1].cols;
        console.log('rows:' + rows);
        console.log('cols:' + cols);
        console.log('stepNumber:' + this.state.stepNumber);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + '[' + cols[move - 1] + ',' + rows[move - 1] + ']' :
                'Go to game start';
            return (
                <li key={move}>
                    <button className="moves" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
