import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
// import { Redirect } from 'react-router-dom';

function SavedArticles() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        isUserAuthenticated()
            .then(res => {
                console.log(`in useeffect: ${isLoggedIn}`)
                setIsLoggedIn(res)
            })
            .catch(err => console.log(err));
    }, []);

    const getPageContent = () => {
        let content;

        console.log(`in method: ${isLoggedIn}`);

        if(isLoggedIn) {
            content = (
                <div>
                    <h1 className="text-center animate__animated animate__flipInX">Saved Articles</h1>
                </div>
            );
        }
        else {
            content = <h1>you must be logged in to save articles</h1>;
        }

        return content;
    }

    return getPageContent();
}

export default SavedArticles;
