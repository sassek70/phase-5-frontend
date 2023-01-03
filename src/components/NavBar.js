import { useContext } from "react"
import { NavLink } from "react-router-dom"
import {UserContext} from "../context/UserContext"



const NavBar = ({handleLogOut}) => {

    const {currentUser} = useContext(UserContext)

    return(
        <>
      <h2>A Not So Magical Gathering</h2>
            <nav>
                <NavLink to='/home' name="Home">Home</NavLink>
                {currentUser ?
                <>
                    <button onClick={() => handleLogOut()}>Log Out</button>
                </>
                :
                <NavLink to='/login' name='Log In'>Log In</NavLink>
                }
                <NavLink to='/signup' name='Sign Up'>Sign Up</NavLink>
                {currentUser?
                <>
                <NavLink to='/newgame' name='Host Game'>Host or Join a Game</NavLink>
                <NavLink to='/profile' name='User Profile'>Profile</NavLink>
                </>
                :
                <></>
                }
                <NavLink to='/leaderboard' name='Leaderboard'>Leaderboard</NavLink>
            </nav>

            </>

    )
}

export default NavBar