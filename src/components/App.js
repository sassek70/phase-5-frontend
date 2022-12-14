import { createConsumer } from "@rails/actioncable";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LogInForm from "./Login Form";
import SignUpForm from "./SignupForm";



function App() {
  const [currentUser, setCurrentUser] = useState("")


  useEffect(() => {
    console.log(localStorage.uid)
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
        .then(user => setCurrentUser(user)
      )}
    })
  } else {
      console.log('No User Found');
  };
  },[])

  console.log(currentUser)


  return (
    <>
    {currentUser ? 
    <h2>{`Welcome ${currentUser.username}`}</h2>
    :
    <h2>Welcome to A Not So Magical Gathering</h2>
   }
    <Routes>
      <Route path='/signup' element={<SignUpForm />}/>
      <Route path='/login' element={<LogInForm />}/>
    </Routes>
    </>
  );
}

export default App;
