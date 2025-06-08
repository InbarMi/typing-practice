import {useEffect, useState} from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState('Hello World!');
    const [textIndex, setTextIndex] = useState(0);
    const [inputKey, setInputKey] = useState('');
    const [correctIndices, setCorrectIndices] = useState([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const currentIndex = textIndex;

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

            setInputKey(key);
            console.log(key);
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [textIndex, text]);

    return (
        <>
            <h1>Type What You See :)</h1>
            <div className="text">
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
        </>
    )
}

export default App
