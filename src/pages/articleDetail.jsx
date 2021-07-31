import React from 'react';
import NotFound from '../components/notFound';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById, getSimilarArticles, saveArticle, isArticleSaved, removeSavedArticle } from '../api/newsRequests';
import BasicCard from '../components/basicCard';
import ArticleCard from '../components/articleCard';
import BookmarkButton from '../components/bookmarkButton';
import { isUserAuthenticated } from '../utils/storage';


function ArticleDetail() {
    const [article, setArticle] = useState({});
    const [errorHasOccurred, setErrorHasOccurred] = useState(false); // used when the article ID doesn't exist
    const [similarArticles, setSimilarArticles] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { id } = useParams();
    
    // useEffect for handling whether the user is logged in
    useEffect(() => {
        isUserAuthenticated()
            .then(res => setIsLoggedIn(res))
            .catch(err => console.log(err));
    }, [localStorage.getItem('token')]);

    // runs whenever value of id changes, gets info about that article and the similar articles
    useEffect(() => {
        getArticleById(id)
            .then(res => {
                if(res.error) {
                    setErrorHasOccurred(true);
                }
                else {
                    setErrorHasOccurred(false);
                    setArticle(res);
                }
            });

        getSimilarArticles(id, 5) // only want to show 5 results on detail page
            .then(res => setSimilarArticles(res))
            .catch(err => console.log(err));
    }, [id]);

    // Creates the bookmark button. Whether it renders depends on whether the user is logged in.
    // It is only enabled if the user has not already bookmarked the article
    const getBookmarkButton = () => {
        let btn = <div></div>;

        if(isLoggedIn) {
            btn = <BookmarkButton articleId={id} />
        }

        return btn;
    }

    const infoStyle = {
        fontSize: "20px"
    }

    const getArticleDetailOrError = () => {
        let html;

        if(errorHasOccurred) {
            html = <NotFound></NotFound>;
        }
        else {
            html = (
                <div className="m-5">
                    <h1>{article.headline}</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-8">
                            <div style={infoStyle}><b>Date Published: </b>{article.date_published}</div>
                            <div style={infoStyle}><b>Publisher: </b>{article.publisher}</div>
                            <div style={infoStyle}><a href={article.url} target="_blank" rel="noreferrer">Link to article</a></div>
                        </div>
                        <div className="col-md-4 text-right">
                            {getBookmarkButton()}
                        </div>
                    </div>
                    <hr />

                    <div style={infoStyle}><b>Keywords: </b>{article.nlp ? article.nlp.keywords : ''}</div>
                    <div className="row">
                        {/* need this to be a condition since the first time this renders, these fields may not be available */}
                        <BasicCard title="Sentiment" content={article.nlp ? article.nlp.sentiment : ''}></BasicCard>
                        <BasicCard title="Subjectivity" content={article.nlp ? article.nlp.subjectivity : ''}></BasicCard>
                        <BasicCard title="Topic" content={article.nlp ? article.nlp.topic_name : ''}></BasicCard>
                    </div>
                    <hr />
                    <div>{article.content}</div>
                    <hr />
                    <h3 className="text-center">Similar Articles</h3>
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            {similarArticles ?
                                similarArticles.map((art, indx) => {
                                    return <ArticleCard key={indx} article={art} />;
                                })
                                : <h4>No similar articles</h4>
                            }
                        </div>
                    </div>
                </div>
            );
        }

        return html;
    }

    return getArticleDetailOrError();
}

export default ArticleDetail;
