import React, { useState } from 'react';
import PlaylistCard from './PlaylistCard';
import '../stylesheets/Playlists.scss';

const Playlists = ({ user, playlists, onSetSelectedPlaylist, 
  selectedPlaylist, isClicked, selectedSong, onSetIsClicked, onAddNewPlaylist }) => {
    
    const [playlistForm, setPlaylistForm] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    
    const selectPlaylists = playlists.filter((playlist) => (playlist.user_id === user.id))

    const myPlaylists = selectPlaylists.map((playlist) => (
      <PlaylistCard
      key={playlist.id}
      playlist={playlist}
      />
    ))

    function handleSubmit(e) {
      e.preventDefault()
      fetch(`/playlists/${selectedPlaylist}/add_song`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedSong, selectedPlaylist }),
      }).then((r) => r.json())
      .then((data) => console.log(data))
      alert("Song added to playlist!")
      onSetIsClicked(false)
    }

    function handleClick() {
     setPlaylistForm(playlistForm => !playlistForm)
    }
    
    function handleNewPlaylistSubmit(e) {
      e.preventDefault()
      fetch('/playlists', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: playlistName }),
      }).then((r) => r.json())
      .then((newPlaylist) => onAddNewPlaylist(newPlaylist))
      alert("New playlist added!")
      setPlaylistName("")
      setPlaylistForm(false)
    }

  return (
    <>
    <div id="playlists-container-wrapper">
      <div>
        <h2>My Playlists</h2>
        {isClicked ? 
        <form onSubmit={handleSubmit}>
          <p>Select Playlist to Add Song:</p>
          <select value={selectedPlaylist} onChange={(e) => onSetSelectedPlaylist(e.target.value)}>
            <option value = "">
              --Select Playlist--
            </option>
            {selectPlaylists.map((playlist, index) => (
            <option value={playlist.id} key={index}>
              {playlist.name}
            </option>))}
          </select>
          <button>Confirm Add Song</button>
        </form> : null}
        <p onClick={handleClick}>{playlistForm ? "- Close Form" : "+ New Playlist"}</p>
        {playlistForm ? 
        <form onSubmit={handleNewPlaylistSubmit}>
          <label htmlFor="playlistName">New Playlist Name:</label>
          <input 
          type="text"
          id="playlistName"
          autoComplete="off"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button>Submit</button>
        </form> : null}
        {myPlaylists}
        </div>
    </div>
    </>
  )
}

export default Playlists;