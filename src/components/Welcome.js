import { useContext } from "react"
import {UserContext} from "../context/UserContext"


const Welcome = ({guestUser}) => {

    
    const {currentUser} = useContext(UserContext)


    return (
        <>
        {currentUser?
        <h2>{`Welcome ${currentUser? currentUser.username: guestUser}`}</h2>
        :
        <></>
        }
        </>
        // <h2>Welcome</h2>

    )
}

export default Welcome