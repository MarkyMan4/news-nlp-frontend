import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './bookmarkButton';
import { isUserAuthenticated } from '../utils/storage';

function ArticleCard(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // useEffect for handling whether the user is logged in
    useEffect(() => {
        isUserAuthenticated()
            .then(res => setIsLoggedIn(res))
            .catch(err => console.log(err));
    }, [localStorage.getItem('token')]);

    // style for placing the Bookmark button in the bottom right corner of the card
    const bottomRightAlign = {
        position: "absolute",
        bottom: 0,
        right: 0
    }

    return (
        <div className="article-card shadow animate__animated animate__fadeInUp">
            <Link to={"/article/" + props.article.id}><h4>{props.article.headline}</h4></Link>
            <div><b>Keywords: </b>{props.article.nlp.keywords}</div>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <div><b>Date Published:</b> {props.article.date_published}</div>
                    <div><b>Publisher: </b>{props.article.publisher}</div>
                    <div><b>Sentiment: </b>{props.article.nlp.sentiment} -- <b>Subjectivity: </b>{props.article.nlp.subjectivity}</div>
                </div>
                <div className="col-md-6 text-right">
                    {props.article.nlp.topic_name}

                    {
                        /* only show bookmark button if user is logged in */
                        isLoggedIn ? 
                            <div style={bottomRightAlign} className="col-md-6">
                                <BookmarkButton articleId={props.article.id} />
                            </div>
                        : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticleCard;