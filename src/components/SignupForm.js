import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../context/UserContext"


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
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" value={formData.username} name="username" placeholder="Enter a Username" onChange={handleChange}></input>

            <label htmlFor="password">Password:</label>
            <input type="text" value={formData.password} name="password" placeholder="Enter a password" onChange={handleChange}></input>

            <button type="submit">Sign Up</button>
        </form>
        {errors?
            errors.errors.map(error => <p>{error}</p>)
        :
        <></>
        }
        </>
    )
}

export default SignUpForm