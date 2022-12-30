import { useContext, useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"
import { useNavigate } from "react-router-dom"
import { Subscription } from "@rails/actioncable"
import GameLog from "./GameLog"
import {UserContext} from "../context/UserContext"

console.log(consumer)

const GameBoard = ({gameSession, setGameSession, guestUser}) => {
    
    const {currentUser} = useContext(UserContext)

    
    const [count, setCount] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [dataStore, setDataStore] = useState({})
    const [activeTurn, setActiveTurn] = useState(false)
    const [chosenCard, setChosenCard] = useState()
    const [isAttacking, setIsAttacking] = useState(false)
    const [hostHealth, setHostHealth] = useState(gameSession.host_player_health)
    const [opponentHealth, setOpponentHealth] = useState(gameSession.opponent_player_health)
    const [gameLog, setGameLog] = useState([])
    const [errors, setErrors] = useState()
    const navigate = useNavigate()
    
    
    useEffect(() => {
        const subscriber =  consumer.subscriptions.create({
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
                    switch(data.action) {
                        case "counter":
                            setCount(data.count);
                            break;
                        case "all-cards":
                            updateDataStore('userCard', data.game_cards)
                            break;
                        case "user-joined":
                            setGameSession(data.game)
                            setGameLog(gameLog => ([ data.message, ...gameLog]))
                            break;
                        case "attack-declared":
                            console.log(data.message)
                            setIsAttacking(isAttacking => !isAttacking)
                            setGameLog(gameLog => ([ data.message, ...gameLog]))
                            break;
                        case "defense-declared":
                            console.log(data.message)
                            setGameLog(gameLog => ([ data.message, ...gameLog]))
                            break;
                        case "update-health":
                                if(data.player === "host") {
                                    setHostHealth((hostHealth) => data.health)
                                    if (data.health <= 0) {
                                        handleGameOver(data.health)
                                    }
                                } else {
                                    setOpponentHealth((opponentHealth) => data.health)
                                    if (data.health <= 0) {
                                        handleGameOver(data.health)
                                    }
                                }
                            break;
                        case "update-cards":
                            updateDataStore('userCard', data.game_cards)
                            break;
                        case "combat-results":
                            if (data.attacking_player === currentUser.id) {
                                setActiveTurn((activeTurn) => false)
                                setIsAttacking((isAttacking) => false)
                            } else {
                                setActiveTurn((activeTurn) => true)
                                setIsAttacking((isAttacking) => true)
                            }

                            setChosenCard(chosenCard => {})
                            console.log(data.message)
                            setGameLog(gameLog => ([ data.message, ...gameLog]))
                            break;
                        case "draw":
                            alert("Neither player has cards remaining. Game is a draw")
                            navigate('/home')
                            break;
                    }
                }
            })
            return () => consumer.disconnect()
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
        setDataStore(dataStore => {
            const copiedDataStore = {...dataStore}
            copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
            models.forEach(model => copiedDataStore[modelName][model.id] = model)
            return copiedDataStore
        })
    }

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
                res.json().then(errors => setErrors(errors))
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
    const selectedCard = (selectedCardId, selectedCardPower, selectedCardDefense, selectedCardUserId, selectedCardUserCardId) => {
        setChosenCard()
        if (isAttacking === true && selectedCardUserId === currentUser.id) {
            let card = {
                player_id: currentUser.id,
                card_id: selectedCardId,
                power: selectedCardPower,
                defense: selectedCardDefense,
                user_id: selectedCardUserId,
                game_id: gameSession.id,
                user_card_id: selectedCardUserCardId
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
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription, cardImage, cardArtist} = user_card.card
        return (
                <Card key={uuid()} id={id} userCardId={user_card.id} cardName={cardName} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} selectedCard={selectedCard} activeTurn={activeTurn} user_id={user_card.user_id} chosenCard={chosenCard} cardImage={cardImage} cardArtist={cardArtist}/>
        )
    })

    let displayOpponentGameCards = filteredOpponentGameCards.map((user_card) => {
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription, cardImage, cardArtist} = user_card.card
        return (
                <Card key={uuid()} id={id} cardName={cardName} userCardId={user_card.id} cardPower={cardPower} cardDefense={cardDefense} cardCost={cardCost} cardDescription={cardDescription} selectedCard={selectedCard} activeTurn={activeTurn} user_id={user_card.user_id} chosenCard={chosenCard} cardImage={cardImage} cardArtist={cardArtist}/>
        )
    })

    const cardCounter = (playerCardsArray) => {
        let count = playerCardsArray.length
        for (const card of playerCardsArray) {
            if (card.isActive === false) {
                count -= 1
            }
        }
        return count
    }

    const submitAttackAction = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/game/${gameSession.id}/player_actions/attack`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(chosenCard)
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }



    const submitDefendAction = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/game/${gameSession.id}/player_actions/combat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(chosenCard)
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    const submitSkipAction = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/game/${gameSession.id}/player_actions/skip`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                player_id: currentUser.id,
                skip: true})
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }



    const endTurnNoCard = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/game/${gameSession.id}/player_actions/combat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                player_id: currentUser.id,
            })
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    const handleGameOver = () => {
            alert("Game over")
            console.log("game over")
            navigate('/home')
    }



    const displayLog = gameLog.map((log) => <p>{log}</p>)

   
    return (
        <>
        <h2>Game Board</h2>
        {/* <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3> */}
        <h3>{`Player 1: ${currentUser.username}`}</h3>
        <h4>Health: {hostHealth}</h4>
        {gameSession.opponent_id ? 
            <>
            <h3>{`Player 2: ${gameSession.opponent_id}`}</h3> 
            <h4>Health:{opponentHealth}</h4> 
            </>
            : 
            <h3>Waiting for opponent</h3>
        }
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
                {gameSession.opponent_id ? 
                    currentUser.id === gameSession.host_user_id ? 
                        displayOpponentGameCards.length > 0 ?
                        <>
                            <p>{`${cardCounter(displayOpponentGameCards)} remaining`}</p>
                            {displayOpponentGameCards.slice(0,6)}
                        </>
                            :
                            <p>No cards remaining</p>
                        : displayHostGameCards.length > 0 ?
                        <>
                            <p>{`${cardCounter(displayHostGameCards)} cards remaining`}</p>
                            {displayHostGameCards.slice(0,6)}
                        </>
                            :
                            <p>No cards remaining</p>
                    :
                    <p>Waiting for opponent to join</p>}
            </div>
            <div className="card-table">
            <p>Your cards</p>
            {isAttacking ? 
                activeTurn ? 
                <p>Choose a card to attack with</p>
                :
                <p>Choose a card to defend with</p>
            :
                <p>Waiting for opponent's action</p>
            }
            {currentUser.id === gameSession.host_user_id ? 
                    displayHostGameCards.length > 0 ?
                        <>
                            <p>{`${cardCounter(displayHostGameCards)} cards remaining`}</p>
                            {displayHostGameCards.slice(0,6)}
                        </>
                        : 
                        <>
                            <p>No cards remaining</p>
                            {isAttacking ? 
                                activeTurn ?
                                    <button onClick={() => submitSkipAction()}>Skip Turn</button>
                                    :
                                    <button onClick={()=>endTurnNoCard()}>End Turn</button>
                                :
                            <></>
                            }  
                        </>
                    :
                    displayOpponentGameCards.length > 0 ?
                        <>
                            <p>{`${cardCounter(displayOpponentGameCards)} cards remaining`}</p>
                            {displayOpponentGameCards.slice(0,6)}
                        </>
                        : 
                        <>
                            <p>No cards remaining</p>
                            {isAttacking ? 
                                activeTurn ?
                                    <button onClick={() => submitSkipAction()}>Skip Turn</button>
                                    :
                                    <button onClick={()=>endTurnNoCard()}>End Turn</button>
                                :
                                <></>
                            }  
                        </>
                }
            </div>
            {chosenCard?
                isAttacking ? 
                    activeTurn ? 
                    <>
                        <button onClick={() => submitAttackAction()}>Confirm Attack</button> 
                    </>
                    :
                    <>  
                        <button onClick={() => submitDefendAction()}>Confirm Defense</button>
                    </>
                :
                <></>
            :
            <></>
            }
        </div>
        <ul className="server-log" >
            {displayLog}
        </ul>


        </>

    )
}

export default GameBoard