import React, {useCallback, useEffect, useRef, useState} from 'react';
import './TextBlock.css';
import Timer from '../Timer/Timer.jsx';
import {generate} from 'random-words';
import Keymap from "../Keymap/Keymap.jsx";
import keyPressSoundPath from '../../assets/mech-key.mp3';

function TextBlock( { currentTime, setCurrentTime, setStats, difficulty, playSound }) {
    const [wordList, setWordList] = useState([]);
    const [textIndex, setTextIndex] = useState(0);
    const [correctIndices, setCorrectIndices] = useState([]);
    const [startTimer, setStartTimer] = useState(false);
    const [totalTyped, setTotalTyped] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [lastKey, setLastKey] = useState(null);
    const [isLastCorrect, setIsLastCorrect] = useState(null);

    const audioRef = useRef(new Audio(keyPressSoundPath));
    audioRef.constructor.volume = 0.5;

    const totalTextLength = wordList.reduce((sum, word) => sum + word.length, 0) + (wordList.length > 0 ? wordList.length - 1 : 0);

    const getCurrentChar = useCallback((globalIndex) => {
        let cumulativeLength = 0;
        for (let i = 0; i < wordList.length; i++) {
            const word = wordList[i];

            if (globalIndex >= cumulativeLength && globalIndex < cumulativeLength + word.length) {
                return word[globalIndex - cumulativeLength];
            }
            cumulativeLength += word.length;

            if (i < wordList.length - 1) {
                if (globalIndex === cumulativeLength) {
                    return ' ';
                }
                cumulativeLength += 1;
            }
        }
        return '';
    }, [wordList]);

    const getRandomSentence = useCallback((difficulty) => {

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

    useEffect(() => {
        const words = getRandomSentence(difficulty);
        setWordList(words);
        setTextIndex(0);
        setCorrectIndices([]);
    }, [getRandomSentence, difficulty]);

    useEffect(() => {
        if (currentTime > 0 && textIndex === totalTextLength) {
            const words = getRandomSentence(difficulty);
            setWordList(words);
            setTextIndex(0);
            setCorrectIndices([]);
        }
    }, [currentTime, textIndex, getRandomSentence, totalTextLength, difficulty]);

    useEffect(() => {
        setStats(prev => ({
            ...prev,
            totalTyped,
            totalCorrect
        }));
    }, [totalTyped, totalCorrect]);

    // keydown listener setup
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const currentIndex = textIndex;

            setLastKey(null);
            setIsLastCorrect(null)

            if (!startTimer) {
                setStartTimer(true);
            }

            if (playSound) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Error playing sound: ", e));
            }

            if (key.length === 1 && key !== 'Backspace') {
                setTotalTyped(prev => prev + 1);

                const expectedChar = getCurrentChar(currentIndex);
                const isCorrect = key === expectedChar;

                if (isCorrect) {
                    setTotalCorrect(prev => prev + 1);
                }

                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    updated[currentIndex] = isCorrect;
                    return updated;
                })
                setTextIndex(prevIndex => Math.min(totalTextLength, prevIndex + 1));
                setLastKey(key);
                setIsLastCorrect(isCorrect);
            }

            // shift cursor
            if (key === 'Backspace') {
                // if key was wrong and typed backspace, make it not red anymore
                setTextIndex(prevIndex => Math.max(0, prevIndex - 1));

                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    updated[textIndex - 1] = null;
                    return updated;

                });
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
                { wordList.map((word, wordIndex) => {
                    const wordSpans = word.split('').map((char, charInWordIndex) => {
                        const globalCharIndex = currentGlobalIndex + charInWordIndex;
                        const isCursorPosition = globalCharIndex === textIndex;
                        const isCorrect = correctIndices[globalCharIndex];

                        let className = '';
                        if (isCorrect === true) className = 'correct';
                        else if (isCorrect === false) className = 'incorrect';

                        return (
                            <span key={globalCharIndex} className={className}>
                                {isCursorPosition && <span className="cursor"/> }
                                {char}
                            </span>
                        );
                    });

                    currentGlobalIndex += word.length;

                    let spaceSeparator = null;
                    if (wordIndex < wordList.length - 1) {
                        spaceSeparator = (
                            <span key={`space-${currentGlobalIndex}`} className='space-separator'>
                                {currentGlobalIndex === textIndex && <span className="cursor"/>}
                                {'\u00A0'}
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