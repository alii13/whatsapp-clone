import React,{useEffect,useState} from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from "./Login";
import {useStateValue} from "./StateProvider"
function App() {
  const [{user},dispatch] = useStateValue();
  const uid =  localStorage.getItem('uid')!==undefined?localStorage.getItem('uid'):null;
  //console.log(useStateValue);
  //const {user,setUser} = useState(null);
  console.log(user)
  return (
    <div className="app">
    {
      !user && !uid?(
       <Login/>
      ):(
        <div className="app__body">
        <Router>
           <Sidebar/>
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat/>
              </Route>
              <Route path="/">
                <Chat/>
              </Route>
          </Switch>
        </Router>
      </div>
      )
    }
    </div>
  );
}

export default App;
