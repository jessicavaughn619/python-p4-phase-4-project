import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './stylesheets/App.scss';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <div id="app-container-wrapper">
    {user ?
    <div id="app-container-logged-in">
      <NavBar setUser={setUser} />
      <Link to="/">Home</Link>
    </div> :
    <div id="app-container-not-logged-in">
      <h1>Welcome to MyTunes!</h1>
      <Link to="/login" exact Component={() => <LoginForm onLogin={setUser}/>}>Login</Link>
      <Link to="/signup" exact component={() => <SignUpForm />}>Sign Up</Link>
    </div>
    }
    </div>
  )
}

export default App;
