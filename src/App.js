// import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import "firebase/auth";
import ReactAudioPlayer from 'react-audio-player';
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import { useState } from 'react';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwDxECAF6BY1nX2l7FWKE7qPNX80f_iNs",
  authDomain: "cs493-2021-957ba.firebaseapp.com",
  projectId: "cs493-2021-957ba",
  storageBucket: "cs493-2021-957ba.appspot.com",
  messagingSenderId: "702882989073",
  appId: "1:702882989073:web:b1c364800e7905af9a9db0",
  measurementId: "G-KLSL1WY0EW"
};
firebase.initializeApp(firebaseConfig);

 const App = () => {
//function App () {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const provider = new firebase.auth.GoogleAuthProvider();
  var songs = [];
  var artist_album = {};
  var album_song = {};

  const googleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((res) => {
        console.log('Signed in!')
        setIsSignedIn(true)
      })
  }

  const handleSignUp = () => {
    firebase.auth()
      .createUserWithEmailAndPassword(user, password)
      .then((user) => {
        setUser('')
        setPassword('')
        setIsSignedIn(true)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const handleSignIn = () => {
      firebase.auth()
        .signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value)
        .then((user) => {
          setUser('')
          setPassword('')
          setIsSignedIn(true)
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert("Wrong Login");
        });
    }

  const handleSignOut = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        setIsSignedIn(false)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const handleGetRequest = () => {
    const Http = new XMLHttpRequest();
    const url='https://1o6q3c8scf.execute-api.us-east-1.amazonaws.com/s3';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200)
      {
        if (Http.responseText)
         {
          songs = JSON.parse(Http.responseText);
          songs.forEach(function callback(item, index) {
            BuildDirLists(item);
          });
          setArtistButtons();
         }
      }
    }
  }

  const setArtistButtons = () => {
    document.getElementById('artist_container').style.display = 'inline-block';
    document.getElementById('song_container').style.display = 'none';

    document.getElementById('album_container').style.display = 'none';

      var keys = Object.keys(artist_album);
      keys.forEach(function callback(item, index) {
        var artist = document.createElement("LI");
        var button = document.createElement("BUTTON");
        button.innerHTML = "Artist " + index; 
        artist.id = "Artist_" + index;
        button.id = "Artist_button_" + index;
        button.className = "artist_btn";
        button.onclick = function(){ setAlbumButtons(item); } ;   
        document.getElementById('artists').appendChild(artist);
        document.getElementById("Artist_" + index).appendChild(button);
    });
  }

  const setAlbumButtons = (artist) => {
    document.getElementById('artist_container').style.display = 'none';
    document.getElementById('song_container').style.display = 'none';

    document.getElementById('album_container').style.display = 'inline-block';

      var keys = artist_album[artist];
      keys.forEach(function callback(item, index) {
        var album = document.createElement("LI");
        var button = document.createElement("BUTTON");
        button.innerHTML = "Album " + index; 
        album.id = "Album_" + index;
        button.id = "Album_button_" + index;
        button.className = "album_btn";
        button.onclick = function(){ setSongButtons(item, artist); } ;   
        document.getElementById('albums').appendChild(album);
        document.getElementById("Album_" + index).appendChild(button);
        //document.getElementById("album_back").onclick = function(){setArtistButtons()};
    });
  }

  const setSongButtons = (album, artist) => {
    document.getElementById('album_container').style.display = 'none';
    document.getElementById('artist_container').style.display = 'none';

    document.getElementById('song_container').style.display = 'inline-block';

    var keys = album_song[album];
    keys.forEach(function callback(item, index) {
      var song = document.createElement("LI");
      var button = document.createElement("BUTTON");
      button.innerHTML = "Song " + index; 
      song.id = "Song_" + index;
      button.id = "Song_button_" + index;
      button.className = "song_btn";
      button.onclick = function(){ setAudioPlayer(item); } ;   
      document.getElementById('songs').appendChild(song);
      document.getElementById("Song_" + index).appendChild(button);
      //document.getElementById("song_back").onclick = function(){ setAlbumButtons(artist); };
      UpdateSongInfo(item, button.id);
    });
  }

  const setAudioPlayer = (songURL) => {
    document.getElementById('songPlayer').src = songURL;
  }

  const BuildDirLists = (link) => {
    var path = link.split('/');
    var song = link;
    var album = ParseUrl(path[4]);
    var artist = ParseUrl(path[3]);

    if (artist in artist_album){
      if(album in artist_album[artist]){
        
      }else{
        artist_album[artist].push(album);
      }
        
    }else {
      artist_album[artist] = [];
      artist_album[artist].push(album);
    }
    
    if (album in album_song){
      album_song[album].push(song);
      
    } else{
      album_song[album] = [];
      album_song[album].push(song);
    } 
    
  }

  const UpdateSongInfo = (link, songID)  =>  {
    var path = link.split('/');

    // document.getElementById("artist").innerHTML = ParseUrl(path[1]);
    // document.getElementById("album").innerHTML = ParseUrl(path[2]);
    document.getElementById(songID).innerHTML = ParseUrl(path[4]) + "/" + ParseUrl(path[5]).split('?')[0];
    console.log(ParseUrl(path[0]));
    console.log(ParseUrl(path[1]));
    console.log(ParseUrl(path[2]));
    console.log(ParseUrl(path[3]));
    console.log(ParseUrl(path[4]));
    console.log(ParseUrl(path[5]).split('?')[0]);
    console.log(link);

  }

 const ParseUrl = (path)  =>  {
    path = path.replace(/%20/g, " ");
    path = path.replace(/\.mp3/g, "");
    return path;
  }





  if(isSignedIn === false) {
    return (
      <div className="App">
        <h1 id="title">
          Sign In
        </h1>
        <input type="text" className= "loginField" id="email" name="email" label="email" placeholder="Email"
          value={user}
          onChange={evt => setUser(evt.target.value)}
        /> <br/>
        <input type="text" className= "loginField" id="password" name="password" label="password" placeholder="Password"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        /> <br/>
        <div className="buttons">
        <button className="btn" id = "signin"  onClick={handleSignIn}>
          Sign In
        </button>
        <button className="btn" id = "signup"  onClick={handleSignUp}>
          Sign Up
        </button>
        </div>
         <br/>
        <button className="googleButton" id = "googlesignin" onClick={googleSignIn}>
          Sign In - Google
        </button>
      </div>
    );
  } else {
    return (
      <div className="App">
      <button className="signOutButton" id= "signout" onClick={handleSignOut}>
        Sign Out
      </button>
      <h2>Shamify</h2>
      {handleGetRequest()}

      <section class="artist_container" id="artist_container">
        <div class="one"> 
          <ul id="artists"></ul> 
        </div>
        <div class="two">      
          
        </div>
      </section>
      <section class="album_container" id="album_container">
        <button id ="album_back">
          Back
        </button>
        <div class="one"> 
          <ul id="albums"></ul> 
        </div>
        <div class="two">      
          
        </div>
      </section>
      <section class="song_container" id="song_container">
        <button id ="song_back" onClick="function(){
            document.getElementById('artist_container').style.display = 'none';
            document.getElementById('song_container').style.display = 'none';

            document.getElementById('album_container').style.display = 'inline-block';

          };>
          Back
        </button>
        <div class="one"> 
          <ul id="songs"></ul> 
        </div>
        <div class="two">      
          <ReactAudioPlayer id="songPlayer"
            src=""
            autoPlay
            controls
          />
        </div>
      </section>
      </div>
    )
  }
}


export default App; 