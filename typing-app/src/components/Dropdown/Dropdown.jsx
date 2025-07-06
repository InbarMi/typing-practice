import React, {useState, useEffect, useRef, useCallback} from "react";
import "./Dropdown.css";

function Dropdown({ label, options, onSelect, selected, unit }) {

    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
        <div className="dropdown-wrapper" ref={dropdownRef}>
            <button onClick={() => setShowMenu(prev => !prev)}>
                {label}: {selected}
            </button>
            { showMenu && (
                <ul className={`dropdown-menu ${showMenu ? 'open' : ''}`} id="fontsMenu" >
                    {options.map(option => (
                        <li key={option} onClick={() => onSelect(option)}>
                            {option} {unit || ''}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown