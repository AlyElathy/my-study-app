import React, {useState, useEffect, useRef} from 'react';

function StopwatchPage() {
    const [running, setRunning] = useState(false); // initially not running
    const intervalIdRef = useRef(null); // intervalId initially DNE
    // total elapsed
    const [elapsedTime, setElapsedTime] = useState(() => { 
        const savedTime = localStorage.getItem('elapsedTime'); // load from localStorage
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    // Holds timestamp where sw started (to calc how much time passed)
    const startTimeRef = useRef(Date.now() - elapsedTime);

    // Resume from same time if user refreshes or closes browser
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('elapsedTime', elapsedTime);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [elapsedTime]);

    useEffect(() => {
        // If sw running
        if (running) {
            // Update elapsed time every 10 ms
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } 
        // Cleanup
        return () => clearInterval(intervalIdRef.current);
    }, [running]); //If running false or unmounts

    // Start Stopwatch
    function start() {
        setRunning(true);
        // Subtract from previous
        startTimeRef.current = Date.now() - elapsedTime;
        console.log(startTimeRef.current); 
    }

    // Stop Stopwatch
    function stop() {
        setRunning(false);
    }

    // Reset Stopwatch
    function reset() {
        setElapsedTime(0); // Set to 0
        setRunning(false) // Set running to false
        localStorage.removeItem('elapsedTime'); //Clear Saved Time
    }

    //Format time for the display
    function formatTime () {
        // Calculate times from ms
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let ms = Math.floor(elapsedTime % 1000 / 10);

        // Convert all to String to pad
        [hours, minutes, seconds, ms] = [hours, minutes, seconds, ms].map(time => String(time).padStart(2, '0')); //Pad w/ leading 0 (2 digits)

        return `${hours}:${minutes}:${seconds}:${ms}`;
    }

    return (
        <div class='timer-page-div'>
            <h2 className='timer-header'>Stopwatch</h2>
            <div className='timer-div'>
                {formatTime()}
            </div>
            <button onClick={start} className='timer-btn'>Start</button>
            <button onClick={stop} className='timer-btn'>Stop</button>
            <button onClick={reset} className='timer-btn'>Reset</button>
        </div>
    );
}

export default StopwatchPage;