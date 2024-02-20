import { useState, useEffect } from "react";

type Players = {
	player1: string;
	player2: string
} | undefined

function App() {
	const [reset, setReset] = useState(false)
	const [winner, setWinner] = useState('')
	const [players, setPlayers] = useState<Players>(undefined)

	const Reset = () => setReset(true)

	return (
		<div className="App">
			<div style={{ padding: '3rem', border: '5px double #808080', }}>
				<div style={{ display: 'flex', gap: '10rem' }}>
					<div style={{ display: 'grid', gap: 5 }}>
						<label htmlFor="player1" style={{ color: '#6b6b6b', fontSize: '1.4rem', fontWeight: 'bold' }}>Player 1</label>
						<input type="text" id="player1" placeholder="Enter Name..." style={{ padding: '.5rem', fontSize: '1.1rem', borderRadius: '5%', color: '#6b6b6b' }} />
					</div>
					<div style={{ display: 'grid', gap: 5 }}>
						<label htmlFor="player2" style={{ color: '#808080', fontSize: '1.4rem', fontWeight: 'bold' }}>Player 2</label>
						<input type="text" id="player2" placeholder="Enter Name..." style={{ padding: '.5rem', fontSize: '1.1rem', borderRadius: '5%', color: '#6b6b6b' }} />
					</div>
				</div>
				<div style={{ display: 'grid', placeItems: 'center', marginTop: '2rem' }}>
					<button>Start Game</button>
				</div>
			</div>
			<div className={`winner ${winner !== "" ? "" : "shrink"}`}>
				<div className="winner-text">{winner}</div>
				<button onClick={Reset}>Reset</button>
			</div>
			<Board reset={reset} setReset={setReset}
				winner={winner} setWinner={setWinner} />
			<Players players={players} />
		</div>
	);
}

const conditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const Board = ({ reset, setReset, winner, setWinner }: any) => {
	const [data, setData] = useState(Array(9).fill(''))
	const [current, setCurrent] = useState('X')

	useEffect(() => {
		if (reset) {
			setData(Array(9).fill(''))
			setWinner('')
			setReset(false)
		}
	}, [reset, setReset, setWinner, winner])

	const Draw = (index: number) => {
		if (data[index] === "") {
			const board = data;
			board[index] = current;
			setData(board)
			if (current === "X") {
				setCurrent("O")
			} else {
				setCurrent("X")
			}

			if (checkWin(board)) {
				if (current === "X") {
					setWinner("Player 1 winner")
				} else {
					setWinner("Player 2 winner")
				}
			}
			if (checkDraw(board)) {
				setWinner("Draw")
			}
		}
	}

	const checkDraw = (board: any) => {
		let count = 0;
		board.forEach((element: any) => {
			if (element !== "") {
				count++;
			}
		})
		if (count >= 9) {
			return true;
		} else {
			return false;
		}
	}
	const checkWin = (board: any) => {
		let flag = false;
		conditions.forEach(element => {
			if (board[element[0]] !== ""
				&& board[element[1]] !== "" &&
				board[element[2]] !== "") {
				if (board[element[0]] === board[element[1]] &&
					board[element[1]] === board[element[2]]) {
					flag = true;
				}
			}
		})
		return flag;
	}
	return (
		<div className='board'>
			{new Array(9).fill(undefined).map((_, idx) => (
				<div className={`input input${idx + 1}`} key={idx}
					onClick={() => Draw(idx)}>{data[idx]}
				</div>
			))}
		</div>
	)
}

const Players = ({ players }: { players: Players }) => {
	return (
		<div className='players'>
			<div className='player'>Player 1: X</div>
			<div className='player'>Player 2: O</div>
		</div>
	)
}

export default App;
