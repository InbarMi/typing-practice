import React from 'react';
import './Stats.css';

function Stats({ stats }) {

    const { totalTyped, totalCorrect, time } = stats;
    const accuracy = Math.round((totalCorrect / totalTyped) * 100);
    const wpm = Math.round((totalTyped / 5) / (time / 60));

    return (
        <div className='stats'>
            <p>WPM: {wpm} </p>
            <p>Accuracy: {accuracy}% </p>
        </div>
    )
}

export default Stats