import React, {useState} from 'react';
import './SettingsPanel.css';
import Dropdown from "../Dropdown/Dropdown.jsx";

function SettingsPanel({ fontProps, timeProps, levelProps, startGame}) {

    const fontOptions = ['Courier', 'monospace', 'Garmond', 'Helvetica', 'Papyrus'];
    const timeOptions = [30, 60, 90] // seconds
    const levelOptions = ['easy', 'normal', 'hard'];

    const [openDropdownId, setOpenDropdownId] = useState(null);

    const handleDropdownToggle = (clickedId) => {
        setOpenDropdownId(prev => (prev === clickedId ? null : clickedId));
    }

    return (
        <div className="settings-container">
            <div className="options-menu">
                <Dropdown
                    id = "fontDropdown"
                    label="Font"
                    options={fontOptions}
                    selected={fontProps.selected}
                    onSelect={fontProps.onSelect}
                    isOpen={openDropdownId === "fontDropdown"}
                    onToggle={handleDropdownToggle}
                />
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
            {(fontProps.selected && timeProps.selected && levelProps.selected) &&
                <button className="start-game-btn" onClick={startGame}>
                    Start
                </button>
            }
        </div>

    )
}

export default SettingsPanel