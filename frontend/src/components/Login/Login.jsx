import './Login.css';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/**
 * Login component to either continue as a guest or login to track stats across sessions
 */
function Login({ onGuest, setUserId }) {
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUserId(user.uid);
        } catch (error) {
            console.error("Login failed: ", error);
        }
    }

    return (
        <div className="loginContainer">
            <button onClick={handleGoogleLogin}>Login with Google Here</button>
            <button onClick={onGuest}>Continue as Guest</button>
        </div>
    )
}

export default Login