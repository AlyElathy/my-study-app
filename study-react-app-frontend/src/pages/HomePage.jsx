import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import '../styles/HomePage.css'

function HomePage() {
    const [showTime, setShowTime] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []); // Render on Mount

    // ***************** MAYBE CHANGE HIDE TIME TERNIARY TO TOGGLE BUTTON LIKE IN VIDEO
    return (
        <div className='homepage-div'>
            <h1 className='homepage-heading'>Cozy Study App</h1>
            {showTime && <h2 className="clock-heading">{currentTime}</h2>} 
            <button className="clock-btn" onClick={() => setShowTime(!showTime)}>
                {showTime ? 'Hide Time': 'Show Time'} 
            </button>    

            <div className="home-btns-container"> 
                <Link to="/login" id='home-login-btn' className="home-nav-btn">Login</Link> 
                <Link to="/register" className="home-nav-btn" id='home-reg-btn'>Register</Link>
                <Link to="/stopwatch" className="home-nav-btn" id='home-sw-btn'>Stopwatch</Link>
                <Link to="/timer" className="home-nav-btn" id='home-timer-btn'>Timer</Link>
                <Link to="/flashcards" className="home-nav-btn" id='home-fc-btn'>Flashcards</Link>
            </div>       
        </div>
    )
}

export default HomePage;