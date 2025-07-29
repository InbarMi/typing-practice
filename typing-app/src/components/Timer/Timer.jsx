import React, {useEffect, useState} from "react";
import './Timer.css'

/**
 * Timer component displays a countdown and manages the timing logic for the typing session.
 * It decrements the `currentTime` prop every second when the timer is active.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.startTimer - A boolean flag that, when true, initiates the countdown.
 * @param {number} props.currentTime - The current time remaining in seconds.
 * @param {function(number): void} props.setCurrentTime - Callback to update the `currentTime` in the parent component.
 */
function Timer({ startTimer, currentTime, setCurrentTime }) {

    /**
     * Effect hook to manage the countdown interval.
     * It sets up a `setInterval` to decrement `currentTime` every second
     * when `startTimer` is true and `currentTime` is greater than 0.
     * The interval is cleared when the component unmounts, `startTimer` becomes false,
     * or `currentTime` reaches 0, preventing memory leaks and unnecessary updates.
     */
    useEffect(() => {
        // only start the timer if `startTimer` is true and there's time left
        if (!startTimer || currentTime <= 0) return;

        // set up the interval to decrement time every 1000ms (1 second)
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