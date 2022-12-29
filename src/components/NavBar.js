import { NavLink } from "react-router-dom"



const NavBar = ({currentUser, handleLogOut}) => {

    return(
        <nav>
            <NavLink to='/home' name="Home">Home</NavLink>
            {currentUser ?
            <>
            {/* <NavLink> */}
                <button onClick={() => handleLogOut()}>Log Out</button>
            {/* </NavLink> */}
            </>
            :
            <NavLink to='/login' name='Log In'>Log In</NavLink>
            }
            <NavLink to='/signup' name='Sign Up'>Sign Up</NavLink>
            {currentUser?
            <>
            <NavLink to='/hostgame' name='Host Game'>Host a Game</NavLink>
            <NavLink to='/joingame' name='Join Game'>Join a Game</NavLink>
            <NavLink to='/profile' name='User Profile'>Profile</NavLink>
            </>
            :
            <></>
            }
            <NavLink to='/leaderboard' name='Leaderboard'>Leaderboard</NavLink>
        </nav>
    )
}

export default NavBar