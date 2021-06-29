import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
import NotFound from '../components/notFound';
// import { Redirect } from 'react-router-dom';

function SavedArticles() {
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
            content = (
                <div>
                    <h1 className="text-center animate__animated animate__flipInX">Saved Articles</h1>
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

export default SavedArticles;
