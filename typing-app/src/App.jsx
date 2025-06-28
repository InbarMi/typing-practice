import {useEffect, useState} from 'react';
import './App.css';
import TextBlock from './TextBlock.jsx';
import Stats from './Stats.jsx';

function App() {

    const fontOptions = ['monospace', 'serif', 'sans-serif'];
    const timeOptions = [30, 60, 90] // seconds
    const difficultyOptions = ['easy', 'normal', 'hard'];

    const [selectedFont, setSelectedFont] = useState('monospace');
    const [showFontMenu, setShowFontMenu] = useState(false);

    const [selectedTime, setSelectedTime] = useState(30);
    const [currentTime, setCurrentTime] = useState(selectedTime);
    const [showTimeMenu, setShowTimeMenu] = useState(false);

    const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
    const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);

    const [stats, setStats] = useState({
        totalTyped: 0,
        totalCorrect: 0,
        time: selectedTime
    });

    const handleFontSelect = (font) => {
        setSelectedFont(font);
        setShowFontMenu(false);
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setShowTimeMenu(false);
    }

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setShowDifficultyMenu(false);
    }

    const handleRefresh = () => {
        window.location.reload();
    }

    useEffect(() => {
        setCurrentTime(selectedTime);
        setStats(prev => ({
            ...prev,
            time: selectedTime
        }));
    }, [selectedTime]);

    return (
        <div className='app-body' style={{fontFamily: selectedFont}}>
            <div className="menu-bar">
                <div className="dropdown-wrapper">
                    <button onClick={() => setShowFontMenu(prev => !prev)}>
                        Pick a font
                    </button>
                    { showFontMenu && (
                        <ul className="dropdown-menu" id="fontsMenu" >
                            {fontOptions.map(font => (
                                <li key={font} onClick={() => handleFontSelect(font)}>
                                    {font}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="dropdown-wrapper">
                    <button onClick={() => setShowTimeMenu(prev => !prev)}>
                        {selectedTime} seconds
                    </button>
                    { showTimeMenu && (
                        <ul className="dropdown-menu" id="timeMenu">
                            {timeOptions.map(time => (
                                <li key={time} onClick={() => handleTimeSelect(time)}>
                                    {time} seconds
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="dropdown-wrapper">
                    <button onClick={() => setShowDifficultyMenu(prev => !prev)}>
                        Difficulty: {selectedDifficulty}
                    </button>
                    { showDifficultyMenu && (
                        <ul className="dropdown-menu" id="levelsMenu">
                            {difficultyOptions.map(level => (
                                <li key={level} onClick={() => handleDifficultySelect(level)}>
                                    {level}
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
                            difficulty={selectedDifficulty}
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
