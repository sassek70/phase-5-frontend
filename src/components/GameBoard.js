import { useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"

console.log(consumer)

const GameBoard = ({currentUser, gameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    const [gameCards, setGameCards] = useState([])
    const [hostPlayerCards, setHostPlayerCards] = useState([])
    const [opponentPlayerCards, setOpponentPlayerCards] = useState([])
    
    const counterTest = () => {
        setCount((count) => count + 1)
        console.log(`Player: ${currentUser? currentUser.id : guestUser} changed the count to ${count}`)
    }

    useEffect(() => {
            consumer.subscriptions.create({
            channel: "GameSessionChannel",
            // username: `${currentUser? currentUser.id : guestUser}`,
            game_key: `${gameSession.game_key}`,
        },{
            connected: () => console.log("connected"),
            disconnected: () => console.log("disconnected"),
            received: data => setCount(data)
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
                game_key: gameSession.game_key
            })
        })
        .then(res => {if (res.ok) {
            res.json()
            .then(gameDeck => setGameCards((gameCards) => ([...gameCards, gameDeck])))
        } else {
            res.json().then(errors => console.log(errors))
        }
    })

    }
    console.log(gameCards)




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

    // let displayPlayerCards = playerCards.map((card) => {
    //     const {cardName, cardPower, cardDefense, cardCost, cardDescription} = card
    //     return (<Card key={uuid()} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription}/>)
    // })

    return (
        <>
        <h2>Game Board</h2>
        <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3>
        <h3>{gameSession.opponent_id}</h3>
        <h3>{gameSession.game_key}</h3>
        <button onClick={()=>updateServer()}>Add one to count</button>
        <p>Count: {count}</p>
        <div className="player-table">
            {/* {playerCards? displayPlayerCards.slice(0,5): <></>} */}
        </div>
        <div>BREAK BREAK BREAK BREA</div>
        <div>
            {/* {displayPlayerCards} */}
        </div>


        </>

    )
}

export default GameBoard