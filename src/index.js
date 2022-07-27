
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import winnergif from './win.webp'

// class Square extends React.Component {
//     // constructor(props)
//     // {
//     //     super(props)
//     //     this.state= {
//     //         value: null,
//     //     }
//     // }
//     render() {
//       return (
//         <button className="square" 
//         // onClick={()=>{ this.setState({value:'X'}) }}
//         onClick={()=> this.props.onClick()}
//         >
//           {/* TODO */
//           this.props.value
//           }
//         </button>
//       );
//     }
//   }






function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Win(p) {
  if (p.winner) {
    return (
      <li className=''>
        <button className='new' onClick={p.reset}>Play Again</button>

      </li>
    );
  }
  else if(
   ! p.curhis.squares.includes(null)
   )
  {
    // console.log(p.curhis.squares.includes(null))
    // p.draw()
    return (
      <li className=''>
        {/* <h5>Game Draw</h5> */}
        <button className='new' onClick={p.reset}>Play Again</button>

      </li>
    );
  }
}
function WinGif(p){
  if (p.winner && false) {
    return (
      <div className='wigi'>
          <img src={winnergif} alt='not found'/>
      </div>
    );
  }
}

function WinningLine(p)
{
  
  // if(p.winner || false)
  
    return(
      <div className={'win-line '+p.classAdd()}>

      </div>
    )
  
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  classAdd()
  {
    if(this.props.winner)
    {
      return ('win-'+this.props.winpos)
    }
    else
    {
      return ''
    }
  }

  render() {
    
    return (
      <div className='tic-board'>
        { <WinningLine winner={this.props.winner} classAdd={()=>this.classAdd()} /> }
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    let ls = JSON.parse(localStorage.getItem('score'))
    let x = 0
    let y = 0
    if(ls!=null)
    {
      x=ls.x;
      y=ls.y;
    }

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      xWon:x,
      oWon:y
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      // if(calculateWinner(squares))
      // {
      //    this.state.stepNumber = 0

      // }
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history: this.state.history.slice(0, step + 1)
    });
  }
  reset(w)
  {
    this.setState({
      stepNumber: 0,
      xIsNext: true,
      history: this.state.history.slice(0,1),
      
    });
   
    // console.log(w)
  }
  // draw()
  // {
  //   console.log("here it is")
  //   this.setState({
  //     stepNumber: 0,
  //     xIsNext: true,
  //     history: this.state.history.slice(0,1),
      
  //   });
  // }
  restart()
  {
    this.setState({
      stepNumber: 0,
      xIsNext: true,
      history: this.state.history.slice(0,1),
      xWon:0,
      oWon:0
      
    });
    localStorage.setItem('score', JSON.stringify({x:0,o:0}));
   
    // console.log(w)
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // const winner = calculateWinner(current.squares);
    const winn = calculateWinner(current.squares)

    const winner = winn? winn.x : null
    const winpos = winn? winn.y : null
    
    let moves
    if(!winner)
    {
    moves = history.map((step, move) => {



      let desc = move ?
        'Go to move #' + move :
        'Go to game start';
      // if (step == 'yes') {
      //   desc = "Press to"
      // }
      if(move===9)
      {
        desc = 'Game Draw'
      }
      return (
        <li className='' key={move}>
          <button className='new' onClick={() => this.jumpTo(move)}>{desc}</button>

        </li>
      );
    });
  }



    let status;
    if (winner) {

      status = "Winner: " + winner;
      if(winner==='X')
      {
        this.state.xWon+=1
        // this.setState(
        //   {
        //     xWon:this.state.xWon+1
        //   }
        // )
      }
      else{
        this.state.oWon+=1
        // this.setState(
        //   {
        //     oWon:this.state.oWon+1
        //   }
        // )
      
      }
      localStorage.setItem('score', JSON.stringify({x:this.state.xWon,o:this.state.oWon}));

    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }


    return (
      <div className="game">
        <div className="game-board">
          <WinGif winner={winner}/>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner = {winner}
           
            winpos = {winpos}
          />
        </div>
        <div className="game-info">
          <div className='info-status'>{status}</div>
          <div className='info-status'>x won {this.state.xWon} Time | O won {this.state.oWon} Time</div>

          <div className='res info-status' onClick={()=>this.restart()}>Reset Score</div>
          <ol>
            {moves}
            {
              <Win value='' winner={winner} curhis={current} reset={()=>this.reset(winner)} />
            }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {x:squares[a],y:i};
    }
  }
  return null;
}
