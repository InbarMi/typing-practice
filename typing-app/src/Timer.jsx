import React, {useEffect, useState} from "react";
import './App.css'

function Timer({ startTimer, currentTime, setCurrentTime }) {

    useEffect(() => {
        if (startTimer) {
            const countdownInterval = setInterval(() => {
                return setCurrentTime(prevTime => Math.max(0, prevTime - 1));
            }, 1000)

            return () => clearInterval(countdownInterval);
        }
    }, [startTimer]);

    return (
        <div className='timer'>
            {currentTime}
        </div>
    );
}

export default Timer