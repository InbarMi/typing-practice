import React from 'react';
import './App.css'

function Stats({ stats }) {

    const { totalTyped, totalCorrect, TotalCharacters } = stats;
    const accuracy = Math.round((totalCorrect / totalTyped) * 100);

    return (
        <div className='stats'>
            <p>WPM: N/A </p>
            <p>Accuracy: {accuracy}% </p>
        </div>
    )
}

export default Stats