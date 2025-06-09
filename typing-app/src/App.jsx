import {useEffect, useState} from 'react';
import './App.css';
import TextBlock from './TextBlock.jsx';

function App() {
    const [selectedFont, setSelectedFont] = useState('monospace');
    const [showFontMenu, setShowFontMenu] = useState(false);

    const fontOptions = ['monospace', 'serif', 'sans-serif'];

    const handleFontSelect = (font) => {
        setSelectedFont(font);
        setShowFontMenu(false);
    }

    return (
        <>
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
            <div className="main-content" style={{fontFamily: selectedFont}}>
                <h1>Type What You See :)</h1>
                <TextBlock />
            </div>
        </>
    )
}

export default App
