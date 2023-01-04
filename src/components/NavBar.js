import { useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"



const NavBar = ({handleLogOut, gameSession}) => {

    const {currentUser} = useContext(UserContext)

    return(
            <>
            <NavBarRow>
                <SideContainer>
                    <Title>A Not So Magical Gathering</Title>
                </SideContainer>
                <CenterContainer>
                    {gameSession ? `Game Key: ${gameSession.game_key}` : <></>} 
                </CenterContainer>
                <SideContainer style={{justifyContent: 'flex-end', flexDirection: 'column'}}>
                    <LinkContainer>
                        <LinkWrapper>
                                <NavLink to='/home' name="Home">Home</NavLink>
                            </LinkWrapper>
                                {currentUser ?
                                <LinkWrapper>
                                    <button onClick={() => handleLogOut()}>Log Out</button>
                                </LinkWrapper>
                                :
                                <>
                                <LinkWrapper>
                                <NavLink to='/login' name='Log In'>Log In</NavLink>
                                </LinkWrapper>
                                <LinkWrapper>
                                <NavLink to='/signup' name='Sign Up'>Sign Up</NavLink>
                                </LinkWrapper>
                                </>
                                }
                                <LinkWrapper>
                                <NavLink to='/newgame' name='Host Game'>Host or Join a Game</NavLink>
                                </LinkWrapper>
                                {currentUser?
                                <LinkWrapper>
                                    <NavLink to='/profile' name='User Profile'>Profile</NavLink>
                                </LinkWrapper>
                                :
                                <></>
                            }
                            <LinkWrapper>
                                <NavLink to='/leaderboard' name='Leaderboard'>Leaderboard</NavLink>
                            </LinkWrapper>
                    </LinkContainer>
                    <div>
                        {currentUser ? `Logged in as: ${currentUser.username}` : <></>}
                    </div>
                </SideContainer>
            </NavBarRow>
            </>
    )
}

export default NavBar


const NavBarRow = styled.nav`
height: 40px;
min-width: 75vw;
display: flex;
padding-top: 5px;
display: flex;
flex: 1 1 0;
`

const SideContainer = styled.div`
height: 100%;
width: 33%;
display: flex;
align-items: center;
`

const CenterContainer = styled.div`
height: 100%;
display: flex;
align-items: center;
/* flex: 1 1 0; */
justify-content: center;
`

const Title = styled.div`
  font-size: large;
  font-weight: bold;
  justify-content: flex-start;
`

const LinkWrapper = styled.div`
    padding: 5px;
`

const LinkContainer = styled.div`
    display:flex;
`