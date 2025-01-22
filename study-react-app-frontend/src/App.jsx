import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import StopwatchPage from './pages/StopWatchPage.jsx';
import TimerPage from './pages/TimerPage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link> 
          <Link to="/register">Register</Link>
          <Link to="/stopwatch">Stopwatch</Link>
          <Link to="/timer">Timer</Link>
          <Link to="/flashcards">Flashcards</Link>
        </nav>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/stopwatch' element={<StopwatchPage />} />
          <Route path='/timer' element={<TimerPage />} />
          <Route path='/flashcards' element={<FlashcardsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
