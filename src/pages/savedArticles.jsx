import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
import { listSavedArticles } from '../api/newsRequests';
import NotFound from '../components/notFound';
import ArticleCard from '../components/articleCard';
// import { Redirect } from 'react-router-dom';

function SavedArticles() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        isUserAuthenticated()
            .then(res => {
                setIsLoggedIn(res)
            })
            .catch(err => console.log(err));

        listSavedArticles()
            .then(res => setArticles(res))
            .catch(err => console.log(err));
    }, [isLoggedIn]);

    const getPageContent = () => {
        let content;

        if(isLoggedIn) {
            content = (
                <div>
                    <h1 className="text-center animate__animated animate__flipInX">Your Saved Articles</h1>
                    {articles.map((article, indx) => {
                        return (
                            <div>
                                <h1>article ID: {article.id}</h1>
                            </div>
                        )
                    })}
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
