import React, { useState, useEffect } from 'react'; 
import '../styles/TimerPage.css'

function TimerPage() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (running && time > 0) {
            interval = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000)
        } 
        if (time <= 0) {
            setRunning(false);
        }
        return() => clearInterval(interval);
    }, [running, time]);

    const startTimer = () => {
        if (time > 0) {
            setRunning(true);
        }
    }

    const stopTimer = () => {
        setRunning(false);
    }

    const resetTimer = () => {
        setRunning(false);
        setTime(0);
    }

    return (
        <div className='timer-page-div'>
            <h2 className='timer-header'>Timer</h2>
            <div className='timer-div'>
                {time} seconds
            </div>
            <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value))} disabled={running} id='timer-input'/>
            <div className='timer-btn-container'>
                <button onClick={startTimer} className="timer-btn">Start</button>
                <button onClick={stopTimer} className="timer-btn">Stop</button>
                <button onClick={resetTimer} className="timer-btn">Reset</button>  
            </div>
        </div>
    )
}

export default TimerPage