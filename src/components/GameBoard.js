import { useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"

console.log(consumer)

const GameBoard = ({currentUser, gameSession, setGameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    const [gameCards, setGameCards] = useState([])
    const [playerOne, setPlayerOne] = useState()
    // const [playerOneCards, setPlayerOneCards] = useState([])
    const [playerTwo, setPlayerTwo] = useState()
    // const [playerTwoCards, setPlayerTwoCards] = useState([])
    const [playerTurnObj, setPlayerTurnObj] = useState()
    const [playedCards, setPlayedCards] = useState()

    // const [hostPlayerCards, setHostPlayerCards] = useState([])
    // const [opponentPlayerCards, setOpponentPlayerCards] = useState([])
    
    useEffect(() => {
            consumer.subscriptions.create({
            channel: "GameSessionChannel",
            // username: `${currentUser? currentUser.id : guestUser}`,
            game_key: `${gameSession.game_key}`,
        },{
            connected: () => {
                createPlayerCards()
                console.log("connected")
            },
            disconnected: () => console.log("disconnected"),
            received: (data) => {
            // handleData(data)
                const {count, game, game_cards} = data
                // switch(game) {
                //     case game:
                if (game) {
                        setGameSession(game)
                        console.log(game)
                        setPlayerOne(game.host_user_id)
                        setPlayerTwo(game.opponent_id)
                        console.log(`Player 1: ${game.host_user_id}, Player 2: ${game.opponent_id}`);
                        // getGameCards()
                }
                        // break;
                    // case game_cards:
                    //         getGameCards()
                    // case(count):
                    else if (count) {
                        setCount(data.count)
                    } 
                    // else if (game_cards)
                    //     console.log(game_cards)
                    //     setGameCards(game_cards)
                        // break;
                setCount(data.count)
                }})
            // })
                    // console.log("Player has joined the game")    
        getGameCards()
    },[gameSession])


    // const handleData = (data) => {
    //     // console.log(data)
    //     const {count, game, game_cards} = data
    //     if (count){
    //         setCount(data.count)
    //     } else if (game) {
    //         setGameSession(game)
    //         console.log(game)
    //         // setPlayerOne(game.host_user_id)
    //         // setPlayerTwo(game.opponent_id)
    //         console.log(`Player 1: ${game.host_user_id}, Player 2: ${game.opponent_id}`);
    //         getGameCards()

    //     } 
    //     // else if (gameCards) {
    //         // getGameCards()
    //     // }

    // }

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
            .then(gameDeck => {
            // console.log(gameDeck[0].card.cardName)
            setGameCards(gameDeck)})
        } else { 
            res.json().then(errors => console.log(errors))
        }
    })
    }

    const getGameCards = () => {
        console.log(gameSession)
        fetch (`${process.env.REACT_APP_BACKEND_URL}/${gameSession.id}/game_cards`)
        .then( res => {if (res.ok) {
            res.json()
            .then(sessionCards => {
                setGameCards(sessionCards)
                console.log(sessionCards)})
                // sessionCards.map((card) => {
                //     console.log(card.user_id) 
                //     console.log(card)
                //     if (card.user_id === gameSession.host_user_id){
                //         // setPlayerOneCards((playerOneCards) => [...playerOneCards, card])
                //         console.log(`player1 card ${card.card}`)
                //     } else {
                //         // setPlayerTwoCards((playerTwoCards) => [...playerTwoCards, card])
                //         console.log(`player2 card ${card}`)

                //     }
                // })
            // })
        }else {
            res.json().then(errors => console.log(errors))
        }}
        )}


    // console.log(`Player 1: ${playerOneCards}`)
    // console.log(`Player 2: ${playerTwoCards}`)
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
    const cardSelect = (selectedCardId, selectedCardPower, selectedCardDefense) => {
        let player 
        if (currentUser && (gameSession.host_user_id === currentUser.id || gameSession.opponent_id === currentUser.id)) {
            player = currentUser.id
        } else if (gameSession.opponent_id === guestUser){
            player = guestUser
        }

        console.log({
            player_id: player,
            card_id:selectedCardId,
            power: selectedCardPower,
            defense: selectedCardDefense
        })
    }
    
    let filteredHostGameCards = gameCards.filter((card) => card.user_id === gameSession.host_user_id? card : null)
    let filteredOpponentGameCards = gameCards.filter((card) => card.user_id === gameSession.opponent_id? card : null)

    let displayHostGameCards = filteredHostGameCards.map((card) => {
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription} = card.card
        return (
                <Card key={uuid()} id={id} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} cardSelect={cardSelect}/>
        )
    })

    let displayOpponentGameCards = filteredOpponentGameCards.map((card) => {
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription} = card.card
        return (
                <Card key={uuid()} id={id} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} cardSelect={cardSelect}/>
        )
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
                {/* {getGameCards} */}
            </div>
            <div className="player-table">
                {currentUser.id === gameSession.host_user_id? displayHostGameCards : displayOpponentGameCards}
            </div>
        </div>


        </>

    )
}

export default GameBoard