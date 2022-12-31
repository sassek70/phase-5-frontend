import styled from "styled-components"


const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription, id, selectedCard, cardImage, cardArtist, user_id, userCardId} ) => {

    return (
        <CardStyle className='player-card' onClick={()=>selectedCard(id, cardPower, cardDefense, user_id, userCardId)}>
            <h4>{cardName}</h4>
            {/* <p>Cost: {cardCost}</p> */}
            <ImageContainer>
                <Image className="image" src={cardImage}/>
            </ImageContainer>
            <CardDetails>
                <p>Artist: {cardArtist}</p>
                <p>Power: {cardPower}</p>
                <p>Toughness: {cardDefense}</p>
            </CardDetails>
            {/* <div>
                {chosenCard?
                <button onClick={()=>submitAction()}>Confirm</button>
                :
                <></>
            }
            </div> */}
        </CardStyle>
    )
}

export default Card


const CardStyle = styled.div`
   border: 2px inset #631414;
   filter: drop-shadow(19px 13px 16px #000); 
   border-radius: 24px;
   background: slategrey;
   margin: auto;
   max-width: 200px;
   max-height: 300px;
   justify-items: center;
   `

const ImageContainer = styled.div`
  max-width: 200px;
  max-height: 150px;
`

const CardDetails = styled.div`
    display: flex;
    padding: 2px;
    /* border: 2px solid black; */
`

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`







// background: radial-gradient( #9E2929 0%, #000 20%, #521818 60%, #000 75%, #251E1E 96%, #1B1A1A 100%);