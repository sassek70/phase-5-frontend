

const Welcome = (currentUser) => {

    console.log(currentUser.currentUser.username)
    return (
        <h2>{`Welcome ${currentUser.currentUser.username}`}</h2>
    )
}

export default Welcome