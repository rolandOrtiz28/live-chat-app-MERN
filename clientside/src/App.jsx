import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './components/Home/Homepage';
import Chats from './components/Chats/Chats';
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>

        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chats} />

      </Router>
    </div>
  );
}

export default App;
