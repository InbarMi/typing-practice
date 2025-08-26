import { useCallback, useEffect, useRef } from "react";
import "./Dropdown.css";

/**
 * Dropdown component for selecting an option from a list.
 * Manages its own menu visibility and handles external clicks to close the menu.
 *
 * @param {object} props - The component props.
 * @param {string} props.id - Unique identifier for the dropdown.
 * @param {string} props.label - Text displayed on the dropdown button.
 * @param {Array<string|number>} props.options - List of options for the menu.
 * @param {function(string|number): void} props.onSelect - Callback when an option is selected.
 * @param {string|number} props.selected - The current selected value.
 * @param {string} [props.unit] - Optional unit to display next to the selected option.
 * @param {boolean} props.isOpen - Controls if this specific dropdown menu is open.
 * @param {function(string|null): void} props.onToggle - Callback to toggle the open state of dropdowns.
 */
function Dropdown({ id, label, options, onSelect, selected, unit, isOpen, onToggle }) {

    // Refs to detect outside clicks and handle focus management
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    /**
     * Handles clicks outside the dropdown component.
     * If a click occurs outside the dropdown and the menu is currently open,
     * it triggers the `onToggle` callback to close the menu.
     */
    const handleClickOutside = useCallback((event) => {
        // If the click is inside the dropdown itself, do nothing.
        if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
            return;
        }

        // If dropdown is open, close it
        if (isOpen) {
            onToggle(null);
        }
    }, [isOpen, onToggle]);

    /**
     * Effect hook to add/remove the global mousedown event listener for closing the dropdown.
     * The listener is only active when the dropdown `isOpen` prop is true.
     */
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClickOutside]);

    /**
     * Handles the click event on an individual option within the dropdown menu.
     * Calls the `onSelect` prop with the chosen option and then closes the dropdown menu.
     * @param {string|number} option - The selected option value.
     */
    const handleOptionClick = (option) => {
        onSelect(option);
        onToggle(null);
    }

    return (
        <div className="dropdown-wrapper" ref={dropdownRef}>
            {/* Dropdown button: toggles the menu visibility when clicked */}
            <button ref={buttonRef} onClick={() => onToggle(id)}>
                {label}: {selected}
            </button>
            {/* Conditionally render the dropdown menu if `isOpen` is true */}
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