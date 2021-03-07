import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticateUser } from '../api/authRequests';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidLoginText, setInvalidLoginText] = useState('');


    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    }

    /*
     * Uses the username and password to try to authenticate the user
     * Update this so it doesn't have to refresh the window after loggin in.
     */
    const handleSubmit = (event) => {
        authenticateUser(username, password).then(res => {
            if(res) {
                window.location.reload(false);
            }
            else {
                setInvalidLoginText('Invalid username or password!');
            }
        });
    }

    return (
        <div className="row">
            <div className="col-md-4"></div>
            <div className="mt-5 border shadow text-center col-md-4">
                <h1 className="mt-2">Login</h1>
                <hr />
                <div className="mt-2">
                    <form>
                        <label>
                            <b>Username</b> <br />
                            <input type="text" value={username} onChange={handleUsernameInput} />
                        </label>
                        <br />
                        <label className="mt-3">
                            <b>Password</b> <br />
                            <input type="password" value={password} onChange={handlePasswordInput} />
                        </label>
                    </form>
                    <p className="mt-2 text-danger">{invalidLoginText}</p>
                    <input className="btn btn-primary mt-3" onClick={handleSubmit} type="submit" value="Login" />
                </div>
                <Link to="/register"><p className="mt-4">Don't have an account? Sign up</p></Link>
            </div>
            <div className="col-md-4"></div>
        </div>
    );
}

export default Login;
