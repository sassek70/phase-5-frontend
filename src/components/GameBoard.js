import { useState } from "react"
import consumer from "../cable"
console.log(consumer)

const GameBoard = ({currentUser, gameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    
    const counterTest = () => {
        setCount((count) => count + 1)
        console.log(`Player: ${currentUser? currentUser.id : guestUser} changed the count to ${count}`)
    }


    consumer.subscriptions.create({
        channel: "GameSessionChannel",
        username: `${currentUser? currentUser.id : guestUser}`,
        game_key: `${gameSession.game_key}`
    })


    return (
        <>
        <h2>Game Board</h2>
        <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3>
        <h3>{gameSession.opponent_id}</h3>
        <h3>{gameSession.game_key}</h3>
        <button onClick={()=>counterTest()}>Add one to count</button>
        <p>Count: {count}</p>


        </>

    )
}

export default GameBoard