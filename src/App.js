// import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import "firebase/auth";
import ReactAudioPlayer from 'react-audio-player';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
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
  var artists = [];
  var albums = [];

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

          // document.getElementById('songInfo').style.display = 'inline-block';
          // document.getElementById("songInfo").src = songs;
          songs.forEach(function callback(item, index) {
            var song = document.createElement("LI");
            var button = document.createElement("BUTTON");
            button.innerHTML = "Song " + index; 
            song.id = "Song_" + index;
            button.id = "Song_button_" + index;
            button.className = "song_btn";
            button.onclick = function(){ setAudioPlayer(item); } ;   
            document.getElementById('songs').appendChild(song);
            document.getElementById("Song_" + index).appendChild(button);
            UpdateSongInfo(item, button.id);
          });
         }
      }
    }
  }

  const setAudioPlayer = (songURL) => {
    document.getElementById('songPlayer').src = songURL;
  }

  const UpdateSongInfo = (link, songID)  =>  {
    var path = link.split('/');

    // document.getElementById("artist").innerHTML = PathFromUrl(path[1]);
    // document.getElementById("album").innerHTML = PathFromUrl(path[2]);
    document.getElementById(songID).innerHTML = PathFromUrl(path[4]) + "/" + PathFromUrl(path[5]).split('?')[0];
    console.log(PathFromUrl(path[0]));
    console.log(PathFromUrl(path[1]));
    console.log(PathFromUrl(path[2]));
    console.log(PathFromUrl(path[3]));
    console.log(PathFromUrl(path[4]));
    console.log(PathFromUrl(path[5]).split('?')[0]);
    console.log(link);

  }

 const PathFromUrl = (path)  =>  {
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
      <section class="container">
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