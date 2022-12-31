import { useContext } from "react"
import {UserContext} from "../context/UserContext"


const Welcome = ({guestUser}) => {

    
    const {currentUser} = useContext(UserContext)


    return (
        <>

        <div>
            <p>A Not So Magical Gathering is a 1v1 browser based card-battle game. This game has been created using Reactjs and Ruby on Rails. At this time, you must create an account in order to play to game.</p>
            <h5>GETTING STARTED:</h5>
            <p>There are two ways to start a game. You can either Host a game or join a game if you have been sent a Game Key. If you choose to host a game, a game key will be displayed when the game loads. Send this key to the person you wish to play against.</p>
            <h5>HOW TO PLAY:</h5>
            <p>When you host or join a game, you will be given a deck containing thirty (30) random cards, Six (6) cards will displayed on your table at a time. Both players start with twenty (20) health.<br/>
                The Host player always has the first turn. On your turn, you can select a Card to attack or skip your turn. Once you click "Confirm Attack", your Opponent then gets to choose a Card to defend with.<br/>
                If the Defending Player chooses a card to defend with, the Power value of each card is compared against the Toughness value. Both player's card tables and total health will be updated based on the results</p>
            <h5>EXAMPLE TURN</h5>
            <ol>
                <li>Player 1 (Host) attacks with a Power: 3, Toughness: 3 Card.</li>
                <li>Player 2 defends with a Power: 1, Toughness: 2 Card.</li>
                <li>The Power of the Attacking Card is greater than the Toughness of the Defending Card.</li>
                <li>The Defending Card is destroyed and removed from the table and replaced with a new card from the Defending Player's deck.</li>
                <li>Defending Card only blocked 2 damage and the Attacking Card has a Power of 3, 1 damage point remains and is applied to the Defending Player's health</li>
                <li>The Defending Player's health is updated to 19</li>
                <li>Since the Attacking Card's Toughness is greater than the Defending Cards Power, it remains on the table. It is now Player 2's turn</li>
            </ol>
            <h5>END OF GAME</h5>
            <p>The two (2) main ways for the game to end is when either player has 0 or less health remaining or if neither player has any cards available.  In the first case, the player that has more than 0 health is declared the winner. In the second case, the game is considered a draw.</p>
            <h5>***IMPORTANT***</h5>
            <p>It is currently impossible to rejoin a game. If you refresh the page, navigate to a different page, close the browser tab, close the browser window or lose connection, you will be locked out of the game. the game session will terminate for both players.</p>
        </div>
        {/* <table>
                <tr>
                    <th>Case</th>
                    <th>Attacking Card (AC) Power</th>
                    <th>Attacking Card (AC) Toughness</th>
                    <th>Defending Card (DC) Power</th>
                    <th>Defending Card (DC) Toughness</th>
                    <th>Result</th>
                </tr>
                <tr>
                    <td>{`AC Power < DC Toughness & DC Power < AC Toughness`}</td>
                </tr>
        </table> */}

        </>
    )
}

export default Welcome