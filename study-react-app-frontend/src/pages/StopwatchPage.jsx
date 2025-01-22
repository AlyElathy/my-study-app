import React, {useState, useEffect, useRef} from 'react';

function StopwatchPage() {
    const [running, setRunning] = useState(false);
    const intervalIdRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(() => {
        const savedTime = localStorage.getItem('elapsedTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const startTimeRef = useRef(Date.now() - elapsedTime);



    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('elapsedTime', elapsedTime);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [elapsedTime]);



    useEffect(() => {
        let interval;
        if (running) {
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } 
        return () => clearInterval(intervalIdRef.current);
    }, [running]); 


    function start() {
        setRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
        console.log(startTimeRef.current);
    }

    function stop() {
        setRunning(false);
    }

    function reset() {
        setElapsedTime(0);
        setRunning(false)
        localStorage.removeItem('elapsedTime'); //Clear Saved Time
    }

    //Format time for the display
    function formatTime () {
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let ms = Math.floor(elapsedTime % 1000 / 10);

        [hours, minutes, seconds, ms] = [hours, minutes, seconds, ms].map(time => String(time).padStart(2, '0'));

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