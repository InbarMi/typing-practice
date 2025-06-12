import React, {useEffect, useState} from 'react';
import './App.css';
import Timer from './Timer.jsx';

function TextBlock( { currentTime, setCurrentTime, difficulty }) {
    const [text, setText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [correctIndices, setCorrectIndices] = useState([]);
    // const [inputKey, setInputKey] = useState('');
    const [startTimer, setStartTimer] = useState(false);

    // keydown listener setup
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const currentIndex = textIndex;

            if (!startTimer) {
                setStartTimer(true);
            }

            setCorrectIndices(prevState => {
                const updated = [...prevState];
                if (key === text[currentIndex]) {
                    updated[currentIndex] = true;
                } else if (key.length === 1) {
                    updated[currentIndex] = false;
                }
                return updated;
            })

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
            } else if (key.length === 1) {
                setTextIndex(prevIndex => Math.min(text.length, prevIndex + 1));
            }

            // setInputKey(key);
            console.log(key);
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [textIndex, text, startTimer]);

    // fetch text file
    useEffect(() => {
        fetch(`../public/texts/${difficulty}.txt`)
            .then((res) => res.text())
            .then((data) => {
                const sentences = data.split('\n');
                const randomIndex = [Math.floor(Math.random() * sentences.length)];
                setText(sentences[randomIndex]);
            })
            .catch((err) => console.error('Error loading text: ', err));
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