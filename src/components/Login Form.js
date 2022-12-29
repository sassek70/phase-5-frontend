import { useState } from "react"
import { useNavigate } from "react-router-dom"


const LogInForm = ({setCurrentUser}) => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })




    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((formData) => ({...formData, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let url = `${process.env.REACT_APP_BACKEND_URL}/login`
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
                // console.log(authToken.user)
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

            <button type="submit">Log In</button>
        </form>
        {errors?
            <p>{errors.error}</p>
            :
            <></>
        }
        </>
    )
}

export default LogInForm