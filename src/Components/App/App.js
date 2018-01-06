import React, { Component } from 'react';
import './reset.css';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchTerm: '',
      searchResults:[],
      playlistName: '',
      playlistTracks:[]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken();
  }

  //Add track from SearchResults to Playlist
  addTrack(track){
    let trackExists = false;
    let updatedTracks = this.state.playlistTracks;
    this.state.playlistTracks.map(playlistTrack=>{
      if(playlistTrack.id===track.id){
        return trackExists = true;
      }
    });
    if (!trackExists){
      updatedTracks.push({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        uri: track.uri
      })
    }
    this.setState({
     playlistTracks: updatedTracks
    });
  }

  //Remove track from playlist
  removeTrack(track){
    let updatedTracks = [];
    updatedTracks = this.state.playlistTracks.filter(playlistTrack=>playlistTrack.id!==track.id);
    this.setState({
      playlistTracks: updatedTracks
    });
  }

  //Update playlist name
  updatePlaylistName(name){
    this.setState({
     playlistName: name
    });
  }

  //Grab playlist name and playlist tracks uris and pass to Spotify.js savePlaylist method
  savePlaylist(){
    let trackURIs = [];
    this.state.playlistTracks.map(playlistTrack=>{
      return trackURIs.push(playlistTrack.uri);
    });
    Spotify.savePlaylist(this.state.playlistName,trackURIs);
    this.setState({
     playlistTracks: [],
     playlistName: 'New Playlist'
    });
  }

  //Pass search term to Spotify.js search method and get results
  search(searchTerm){
    Spotify.search(searchTerm).then(spotifySearchResults=>{
      this.setState({
       searchResults: spotifySearchResults
      })
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* Add a SearchBar component */}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* Add a SearchResults component */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            {/* Add a Playlist component */}
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
