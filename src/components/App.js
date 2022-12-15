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
  const [gameSession, setGameSession] = useState()
  const [currentUser, setCurrentUser] = useState()


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
          console.log(user.username)
          navigate('/home')
        }
      )}
    })
  } else {
      console.log('No User Found');
  };
  },[])

  const handleLogOut =() => {
    localStorage.removeItem("uid")
    setCurrentUser(null)
    // navigate('/')
}


  return (
    <>
    <h2>A Not So Magical Gathering</h2>
    <NavBar currentUser={currentUser} handleLogOut={handleLogOut}/>
    <Routes>
      <Route path='/home' element={<Welcome currentUser={currentUser}/>}/>
      <Route path='/signup' element={<SignUpForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/login' element={<LogInForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/hostgame' element={<CreateOrJoinGame currentUser={currentUser} gameSession={gameSession} setGameSession={setGameSession}/>}/>
      <Route path={`/game/${gameSession? gameSession.game_key : null}`} element={<GameBoard currentUser={currentUser} gameSession={gameSession}/>}/>
    </Routes>
    </>
  );
}

export default App;
