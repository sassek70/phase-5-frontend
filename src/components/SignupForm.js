import { useState } from "react"


const SignUpForm = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0
    })

    console.log(formData)




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
    .then(r => r.json())
    .then(newUser => console.log(newUser))
    }





    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" value={formData.username} name="username" placeholder="Enter a Username" onChange={handleChange}></input>

            <label htmlFor="password">Password:</label>
            <input type="text" value={formData.password} name="password" placeholder="Enter a password" onChange={handleChange}></input>

            <button type="submit">Log In</button>
        </form>
    )
}

export default SignUpForm