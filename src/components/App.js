import { createConsumer } from "@rails/actioncable";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateOrJoinGame from "./CreateOrJoinGame";
import GameBoard from "./GameBoard";
import LogInForm from "./Login Form";
import NavBar from "./NavBar";
import SignUpForm from "./SignupForm";
import Welcome from "./Welcome";



function App() {
  const navigate = useNavigate()
  const [guestUser, setGuestUser] = useState(null)
  const [gameSession, setGameSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)


  useEffect(() => {
    if (localStorage.uid) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/existingtoken`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(localStorage.uid)
      })
      .then(res => {if(res.ok) {
        res.json()
        .then(user => {
          setCurrentUser(user)
          navigate('/home')
        }
      )}
    })
  } else {
    setGuestUser(parseInt(Math.random() * ((100000 - 1000) + 1000)))
    console.log('No User Found');
  };
  },[])

  const handleLogOut =() => {
    localStorage.removeItem("uid")
    navigate('/')
    return setCurrentUser()
}

const welcomeMessage = () => {
  if (currentUser) {
    return currentUser.username
  } else {
    return guestUser
  }
  }

  // console.log(`/users/${gameSession? gameSession.host_user_id : null}/joingame/${gameSession? gameSession.game_key : null}/game`)
  // console.log(gameSession)

  return (
    <>
    <h2>A Not So Magical Gathering</h2>
    <p>Welcome {`${welcomeMessage()}`}</p>
    <NavBar currentUser={currentUser} handleLogOut={handleLogOut}/>
    <Routes>
      <Route path='/home' element={<Welcome currentUser={currentUser} guestUser={guestUser}/>}/>
      <Route path='/signup' element={<SignUpForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/login' element={<LogInForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/hostgame' element={<CreateOrJoinGame currentUser={currentUser} gameSession={gameSession} setGameSession={setGameSession} guestUser={guestUser} setGuestUser={setGuestUser}/>}/>
      {/* <Route path={`/users/${currentUser? currentUser.id : guestUser}/joingame/${gameSession? gameSession.game_key : null}`} element={<GameBoard currentUser={currentUser} gameSession={gameSession}/>}/> */}
      <Route path={`/game/${gameSession? gameSession.game_key : null}`} element={<GameBoard currentUser={currentUser} gameSession={gameSession} setGameSession={setGameSession} guestUser={guestUser}/>}/>
    </Routes>
    <p className="discalimer">A Not So Magical Gathering is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.<br /> A Not So Magical Gathering is a simplified version of <a href="https://company.wizards.com/en">Wizards of the Coast's</a> trading-card game <a href="https://magic.wizards.com/en">Magic: The Gathering</a> and was created as a cap-stone project for <a href="https://flatironschool.com/courses/coding-bootcamp/">Flatiron School's Software Engineering</a> course. <br /> Card images and Artist information provided by the <a href="https://scryfall.com/docs/api/cards">Scryfall API</a>.</p>

    </>
  );
}

export default App;
