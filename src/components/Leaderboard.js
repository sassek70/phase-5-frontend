import { useEffect, useState } from "react"


const Leaderboard = () => {
    const [userList, setUserList] = useState([])
    const [errors, setErrors] = useState()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/leaderboard`)
        .then(res => {
            if (res.ok) {
                res.json().then(users => setUserList(users))
            } else {
                res.json().then(errors => setErrors(errors))
            }
        })
    },[])

    let displayUsers = userList.map((user, key) => {
        return ( 
            <tr key={key}>
                <td>{user.username}</td>
                <td>{user.gamesPlayed}</td>
                <td>{user.gamesWon}</td>
                <td>{user.win_rate}</td>
            </tr>
        )
    })

    return (
        <table>
            <tr>
                <th>User</th>
                <th>Games Played</th>
                <th>Games Won</th>
                <th>Win Rate</th>
            </tr>
            {displayUsers}
        </table>
    )
}

export default Leaderboard