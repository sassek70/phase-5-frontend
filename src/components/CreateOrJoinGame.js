import { useEffect, useState } from "react"


const CreateOrJoinGame = ({currentUser, setGameSession, gameSession}) => {
    // const [currentUser, setCurrentUser] = useState()
    const [formData, setFormData] = useState({gameKey: ""})
    const [gameKey, setGameKey] = useState()
    console.log(currentUser)

    // useEffect(() => {
    //     setCurrentUser(localStorage.getItem("uid"))
    // },[])

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((formData) => ({...formData, [name]: value}))
    }

    const handleClick = () => {
        // e.preventDefault()
        console.log("click")

        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/creategame`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // body: JSON.stringify(formData),
      })
      .then(r => r.json())
      .then(newGame => {
        setGameSession(newGame)
        setGameKey(newGame.game_key)
      })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/joingame`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      .then(r => r.json())
      .then(newKey => setGameKey(newKey))
    }

    console.log(gameSession, gameKey)
    // console.log(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/creategame`)

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter a Game Key:</label>
                <input type="text" value={formData.gameKey} name="gameId" placeholder="Enter a Game Key" onChange={handleChange}></input>

                <button type="submit">Join!</button>
            </form>            
        {currentUser?
            <button onClick={()=>handleClick()}>Generate Game Key</button>
         :
         <></>
        }
        {gameKey}
        </>
    )
}

export default CreateOrJoinGame