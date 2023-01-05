import { useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import {UserContext} from "../context/UserContext"
import styled from "styled-components"



const NavBar = ({handleLogOut, gameSession}) => {

    const {currentUser} = useContext(UserContext)

    return(
            <>
            {/* <NavBarRow> */}
                <LeftSideContainer style={{backgroundColor: 'red'}}>
                    <Title>A Not So Magical Gathering</Title>
                </LeftSideContainer>
                <CenterContainer style={{backgroundColor: 'blue'}}>
                    {gameSession ? `Game Key: ${gameSession.game_key}` : <></>} 
                </CenterContainer>
                <RightSideContainer >
                    <NavBarRow>
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
                    </NavBarRow>
                    <div>
                        {currentUser ? `Logged in as: ${currentUser.username}` : <></>}
                    </div>
                </RightSideContainer>
            {/* </NavBarRow> */}
            </>
    )
}

export default NavBar


const NavBarRow = styled.nav`
height: 100%;
/* min-width: 75vw; */
display: flex;
align-items: center;
/* display: flex; */
/* flex: 1 1 0; */
`

const LeftSideContainer = styled.div`
height: 100%;
width: 450px;
display: flex;
align-items: center;
`

const RightSideContainer = styled.div`
height: 100%;
width: 450px;
display: flex;
align-items: center;
justify-content: flex-end;
flex-direction: column;
background-color: pink;
`

const CenterContainer = styled.div`
height: 100%;
display: flex;
align-items: center;
flex: 1 1 0;
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