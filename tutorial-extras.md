
## Extras

1. Display the location for each move in the format (col, row) in the move history list.

```javascript
class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        picked: null,                                 <--
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

```javascript
handleClick(i) {
  const history = this.state.history.slice(0, this.state.stepNumber + 1);
  const current = history[history.length - 1];
  const squares = current.squares.slice();
  if(squares[i] || calculateWinner(squares))
    return;

  squares[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState({ history: history.concat([{squares: squares, picked: i}]) ,   <--
                  stepNumber: history.length,
                  xIsNext: !this.state.xIsNext,
                });
}
```
```javascript
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step,move) => {
        const desc = move ? 'Go to move #' + move + ' : ' +
         (Math.floor(step.picked/3)+1) + ',' +  (step.picked%3+1)  <--
                          : 'Go to game start' ;
        return (
    ...
```


**2. Bold the currently selected item in the move list.**


3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
When no one wins, display a message about the result being a draw.
