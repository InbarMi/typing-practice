import React, {useState, useEffect, useRef, useCallback} from "react";
import "./Dropdown.css";

function Dropdown({ id, label, options, onSelect, selected, unit, isOpen, onToggle }) {

    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
            return;
        }

        if (isOpen) {
            onToggle(null);
        }
    }, [isOpen, onToggle]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClickOutside]);

    const handleOptionClick = (option) => {
        onSelect(option);
        onToggle(null);
    }

    return (
        <div className="dropdown-wrapper" ref={dropdownRef}>
            <button ref={buttonRef} onClick={() => onToggle(id)}>
                {label}: {selected}
            </button>
            { isOpen && (
                <ul className='dropdown-menu open' id="fontsMenu" >
                    {options.map(option => (
                        <li key={option} onClick={() => handleOptionClick(option)}>
                            {option} {unit || ''}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown