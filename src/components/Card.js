


const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription, cardSelect, id}) => {


    return (
        <div className='player-card' onClick={()=>cardSelect(id, cardPower, cardDefense)}>
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