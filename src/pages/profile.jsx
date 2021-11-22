import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
import NotFound from '../components/notFound';

function Profile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        isUserAuthenticated()
            .then(res => {
                setIsLoggedIn(res)
            })
            .catch(err => console.log(err));
    }, [isLoggedIn]);

    const getPageContent = () => {
        let content;

        if(isLoggedIn) {
            content = <div><h1>Profile</h1></div>;
        }
        else {
            content = <NotFound></NotFound>;
        }

        return content;
    }

    return getPageContent();
}

export default Profile;
