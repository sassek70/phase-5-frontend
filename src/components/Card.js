


const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription}) => {


    return (
        <div className='player-card'>
            <h4>{cardName}</h4>
            <p>Cost: {cardCost}</p>
            <p>{cardDescription}</p>
            <p>{cardPower}/{cardDefense}</p>
            <div>
                <button>Attack</button>
                <button>Defend</button>
            </div>
        </div>
    )
}

export default Card