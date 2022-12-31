import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"


const CreateOrJoinGame = ({setGameSession, guestUser, setGuestUser, gameSession}) => {
    // const [currentUser, setCurrentUser] = useState()
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState({gameKey: ""})
    const [gameKey, setGameKey] = useState("")

    const {currentUser} = useContext(UserContext)


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
          "uid": localStorage.getItem('uid'),
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // body: JSON.stringify(formData),
      })
      .then(res => {
        if (res.ok) {
          res.json().then(newGame => {
        setGameSession(newGame)
        setGameKey(newGame.game_key)
        navigate(`/game/${newGame.game_key}`)
      })
    } else {
      res.json().then(errors => console.log(errors))
    }})
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

        const invalidKey = (e) => {
          return e.target.setCustomValidity("Please enter a game key")
        }

    return (
        <>
        {currentUser?
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Have a Game Key? Enter it here to join!</label>
                <input type="text" value={formData.gameKey} name="gameKey" placeholder="Enter a Game Key" onChange={handleChange} required onInvalid={invalidKey}></input>

                <button type="submit">Join!</button>
            </form>
            <div>
              <p>Click here to host a new game and receive a game key to give to a friend.</p>
              <button onClick={()=>handleClick()}>Create Game</button>
            </div>
        </>
         :
         <>
         <p>You must be logged in to play</p>
         </>
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