import { createConsumer } from "@rails/actioncable";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateOrJoinGame from "./CreateOrJoinGame";
import LogInForm from "./Login Form";
import SignUpForm from "./SignupForm";
import Welcome from "./Welcome";



function App() {
  const navigate = useNavigate()
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
          navigate('/welcome')
        }
      )}
    })
  } else {
      console.log('No User Found');
  };
  },[])

  // console.log(currentUser.username)


  return (
    <>
    <h2>Welcome to A Not So Magical Gathering</h2>
    <Routes>
      <Route path='/welcome' element={<Welcome currentUser={currentUser}/>}/>
      <Route path='/signup' element={<SignUpForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/login' element={<LogInForm setCurrentUser={setCurrentUser}/>}/>
      <Route path='/gamelobby' element={<CreateOrJoinGame currentUser={currentUser}/>}/>
    </Routes>
    </>
  );
}

export default App;
