import React, {useState} from 'react';
import './SettingsPanel.css';
import Dropdown from "../Dropdown/Dropdown.jsx";

/**
 * SettingsPanel component allows users to configure game preferences
 * such as font, time, and difficulty level before starting a typing session.
 * It uses the `Dropdown` component for each setting.
 *
 * @param {object} props - The component props.
 * @param {object} props.fontProps - Object containing `selected` font and `onSelect` handler for font.
 * @param {object} props.timeProps - Object containing `selected` time and `onSelect` handler for time.
 * @param {object} props.levelProps - Object containing `selected` level and `onSelect` handler for difficulty.
 * @param {function(): void} props.startGame - Callback function to initiate the typing game.
 */
function SettingsPanel({ fontProps, timeProps, levelProps, startGame}) {

    // options available for font, practice time duration, and difficulty level
    const fontOptions = ['Courier', 'monospace', 'Garmond', 'Helvetica', 'Papyrus'];
    const timeOptions = [30, 60, 90] // in seconds
    const levelOptions = ['easy', 'normal', 'hard'];

    // state to manage which dropdown is currently open
    const [openDropdownId, setOpenDropdownId] = useState(null);

    /**
     * Toggles the open/closed state of a specific dropdown menu.
     * If the clicked dropdown is already open, it closes it. Otherwise, it opens the clicked dropdown
     * and ensures any other open dropdown is closed.
     * @param {string} clickedId - The unique ID of the dropdown that was clicked.
     */
    const handleDropdownToggle = (clickedId) => {
        setOpenDropdownId(prev => (prev === clickedId ? null : clickedId));
    }

    return (
        <div className="settings-container">
            <div className="options-menu">
                {/* Font Selection Dropdown */}
                <Dropdown
                    id = "fontDropdown"
                    label="Font"
                    options={fontOptions}
                    selected={fontProps.selected}
                    onSelect={fontProps.onSelect}
                    isOpen={openDropdownId === "fontDropdown"}
                    onToggle={handleDropdownToggle}
                />
                {/* Time Selection Dropdown */}
                <Dropdown
                    id="timeDropdown"
                    label="Time"
                    options={timeOptions}
                    selected={timeProps.selected}
                    onSelect={timeProps.onSelect}
                    unit="seconds"
                    isOpen={openDropdownId === "timeDropdown"}
                    onToggle={handleDropdownToggle}
                />
                {/* Difficulty Level Selection Dropdown */}
                <Dropdown
                    id="levelDropdown"
                    label="Level"
                    options={levelOptions}
                    selected={levelProps.selected}
                    onSelect={levelProps.onSelect}
                    isOpen={openDropdownId === "levelDropdown"}
                    onToggle={handleDropdownToggle}
                />
            </div>
            {/* Enable Start Game Button only when all three settings have been selected */}
            {(fontProps.selected && timeProps.selected && levelProps.selected) &&
                <button className="start-game-btn" onClick={startGame}>
                    Start
                </button>
            }
        </div>
    )
}

export default SettingsPanel