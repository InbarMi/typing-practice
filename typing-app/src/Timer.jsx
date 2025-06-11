import React, {useEffect, useState} from "react";
import './App.css'

function Timer({ startTimer, currentTime, setCurrentTime }) {

    useEffect(() => {
        if (!startTimer || currentTime <= 0) return;

        const countdownInterval = setInterval(() => {
            return setCurrentTime(prevTime => prevTime - 1);
        }, 1000)

        return () => clearInterval(countdownInterval);

    }, [startTimer]);

    return (
        <div className='timer'>
            {currentTime}
        </div>
    );
}

export default Timer