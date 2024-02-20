import { useState, useEffect } from "react";

type Score = {
	win: number
	lose: number
}

type Players = {
	player1: {
		name: string
		score: Score
	};
	player2: {
		name: string
		score: Score
	};
} | undefined

function App() {
	const [reset, setReset] = useState(false)
	const [winner, setWinner] = useState('')
	const [players, setPlayers] = useState<Players>(undefined)

	const Reset = () => setReset(true)

	console.log(players)
	return (
		<div className="App">
			{!players ?
				<PlayersForm getPlayers={setPlayers} />
				: <>
					<div className={`winner ${winner !== "" ? "" : "shrink"}`}>
						<div className="winner-text">{winner}</div>
						<button onClick={Reset}>Reset</button>
					</div>
					<Board
						reset={reset}
						setReset={setReset}
						players={players}
						winner={winner} setWinner={setWinner} />
					<Players players={players} />
				</>

			}
		</div>
	);
}

const initNamesState = { player1: { name: '', score: { win: 0, lose: 0 } }, player2: { name: '', score: { win: 0, lose: 0 } } }
const initErrorsState = { error1: '', error2: '' }

function PlayersForm({ getPlayers }: { getPlayers: React.Dispatch<React.SetStateAction<Players>> }) {
	const [names, setNames] = useState(initNamesState);
	const [errors, setErrors] = useState(initErrorsState)

	const inputChange = (e: any) => setNames({ ...names, [e.target.name]: { name: e.target.value, score: { win: 0, lose: 0 } } })

	return <div style={{ padding: '3rem', border: '5px double #808080', }}>
		<div style={{ display: 'flex', gap: '10rem' }}>
			<div style={{ display: 'grid', gap: 5 }}>
				<label htmlFor="player1" style={{ color: '#6b6b6b', fontSize: '1.4rem', fontWeight: 'bold' }}>Player 1</label>
				<input type="text" id="player1" placeholder="Enter Name..." style={{ padding: '.5rem', fontSize: '1.1rem', borderRadius: '5%', color: '#6b6b6b' }} name='player1' value={names?.player1?.name} onChange={inputChange} />
				<p style={{ color: 'red', margin: 0 }}>{errors?.error1 !== '' && errors?.error1}</p>
			</div>
			<div style={{ display: 'grid', gap: 5 }}>
				<label htmlFor="player2" style={{ color: '#808080', fontSize: '1.4rem', fontWeight: 'bold' }}>Player 2</label>
				<input type="text" id="player2" placeholder="Enter Name..." style={{ padding: '.5rem', fontSize: '1.1rem', borderRadius: '5%', color: '#6b6b6b' }} name='player2' value={names?.player2?.name} onChange={inputChange} />
				<p style={{ color: 'red', margin: 0 }}>{errors?.error2 !== '' && errors?.error2}</p>
			</div>
		</div>
		<div style={{ display: 'grid', placeItems: 'center', marginTop: '2rem' }}>
			<button style={{ textTransform: 'uppercase', letterSpacing: 1.2 }} onClick={() => {
				setErrors(initErrorsState)
				if (!names.player1 && !names.player2) {
					setErrors({ error1: 'Please enter valid name', error2: 'Please enter valid name' })
					return
				}
				else if (!names.player1 || names.player1?.name.length <= 2) {
					setErrors({ error2: '', error1: 'Please enter valid name for player 1' })
					return
				} else if (!names.player2 || names.player2?.name.length <= 2) {
					setErrors({ error1: '', error2: 'Please enter valid name for player 2' })
					return
				} else if (names.player1 === names.player2) {
					setErrors({ error1: 'Cannot use same player name', error2: 'Cannot use same player name' })
					return
				} else {
					getPlayers({ ...names! })
					setErrors(initErrorsState)
				}
			}}>Start Game</button>
		</div>
	</div>
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

const Board = ({ reset, setReset, winner, setWinner, players }: any) => {
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
					setWinner(`${players.player1} wins`)
				} else {
					setWinner(`${players.player2} wins`)
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
			<div className='player'>{players?.player1?.name}: X</div>
			<div className='player'>{players?.player2?.name}: O</div>
		</div>
	)
}

export default App;
