import React, {useCallback, useEffect, useRef, useState} from 'react';
import './TextBlock.css';
import Timer from '../Timer/Timer.jsx';
import {generate} from 'random-words';
import Keymap from "../Keymap/Keymap.jsx";
import keyPressSoundPath from '../../assets/mech-key.mp3';

/**
 * TextBlock component manages the core typing practice logic.
 * It displays the text to be typed, handles user input, tracks progress,
 * and integrates with the timer and keyboard map.
 *
 * @param {object} props - The component props.
 * @param {number} props.currentTime - The current time remaining in the session.
 * @param {function(number): void} props.setCurrentTime - Callback to update the current time in the parent.
 * @param {function(object): void} props.setStats - Callback to update typing statistics in the parent.
 * @param {string} props.difficulty - The selected difficulty level for text generation.
 * @param {boolean} props.playSound - Flag indicating whether typing sound effects should play.
 */
function TextBlock( { currentTime, setCurrentTime, setStats, difficulty, playSound }) {
    // states for managing the typing session's text, progress, and timer
    const [wordList, setWordList] = useState([]);
    const [textIndex, setTextIndex] = useState(0);
    const [correctIndices, setCorrectIndices] = useState([]);
    const [startTimer, setStartTimer] = useState(false);

    // states for tracking typing performance metrics
    const [totalTyped, setTotalTyped] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    // states for providing visual feedback to the keymap component
    const [lastKey, setLastKey] = useState(null);
    const [isLastCorrect, setIsLastCorrect] = useState(null);

    // ref for the audio element to play keypress sounds
    const audioRef = useRef(new Audio(keyPressSoundPath));
    audioRef.current.volume = 0.5;

    // calculate total length of the entire text including space between words
    const totalTextLength = wordList.reduce((sum, word) => sum + word.length, 0) + (wordList.length > 0 ? wordList.length - 1 : 0);

    /**
     * Retrieves the character at a given global index from the `wordList`.
     * This handles both characters within words and spaces between words.
     *
     * @param {number} globalIndex - The absolute index of the character in the entire text.
     * @returns {string} The character at the specified global index.
     */
    const getCurrentChar = useCallback((globalIndex) => {
        let cumulativeLength = 0;
        for (let i = 0; i < wordList.length; i++) {
            const word = wordList[i];

            // check if the global index falls within the current word
            if (globalIndex >= cumulativeLength && globalIndex < cumulativeLength + word.length) {
                return word[globalIndex - cumulativeLength];
            }
            cumulativeLength += word.length;

            // check for space between words
            if (i < wordList.length - 1) {
                if (globalIndex === cumulativeLength) {
                    return ' ';
                }
                cumulativeLength += 1;
            }
        }
        return '';
    }, [wordList]);

    /**
     * Generates a random sentence based on the specified difficulty level using `random-words` library.
     *
     * @param {string} difficulty - The difficulty level ('easy', 'normal', 'hard').
     * @returns {Array<string>} An array of words forming the sentence.
     */
    const getRandomSentence = useCallback((difficulty) => {

        // default (normal) word options
        let options = {
            exactly: 12,
            maxLength: 8,
            minLength: 5
        };

        switch (difficulty) {
            case 'easy':
                options.exactly = 7;
                options.maxLength = 5;
                break;
            case 'hard':
                options.exactly = 15;
                options.maxLength = 10;
                options.minLength = 6;
                break;
            default:
                break;
        }
        return generate(options);

    }, [difficulty]);

    /**
     * Effect hook to initialize the word list when the component mounts.
     * Resets text index and correctness tracking.
     */
    useEffect(() => {
        const words = getRandomSentence(difficulty);
        setWordList(words);
        setTextIndex(0);
        setCorrectIndices([]);
    }, [getRandomSentence, difficulty]);

    /**
     * Effect hook to generate a new sentence if the current one is fully typed
     * and the timer is still running.
     */
    useEffect(() => {
        if (currentTime > 0 && textIndex === totalTextLength) {
            const words = getRandomSentence(difficulty);
            setWordList(words);
            setTextIndex(0);
            setCorrectIndices([]);
        }
    }, [currentTime, textIndex, getRandomSentence, totalTextLength, difficulty]);

    /**
     * Effect hook to update parent component's statistics whenever `totalTyped` or `totalCorrect` changes.
     */
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            totalTyped,
            totalCorrect
        }));
    }, [totalTyped, totalCorrect]);

    /**
     * Effect hook to set up and clean up the global `keydown` event listener.
     * This listener captures user typing input.
     */
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const currentIndex = textIndex;

            // reset last key and correctness status for the Keymap component
            setLastKey(null);
            setIsLastCorrect(null)

            // start the timer on the first key press if it hasn't started yet
            if (!startTimer) {
                setStartTimer(true);
            }

            // play keypress sound if enabled
            if (playSound) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Error playing sound: ", e));
            }

            // handle regular character input (single character, not backspace)
            if (key.length === 1 && key !== 'Backspace') {
                setTotalTyped(prev => prev + 1);

                const expectedChar = getCurrentChar(currentIndex);
                const isCorrect = key === expectedChar;

                if (isCorrect) {
                    setTotalCorrect(prev => prev + 1);
                }

                // update the correctness array at current index
                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    updated[currentIndex] = isCorrect;
                    return updated;
                })
                // move cursor to the next position, not exceeding total text length
                setTextIndex(prevIndex => Math.min(totalTextLength, prevIndex + 1));

                // update Keymap props for the last typed key feedback
                setLastKey(key);
                setIsLastCorrect(isCorrect);
            }

            // handle backspace key to move cursor back and clear correctness status
            if (key === 'Backspace') {
                // move cursor back, not below 0
                setTextIndex(prevIndex => Math.max(0, prevIndex - 1));

                // clear the correctness status for the character that was 'deleted' to remove the highlight
                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    updated[textIndex - 1] = null;
                    return updated;

                });
                // clear keymap feedback for the last key
                setLastKey(null);
                setIsLastCorrect(null);
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [textIndex, startTimer, totalTextLength, getCurrentChar, playSound]);


    let currentGlobalIndex = 0;

    return (
        <div className="text-block-container">
            <Timer startTimer={startTimer} currentTime={currentTime} setCurrentTime={setCurrentTime} />
            <div className="text-content-wrapper">
                {/* Map over words to render the typing text */}
                { wordList.map((word, wordIndex) => {
                    // map over characters within each word
                    const wordSpans = word.split('').map((char, charInWordIndex) => {
                        const globalCharIndex = currentGlobalIndex + charInWordIndex;
                        const isCursorPosition = globalCharIndex === textIndex;
                        const isCorrect = correctIndices[globalCharIndex];

                        let className = '';
                        if (isCorrect === true) className = 'correct';
                        else if (isCorrect === false) className = 'incorrect';

                        return (
                            <span key={globalCharIndex} className={className}>
                                {/* Render cursor at current position */}
                                {isCursorPosition && <span className="cursor"/> }
                                {char}
                            </span>
                        );
                    });

                    // update global index for the next word
                    currentGlobalIndex += word.length;

                    let spaceSeparator = null;

                    // add a space separator between words, but not after the last word
                    if (wordIndex < wordList.length - 1) {
                        spaceSeparator = (
                            <span key={`space-${currentGlobalIndex}`} className='space-separator'>
                                {currentGlobalIndex === textIndex && <span className="cursor"/>}
                                {'\u00A0'} {/* Non-breaking space */}
                            </span>
                        );
                        currentGlobalIndex++;
                    }

                    return (
                        <React.Fragment key={`word-block-${wordIndex}`}>
                            <span key={`word-unit-${wordIndex}`} className="word-unit">
                                {wordSpans}
                            </span>
                            {spaceSeparator}
                        </React.Fragment>
                    )
                })}
            </div>

            <Keymap nextExpectedKey={getCurrentChar(textIndex)} lastKey={lastKey} isLastCorrect={isLastCorrect} />
        </div>
    )
}

export default TextBlock