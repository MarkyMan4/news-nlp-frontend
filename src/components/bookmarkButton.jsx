import { useEffect, useState } from 'react';
import { isArticleSaved, saveArticle, removeSavedArticle } from '../api/newsRequests';

/*
This componenet assumes the user is logged in, since users can only bookmark articles if they are logged in.
It is up to the caller to make sure they are logged in.
This will create a button with the option to bookmark if the user doesn't have the article saved, otherwise
the button will have the option to delete the bookmark.

Must include an article ID as a prop
*/

function BookmarkButton(props) {
    const [articleIsSaved, setArticleIsSaved] = useState(false);

    useEffect(() => {
        isArticleSaved(props.articleId)
            .then(res => setArticleIsSaved(res))
            .catch(err => console.log(err));
    }, [props.articleId])

    // save an article (bookmark)
    const bookmark = () => {
        saveArticle(props.articleId)
            .then(() => setArticleIsSaved(true))
            .catch(err => console.log(err));
    }

    // delete a saved article (remove bookmark)
    const removeBookmark = () => {
        removeSavedArticle(props.articleId)
            .then(() => setArticleIsSaved(false))
            .catch(err => console.log(err));
    }

    return (
        <div>
            {
                /* Determine which button to return based on whether the user has the article saved */
                articleIsSaved ? 
                <button onClick={removeBookmark} className="btn btn-danger">Remove bookmark</button> :
                <button onClick={bookmark} className="btn btn-success">Bookmark</button>    
            }
        </div>
    )
}

export default BookmarkButton;
