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

    const layout = {
        default: [
            "q w e r t y u i o p [ ]",
            "a s d f g h j k l ; '",
            "z x c v b n m , . /",
            "{space}"
        ]
    }

    const handleToggleMap = () => {
        setToggleMap(prev => !prev);
    }

    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;
        const prevNextKey = prevNextKeyRef.current;

        const currentNextKey = nextExpectedKey ? (nextExpectedKey === ' ' ? '{space}' : nextExpectedKey.toLowerCase()) : null;

        if (prevNextKey) {
            keyboard.removeButtonTheme(prevNextKey, 'next-key-highlight');
        }

        if (currentNextKey) {
            if (currentNextKey === prevNextKey) {
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

    useEffect(() => {
        if (!keyboardRef.current) return;
        const keyboard = keyboardRef.current;

        const currentTypedKey = lastKey ? (lastKey === ' ' ? '{space}' : lastKey.toLowerCase()) : null;

        if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
            inputTimeoutRef.current = null;
        }

        if (prevInputKeyRef.current) {
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'correct-key');
            keyboard.removeButtonTheme(prevInputKeyRef.current, 'incorrect-key');
        }

        if (currentTypedKey && (isLastCorrect !== null)) {
            keyboard.removeButtonTheme(currentTypedKey, 'next-key-highlight');

            const themeToAdd = isLastCorrect ? 'correct-key' : 'incorrect-key';

            if (currentTypedKey === prevInputKeyRef.current) {
                setTimeout(() => {
                    if (keyboard) {
                        keyboard.addButtonTheme(currentTypedKey, themeToAdd);
                    }
                }, 100);
            } else {
                keyboard.addButtonTheme(currentTypedKey, themeToAdd);
            }

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