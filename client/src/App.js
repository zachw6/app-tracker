import './index.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Link} from 'react-router-dom';
import React from 'react';
import Login from './Component/Login';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);

  const loginTrue = (state) => {
    setLogin(state);
  }

  useEffect(() => {
    if(sessionStorage.getItem('loginToken') == null){
      setLogin(false);
  } else {

    axios({
      method: "POST",
      url: "http://localhost:5000/user/verify",
      data: {token: sessionStorage.getItem('loginToken')}
  }).then(res => {
      if(res.data.access === 'granted'){
        setName(res.data.name);
        setLogin(true);
      } else {
        console.log("User not logged in.")
        setLogin(false);
      }
  });
  }
  }, [])

  useEffect( () => {
    if(sessionStorage.getItem('loginToken') != null){

    axios({
      method: "POST",
      url: "http://localhost:5000/user/verify",
      data: {token: sessionStorage.getItem('loginToken')}
  }).then(res => {
      if(res.data.access === 'granted'){
        setName(res.data.name);
      }
  });
  }
  }, [login])

  const getApplications = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/user/applications",
      data: {token: sessionStorage.getItem('loginToken')}
  }).then(res => {
      // Do what we want with the applications array.
      
  });
  }

  return (
    <Router>
      <Route exact={true} path="/">
        <div className="homeCenter">
            <div className="centerContent">
              {login ? <h1 style={{paddingBottom: '20px'}}>Welcome to AppTracker, {name}</h1> : <h1 style={{paddingBottom: '20px'}}>Welcome to AppTracker</h1>}
              <div>{login ? <Link to="./dashboard"><button className="dashboard" onClick={getApplications}>Dashboard</button></Link> : <Login loginFunc={loginTrue}/>}</div>
            </div>
        </div>
      </Route>
      <Route exact={true} path="/dashboard">
        Dashboard
      </Route>
    </Router>
  );
}

export default App;
