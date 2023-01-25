import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"


const SignUpForm = () => {
    const navigate = useNavigate()
    const {setCurrentUser} = useContext(UserContext)

    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
    })


    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((formData) => ({...formData, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let url = `${process.env.REACT_APP_BACKEND_URL}/users`
        fetch(url,{method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(res => {
        if (res.ok) {
            res.json().then(authToken => {
                setCurrentUser(authToken.user)
                localStorage.setItem("uid", authToken.auth_token)
                navigate('/home')
            })
        } else {
            res.json().then(errors => setErrors(errors))
      }
    })
    }


    return (
        <Body>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                <InputContainer>
                    <Label htmlFor="username">Username:</Label>
                    <input type="text" value={formData.username} name="username" placeholder="Enter a Username" onChange={handleChange}></input>
                </InputContainer>
                <InputContainer>
                    <Label htmlFor="password">Password:</Label>
                    <input type="password" value={formData.password} name="password" placeholder="Enter a password" onChange={handleChange}></input>
                </InputContainer>
                <InputContainer>
                    <Button type="submit">Sign Up</Button>
                </InputContainer>
                </form>
                <InputContainer>
                    {errors?
                        errors.errors.map(error => <p>{error}</p>)
                        :
                        <></>
                    }
                </InputContainer>
            </FormContainer>
        </Body>
    )
}

export default SignUpForm

// Everything below is for styling

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 30vw;
    height: 20vw;
    background-color: rgba(0,0,0,0.9);
    justify-content: center;
    color: white;
    border-radius: 20px;
    border: 2px solid #631414;
    padding: 10px;
    margin-top: 50px;
`

const InputContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`

const Body = styled.div`
    display: flex;
    justify-content: center;
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

const Label = styled.label`
    padding-right: 10px;
`