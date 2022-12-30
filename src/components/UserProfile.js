import { useContext, useEffect, useState } from "react"
import {UserContext} from "../context/UserContext"


const UserProfile = () => {
    const [updatedStats, setUpdatedStats] = useState()
    const [errors, setErrors] = useState()
    const {currentUser} = useContext(UserContext)

    
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


    return (
        <div>
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
        </div>
    )
}

export default UserProfile