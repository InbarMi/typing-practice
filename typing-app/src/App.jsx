import {useEffect, useState} from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Hello World!');
  const [textIndex, setTextIndex] = useState(0);
  const [inputKey, setInputKey] = useState('');

  const handleInputKey = (event) => {
      setInputKey(event.key);
      console.log(event.key);
  }
    const [count, setCount] = useState(0);
    const [text, setText] = useState('Hello World!');
    const [textIndex, setTextIndex] = useState(0);
    const [inputKey, setInputKey] = useState('');

    useEffect(() => {
        const handleKeyDown = (event) => {
            setInputKey(event.key);
            console.log(event.key);
            const key = event.key;
            const currentIndex = textIndex;


            // shift cursor
            if (key === 'Backspace') {
                // if key was wrong and typed backspace, make it not red anymore
                setTextIndex(prevIndex => {
                    const newIndex = Math.max(0, prevIndex - 1);

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
          {text.split('').map((char, index) => (
              <span key={index}>
                  {index === textIndex && <span className="cursor" />}
                  <span key={index} className={index < textIndex ? 'typed' : ''}>{char}</span>
              </span>
          ))}
          <p className="text">{inputKey}</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
    return (
        <>
            <h1>Type What You See :)</h1>
            <div className="text">
                {text.split('').map((char, index) => {
                    const cursorPosition = index === textIndex;

                    let className = '';

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
