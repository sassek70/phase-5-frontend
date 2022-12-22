import { useState } from "react"



const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription, id, selectedCard, chosenCard, user_id}) => {
    // const [chosenCard, setChosenCard] = useState()

    // const selectedCard = (selectedCardId, selectedCardPower, selectedCardDefense) => {
    //     // let selectedCard = {}
    //     if (user_id === currentUser.id) {
    //         let selectedCard = {
    //             player_id: currentUser.id,
    //             card_id:selectedCardId,
    //             power: selectedCardPower,
    //             defense: selectedCardDefense
    //         }
    //         setChosenCard(selectedCard)
    //     }
    // }

    // const submitAction = (chosenCard) => {
    //     if (activeTurn === true) {
    //         console.log(chosenCard)
    //     }
    // }
    // console.log(user_id)

    return (
        <div className='player-card' onClick={()=>selectedCard(id, cardPower, cardDefense, user_id)}>
            <h4>{cardName}</h4>
            <p>Cost: {cardCost}</p>
            <p>{cardDescription}</p>
            <p>{cardPower}/{cardDefense}</p>
            {/* <div>
                {chosenCard?
                <button onClick={()=>submitAction()}>Confirm</button>
                :
                <></>
            }
            </div> */}
        </div>
    )
}

export default Card