import { useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"



const NavBar = ({handleLogOut, gameSession}) => {

    const {currentUser} = useContext(UserContext)

    return(
            <>
                <LeftSideContainer>
                    <Title>A Not So Magical Gathering</Title>
                </LeftSideContainer>
                <CenterContainer>
                    {gameSession ? `Game Key: ${gameSession.game_key}` : <></>} 
                </CenterContainer>
                <RightSideContainer >
                    <NavBarRow>
                        <LinkWrapper>
                            <NavLink className="nav-links" to='/home' name="Home">Home</NavLink>
                        </LinkWrapper>
                            {currentUser ?
                            <></>
                            :
                            <>
                                <LinkWrapper>
                                    <NavLink className="nav-links" to='/signup' name='Sign Up'>Sign Up</NavLink>
                                </LinkWrapper>
                            </>
                            }
                            <LinkWrapper>
                                <NavLink className="nav-links" to='/newgame' name='Host Game'>Host or Join a Game</NavLink>
                            </LinkWrapper>
                            {currentUser?
                            <LinkWrapper>
                                <NavLink className="nav-links" to='/profile' name='User Profile'>Profile</NavLink>
                            </LinkWrapper>
                            :
                            <></>
                            }
                            <LinkWrapper>
                                <NavLink className="nav-links" to='/leaderboard' name='Leaderboard'>Leaderboard</NavLink>
                            </LinkWrapper>
                    </NavBarRow>
                    {currentUser ? 
                        <UserContainer>
                            Logged in as: {currentUser.username}
                            <Button onClick={() => handleLogOut()}>Log Out</Button>
                        </UserContainer>
                        : 
                        <>
                        <UserContainer>
                            Not Logged in
                            <LinkWrapper>
                                <NavLink className="nav-links" to='/login' name='Log In'>Log In</NavLink>
                            </LinkWrapper>
                        </UserContainer>
                        </>
                        }
                </RightSideContainer>
            </>
    )
}

export default NavBar


// Everything below is for styling

const NavBarRow = styled.nav`
    height: 100%;
    display: flex;
    align-items: center;
`

const LeftSideContainer = styled.div`
    height: 100%;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`

const RightSideContainer = styled.div`
    height: 100%;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    color: white;
    text-decoration: none;
`

const CenterContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1 1 0;
    justify-content: center;
    color: white;
`

const Title = styled.div`
    font-size: large;
    font-weight: bold;
    justify-content: flex-start;
    color: #631414;
`

const LinkWrapper = styled.div`
    padding: 5px;
`

const Button = styled.button`
    margin-left: 10px;
    color: white;
    background-color: rgba(0,0,0,0.9);
    border-radius: 5px;
    color: #631414;
    border: 0px solid #631414;

    &:hover {
        background-color: #631414;
        cursor: pointer;
        color: black;
    }
`

const UserContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #631414;
    padding: 5px;
`
