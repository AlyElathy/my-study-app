import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegistrationPage.css'

function RegistrationPage() {
    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username, 
                password
            });
            alert(response.data.message);
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h2 className='register-heading'>Registration Page</h2>
            <form onSubmit={handleRegistration} className='login-form'>
                <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} id='username-register-input' className='form-child'/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} id='password-register-input' className='form-child'/>
                <button type='submit' id='register-btn' className='form-child'>Register</button>
            </form>
        </div>
    );
}

export default RegistrationPage;