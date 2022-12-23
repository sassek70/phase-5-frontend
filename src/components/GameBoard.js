import { useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"

// console.log(consumer)

const GameBoard = ({currentUser, gameSession, setGameSession, guestUser}) => {
    const [count, setCount] = useState(0)
    const [gameCards, setGameCards] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [dataStore, setDataStore] = useState({})
    const [activeTurn, setActiveTurn] = useState(false)
    const [chosenCard, setChosenCard] = useState()
    const [isAttacking, setIsAttacking] = useState(false)
    const [hostHealth, setHostHealth] = useState(gameSession.host_player_health)
    const [opponentHealth, setOpponentHealth] = useState(gameSession.opponent_player_health)

    // const [hostPlayerCards, setHostPlayerCards] = useState([])
    // const [opponentPlayerCards, setOpponentPlayerCards] = useState([])
    
    useEffect(() => {
            consumer.subscriptions.create({
            channel: "GameSessionChannel",
            game_key: `${gameSession.game_key}`,
        },{
            connected: () => {
                console.log("connected")
                setIsConnected(true)
            },
            disconnected: () => {
                console.log("disconnected")
                setIsConnected(false)
            },
            received: (data) => {
            // handleData(data)
                // const {count, game, game_cards} = data
                switch(data.action) {
                    case "counter":
                        setCount(data.count);
                        break;
                    case "all-cards":
                        updateDataStore('userCard', data.game_cards)
                        console.log(data)
                        break;
                    case "user-joined":
                        setGameSession(data.game)
                        break;
                    case "attack-declared":
                        console.log(data.message)
                        setActiveTurn(activeTurn => !activeTurn)
                        // setIsAttacking(isAttacking => !isAttacking)
                        break;
                    case "defense-declared":
                        console.log(data.message)
                        break;
                    case "update-health":
                        if(data.player === "host") {
                            setHostHealth(data.health)
                        } else {
                            setOpponentHealth(data.health)
                        }
                        break;
                    case "update-cards":
                        updateDataStore('userCard', data.game_cards)
                        console.log(data)
                        console.log(data.game_cards)
                        console.log(data)
                        break;
                    case "combat-results":
                        setActiveTurn((activeTurn) => !activeTurn)
                        setIsAttacking((isAttacking) => !isAttacking)
                        // setHostHealth(data.game)
                        setChosenCard(chosenCard => {})
                        console.log(data.message)
                        console.log(data)
                        break;

                }
            }
        })        
    },[])
    
    useEffect(() => {
        if (!isConnected) {
            return
        }

        if (gameSession.host_user_id === currentUser.id) {
            setActiveTurn(true)
            setIsAttacking(true)
        }
        createPlayerCards()
        
    },[isConnected])

    const updateDataStore = (modelName, models) => {
        // const copiedDataStore = {...dataStore}
        // copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
        // models.forEach(model => copiedDataStore[modelName][model.id] = model)
        setDataStore(dataStore => {
            const copiedDataStore = {...dataStore}
            copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
            models.forEach(model => copiedDataStore[modelName][model.id] = model)
            return copiedDataStore
        })
    }

    // const resultDataStore = (modelName, models) => {
    //     // const copiedDataStore = {...dataStore}
    //     // copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
    //     // models.forEach(model => copiedDataStore[modelName][model.id] = model)
    //     setDataStore(dataStore => {
    //         const updatedDataStore = {...dataStore}
    //         updatedDataStore[modelName] = updatedDataStore[modelName] ?? {}
    //         models.forEach(model => updatedDataStore[modelName][model.id] = model)
    //         return updateDataStore
    //     })
    // }


    const createPlayerCards = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/create_random_deck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                // player_id: currentUser? currentUser.id : guestUser,
                player_id: currentUser.id,
                game_id: gameSession.id
            })
        })
        .then(res => {
            if (res.ok) {
                res.json()
                .then(game_cards => {
                    updateDataStore('userCard', game_cards)
                })
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
        // .then(res => { 
        //     if (res.ok) {
        //     res.json().then(updatedCount => setCount(updatedCount))
        //     }
        // })
    }
    const selectedCard = (selectedCardId, selectedCardPower, selectedCardDefense, selectedCardUserId) => {
        setChosenCard()
        if (activeTurn === true && selectedCardUserId === currentUser.id) {
            let card = {
                player_id: currentUser.id,
                card_id: selectedCardId,
                power: selectedCardPower,
                defense: selectedCardDefense,
                user_id: selectedCardUserId,
                // user_card_id: 
                game_id: gameSession.id
            }
            console.log({
                player_id: currentUser.id,
                card_id:selectedCardId,
                power: selectedCardPower,
                defense: selectedCardDefense,
                user_id: selectedCardUserId,
                game_id: gameSession.id

            })
            setChosenCard(card)
        }
    }
    
    let filteredHostGameCards = Object.values(dataStore.userCard ?? {}).filter((userCard) => userCard.user_id === gameSession.host_user_id && userCard.isActive ? userCard : null)
    let filteredOpponentGameCards = Object.values(dataStore.userCard ?? {}).filter((userCard) => userCard.user_id !== gameSession.host_user_id && userCard.isActive ? userCard : null)

    let displayHostGameCards = filteredHostGameCards.map((user_card) => {
        // debugger
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription} = user_card.card
        return (
                <Card key={uuid()} id={id} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} selectedCard={selectedCard} activeTurn={activeTurn} user_id={user_card.user_id} chosenCard={chosenCard}/>
        )
    })

    let displayOpponentGameCards = filteredOpponentGameCards.map((user_card) => {
        // debugger
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription} = user_card.card
        return (
                <Card key={uuid()} id={id} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} selectedCard={selectedCard} activeTurn={activeTurn} user_id={user_card.user_id} chosenCard={chosenCard}/>
        )
    })

    const submitPlayerAction = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/game/${gameSession.id}/player_actions/${isAttacking ? "attack" : "combat"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(chosenCard)
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => console.log(errors))
            } 
        })
    }



    return (
        <>
        <h2>Game Board</h2>
        {/* <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3> */}
        <h3>{`Player 1: ${currentUser.username}`}</h3>
        <h3>{`Player 2: ${gameSession.opponent_id}`}</h3>
        <p>{`Game-key: ${gameSession.game_key}`}</p>
        {activeTurn?
            <p>Your turn</p>
            :
            <p>Oppenent's turn</p>
        } 
        <button onClick={()=>updateServer()}>Add one to count</button>
        <p>Count: {count}</p>
        <div className="game-table">
            <div className="card-table">
                <p>Oppenent's cards</p>
                <p>Oppenent's health: {currentUser.id === gameSession.host_user_id ? opponentHealth : hostHealth}</p>
                {gameSession.opponent_id? (currentUser.id === gameSession.host_user_id ? displayOpponentGameCards : displayHostGameCards) : <p>Waiting for opponent to join</p>}
            </div>
            <div className="card-table">
            <p>Current Player's cards</p>
            <p>Your health: {currentUser.id === gameSession.host_user_id ? hostHealth : opponentHealth}</p>


            {activeTurn? <p>Choose a card to {`${isAttacking? "attack" : "defend"}`} with</p> : <p>Waiting for opponent's action</p>}
            {currentUser.id === gameSession.host_user_id ? displayHostGameCards : displayOpponentGameCards}
            </div>
            {chosenCard? <button onClick={() => submitPlayerAction()}>Confirm</button> : <></>}
        </div>


        </>

    )
}

export default GameBoard