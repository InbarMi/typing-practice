import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import Timer from './Timer.jsx';
import Keymap from './Keymap.jsx';
import {generate} from 'random-words';

function TextBlock( { currentTime, setCurrentTime, setStats, difficulty }) {
    const [text, setText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [correctIndices, setCorrectIndices] = useState([]);
    const [startTimer, setStartTimer] = useState(false);
    const [totalTyped, setTotalTyped] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

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
        const sentence = words.join(' ')
        setText(sentence);
        setTextIndex(0);
        setCorrectIndices([]);
    }, [getRandomSentence, difficulty]);

    useEffect(() => {
        if (currentTime > 0 && textIndex === text.length) {
            const words = getRandomSentence(difficulty);
            const sentence = words.join(' ');
            setText(sentence);
            setTextIndex(0);
            setCorrectIndices([]);
        }
    }, [currentTime, textIndex, getRandomSentence, text.length, difficulty]);

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

            if (!startTimer) {
                setStartTimer(true);
            }

            if (key.length === 1 && key !== 'Backspace') {
                setTotalTyped(prev => prev + 1);

                if (key === text[currentIndex]) {
                    setTotalCorrect(prev => prev + 1);
                }

                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    updated[currentIndex] = key === text[currentIndex];
                    return updated;
                })
                setTextIndex(prevIndex => Math.min(text.length, prevIndex + 1));
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
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [textIndex, text, startTimer]);

    return (
        <div className="text">
            <Timer startTimer={startTimer} currentTime={currentTime} setCurrentTime={setCurrentTime} />
            {text.split('').map((char, index) => {
                const cursorPosition = index === textIndex;
                const isCorrect = correctIndices[index];

                let className = '';
                if (isCorrect === true) className = 'correct';
                else if (isCorrect === false) className = 'incorrect';

                return (
                    <span key={index}>
                        {cursorPosition && <span className="cursor"/>}
                        <span className={className}>{char}</span>
                    </span>
                );
            })}
            {/*<Keymap nextExpectedKey={text.charAt(textIndex)} />*/}
        </div>
    )
}

export default TextBlock