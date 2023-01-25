import { useContext, useEffect, useRef, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"

const GameBoard = ({gameSession, setGameSession, guestUser}) => {
    
    const {currentUser} = useContext(UserContext)
    
    const [count, setCount] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [dataStore, setDataStore] = useState({})
    const [activeTurn, setActiveTurn] = useState(false)
    const [chosenCard, setChosenCard] = useState({})
    const [isAttacking, setIsAttacking] = useState(false)
    const [hostHealth, setHostHealth] = useState(gameSession.host_player_health)
    const [opponentHealth, setOpponentHealth] = useState(gameSession.opponent_player_health)
    const [gameLog, setGameLog] = useState([])
    const [errors, setErrors] = useState()
    const [attackingCardId, setAttackingCardId] = useState()
    const navigate = useNavigate()
    const gameLogWindow = useRef(null)
    const [gameStarted, setGameStarted] = useState(false)
    
    // Create websocket connection and handle server broadcasts
    useEffect(() => {
        const subscriber =  consumer.subscriptions.create({
                channel: "GameSessionChannel",
                game_key: `${gameSession.game_key}`,
            },{
                connected: () => {
                    setIsConnected(true)
                },
                disconnected: () => {
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
                            setGameLog(gameLog => ([ ...gameLog, data.message]))
                            break;
                        case "attack-declared":
                            setIsAttacking(isAttacking => !isAttacking)
                            setAttackingCardId(data.player_action.attacking_user_card.id)
                            setGameLog(gameLog => ([ ...gameLog, data.message]))
                            setGameStarted((gameStarted) => true)
                            break;
                        case "defense-declared":
                            setGameLog(gameLog => ([ ...gameLog, data.message]))
                            break;
                        case "update-health":
                                if(data.player === "host") {
                                    setHostHealth((hostHealth) => data.health)
                                    if (data.health <= 0) {
                                        handleGameOver("Game Over")
                                    }
                                } else {
                                    setOpponentHealth((opponentHealth) => data.health)
                                    if (data.health <= 0) {
                                        handleGameOver("Game Over")
                                    }
                                }
                            break;
                        case "update-cards":
                            updateDataStore('userCard', data.destroyed_user_cards)
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
                            setAttackingCardId()
                            setGameLog(gameLog => ([ ...gameLog, data.message]))
                            break;
                        case "draw":
                            alert("Neither player has cards remaining. Game is a draw")
                            navigate('/home')
                            break;
                    }
                }
            })
            return () => {
                consumer.disconnect()
                setGameSession()
            }
    },[])
    
    // set Host player as the first turn
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

    // scroll the game log with new updates
    useEffect(() => {
        gameLogWindow.current?.scrollIntoView({behavior: "smooth", block: "nearest"})
    },[gameLog])

    const fetchConfig = (verb, body, urlEndPoint) => {
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/${urlEndPoint}`, {
                method: verb,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(body)
            })
    }

    // Contains all user_cards for both players as well as serialized data from the server.
    const updateDataStore = (modelName, models) => {
        setDataStore(dataStore => {
            const copiedDataStore = {...dataStore}
            // Makes dataStore expandable to have other keys if needed.
            copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
            // Models will change based on server response, for each thing we want to change, check dataStore, if existing update, if not add new one with new value = also called an "Upsert - update/insert"
            models.forEach(model => copiedDataStore[modelName][model.id] = model)
            return copiedDataStore
        })
    }

    // Pulls the user_cards from the server, stores them in dataStore.
    const createPlayerCards = () => {

        fetchConfig('POST',{player_id: currentUser.id, game_id: gameSession.id}, 'create_random_deck')
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

    // used for testing websocket connection
    // const updateServer = () => {
    //     fetchConfig('POST',{player_id: currentUser.id, game_id: gameSession.id}, `increase_counter`)
    //     // .then(res => { 
    //     //     if (res.ok) {
    //     //     res.json().then(updatedCount => setCount(updatedCount))
    //     //     }
    //     // })
    //     consumer.send({
    //         command: "message",
    //         // identifier:{
    //             channel: "GameSessionChannel",
    //             game_key: gameSession.game_key,
    //         // },
    //         data:JSON.stringify({message:"button clicked"})
    //     })
    // }

    // Sets state to reflect the card the active player has chosen
    const selectedCard = (selectedCardId, selectedCardPower, selectedCardDefense, selectedCardUserId, selectedCardUserCardId) => {
        setChosenCard({})
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
            setChosenCard(card)
        }
    }

    // Divide the dataStore userCards between their respective players.
    let filteredHostGameCards = Object.values(dataStore.userCard ?? {}).filter((userCard) => userCard.user_id === gameSession.host_user_id && userCard.isActive ? userCard : null)
    let filteredOpponentGameCards = Object.values(dataStore.userCard ?? {}).filter((userCard) => userCard.user_id !== gameSession.host_user_id && userCard.isActive ? userCard : null)

    // Filter throught the dataStore to only display cards that have isActive: true
    let displayHostGameCards = filteredHostGameCards.map((user_card) => {
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription, cardImage, cardArtist} = user_card.card
        return (
                <Card
                    key={uuid()}
                    id={id}
                    userCardId={user_card.id}
                    cardName={cardName}
                    cardPower={cardPower}
                    cardDefense={cardDefense}
                    cardCost={cardCost}
                    cardDescription={cardDescription}
                    selectedCard={selectedCard}
                    activeTurn={activeTurn}
                    user_id={user_card.user_id}
                    cardImage={cardImage}
                    cardArtist={cardArtist}
                    isAttackingCard={user_card.id === attackingCardId}
                    isSelected={user_card.id === chosenCard?.user_card_id}
                />
        )
    })

    let displayOpponentGameCards = filteredOpponentGameCards.map((user_card) => {
        const {id, cardName, cardPower, cardDefense, cardCost, cardDescription, cardImage, cardArtist} = user_card.card
        return (
                <Card
                    key={uuid()}
                    id={id}
                    cardName={cardName}
                    userCardId={user_card.id}
                    cardPower={cardPower}
                    cardDefense={cardDefense}
                    cardCost={cardCost}
                    cardDescription={cardDescription}
                    selectedCard={selectedCard}
                    activeTurn={activeTurn}
                    user_id={user_card.user_id}
                    cardImage={cardImage}
                    cardArtist={cardArtist}
                    isAttackingCard={user_card.id === attackingCardId}
                    isSelected={user_card.id === chosenCard?.user_card_id}
                />
        )
    })

    // Function determines the amount of active cards remaining for both players
    const cardCounter = (playerCardsArray) => {
        let count = playerCardsArray.length
        for (const card of playerCardsArray) {
            if (card.isActive === false) {
                count -= 1
            }
        }
        return count
    }

    // Confirms the attacking player's card choice and sends to the server.
    const submitAttackAction = () => {
        fetchConfig("POST", chosenCard,`game/${gameSession.id}/player_actions/attack`)
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    // Confirms the defending player's card choice and sends to the server.
    const submitDefendAction = () => {
        fetchConfig("POST", chosenCard,`game/${gameSession.id}/player_actions/combat`)
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    // If a player has no cards remaining and it is their turn to attack, a button will appear to target this endpoint, allowing the active player to skip their turn.
    const submitSkipAction = () => {
        fetchConfig("POST", {player_id: currentUser.id, skip: true},`game/${gameSession.id}/player_actions/skip`)
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    // If a player has no cards remaining and it is their turn to defend, a button will appear to target this endpoint, allowing the active player to skip their turn.
    const endTurnNoCard = () => {
        fetchConfig("POST", {player_id: currentUser.id},`game/${gameSession.id}/player_actions/combat`)
        .then(res => {
            if (!res.ok) {
                res.json().then(errors => setErrors(errors))
            } 
        })
    }

    // Function gets called if one player's health is <= 0 to signal the end of the game.
    const handleGameOver = (message) => {
            alert(message)
            setGameSession()
            navigate('/home')
    }

    // Check to see if either player still has active cards. If both players have no cards with isActive: true, the game ends in a draw.
    let hostActiveCards = displayHostGameCards.length
    let opponentActiveCards = displayOpponentGameCards.length

    useEffect(() => {
        if(gameStarted === true && hostActiveCards === 0 && opponentActiveCards === 0) {
            if(currentUser.id === gameSession.host_user_id) {
                fetchConfig("PATCH", {draw: true},`game/${gameSession.game_key}/draw`)
                .then(res => {
                if (!res.ok) {
                    res.json().then(errors => setErrors(errors))
                } 
            })
        }
        handleGameOver("No active cards remaining. Game is a draw.")
        }
    },[hostActiveCards, opponentActiveCards])

    // Display messages from the server to let player's know what is happening each turn.
    const displayLog = gameLog.map((log) => <p key={uuid()}>{log}</p>)
   
    return (
        <>
        {/*
        Button to increase a counter to test websocket connection without needing cards/ third-party API

        <button onClick={()=>updateServer()}>Add one to count</button>
        <p>Count: {count}</p>
        */}

        <Body>
        <GameTable>
        <ActionRow>
            <SideActionContainer>
            <h4>{currentUser.id === gameSession.host_user_id ? `Opponent's Health: ${opponentHealth}`:`Opponent's Health: ${hostHealth}`}</h4>
            </SideActionContainer>
        </ActionRow>
            <PlayerCardArea className="card-table">
                {gameSession.opponent_id ? 
                    currentUser.id === gameSession.host_user_id ? 
                    displayOpponentGameCards.length > 0 ?
                    <>
                            {displayOpponentGameCards.slice(0,5)}
                            <CardPile>
                                <p>{cardCounter(displayOpponentGameCards) < 5 ? `0 cards remaining` : `${cardCounter(displayOpponentGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                        </>
                            :
                            <CardPile>
                                <p>No cards remaining</p>
                            </CardPile>
                            : displayHostGameCards.length > 0 ?
                            <>
                            {displayHostGameCards.slice(0,5)}
                            <CardPile>
                                <p>{cardCounter(displayHostGameCards) < 5 ? `0 cards remaining` : `${cardCounter(displayHostGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                        </>
                            :
                            <CardPile>
                                <p>No cards remaining</p>
                            </CardPile>
                            :
                            <p>Waiting for opponent to join</p>}
            </PlayerCardArea>
        <GameActions className="server-log" >
                {displayLog}
            <div ref={gameLogWindow}></div>
        </GameActions>
            <ActionRow>
                <SideActionContainer style={{justifyContent: "flex-start"}}>
                {chosenCard && isAttacking ? 
                    activeTurn ? 
                    <button onClick={() => submitAttackAction()}>Confirm Attack</button> 
                    :
                    <button onClick={() => submitDefendAction()}>Confirm Defense</button>
                    :
                    <></>
                }
                </SideActionContainer>
                <CenterActionContainer>

                    {isAttacking ? 
                        activeTurn ? 
                        <PlayerNotes>Choose a card to attack with</PlayerNotes>
                        :
                        <PlayerNotes>Choose a card to defend with</PlayerNotes>
                        :
                        <PlayerNotes>Waiting for opponent's action</PlayerNotes>
                    }
                </CenterActionContainer>
                <SideActionContainer style={{justifyContent: "flex-end"}}>
                    <h4>{currentUser.id === gameSession.host_user_id ? `Your Health: ${hostHealth}`:`Your Health: ${opponentHealth}`}</h4>
                </SideActionContainer>
            </ActionRow>
                        <PlayerCardArea className="card-table">
            {currentUser.id === gameSession.host_user_id ? 
                    displayHostGameCards.length > 0 ?
                        <>
                            <CardPile>
                                <p>{cardCounter(displayHostGameCards) < 5 ? `No cards remaining` : `${cardCounter(displayHostGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                            {displayHostGameCards.slice(0,5)}
                        </>
                        : 
                        <>
                            <CardPile>
                                <p>No cards remaining</p>
                            {isAttacking ? 
                                activeTurn ?
                                <button onClick={() => submitSkipAction()}>Skip Turn</button>
                                :
                                <button onClick={()=>endTurnNoCard()}>End Turn</button>
                                :
                                <></>
                            }  
                            </CardPile>
                        </>
                    :
                    displayOpponentGameCards.length > 0 ?
                        <>
                            <CardPile>
                                <p>{cardCounter(displayOpponentGameCards) < 5 ? `No cards remaining` : `${cardCounter(displayOpponentGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                            {displayOpponentGameCards.slice(0,5)}
                        </>
                        : 
                        <>
                            <CardPile>
                                <p>No cards remaining</p>
                            {isAttacking ? 
                                activeTurn ?
                                        <button onClick={() => submitSkipAction()}>Skip Turn</button>
                                    :
                                        <button onClick={()=>endTurnNoCard()}>End Turn</button>
                                :
                                <></>
                            }  
                            </CardPile>
                        </>
                }
            </PlayerCardArea>
            </GameTable>
        </Body>
        </>
    )
}

export default GameBoard


// Everything below is for styling

const GameTable = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    justify-content: center;
    align-items: center;
    min-width: 80vw;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.95);
    border-radius: 20px;
`

const PlayerCardArea = styled.div`
    display: flex;
    min-width : 75vw;
    min-height: 340px;
    flex-direction: row;
    flex-wrap: nowrap;
    border: 5px inset #631414;
    column-gap: 20px;
`

const CardPile = styled.div`
    border: 2px solid #631414;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    background: slategrey;
    margin: auto;
    width: 140px;
    height: 250px;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background: radial-gradient( #9E2929 0%, #000 20%, #521818 60%, #000 75%, #251E1E 96%, #1B1A1A 100%);
    color: white;
`

const GameActions = styled.ul`
    border: 2px solid white;
    overflow-y: scroll;
    height: 200px;
    width: 500px;
    scroll-behavior: smooth;
    color: white;
`
const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: white;
    margin-top: 40px;
`
const PlayerNotes = styled.div`
    display: flex;
    justify-content: left;
    padding: 5px;
`

const ActionRow = styled.div`
    height: 30px;
    min-width: 75vw;
    display: flex;
`

const SideActionContainer = styled.div`
    height: 100%;
    width: 33%;
    display: flex;
    align-items: center;
`

const CenterActionContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1 1 0;
    justify-content: center;
`