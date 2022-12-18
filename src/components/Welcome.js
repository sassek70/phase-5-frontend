

const Welcome = ({currentUser, guestUser}) => {

    // console.log(currentUser.username)
    return (
        <>
        {currentUser?
        <h2>{`Welcome ${currentUser? currentUser.username: guestUser}`}</h2>
        :
        <></>
        }
        </>
        // <h2>Welcome</h2>

    )
}

export default Welcome