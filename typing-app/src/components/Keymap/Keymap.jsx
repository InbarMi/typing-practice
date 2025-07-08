import React, {useEffect, useRef, useState} from "react";
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import './Keymap.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faKeyboard} from '@fortawesome/free-solid-svg-icons';

function Keymap({ nextExpectedKey, lastKey, isLastCorrect }) {
    const [toggleMap, setToggleMap] = useState(true);

    const keyboardRef = useRef(null);

    const prevNextKeyRef = useRef(null);
    const prevInputKeyRef = useRef(null);
    const inputTimeoutRef = useRef(null);

    const handleToggleMap = () => {
        setToggleMap(prev => !prev);
    }

    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;

        const currentNextKey = nextExpectedKey ? (nextExpectedKey === ' ' ? '{space}' : nextExpectedKey.toLowerCase()) : null;

        if (prevNextKeyRef.current && prevNextKeyRef.current !== currentNextKey) {
            keyboard.removeButtonTheme(prevNextKeyRef.current, 'next-key-highlight');
        } else if (!currentNextKey && prevNextKeyRef.current) {
            keyboard.removeButtonTheme(prevNextKeyRef.current, 'next-key-highlight');
        }

        if (currentNextKey) {
            keyboard.addButtonTheme(currentNextKey, 'next-key-highlight');
        }
        prevNextKeyRef.current = currentNextKey;

    }, [nextExpectedKey, toggleMap]);

    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;

        const currentTypedKey = lastKey ? (lastKey === ' ' ? '{space}' : lastKey.toLowerCase()) : null;

        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
            inputTimeoutRef.current = null;
        }

        if (prevInputKeyRef.current && prevInputKeyRef.current !== currentTypedKey) {
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'correct-key');
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'incorrect-key');
        } else if (!currentTypedKey && prevInputKeyRef.current) {
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'correct-key');
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'incorrect-key');
        }

        if (currentTypedKey && (isLastCorrect !== null)) {
            keyboard.removeButtonTheme(currentTypedKey, 'next-key-highlight');

            if (isLastCorrect) {
                keyboard.addButtonTheme(currentTypedKey, 'correct-key');
            } else {
                keyboard.addButtonTheme(currentTypedKey, 'incorrect-key');
            }
            prevInputKeyRef.current = currentTypedKey;

            inputTimeoutRef.current = setTimeout(() => {
                keyboard.removeButtonTheme(currentTypedKey, 'correct-key');
                keyboard.removeButtonTheme(currentTypedKey, 'incorrect-key');
            }, 250);
        }
    }, [lastKey, isLastCorrect, toggleMap]);

    return (

        <div className="keymap-container">
            <button className="toggleKeymap" onClick={handleToggleMap}>
                <FontAwesomeIcon icon={faKeyboard} />
            </button>
            <div className={!toggleMap ? 'hidden-keyboard' : ''}>
                <Keyboard keyboardRef={(r) => (keyboardRef.current = r)} />
            </div>
        </div>
    )
}

export default Keymap