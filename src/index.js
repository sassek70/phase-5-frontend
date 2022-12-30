import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './components/App';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);