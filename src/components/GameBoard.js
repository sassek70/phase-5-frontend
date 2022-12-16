

const GameBoard = ({currentUser, gameSession, guestUser}) => {
    return (
        <>
        <h2>Game Board</h2>
        <h3>{`Player 1: ${currentUser? currentUser.username : guestUser}`}</h3>
        <h3>{gameSession.opponent_id}</h3>
        <h3>{gameSession.game_key}</h3>


        </>

    )
}

export default GameBoard