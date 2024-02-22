import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from "axios";

const BASE_URL = `http://127.0.0.1:5000`

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
} & Partial<{ _id: string; createdAt: string; updatedAt: string; rounds: number; draw: number }> | undefined

function App() {
	const [reset, setReset] = useState(false)
	const [winner, setWinner] = useState('')
	const [players, setPlayers] = useState<Players>(undefined)

	const Reset = () => setReset(true)

	return (
		<Router basename="/" future={{ v7_startTransition: true }}>
			<Routes>
				<Route path="/" element={<PlayersLists />} />
				<Route path="/register" element={
					<PlayersForm
						players={players}
						getPlayers={setPlayers}

					/>} />
				<Route path="/playgame/:id" element={
					<Board
						reset={reset}
						setReset={setReset}
						winner={winner} setWinner={setWinner}
					/>} />
			</Routes>
			{/* {!players ?
				<PlayersForm getPlayers={setPlayers} />
				: <>
					
					<Board
						reset={reset}
						setReset={setReset}
						players={players}
						winner={winner} setWinner={setWinner}
						setPlayers={setPlayers}
					/>

					
				</>
			} */}
		</Router>
	);
}

const initNamesState = { player1: { name: '', score: { win: 0, lose: 0, draw: 0 } }, player2: { name: '', score: { win: 0, lose: 0, draw: 0 } } }
const initErrorsState = { error1: '', error2: '' }

function PlayersForm({ players }: { players: Players; getPlayers: React.Dispatch<React.SetStateAction<Players>> }) {
	const [names, setNames] = useState(initNamesState);
	const [errors, setErrors] = useState(initErrorsState)
	const navigate = useNavigate()

	if (players) return <Navigate to='/playgame' />

	const inputChange = (e: any) => setNames({ ...names, [e.target.name]: { name: e.target.value, score: { win: 0, lose: 0, draw: 0 } } })

	return <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
		<div style={{ padding: '3rem', border: '5px double #808080', }}>
			<Link to='/' style={{ fontSize: 24, color: '#575757' }}>Back to score board</Link>
			<h1 style={{ textAlign: 'center' }}>Register Players</h1>
			<div style={{ display: 'flex', justifyContent: 'center', gap: '10rem' }}>
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
			</div >
			<div style={{ display: 'grid', placeItems: 'center', marginTop: '2rem' }}>
				<button style={{ textTransform: 'uppercase', letterSpacing: 1.2 }} onClick={async () => {
					setErrors(initErrorsState)
					if (!names.player1.name && !names.player2.name) {
						setErrors({ error1: 'Please enter valid name', error2: 'Please enter valid name' })
						return
					}
					else if (!names.player1.name || names.player1?.name.length <= 2) {
						setErrors({ error2: '', error1: 'Please enter valid name for player 1' })
						return
					} else if (!names.player2.name || names.player2?.name.length <= 2) {
						setErrors({ error1: '', error2: 'Please enter valid name for player 2' })
						return
					} else if (names.player1.name === names.player2.name) {
						setErrors({ error1: 'Cannot use same player name', error2: 'Cannot use same player name' })
						return
					} else {
						setErrors(initErrorsState)
						try {
							const players = { player1: names.player1.name, player2: names.player2.name }
							const res = await fetch(`${BASE_URL}/api/players`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(players) }) as any
							const data = await res.json()
							navigate('/playgame/' + data?._id!)
							localStorage.setItem('id', JSON.stringify(data?._id))
						} catch (error) {
							console.log('frontned error: ', error)
						}
					}
				}}>Start Game</button>
			</div>
		</div >
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

const Board = ({ reset, setReset, winner, setWinner, }: any) => {
	const [data, setData] = useState(Array(9).fill(''))
	const [current, setCurrent] = useState('X')
	const [players, setPlayers] = useState<Players | undefined>(undefined)
	const { id } = useParams()

	if (!id) return <Navigate to='/register' />

	const resetGame = () => {
		setData(Array(9).fill(''))
		console.log(winner)
		setWinner('')
		setReset(false)
	}

	useEffect(() => {
		if (reset) resetGame
	}, [reset, setReset, setWinner, winner])

	useEffect(() => {
		let cleanUp = false;

		(async () => {
			try {
				const res = await fetch(`${BASE_URL}/api/players/${id}`, { method: 'GET' }) as any
				const data = await res.json()
				if (!cleanUp) setPlayers(data)


			} catch (error) {
				return error
			}
		})()
		return () => {
			cleanUp = true
		}
	}, [id])

	console.log(players)

	const Draw = (index: number) => {
		if (winner) return
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
					setWinner(`${players?.player1.name} wins`)
					// setPlayers({
					// 	player1: {
					// 		name: players?.player1.name,
					// 		score: {
					// 			...players?.player1.score,
					// 			win: players?.player1.score.win + 1,
					// 		}
					// 	},
					// 	player2: {
					// 		...players?.player2,
					// 		score: {
					// 			...players?.player2.score,
					// 			lose: players?.player2.score.lose + 1,
					// 		}
					// 	},
					// })
					return
				} else {
					setWinner(`${players?.player2.name} wins`)
					// setPlayers({
					// 	player1: {
					// 		name: players?.player2.name,
					// 		score: {
					// 			...players?.player1.score,
					// 			lose: players?.player1.score.lose + 1,
					// 		}
					// 	},
					// 	player2: {
					// 		...players?.player2,
					// 		score: {
					// 			...players?.player2.score,
					// 			win: players?.player2.score.win + 1,
					// 		}
					// 	},
					// })
					return
				}
			}
			if (checkDraw(board)) {
				setWinner("Draw")
				// setPlayers({
				// 	player1: {
				// 		name: players?.player2?.name,
				// 		score: {
				// 			...players?.player1.score,
				// 			// draw: players?.player1.score.draw + 1
				// 		}
				// 	},
				// 	player2: {
				// 		...players.player2,
				// 		score: {
				// 			...players.player2.score,
				// 			// draw: players.player2.score.draw + 1
				// 		}
				// 	},
				// })
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
		<div className="App">
			<div className={`winner ${winner !== "" ? "" : "shrink"}`}>
				<div className="winner-text">{winner}</div>
				<button onClick={resetGame}>Reset</button>
			</div>
			<div className='board'>
				{new Array(9).fill(undefined).map((_, idx) => (
					<div className={`input input${idx + 1}`} key={idx}
						onClick={() => Draw(idx)}>{data[idx]}
					</div>
				))}
			</div>
			<Players players={players} />
		</div>
	)
}

const PlayersLists = () => {
	const [lists, setLists] = useState<Players[]>([])
	useEffect(() => {
		let cleanUp = false;
		(async () => {
			try {
				const res = await fetch(`${BASE_URL}/api/players`, { method: 'GET' })
				const data = await res.json()
				if (!cleanUp) setLists(data ?? [])

			} catch (error) {
				return error
			}
		})()
		return () => {
			cleanUp = true
		}
	}, [])

	return <>
		<h1 style={{ color: '#525252', textAlign: 'center' }}>Tic Tac Toe Scoring Board</h1>
		<div style={{ textAlign: 'right', padding: 10 }}>
			<Link to='/register' style={{ fontSize: 32, fontWeight: 'bold', color: '#525252' }}>Play Game</Link>
		</div >
		<table id="player-lists" style={{ textAlign: 'center' }}>
			<thead >
				<tr >
					<th>Players</th>
					<th>Rounds</th>
					<th>Score</th>
					<th>Draw</th>
					<th>Action</th>
				</tr>
			</thead>
			<h2 style={{ textAlign: 'center' }}>
				{!lists.length ? 'No players had played yet' : ''}
			</h2>
			<tbody>
				{lists.map((player: Players) => (
					<tr key={player?._id}>
						<td>
							{player?.player1.name} <br />
							{player?.player2.name}
						</td>
						<td>{player?.rounds}</td>
						<td>
							Win: {player?.player1?.score?.win} {" "}
							Lose: {player?.player1?.score?.lose}
							<br />
							Win: {player?.player2?.score?.win} {" "}
							Lose: {player?.player2?.score?.lose}
						</td>
						<td>{player?.draw}</td>
						<td >
							<button onClick={() => alert('func for rematch')}>Rematch</button>
						</td>
					</tr>
				))}
				<tr>
					{/* <td>Berglunds snabbköp</td>
					<td>Christina Berglund</td>
					<td>Sweden</td> */}
				</tr>
			</tbody>
		</table>
	</>
}

const Players = ({ players }: { players: Players }) => {
	return (
		<div className='players'>
			<div className='player' style={{ display: 'grid' }}>
				<p style={{ marginTop: 0, marginBottom: 8 }}>{`${players?.player1?.name}: X`}</p>
				<div style={{ display: 'grid' }}>
					<i>
						Win: {players?.player1?.score.win}
					</i>
					<i>
						Lose: {players?.player1?.score.lose}
					</i>
					<i>
						Draw: {players?.draw ?? 0}
					</i>
				</div>
			</div>
			<div className='player' style={{ display: 'grid' }}>
				<p style={{ marginTop: 0, marginBottom: 8 }}>{`${players?.player2?.name}: X`}</p>
				<div style={{ display: 'grid' }}>
					<i>
						Win: {players?.player2?.score.win}
					</i>
					<i>
						Lose: {players?.player2?.score.lose}
					</i>
					<i>
						Draw: {players?.draw ?? 0}
					</i>
				</div>
			</div>
		</div>
	)
}

export default App;
