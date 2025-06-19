import React, {useEffect, useState} from 'react';
import './App.css';
import Timer from './Timer.jsx';

function TextBlock( { currentTime, setCurrentTime, difficulty, setStats }) {
    const [text, setText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [correctIndices, setCorrectIndices] = useState([]);
    const [startTimer, setStartTimer] = useState(false);
    const [totalTyped, setTotalTyped] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    const getRandomSentence = async () => {
        try {
            const res = await fetch(`../public/texts/${difficulty}.txt`);
            const data = await res.text();
            const sentences = data.split('\n');
            const randomIndex = Math.floor(Math.random() * sentences.length);
            return sentences[randomIndex];
        } catch (err) {
            console.error('Error loading text: ', err);
            return '';
        }
    };

    // keydown listener setup
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const currentIndex = textIndex;

            if (!startTimer) {
                setStartTimer(true);
            }

            if (key.length === 1) {
                setCorrectIndices(prevState => {
                    const updated = [...prevState];
                    if (key === text[currentIndex]) {
                        updated[currentIndex] = true;
                        setTotalCorrect(prev => prev + 1);
                    } else {
                        updated[currentIndex] = false;
                    }
                    setTotalTyped(prev => prev + 1);
                    return updated;
                })
                if (key !== 'Backspace') {
                    setTextIndex(prevIndex => Math.min(text.length, prevIndex + 1));
                }
            }


            // shift cursor
            if (key === 'Backspace') {
                // if key was wrong and typed backspace, make it not red anymore
                setTextIndex(prevIndex => {
                    const newIndex = Math.max(0, prevIndex - 1);

                    setCorrectIndices(prevState => {
                        const updated = [...prevState];
                        updated[newIndex] = null;
                        return updated;
                    });
                    return newIndex;
                });
            }
            setStats(prev => ({
                ...prev,
                totalTyped: totalTyped,
                totalCorrect: totalCorrect
            }));
            console.log(key);
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [textIndex, text, startTimer]);

    useEffect(() => {
        if (currentTime > 0 && textIndex === text.length - 1) {
            getRandomSentence().then(sentence => {
                setStats(prev => ({
                    ...prev,
                    totalCharacters: prev.totalCharacters + sentence.length
                }));
                setText(sentence);
                setTextIndex(0)
                setCorrectIndices([]);
            })
        }
    }, [currentTime, textIndex]);

    // fetch text file according to difficulty
    useEffect(() => {
        getRandomSentence().then(sentence => setText(sentence));
    }, [difficulty]);

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
        </div>
    )
}

export default TextBlock