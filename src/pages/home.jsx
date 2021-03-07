import React, { useEffect, useState } from 'react';
import { getUser } from '../api/authRequests';

function Home() {
    const [username, setUsername] = useState('');        

    useEffect(() => {
        getUser().then(res => {
            setUsername(res);
        })
    }, []);

    /*
     * This is just a barebones home page with a logout button.
     * Logging out redirects to the home page.
     */
    return (
        <div>
            <h1>Welcome, {username}</h1>
        </div>
    );
}

export default Home;
