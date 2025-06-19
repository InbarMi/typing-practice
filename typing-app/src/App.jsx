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
    const [stats, setStats] = useState({
        totalTyped: 0,
        totalCorrect: 0,
        time: initialTime
    });

    const handleFontSelect = (font) => {
        setSelectedFont(font);
        setShowFontMenu(false);
    }

    const handleRefresh = () => {
        window.location.reload();
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
                        <Stats stats={stats} />
                    ) : (
                        <TextBlock
                            currentTime={currentTime}
                            setCurrentTime={setCurrentTime}
                            difficulty='beginner'
                            setStats={setStats}
                        />
                    )
                }
                <button className="refresh" onClick={handleRefresh}>
                    ↻
                </button>
            </div>
        </div>
    )
}

export default App
