import { useEffect, useState } from "react"


const Leaderboard = () => {
    const [userList, setUserList] = useState()
    const [errors, setErrors] = useState()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/leaderboard`)
        .then(res => {
            if (res.ok) {
                res.json().then(users => console.log(users))
            } else {
                res.json().then(errors => setErrors(errors))
            }
        })
    },[])

    return (
        <></>
    )
}

export default Leaderboard