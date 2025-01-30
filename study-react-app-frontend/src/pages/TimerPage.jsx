import React, { useState, useEffect } from 'react'; 
import '../styles/TimerPage.css'

function TimerPage() {
    const [time, setTime] = useState(0); // Set initial time to 0 
    const [running, setRunning] = useState(false); // Initially not running

    
    useEffect(() => {
        let interval;
        // If running true and time greater than 0
        if (running && time > 0) {
            // Set interval that decrements by 1 every 1000 ms (1 second)
            interval = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000)
        } 
        if (time <= 0) {
            setRunning(false); // When time hits 0, stop (no negative times)
        }
        return() => clearInterval(interval); // Cleanup
    }, [running, time]); // When initial state (0 and false)

    const startTimer = () => {
        // If time is greater than 0, you can start timer
        if (time > 0) {
            setRunning(true);
        }
    }

    // Stop countdown
    const stopTimer = () => {
        setRunning(false);
    }

    // Reset Timer, Clear
    const resetTimer = () => {
        setRunning(false);
        setTime(0);
    }

    function formatTime (timeInSeconds) {
        // If no input, display as 0
        if (isNaN(timeInSeconds)) {
            timeInSeconds = 0;
        }
        // Calculate times from ms
        let hours = Math.floor(timeInSeconds / 3600);
        let minutes = Math.floor((timeInSeconds % 3600) / 60);
        let seconds = Math.floor(timeInSeconds % 60);

        // Convert all to String to pad
        [hours, minutes, seconds] = [hours, minutes, seconds].map(time => String(time).padStart(2, '0')); //Pad w/ leading 0 (2 digits)

        return `${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className='timer-page-div'>
            <h2 className='timer-header'>Timer</h2>
            <div className='timer-div'>
                {formatTime(time)}
            </div>
            <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value, 10))} disabled={running} id='timer-input' />
            <div className='timer-btn-container'>
                <button onClick={startTimer} className="timer-btn">Start</button>
                <button onClick={stopTimer} className="timer-btn">Stop</button>
                <button onClick={resetTimer} className="timer-btn">Reset</button>  
            </div>
        </div>
    )
}

export default TimerPage