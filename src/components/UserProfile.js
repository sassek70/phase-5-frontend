import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"


const UserProfile = () => {
    const [updatedStats, setUpdatedStats] = useState()
    const [errors, setErrors] = useState()
    // const [showForm, setShowForm] = useState()
    // const [formData, setFormData] = useState({password: ""})
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
    
    // const handleChange = (e) => {
    //     const {name, value} = e.target
    //     setFormData((formData) => ({...formData, [name]: value}))
    // }


    // const changePassword = () => {
    //     fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUser.id}`, {
    //         method: 'PATCH',
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json"
    //         },
    //         body: JSON.stringify(formData)
    //     })
    //     .then(res => {
    //         if(res.ok) {
    //             alert("Password changed Successfully")
    //             navigate('/home')
    //         } else {
    //             res.json().then(errors => setErrors(errors))
    //         }
    //     })
    // }

    return (
        <Body>
        <StatsContainer>
            {updatedStats?
            <Stats>
                <div>Games Played: {updatedStats.gamesPlayed}</div>
                <div>Games Won: {updatedStats.gamesWon}</div>
                <div>Win rate: {updatedStats.win_rate ? updatedStats.win_rate : 0} %</div>
            </Stats>
            :
            <>
                <p>Loading stats</p>
            </>
            }
            <Wrapper>
                <Button onClick={() => handleDelete()}>Delete Account</Button>
                {/* <Button onClick={() => setShowForm(true)}>Change Password</Button> */}
            </Wrapper>
        </StatsContainer>
        {/* {showForm ?
            <InputContainer>
                <Label htmlFor="password">Password:</Label>
                <input type="text" value={formData.password} name="password" placeholder="Enter a password" onChange={handleChange}></input>
            </InputContainer>
            :
            <></>
        }
        <InputContainer>
                    {errors?
                        errors.errors.map(error => <p>{error}</p>)
                        :
                        <></>
                    }
                </InputContainer> */}
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
const Stats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    
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
  margin: 10px;

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

// const FormContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 30vw;
//   height: 20vw;
//   background-color: rgba(0,0,0,0.9);
//   justify-content: center;
//   /* align-items: center; */
//   color: white;
//   border-radius: 20px;
//   border: 2px solid #631414;
//   padding: 10px;
//   margin-top: 50px;
// `

// const InputContainer = styled.div`
//     display: flex;
//     justify-content: center;
//     padding: 10px;
        
// `
// const Label = styled.label`
//   padding-right: 10px;
// `