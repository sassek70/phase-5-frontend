import { useEffect, useState } from "react"
import consumer from "../cable"
console.log(consumer)

const GameBoard = ({currentUser, gameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    const [playerCards, setPlayerCards] = useState([])
    
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
            .then(playerDeck => console.log(playerDeck))
        } else {
            res.json().then(errors => console.log(errors))
        }
    })

    }

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

    return (
        <>
        <h2>Game Board</h2>
        <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3>
        <h3>{gameSession.opponent_id}</h3>
        <h3>{gameSession.game_key}</h3>
        <button onClick={()=>updateServer()}>Add one to count</button>
        <p>Count: {count}</p>


        </>

    )
}

export default GameBoard