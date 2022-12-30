import { useState } from "react"



const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription, id, selectedCard, cardImage, cardArtist, user_id, userCardId} ) => {

    return (
        <div className='player-card' onClick={()=>selectedCard(id, cardPower, cardDefense, user_id, userCardId)}>
            <h4>{cardName}</h4>
            <p>Cost: {cardCost}</p>
            <div className="image-container">
                <img className="image" src={cardImage}/>
            </div>
            <p>Artist: {cardArtist}</p>
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