import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { logoutUser } from '../api/authRequests';

function Nav() {
    const navStyle = {
        color: 'white'
    };

    const logout = () => {
        logoutUser().then(res => {
            window.location.reload(false);
        });
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow mb-4">
                <Link className="navbar-brand" to="/">
                    Some Site
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <Link style={navStyle} to="/">
                            <li className="mr-3">Home</li>
                        </Link>
                        <Link style={navStyle} to="/about">
                            <li>About</li>
                        </Link>
                    </ul>
                    <span className="navbar-text">
                        <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
                    </span>
                </div>
            </nav>
        </div>
    );
}

export default Nav;
