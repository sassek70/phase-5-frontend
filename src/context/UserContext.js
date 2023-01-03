import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import React from "react"

// create the context
const UserContext = React.createContext()

// create the provider component
const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [opponentUser, setOpponentUser] = useState(null)
    const navigate = useNavigate()

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
        // setGuestUser(parseInt(Math.random() * ((100000 - 1000) + 1000)))
        console.log('No User Found');
        navigate('/home')
      };
      },[])
    // the value prop of the provider is the context data
    // this value will be available in the child components of this provider
    return ( <UserContext.Provider value={{currentUser, setCurrentUser, setOpponentUser, opponentUser}}>
                {children}
            </UserContext.Provider>
    ); 
}

export {UserContext, UserProvider}