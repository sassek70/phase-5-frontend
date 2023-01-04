import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"


const UserProfile = () => {
    const [updatedStats, setUpdatedStats] = useState()
    const [errors, setErrors] = useState()
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const navigate = useNavigate()

    
    useEffect(() => {
        if (currentUser) {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}/stats`)
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUpdatedStats(user))
            } else {
                res.json().then(errors => setErrors(errors))
            }
        })
    }
    },[])

    const handleDelete = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => {
            if(res.ok) {
                localStorage.removeItem("uid")
                alert("Account Deleted Successfully")
                setCurrentUser()
                navigate('/home')
            }
        })
    }

    return (
        <Body>
        <StatsContainer>
            {updatedStats?
            <>
                <p>Games Played: {updatedStats.gamesPlayed}</p>
                <p>Games Won: {updatedStats.gamesWon}</p>
                <p>Win%: {updatedStats.win_rate}</p>
            </>
            :
            <>
                <p>Loading stats</p>
            </>
            }
            <Wrapper>
                <Button onClick={() => handleDelete()}>Delete Account</Button>
            </Wrapper>
        </StatsContainer>
        </Body>
    )
}

export default UserProfile

const StatsContainer = styled.div`
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

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`