import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Hello World!');

  return (
    <>
      <h1>Type What You See :)</h1>
      <div className="text">
          {text}
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
