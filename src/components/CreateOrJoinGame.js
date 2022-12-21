import { useState } from "react"
import { useNavigate } from "react-router-dom"


const CreateOrJoinGame = ({currentUser, setGameSession, guestUser, setGuestUser, gameSession}) => {
    // const [currentUser, setCurrentUser] = useState()
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState({gameKey: ""})
    const [gameKey, setGameKey] = useState("")
    // console.log(currentUser)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((formData) => ({...formData, [name]: value}))
    }

    const handleClick = () => {
        // e.preventDefault()
        // console.log("click")

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


          fetch(`${process.env.REACT_APP_BACKEND_URL}/joingame/${formData.gameKey}`,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({opponent_id: currentUser? currentUser.id : guestUser}),
          })
          .then(res => {if (res.ok) {
            res.json()
          .then(existingGame => {
            console.log(`/game/${formData.gameKey}`)
            setGameSession(existingGame)
            navigate(`/game/${existingGame.game_key}`)
          })
          } else {
          
            res.json().then(errors => setErrors(errors))
          }})
        
    //     } else {

    //     fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/joingame`,{
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //   .then(res => {if (res.ok) {
    //     res.json()
    //   .then(newKey => {
    //     setGameKey(newKey)
    //     console.log(`/users/${currentUser.id}/game/${formData.gameKey}`)
    //   })
    // } else {
    //   console.log(`/users/${currentUser? currentUser.id : guestUser}/game/${formData.gameKey}`)

    //   res.json().then(errors => setErrors(errors))
    // }})
    // }}
        }

    const startGame = () => {
      navigate(`/game/${gameKey}`)
    } 

    // console.log(gameSession, gameKey)
    // console.log(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/creategame`)

    return (
        <>
        {currentUser?
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter a Game Key:</label>
                <input type="text" value={formData.gameKey} name="gameKey" placeholder="Enter a Game Key" onChange={handleChange}></input>

                <button type="submit">Join!</button>
            </form>            
            <button onClick={()=>handleClick()}>Generate Game Key</button>
        </>
         :
         <>
         <p>You must be logged in to play</p>
         </>
        }
        {gameKey}
        {gameKey?
        <button onClick={()=>startGame()}>Start Game</button>
        :
        <></>  
        }
        {errors?
            <p>{errors.error}</p>
            :
            <></>
        }
        </>
    )
}

export default CreateOrJoinGame