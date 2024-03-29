import {
  Routes,
  Route
} from "react-router-dom";

import './App.css';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import handleRequest from './utilities/Request'
import PrivateRoute from './utilities/PrivateRoute'
import { useState, useEffect } from "react"

function App() {
    const [state, setState] = useState({
      username: "",
      password: "",
      loggedIn: false,
  })

  function handleChange(event:any){
      setState({...state, [event.target.id]:event.target.value})
  }
  //pass down to login page so we know when we are logged in
  function setLoggedIn(loggedIn: boolean) {
    setState({...state, loggedIn: loggedIn})
  }

  //TODO: Check access token expired
  function verifyLogin() {
      let access_token = localStorage.getItem('access_token')
      if (access_token) {
        setState({...state, loggedIn: true})
      }
  }

  //get current user data if logged in
  async function getCurrentUser() {
    if(state.loggedIn) {
      let user = await handleRequest('get', '/current_user')
      if(user) {
        setState({...state, username: user.data.username})
      }
    }
  }

  function logout() {
    localStorage.removeItem('access_token')
    setState({...state, loggedIn: false})
  }

  useEffect(() => {
    verifyLogin()
    getCurrentUser()
  },[state.loggedIn])

  return (
    <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Navbar pageName="Name" logout={logout} loggedIn={state.loggedIn} username={state.username}/>
      <body>
        <Routes>
          <Route path="/" element={
            <PrivateRoute redirectPath={'/login'}>
              <Home handleChange={handleChange} loggedIn={state.loggedIn}/>
            </PrivateRoute>
          }/>
          <Route path="/login" element={<Authentication type="login" setLoggedIn={setLoggedIn} loggedIn={state.loggedIn}/>}/>
          <Route path="/:username" element={<Profile />}/>
          <Route path="/signup" element={<Authentication type="signup" setLoggedIn={setLoggedIn} loggedIn={state.loggedIn}/>}/>
        </Routes>
      </body>
    </div>
  );
}

export default App;
