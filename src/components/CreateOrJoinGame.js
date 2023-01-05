import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"


const CreateOrJoinGame = ({setGameSession, guestUser, setGuestUser}) => {
    // const [currentUser, setCurrentUser] = useState()
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState({gameKey: ""})
    const [gameKey, setGameKey] = useState("")

    const {currentUser} = useContext(UserContext)


    const handleChange = (e) => {
        const {name, value} = e.target
        e.target.setCustomValidity("")
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
        <Body>
          <FormContainer>
        {currentUser?
          <>
            <form onSubmit={handleSubmit}>
              <InputContainer>
                <Label htmlFor="username">Have a Game Key?</Label>
                <input type="text" value={formData.gameKey} name="gameKey" placeholder="Enter a Game Key" required onInvalid={invalidKey} onChange={handleChange}></input>
              </InputContainer>
              <InputContainer>
                <Button type="submit">Join!</Button>
              </InputContainer>
              <InputContainer>
                {errors?
                    <p>{errors.error}</p>
                    :
                    <></>
                  }
              </InputContainer>
            </form>
            <InputContainer>
              <p>Click here to host a new game and receive a game key to give to a friend.</p>
            </InputContainer>
              <InputContainer>
                <Button onClick={()=>handleClick()}>Create Game</Button>
              </InputContainer>
          </>
            :
            <InputContainer>
              You must be logged in to play
            </InputContainer>
          }
        </FormContainer>
        </Body>
    )
}

export default CreateOrJoinGame


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 20vw;
  background-color: rgba(0,0,0,0.9);
  justify-content: center;
  /* align-items: center; */
  color: white;
  border-radius: 20px;
  border: 2px solid #631414;
  padding: 10px;
  margin-top: 50px;
`

const Body = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: center; */

`


const Button = styled.button`
  border-radius: 20px;
  color: red;
  border: 2px solid #631414;
  background-color: rgba(0,0,0,0.9);
  padding: 10px;

  &:hover {
    background-color: #631414;
    cursor: pointer;
    color: black;
  }
  
`

const InputContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
        
`
const Label = styled.label`
  padding-right: 10px;
`

