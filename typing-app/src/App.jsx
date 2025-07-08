import {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import TextBlock from './components/TextBlock/TextBlock.jsx';
import Stats from './components/Stats/Stats.jsx';
import SettingsPanel from './components/SettingsPanel/SettingsPanel.jsx';

function App() {
    const [selectedFont, setSelectedFont] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const [stats, setStats] = useState({
        totalTyped: 0,
        totalCorrect: 0,
        time: selectedTime
    });

    const [gameStarted, setGameStarted] = useState(false);

    const startGame = useCallback(() => {
        setCurrentTime(selectedTime);
        setStats({
            totalTyped: 0,
            totalCorrect: 0,
            time: selectedTime
        });
        setGameStarted(true);
    }, [selectedTime, setCurrentTime, setStats])


    const handleFontSelect = (font) => {
        setSelectedFont(font);
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    }

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
    }

    const handleRefresh = useCallback(() => {
        setGameStarted(false);
        setCurrentTime(selectedTime);
        setStats({
            totalTyped: 0,
            totalCorrect: 0,
            time: selectedTime
        });
        setSelectedFont(null);
        setSelectedTime(null);
        setSelectedLevel(null);
    }, [selectedTime]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (gameStarted && currentTime === 0 && event.key === 'Enter') {
                handleRefresh();
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameStarted, currentTime, handleRefresh]);

    useEffect(() => {
        setCurrentTime(selectedTime);
        setStats(prev => ({
            ...prev,
            time: selectedTime
        }));
    }, [selectedTime]);

    const fontProps = {
        selected: selectedFont,
        onSelect: handleFontSelect
    }

    const timeProps = {
        selected: selectedTime,
        onSelect: handleTimeSelect
    }

    const levelProps = {
        selected: selectedLevel,
        onSelect: handleLevelSelect
    }

    return (
        <div style={{fontFamily: selectedFont}}>
            <div className='app-body' style={{fontFamily: selectedFont}}>
                <h1 className='title'>{!gameStarted ? 'Pick your Preferences:' : 'Type What You See :)'}</h1>
                {!gameStarted ? (
                    <SettingsPanel
                        fontProps={fontProps}
                        timeProps={timeProps}
                        levelProps={levelProps}
                        startGame={startGame}
                    />
                ) : (
                    <>
                        {
                            (currentTime === 0) ? (
                                <Stats stats={stats} />
                            ) : (
                                <TextBlock
                                    currentTime={currentTime}
                                    setCurrentTime={setCurrentTime}
                                    setStats={setStats}
                                    difficulty={selectedLevel}
                                />
                            )
                        }
                        <button className="refresh" onClick={handleRefresh}>
                            ↻
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default App
