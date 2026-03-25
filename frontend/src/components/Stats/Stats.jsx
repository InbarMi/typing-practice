import React from 'react';
import './Stats.css';

/**
 * Stats component displays the typing session results,
 * including Words Per Minute (WPM) and accuracy percentage.
 *
 * @param {object} props - The component props.
 * @param {object} props.stats - An object containing the session data including statistics.
 * @param {number} props.stats.wpm - average number of words typed per minute
 * @param {number} props.stats.accuracy - total correct / total typed (percentage)
 */
function Stats({ stats }) {
    
    if (!stats) {
        return (
            <div className='stats'>
                <div className='inner-box'>
                    <p>Session Not Saved</p>
                </div>
            </div>
        )
    }

    return (
        <div className='stats'>
            <div className='inner-box'>
                <h3>Results:</h3>
                <p>WPM: {stats.wpm} </p>
                <p>Accuracy: {stats.accuracy}% </p>
            </div>
        </div>
    )
}

export default Stats