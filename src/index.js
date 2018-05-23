import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square
              value={this.props.squares[i]}
              onClick={ () => this.props.onClick(i) }
            />);
  }

  render() {

    let allSquares = []
    for (var row_n = 0; row_n < 3; row_n++) {
      let rowSquares = []
      for (var col_n = 0; col_n < 3; col_n++) {
        rowSquares.push( this.renderSquare(row_n*3+col_n) );
      }
      allSquares.push(<div className="board-row">{rowSquares}</div>);
    }

    return (
      <div>
        {allSquares}
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
        picked: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  jumpTo(step) {
    this.setState({ stepNumber: step,
                    xIsNext: (step % 2) === 0,
                  });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(squares[i] || calculateWinner(squares))
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ history: history.concat([{squares: squares, picked: i}]) ,
                    stepNumber: history.length, //stepNumber+1,
                    xIsNext: !this.state.xIsNext,
                  });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step,move) => {
        const desc = move ? 'Go to move #' + move + ' : ' + (step.picked%3+1) + ',' +  (Math.floor(step.picked/3)+1)
                          : 'Go to game start' ;
        const formatClass = (move == this.state.stepNumber ? 'bold' : '');
        return (
          <li key={move}>
            <button className={formatClass} onClick={ () => this.jumpTo(move, this.key) }>{desc}</button>
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') ;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={ (i) => this.handleClick(i) }
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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

  for(let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if( squares[a] && squares[a]===squares[b] && squares[a]===squares[c] )
      return squares[a];
  }

  return null;
}
