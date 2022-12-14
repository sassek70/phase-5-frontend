import { useState } from "react"


const CreateOrJoinGame = ({currentUser}) => {

    const [formData, setFormData] = useState({gameKey: ""})
    const [gameKey, setGameKey] = useState()


    const handleClick = () => {
        fetch (`${process.env.REACT_APP_BACKEND_URL}/gamelobby`)

    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((formData) => ({...formData, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

    //     let url = `${process.env.REACT_APP_BACKEND_URL}/login`
    //     fetch(url,{method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //   .then(r => r.json())
    //   .then(authToken => localStorage.setItem("uid", authToken.auth_token))
    }



    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter a Game Key:</label>
                <input type="text" value={formData.gameKey} name="gameId" placeholder="Enter a Game Key" onChange={handleChange}></input>

                <button type="submit">Join!</button>
            </form>            
        {currentUser?
            <button onClick={()=>handleClick}>Generate Game Key</button>
            :
            <></>
        }
        {gameKey}
        </>
    )
}

export default CreateOrJoinGame