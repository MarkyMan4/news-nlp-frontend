import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
import { getUser } from '../api/authRequests';
import NotFound from '../components/notFound';

function Profile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        isUserAuthenticated()
            .then(res => setIsLoggedIn(res))
            .catch(err => console.log(err));
    }, [isLoggedIn]);

    useEffect(() => {
        if(isLoggedIn) {
            getUser()
                .then(res => setUserInfo(res))
                .catch(err => console.log(err));
        }
    }, []);

    const getPageContent = () => {
        let content;

        if(isLoggedIn) {
            content = (
                <div className="text-center">
                    <h4>Username</h4>
                    {userInfo.username}

                    <h4 className="mt-4">Email</h4>
                    {userInfo.email}
                </div>
            );
        }
        else {
            content = <NotFound></NotFound>;
        }

        return content;
    }

    return getPageContent();
}

export default Profile;
