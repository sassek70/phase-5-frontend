import { useEffect, useState } from "react"
import styled from "styled-components"


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
                <Tdnb>{user.username}</Tdnb>
                <Td>{user.gamesPlayed}</Td>
                <Td>{user.gamesWon}</Td>
                <Td>{user.win_rate}%</Td>
            </tr>
        )
    })

    return (
        <>
            {userList?
            <Table>
                <thead>
                    <tr>
                        <Thnb>User</Thnb>
                        <Th>Games Played</Th>
                        <Th>Games Won</Th>
                        <Th>Win Rate</Th>
                    </tr>
                </thead>
                <tbody>
                    {displayUsers}
                </tbody>
            </Table>
            :
            <p>Leaderboard loading</p>
            }
        </>
    )
}

export default Leaderboard

const Table = styled.table`
    border: 10px ridge #311D1D;
    margin: auto;
    /* display: flex; */
    justify-content: center;
    align-items: center;
`

const Th = styled.th`
    min-width: 130px;
    padding: 5px;
    padding-left: 10px;    
    border-left: 2px ridge #311D1D;
    `

const Thnb = styled.th`
min-width: 130px;
padding: 5px;
padding-left: 10px;    
`

const Td = styled.td`
    text-align: center;
    border-top: 2px ridge #311D1D;
    border-left: 2px ridge #311D1D;
`

const Tdnb = styled.td`
    text-align: center;
    border-top: 2px ridge #311D1D;
`