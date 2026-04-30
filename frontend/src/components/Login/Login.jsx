import './Login.css';
import { useState } from 'react';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/**
 * Login component to either continue as a guest or login to track stats across sessions
 */
function Login({ onGuest, setUserId }) {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUserId(user.uid);
        } catch (error) {
            console.error("Login failed: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="loginContainer">
            <button onClick={handleGoogleLogin} disabled={loading}>Login with Google Here</button>
            <button onClick={onGuest}>Continue as Guest</button>
        </div>
    )
}

export default Login