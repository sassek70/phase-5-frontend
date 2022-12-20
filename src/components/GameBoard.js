import { useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"

console.log(consumer)

const GameBoard = ({currentUser, gameSession, setGameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    const [gameCards, setGameCards] = useState([])
    const [playerOne, setPlayerOne] = useState()
    const [playerTwo, setPlayerTwo] = useState()
    // const [hostPlayerCards, setHostPlayerCards] = useState([])
    // const [opponentPlayerCards, setOpponentPlayerCards] = useState([])
    
    useEffect(() => {
            consumer.subscriptions.create({
            channel: "GameSessionChannel",
            // username: `${currentUser? currentUser.id : guestUser}`,
            game_key: `${gameSession.game_key}`,
        },{
            connected: () => console.log("connected"),
            disconnected: () => console.log("disconnected"),
            received: data => {
                const {count, game} = data
                if (game) {
                    setGameSession(game)
                    console.log(game)
                    setPlayerOne(game.host_user_id)
                    setPlayerTwo(game.opponent_id)
                    console.log(`Player 1: ${game.host_user_id}, Player 2: ${game.opponent_id}`)
                }
                setCount(count)
            }
        })


        createPlayerCards()
    },[])


    const createPlayerCards = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/create_random_deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                player_id: currentUser? currentUser.id : guestUser,
                game_id: gameSession.id
            })
        })
        .then(res => {if (res.ok) {
            res.json()
            .then(gameDeck => {setGameCards(gameDeck)
            console.log(gameDeck[0].card.cardName)})
        } else { 
            res.json().then(errors => console.log(errors))
        }
    })

    }
    // console.log(gameCards[0].card.cardName)
    // console.log(gameSession)




    const updateServer = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/increase_counter`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({game_key: gameSession.game_key}),
          })
        .then(res => { 
            if (res.ok) {
            res.json().then(updatedCount => setCount(updatedCount))
            }
        })
    }

    let displayGameCards = gameCards.map((card) => {
        const {cardName, cardPower, cardDefense, cardCost, cardDescription} = card.card
        return (<Card key={uuid()} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription}/>)
    })

    return (
        <>
        <h2>Game Board</h2>
        <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3>
        <h3>{gameSession.opponent_id}</h3>
        <h3>{gameSession.game_key}</h3>
        <button onClick={()=>updateServer()}>Add one to count</button>
        <p>Count: {count}</p>
        <div className="game-table">
            <div className="opponent-table">
                <img alt="oppenent card"/>
                <img alt="oppenent card"/>
                <img alt="oppenent card"/>
            </div>
            <div className="player-table">
                {gameCards? displayGameCards : <></>}
            </div>
        </div>


        </>

    )
}

export default GameBoard