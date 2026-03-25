import './Login.css'

/**
 * 
 * Login component to either continue as a guest or login to track stats across sessions
 */
function Login({ onLogin, onGuest }) {
    return (
        <div className="loginContainer">
            <button onClick={onLogin}>Login Here</button>
            <button onClick={onGuest}>Continue as Guest</button>
        </div>
    )
}

export default Login