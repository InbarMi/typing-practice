import {useEffect, useState} from 'react';
import './App.css';
import TextBlock from './TextBlock.jsx';
import Stats from './Stats.jsx';

function App() {

    const fontOptions = ['monospace', 'serif', 'sans-serif'];
    const initialTime = 30;

    const [selectedFont, setSelectedFont] = useState('monospace');
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(initialTime);

    const handleFontSelect = (font) => {
        setSelectedFont(font);
        setShowFontMenu(false);
    }

    return (
        <div className='app-body' style={{fontFamily: selectedFont}}>
            <div className="menu-bar">
                <div className="dropdown">
                    <button onClick={() => setShowFontMenu(prev => !prev)}>
                        Pick a font
                    </button>
                    { showFontMenu && (
                        <ul className="dropdown-menu">
                            {fontOptions.map(font => (
                                <li key={font} onClick={() => handleFontSelect(font)}>
                                    {font}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <h1 className="title">Type What You See :)</h1>
            <div className="main-content">
                {
                    (currentTime === 0) ? (
                        <Stats />
                    ) : (
                        <TextBlock currentTime={currentTime} setCurrentTime={setCurrentTime} difficulty='beginner' />
                    )
                }
            </div>
        </div>
    )
}

export default App
