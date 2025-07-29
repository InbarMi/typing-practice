import React, {useEffect, useRef, useState} from "react";
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import './Keymap.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faKeyboard} from '@fortawesome/free-solid-svg-icons';

/**
 * Keymap component displays an interactive virtual keyboard that provides visual feedback
 * for typing practice, highlighting the next expected key and showing correct/incorrect
 * presses for the last typed key.
 *
 * @param {object} props - The component props.
 * @param {string} props.nextExpectedKey - The character expected next in the typing text.
 * @param {string} props.lastKey - The last character typed by the user.
 * @param {boolean|null} props.isLastCorrect - True if `lastKey` was correct, false if incorrect, null if no key has been evaluated yet.
 */
function Keymap({ nextExpectedKey, lastKey, isLastCorrect }) {
    // State to control the visibility of virtual keyboard
    const [toggleMap, setToggleMap] = useState(true);

    // Refs for managing themes and key highlighting
    const keyboardRef = useRef(null);
    const prevNextKeyRef = useRef(null);
    const prevInputKeyRef = useRef(null);
    const inputTimeoutRef = useRef(null);

    // keyboard layout
    const layout = {
        default: [
            "q w e r t y u i o p [ ]",
            "a s d f g h j k l ; '",
            "z x c v b n m , . /",
            "{space}"
        ]
    }

    /**
     * Toggles the visibility of the keyboard map
     */
    const handleToggleMap = () => {
        setToggleMap(prev => !prev);
    }

    /**
     * Effect hook to highlight the next expected key on the virtual keyboard.
     * It removes the highlight from the previous 'next key' and applies it to the current one.
     *
     * Known bug: if the 'nextExpectedKey' is the same as the 'prevNextKey' (e.g. repeated characters like "ss"),
     * the highlight does not visually update due to the 'react-simple-keyboard' not re-applying the theme when it perceives no change.
     * A 'setTimeout' workaround was attempted but did not fix the bug.
     */
    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;
        const prevNextKey = prevNextKeyRef.current;

        const currentNextKey = nextExpectedKey ? (nextExpectedKey === ' ' ? '{space}' : nextExpectedKey.toLowerCase()) : null;

        // remove highlight from previously expected key
        if (prevNextKey) {
            keyboard.removeButtonTheme(prevNextKey, 'next-key-highlight');
        }

        // add highlight to the current next expected key
        if (currentNextKey) {
            if (currentNextKey === prevNextKey) {
                // small delay introduced in attempt to fix bug to force re-rendering for repeated keys
                setTimeout(() => {
                    if (keyboard) {
                        keyboard.addButtonTheme(currentNextKey, 'next-key-highlight');
                    }
                }, 100);
            } else {
                keyboard.addButtonTheme(currentNextKey, 'next-key-highlight');
            }
        }
        prevNextKeyRef.current = currentNextKey;

    }, [nextExpectedKey]);

    /**
     * Effect hook to provide visual feedback for the last typed key (correct/incorrect).
     * It highlights the typed key with a correct/incorrect theme and then removes it after a short delay.
     *
     * Known Bug: Similar to `nextExpectedKey`, if `lastKey` is a repeated character,
     * the highlight for correct/incorrect feedback might not visually update.
     * A `setTimeout` workaround was attempted but did not fix the bug.
     */
    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;

        const currentTypedKey = lastKey ? (lastKey === ' ' ? '{space}' : lastKey.toLowerCase()) : null;

        // clear any existing timeout to prevent lingering highlights.
        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
            inputTimeoutRef.current = null;
        }

        // remove themes from the previously typed key.
        if (prevInputKeyRef.current) {
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'correct-key');
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'incorrect-key');
        }

        // Apply new theme based on correctness of the last typed key.
        if (currentTypedKey && (isLastCorrect !== null)) {
            keyboard.removeButtonTheme(currentTypedKey, 'next-key-highlight');

            const themeToAdd = isLastCorrect ? 'correct-key' : 'incorrect-key';

            if (currentTypedKey === prevInputKeyRef.current) {
                // small delay introduced in attempt to fix bug to force re-rendering for repeated keys
                setTimeout(() => {
                    if (keyboard) {
                        keyboard.addButtonTheme(currentTypedKey, themeToAdd);
                    }
                }, 100);
            } else {
                keyboard.addButtonTheme(currentTypedKey, themeToAdd);
            }

            // set a timeout to remove the correctness highlight after a brief period.
            inputTimeoutRef.current = setTimeout(() => {
                if (keyboard) {
                    keyboard.removeButtonTheme(currentTypedKey, 'correct-key');
                    keyboard.removeButtonTheme(currentTypedKey, 'incorrect-key');
                }
            }, 250);
        }
        prevInputKeyRef.current = currentTypedKey

    }, [lastKey, isLastCorrect, toggleMap]);

    return (

        <div className="keymap-container">
            <div className={!toggleMap ? 'hidden-keyboard' : ''}>
                <Keyboard
                    keyboardRef={(r) => (keyboardRef.current = r)}
                    layout={layout}
                />
            </div>
            <button className="toggleKeymap" onClick={handleToggleMap}>
                <FontAwesomeIcon icon={faKeyboard} />
            </button>
        </div>
    )
}

export default Keymap