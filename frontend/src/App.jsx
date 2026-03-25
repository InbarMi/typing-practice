// App.jsx - Main application component for the Typing Practice App

import {useCallback, useEffect, useState} from 'react';
import Login from './components/Login/Login.jsx'
import TextBlock from './components/TextBlock/TextBlock.jsx';
import Stats from './components/Stats/Stats.jsx';
import SettingsPanel from './components/SettingsPanel/SettingsPanel.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faVolumeOff, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import './App.css';

/**
 * App component serves as the root of the typing practice application.
 * It manages global state for game settings, session progress, and orchestrates
 * the rendering of different UI sections (settings, typing area, results).
 */
function App() {
    // States for user identity state
    const [userId, setUserId] = useState(null);
    const [isGuest, setIsGuest] = useState(false);

    const handleGuest = () => {
        setUserId("guest");
        setIsGuest(true);
    };

    // States for user-selected preferences and game status
    const [selectedFont, setSelectedFont] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [playSound, setPlaySound] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);

    // State to store typing session statistics
    const [stats, setStats] = useState({
        totalTyped: 0,
        totalCorrect: 0,
        time: selectedTime
    });

    // states to track if session is saved
    const [sessionSaved, setSessionSaved] = useState(false);
    const [sessionResult, setSessionResult] = useState(null)

    /**
     * Initializes a new typing session.
     * Sets the timer, resets statistics, and flags the game as started.
     */
    const startGame = useCallback(() => {
        setCurrentTime(selectedTime);
        setStats({
            totalTyped: 0,
            totalCorrect: 0,
            time: selectedTime
        });
        setGameStarted(true);
    }, [selectedTime, setCurrentTime, setStats])

    /**
     * Handles font selection from the settings.
     * @param {string} font - The name of the selected font.
     */
    const handleFontSelect = (font) => {
        setSelectedFont(font);
    }

    /**
     * Handles time duration selection.
     * @param {number} time - The selected time in seconds.
     */
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    }

    /**
     * Handles difficulty level selection.
     * @param {string} level - The selected difficulty level
     */
    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
    }

    /**
     * Toggles the typing sound effects on or off.
     */
    const handleToggleSound = () => {
        setPlaySound(prev => !prev);
    }

    /**
     * Resets the entire application state to its initial preferences.
     * Stops the current game and clears all session-specific data.
     */
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

    /**
     * When timer runs out, save session data
     */
    useEffect(() => {
        const saveSession = async () => {
            try {
                const userId = "test-user-1";

                const response = await fetch(`http://localhost:8080/sessions/user/${userId}`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        totalTyped: stats.totalTyped,
                        totalCorrect: stats.totalCorrect,
                        timeInSeconds: stats.time
                    })
                })

                if (!response.ok) {
                    throw new Error("Failed to save last session");
                }

                const data = await response.json();

                setSessionResult({
                    wpm: data.wpm,
                    accuracy: data.accuracy
                });
                setSessionSaved(true);
            } catch (error) {
                console.error("Failed to save last session", error);
            }
        };

        if (gameStarted && currentTime === 0 && !sessionSaved) {
            if (!isGuest) {
                saveSession();
            } else {
                // compute stats locally without persisting
                const accuracy = stats.totalTyped > 0
                    ? Math.round((stats.totalCorrect / stats.totalTyped) * 100)
                    : 0;
                
                const wpm = stats.time > 0
                    ? Math.round((stats.totalTyped / 5) / (stats.time / 60))
                    : 0;

                setSessionResult({
                    wpm: wpm,
                    accuracy: accuracy
                });
                setSessionSaved(true);
            }
        }
    }, [currentTime, gameStarted, sessionSaved, stats])

    /**
     * Effect to listen for the 'Enter' key press to restart the game after a session ends.
     */
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

    /**
     * Effect to synchronize `currentTime` and `stats.time` with `selectedTime`.
     * Ensures timer and stats reflect the chosen session duration.
     */
    useEffect(() => {
        setCurrentTime(selectedTime);
        setStats(prev => ({
            ...prev,
            time: selectedTime
        }));
    }, [selectedTime]);

    // props to pass to SettingsPanel
    const fontProps = { selected: selectedFont, onSelect: handleFontSelect }
    const timeProps = { selected: selectedTime, onSelect: handleTimeSelect }
    const levelProps = { selected: selectedLevel, onSelect: handleLevelSelect }

    return (
        <>
            <div className='header' style={{fontFamily: selectedFont}}>
                {/* Sound toggle button, visible only during an active game session */}
                {(gameStarted && currentTime !== 0) &&
                    <button className='soundBtn' onClick={handleToggleSound}>
                        {playSound ? (
                            <FontAwesomeIcon icon={faVolumeHigh}/>
                        ) : (
                            <FontAwesomeIcon icon={faVolumeOff} />
                        )
                        }
                    </button>
                }
                <h1 className='title'>{!gameStarted ? 'Pick Your Preferences:' : (currentTime === 0 ? 'Nice Job!' : 'Type What You See :)')}</h1>
            </div>
            <div className='app-body' style={{fontFamily: selectedFont}}>
                {!userId ? (
                    <Login onGuest={handleGuest} />
                ) : (
                    <>
                        {/* Conditionally renders SettingsPanel or game-related components */}
                        {!gameStarted ? (
                            <SettingsPanel
                                fontProps={fontProps}
                                timeProps={timeProps}
                                levelProps={levelProps}
                                startGame={startGame}
                            />
                        ) : (
                            <>
                                {/* Displays Stats when time is up, otherwise shows TextBlock for typing */}
                                {(currentTime === 0 && sessionSaved) ? (
                                    <Stats stats={sessionResult} />
                                ) : (
                                    <TextBlock
                                        currentTime={currentTime}
                                        setCurrentTime={setCurrentTime}
                                        setStats={setStats}
                                        difficulty={selectedLevel}
                                        playSound={playSound}
                                    />
                                    )}
                                <button className="refresh" onClick={handleRefresh}>
                                    ↻
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default App
