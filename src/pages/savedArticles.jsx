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
                    <hr />
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            {articles.length > 0 ?
                                /* display saved articles if the user has any savd */
                                articles.map((article, indx) => {
                                    return (
                                        <ArticleCard key={indx} article={article} />
                                    )
                                }) :
                                /* otherwise tell them how to save articles */
                                <h3 className="text-center">You haven't bookmarked any articles! Click "Bookmark" when viewing an article to save it.</h3>
                            }
                        </div>
                    </div>
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
