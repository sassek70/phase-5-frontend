import { useContext, useEffect, useState } from "react"
import consumer from "../cable"
import uuid from "react-uuid"
import Card from "./Card"
import { useNavigate } from "react-router-dom"
import GameLog from "./GameLog"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"

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
                        case "test":
                            console.log(data)
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
        consumer.send({
            command: "message",
            // identifier:{
                channel: "GameSessionChannel",
                game_key: gameSession.game_key,
            // },
            data:JSON.stringify({message:"button clicked"})
        })
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



    const displayLog = gameLog.map((log) => <p key={uuid()}>{log}</p>)
    console.log(gameSession)
   
    return (
        <>
        {/* <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3> */}
        <h3>{`Player 1: ${currentUser.username}`}</h3>
        {gameSession.opponent_id ? 
            <>
            <h3>{`Player 2: ${gameSession.opponent_id}`}</h3> 
            </>
            : 
            <h3>Waiting for opponent</h3>
        }
        <div>{`Game-key: ${gameSession.game_key}`}</div>
        <button onClick={()=>updateServer()}>Add one to count</button>
        {/* <p>Count: {count}</p> */}
        <Body>
        <GameTable>
        {/* <div>Oppenent's cards</div> */}
        <h4>Opponent's Health:{opponentHealth}</h4> 
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
        </GameActions>
        {/* <p>Your cards</p> */}
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
                    {activeTurn?
                        <PlayerNotes>Your turn</PlayerNotes>
                        :
                        <PlayerNotes>Oppenent's turn</PlayerNotes>
                    } 
                    <br/>
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
                    <h4>Your Health: {hostHealth}</h4>
                </SideActionContainer>
            </ActionRow>
                        <PlayerCardArea className="card-table">
            {currentUser.id === gameSession.host_user_id ? 
                    displayHostGameCards.length > 0 ?
                        <>
                            <CardPile>
                                <p>{cardCounter(displayHostGameCards) < 5 ? `0 cards remaining` : `${cardCounter(displayHostGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                            {displayHostGameCards.slice(0,5)}
                        </>
                        : 
                        <>
                            <CardPile>
                                <p>No cards remaining</p>
                            </CardPile>
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
                            <CardPile>
                                <p>{cardCounter(displayOpponentGameCards) < 5 ? `0 cards remaining` : `${cardCounter(displayOpponentGameCards) - 5} cards remaining`}</p>
                            </CardPile>
                            {displayOpponentGameCards.slice(0,5)}
                        </>
                        : 
                        <>
                            <CardPile>
                                <p>No cards remaining</p>
                            </CardPile>
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
            </PlayerCardArea>
            </GameTable>
            <div>

            </div>



        </Body>
        </>

    )
}

export default GameBoard


const GameTable = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
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
   /* filter: drop-shadow(19px 13px 16px #000);  */
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
    margin: auto;
    width: 100vw;
    color: white;
`
const PlayerNotesContainer = styled.div`
    display: flex;
    flex-direction: row;
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