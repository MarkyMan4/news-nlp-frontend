import { useState, useEffect } from 'react';
import { isUserAuthenticated } from '../utils/storage';
import { listSavedArticles, clearAllSavedArticles } from '../api/newsRequests';
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

    const handleClearBtnClicked = () => {
        // call method to clear saved articles and set the articles to empty array
        clearAllSavedArticles()
            .then(res => setArticles([]))
            .catch(err => console.log(err));
    }

    const getPageContent = () => {
        let content;

        if(isLoggedIn) {
            content = (
                <div>
                    <h1 className="text-center animate__animated animate__flipInX">Your Saved Articles</h1>
                    <hr />
                    <div className="row w-100">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            {articles.length > 0 ?
                                /* display saved articles if the user has any savd */
                                <div>
                                    <div className="text-center">
                                        <button onClick={handleClearBtnClicked} className="btn btn-danger">Clear Saved Articles</button>
                                    </div>
                                    { articles.map((article, indx) => <ArticleCard key={indx} article={article} />) } 
                                </div> :
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
