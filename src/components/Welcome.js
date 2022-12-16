

const Welcome = ({currentUser}) => {

    console.log(currentUser.username)
    return (
        <>
        {currentUser?
        <h2>{`Welcome ${currentUser.username}`}</h2>
        :
        <></>
        }
        </>
        // <h2>Welcome</h2>

    )
}

export default Welcome