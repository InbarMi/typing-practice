import React from 'react';
import './Stats.css';

/**
 * Stats component displays the typing session results,
 * including Words Per Minute (WPM) and accuracy percentage.
 *
 * @param {object} props - The component props.
 * @param {object} props.stats - An object containing the session statistics.
 * @param {number} props.stats.totalTyped - The total number of characters typed by the user.
 * @param {number} props.stats.totalCorrect - The total number of correctly typed characters.
 * @param {number} props.stats.time - The initial duration of the typing session in seconds.
 */
function Stats({ stats }) {
    const { totalTyped, totalCorrect, time } = stats;
    const accuracy = Math.round((totalCorrect / totalTyped) * 100);
    const wpm = Math.round((totalTyped / 5) / (time / 60)); // assume average word length of 5 characters

    return (
        <div className='stats'>
            <div className='inner-box'>
                <h3>Results:</h3>
                <p>WPM: {wpm} </p>
                <p>Accuracy: {accuracy}% </p>
            </div>
        </div>
    )
}

export default Stats