import React, { useState } from 'react'
import axios from 'axios'
import '../styles/LoginPage.css'

function LoginPage() {
    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            // POST method w/ username and pw
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            // if successful
            const { token } = response.data; // extract token from response
            localStorage.setItem('token', token); // Save in localStorage
            alert('Login successful'); // Alert a successful login
        } catch (error) {
            console.error("Login Failed"); // log error
        }
    };

    return (
        <div className="loginpage-div">
            <h2 className='login-heading'>Login Page</h2>
            <form onSubmit={handleLogin} className='login-form'>
                <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='form-child' id='username-login-input'/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-child' id='password-login-input'/>
                <button type='submit' className='form-child' id='login-btn'>Log in</button>
            </form>
        </div>
    );
}

export default LoginPage;