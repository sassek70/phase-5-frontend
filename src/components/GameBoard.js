import { useState } from "react"
import consumer from "../cable"
console.log(consumer)

const GameBoard = ({currentUser, gameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    
    const counterTest = () => {
        setCount((count) => count + 1)
        console.log(`Player: ${currentUser? currentUser.id : guestUser} changed the count to ${count}`)
    }

// const updateCount = () => {
    consumer.subscriptions.create({
        channel: "GameSessionChannel",
        username: `${currentUser? currentUser.id : guestUser}`,
        game_key: `${gameSession.game_key}`,
        count: `${count}`
    },{
        connected: () => console.log("connected"),
        disconnected: () => console.log("disconnected"),
        received: data => console.log("received", data)
    })
// }



    const updateServer = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/increase_counter`)
        .then(res => { 
            if (res.ok) {
            res.json().then(updatedCount => console.log(updatedCount))
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