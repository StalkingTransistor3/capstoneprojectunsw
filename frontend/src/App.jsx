import './App.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Site from './components/Site.jsx';
function App() {
  return (
    <>
      <Router>
        <Site />
      </Router>
    </>
  );
}

export default App;
