import React from 'react';
import './SettingsPanel.css';
import Dropdown from "../Dropdown/Dropdown.jsx";

function SettingsPanel({ fontProps, timeProps, levelProps, startGame}) {

    const fontOptions = ['monospace', 'serif', 'sans-serif'];
    const timeOptions = [30, 60, 90] // seconds
    const levelOptions = ['easy', 'normal', 'hard'];

    return (
        <div className="settings-container">
            <div className="options-menu">
                <Dropdown
                    label="Font"
                    options={fontOptions}
                    selected={fontProps.selected}
                    onSelect={fontProps.onSelect}
                />
                <Dropdown
                    label="Time"
                    options={timeOptions}
                    selected={timeProps.selected}
                    onSelect={timeProps.onSelect}
                    unit="seconds"
                />
                <Dropdown
                    label="Level"
                    options={levelOptions}
                    selected={levelProps.selected}
                    onSelect={levelProps.onSelect}
                />
            </div>
            {(fontProps.selected && timeProps.selected && levelProps.selected) &&
                <button className="start-game-btn" onClick={startGame}>
                    Start
                </button>
            }
        </div>

    )
}

export default SettingsPanel