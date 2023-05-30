import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import Home from './components/Home';
import SignUpForm from './components/SignUpForm';
import { Routes, Route, Link } from "react-router-dom";
import './stylesheets/App.scss';

function App() {
  const [user, setUser] = useState(null);
  const [artists, setArtists] =  useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [displayedPlaylists, setDisplayedPlaylists] = useState([])
  const [showFiltered, setShowFiltered] = useState(false);
  const [displayedArtists, setDisplayedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickedButton, setLastClickedButton] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const check_session_response = await fetch("/check_session");
        if (check_session_response.ok) {
          const user = await check_session_response.json();
          setUser(user);
        }

        setIsLoading(true);
        const music_response = await fetch("/music");
        const artists = await music_response.json();
        setArtists(artists);
        setDisplayedArtists(artists);

        const playlists_response = await fetch("/playlists");
        const playlists = await playlists_response.json();
        setPlaylists(playlists);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  function handleSetSelectedPlaylist(playlist) {
    setSelectedPlaylist(playlist)
  }

  function handleSetIsClicked() {
    setIsClicked(isClicked => !isClicked)
  }
  
  function handleSetArtist(data) {
    const clickedButton = data;
    let filteredArtist;
    if ((typeof data) === "number") {
      filteredArtist = artists.filter(artist => (artist.id === data))
  }
    else if ((typeof data) === "string") {
      filteredArtist = artists.filter(artist => (artist.genres === data))
  }

    if (showFiltered) {
      if (lastClickedButton === clickedButton) {
        setShowFiltered(showFiltered => !showFiltered)
        setDisplayedArtists(artists);
        setLastClickedButton(clickedButton);
      }
      else {
        setDisplayedArtists(filteredArtist);
        setLastClickedButton(clickedButton);
      }
    }
    else {
      setShowFiltered(showFiltered => !showFiltered);
      setDisplayedArtists(filteredArtist);
      setLastClickedButton(clickedButton);
    }
  }

  function handleAddToPlaylist(song) {
    handleSetIsClicked()
    setSelectedSong(song)
  }

  function handleAddNewPlaylist(newPlaylist) {
    const updatedPlaylists = [...playlists, newPlaylist]
    setPlaylists(updatedPlaylists)
  }

  return (
    <div id="app-container-wrapper">
    {user ? 
    <Routes>
      <Route exact path='/' element={<Home
        user={user} 
        onSetUser={setUser} 
        artists={displayedArtists} 
        playlists={playlists}
        onSetArtist={handleSetArtist}
        isLoading={isLoading}
        onAddToPlaylist={handleAddToPlaylist}
        onSetSelectedPlaylist={handleSetSelectedPlaylist}
        selectedPlaylist={selectedPlaylist}
        isClicked={isClicked}
        selectedSong={selectedSong}
        onSetIsClicked={handleSetIsClicked}
        onAddNewPlaylist={handleAddNewPlaylist}
        />}>
      </Route>
    </Routes>
      :
      <>
      <div className="no-session-landing">
        <h1>Welcome to MyTunes!</h1>
        <div className="links">
        <Link to='/signup' className="link">Sign Up</Link>
        <Link to='/login' className="link">Login</Link>
        </div>
        </div>
      <Routes>
        <Route path='/signup' element={<SignUpForm onLogin={setUser}/>}>
        </Route>
        <Route path='/login' element={<LoginForm onLogin={setUser}/>}>
        </Route>
      </Routes>
      </>
    }
    <Footer />
    </div>
  )
}

export default App;
