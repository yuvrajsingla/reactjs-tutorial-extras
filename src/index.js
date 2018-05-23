import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.extraClass} onClick={props.onClick}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let extraClassName = 'square';
    if (this.props.winnerCells && this.props.winnerCells.indexOf(i) > -1 )
        extraClassName = 'square highlighted';

    return (<Square
              key = {'sq_'+i}
              check = {this.props.winnerCells}
              extraClass = {extraClassName}
              value = {this.props.squares[i]}
              onClick = { () => this.props.onClick(i) }
            />);
  }

  render() {

    let allSquares = []
    for (var row_n = 0; row_n < 3; row_n++) {
      let rowSquares = []
      for (var col_n = 0; col_n < 3; col_n++) {
        rowSquares.push( this.renderSquare(row_n*3+col_n) );
      }
      allSquares.push(<div key={'row_'+row_n} className="board-row">{rowSquares}</div>);
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
      movesAsc: true,
    };
  }

  jumpTo(step) {
    this.setState({ stepNumber: step,
                    xIsNext: (step % 2) === 0,
                  });
  }

  toggleOrder() {
    this.setState({ movesAsc: !this.state.movesAsc,
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
    const winnerInfo = calculateWinner(current.squares);
    const winner = winnerInfo ? winnerInfo[0] : winnerInfo;
    const winnerCells = winnerInfo ? winnerInfo.slice(1) : winnerInfo;

    let moves = history.map( (step,move) => {
        const desc = move ? 'Go to move #' + move + ' : ' + (step.picked%3+1) + ',' +  (Math.floor(step.picked/3)+1)
                          : 'Go to game start' ;
        const formatClass = (move === this.state.stepNumber ? 'bold' : '');
        return (
          <li key={move}>
            <button className={formatClass} onClick={ () => this.jumpTo(move, this.key) }>{desc}</button>
          </li>
        );
    });
    if (this.state.movesAsc === false) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') ;
    }

    const oppOrder = this.state.movesAsc ? 'descending' : 'ascending';
    let toggleButton = <button onClick={ () => this.toggleOrder() }>Toggle moves order to {oppOrder}</button>

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerCells={winnerCells}
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggleButton}</div>
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
      return [ squares[a], a, b, c ];
  }

  return null;
}
