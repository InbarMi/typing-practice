import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Hello World!');
  const [textIndex, setTextIndex] = useState(0);

  return (
    <>
      <h1>Type What You See :)</h1>
      <div className="text">
          {text.split('').map((char, index) => (
              <>
                  {index === textIndex && <span className="cursor" />}
                  <span key={index} className={index < textIndex ? 'typed' : ''}>{char}</span>
              </>
          ))}
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
