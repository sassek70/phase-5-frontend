import styled from "styled-components"


const Card = ({cardName, cardPower, cardDefense, cardCost, cardDescription, id, selectedCard, cardImage, cardArtist, user_id, userCardId} ) => {

    return (
        <CardStyle className='player-card' onClick={()=>selectedCard(id, cardPower, cardDefense, user_id, userCardId)}>
            <h4>{cardName}</h4>
            {/* <p>Cost: {cardCost}</p> */}
            <ImageContainer>
                <Image className="image" src={cardImage}/>
                <div>Artist: {cardArtist}</div>
            </ImageContainer>
            <CardDetails>
                <div>Power/Toughness: {cardPower}/{cardDefense}</div>
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
   border: 2px solid #631414;
   /* filter: drop-shadow(19px 13px 16px #000);  */
   border-radius: 24px;
   background: slategrey;
   margin: auto;
   width: 140px;
   height: 250px;
   justify-items: center;
   padding: 5px;
   display: flex;
   flex-direction:column;
   align-items: center;
   color: black;
   `

const ImageContainer = styled.div`
  max-width: fit-content;
  max-height: 150px;
  font-size:smaller;
  text-align: center;
`

const CardDetails = styled.div`
    display: flex;
    position:relative;
    flex-direction: column;
    margin: auto;
    padding: 2px;
    /* border: 2px solid black; */
    font-size:smaller;
`

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`







// background: radial-gradient( #9E2929 0%, #000 20%, #521818 60%, #000 75%, #251E1E 96%, #1B1A1A 100%);