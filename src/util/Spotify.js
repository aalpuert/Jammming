let accessToken = '';
//HIDE CLIENTID ON GITHUB
//Obtain clientID at https://developer.spotify.com/dashboard/applications 
const clientId = '';
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  //grab access token from Spotify
  getAccessToken(){
    if(accessToken!==''){
      return accessToken;
    }else{

        //check Spotify returned spotifyUrl
        let spotifyUrl = window.location.href;
        //console.log(spotifyUrl);
        if(spotifyUrl!==''){

            let reToken = /access_token=([^&]*)/;
            let reExpTime = /expires_in=([^&]*)/;
            let expiresIn = '';
            accessToken = spotifyUrl.match(reToken);
            expiresIn = spotifyUrl.match(reExpTime);

            //check if token and expTime are in url
            if(accessToken!==null&&expiresIn!==null){
              accessToken=accessToken[1];
              expiresIn=expiresIn[1];
              //console.log(accessToken);
              //console.log(expiresIn);
              window.setTimeout(() => accessToken = '', expiresIn * 1000);
              window.history.pushState('Access Token', null, '/');
            }else{
              console.log('Access Token and Expires time is null');
              window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            }

        }else{
          console.log('SpotifyUrl is empty');
          window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }

    }
  },
  //fetch search results from Spotify search tracks endpoint
  search(term){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      if (jsonResponse.tracks.items) {
        console.log(jsonResponse.tracks.items);
        return jsonResponse.tracks.items.map(track=>({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }

    });
  },

  //Save playlist name and playlist tracks to user's Spotify account
  savePlaylist(playlistName,trackUris){

    if(playlistName!==null&&trackUris!==null){
      let currUserAccessToken = accessToken;
      let headers = {
        'Authorization': 'Bearer '+ currUserAccessToken
      }
      let userId = '';

      //grab user's ID
      userId = fetch(`https://api.spotify.com/v1/me`, {
        headers: headers
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(jsonResponse.id){
          return jsonResponse.id;
        }
      });

      //POST the playlist name
      userId.then(id=>{

        fetch(`https://api.spotify.com/v1/users/${id}/playlists`,{
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ currUserAccessToken,
            "Content-type": "application/json"
          },
          body: JSON.stringify({"name":playlistName})
        }).then(response=>{
          if(response.ok){
             return response.json();
          }
          throw new Error('Request failed! Playlist name not posted');
        },networkError=>{
          console.log(networkError.message);
        }).then(jsonResponse=>{
          return jsonResponse.id
        }).then(playlistId=>{

            //POST the playlist tracks
            fetch(`https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`,{
              method: 'POST',
              headers: {
                'Authorization': 'Bearer '+ currUserAccessToken,
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                "uris":trackUris
              })
            }).then(response=>{
              if(response.ok){
                 return response.json();
              }
              throw new Error('Request failed! Playlist tracks not posted');
            },networkError=>{
              console.log(networkError.message);
            }).then(jsonResponse=>{
              return jsonResponse.id
            })


        });

      });

    }else{
      return;
    }
  }

};

export default Spotify;
