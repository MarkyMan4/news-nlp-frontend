import React, { useState, useEffect } from 'react';
import '../App.css';
import { Nav, Navbar} from 'react-bootstrap';
import { logoutUser } from '../api/authRequests';
import { isUserAuthenticated } from '../utils/storage';


const logout = () => {
    logoutUser().then(res => {
        window.location.reload(false);
    });
}

function NavMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        isUserAuthenticated()
            .then(res => setIsLoggedIn(res))
            .catch(err => console.log(err));
    }, [localStorage.getItem('token')]);

    /*
     * Return a login or logout button based on whether the user is logged in
     */
    const getButton = () => {
        let button = <Nav.Link className="btn btn-outline-success" href="#/login">Login</Nav.Link>;

        if(isLoggedIn) {
            button = <button className="btn btn-outline-danger" onClick={logout}>Logout</button>;
        }

        return button;
    }

    return (

        <Navbar className="navbar-dark mb-5 py-2" bg="dark" expand="lg">
            <Navbar.Brand href="#/" className="ml-5">News NLP</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link className="nav-link" href="#/">Home</Nav.Link>
                    <Nav.Link className="nav-link" href="#/articles/1">Articles</Nav.Link>
                    <Nav.Link className="nav-link" href="#/visuals">Visualizations</Nav.Link>
                    <Nav.Link className="nav-link" href="#/analysis">Analysis</Nav.Link>
                    <Nav.Link className="nav-link" href="#/about">About</Nav.Link>
                    {isLoggedIn ? 
                        <Nav.Link className="nav-link" href="#/savedarticles">
                            <li>Saved Articles</li>
                        </Nav.Link> : <li></li>
                    }
                    {/* {isLoggedIn ? 
                        <Nav.Link className="nav-link" href="#/profile">
                            <li>Profile</li>
                        </Nav.Link> : <li></li>
                    } */}
                </Nav>
            </Navbar.Collapse>
            <span className="navbar-text mr-5">
                {getButton()}
            </span>
        </Navbar>
    );
}

export default NavMenu;
