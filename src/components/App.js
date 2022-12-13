import { createConsumer } from "@rails/actioncable";
import { Route, Routes } from "react-router-dom";
import LogInForm from "./Login Form";
import SignUpForm from "./SignupForm";



function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUpForm />}/>
      <Route path='/login' element={<LogInForm />}/>
    </Routes>
  );
}

export default App;
