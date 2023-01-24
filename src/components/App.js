import { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateOrJoinGame from "./CreateOrJoinGame";
import GameBoard from "./GameBoard";
import Leaderboard from "./Leaderboard";
import LogInForm from "./Login Form";
import NavBar from "./NavBar";
import SignUpForm from "./SignupForm";
import UserProfile from "./UserProfile";
import Welcome from "./Welcome";
import {UserContext} from "../context/UserContext"
import styled from "styled-components";
import { GameCardProvider } from "../context/GameCardContext";



function App() {
  const navigate = useNavigate()
  const [guestUser, setGuestUser] = useState(null)
  const [gameSession, setGameSession] = useState(null)
  const {currentUser, setCurrentUser} = useContext(UserContext)



  const handleLogOut =() => {
    localStorage.removeItem("uid")
    navigate("/home")
    setCurrentUser()
}

const welcomeMessage = () => {
  if (currentUser) {
    return currentUser.username
  } else {
    return guestUser
  }
  }


  return (
    <>
    <Header>
      {/* <MenuItems> */}
        <NavBar handleLogOut={handleLogOut} gameSession={gameSession} />
      {/* </MenuItems> */}
    </Header>
    <Main>
      <Routes>
        <Route path='/home' element={<Welcome guestUser={guestUser}/>}/>
        <Route path='/signup' element={<SignUpForm setCurrentUser={setCurrentUser}/>}/>
        <Route path='/login' element={<LogInForm setCurrentUser={setCurrentUser}/>}/>
        <Route path='/newgame' element={<CreateOrJoinGame setGameSession={setGameSession} guestUser={guestUser} setGuestUser={setGuestUser}/>}/>
        <Route path={`/game/${gameSession? gameSession.game_key : null}`} element={
          <GameCardProvider>
            <GameBoard gameSession={gameSession} setGameSession={setGameSession} guestUser={guestUser}/>
          </GameCardProvider>
        }/>
        <Route path='/profile' element={<UserProfile currentUser={currentUser}/>}/>
        <Route path='/leaderboard' element={<Leaderboard/>}/>
      </Routes>
    </Main>
      <Footer>
        <p>A Not So Magical Gathering is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.<br /> A Not So Magical Gathering is a simplified battle-card game based on <a href="https://company.wizards.com/en">Wizards of the Coast's</a> trading-card game <a href="https://magic.wizards.com/en">Magic: The Gathering</a> and was created as a cap-stone project for <a href="https://flatironschool.com/courses/coding-bootcamp/">Flatiron School's Software Engineering</a> course. <br /> Card images and Artist information provided by the <a href="https://scryfall.com/docs/api/cards">Scryfall API</a>.</p>
      </Footer>

    </>
  );
}

export default App;


const Footer = styled.footer`
  bottom: 0;
  /* position: relative; */
  /* width: 100%; */
  min-height: 10vh;
  background-color: rgba(0,0,0,0.9);
  color: white;
  /* margin-top: 30px; */
  display: flex;
  justify-content: center;
`
const Header = styled.header`
  display: flex;
  flex-direction: row;
  height: 7vh;
  background-color: rgba(0,0,0,0.9);
  width: 100%;
`


const MenuItems = styled.div`
  justify-content: flex-end;
  display: flex;
`
const Main = styled.div`
  min-height: 95vh;
`


