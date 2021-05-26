import React from 'react';
import NotFound from '../components/notFound';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../api/newsRequests';

function ArticleDetail() {
    const [article, setArticle] = useState({});
    const [errorHasOccurred, setErrorHasOccurred] = useState(false); // used when the article ID doesn't exist
    const { id } = useParams();

    useEffect(() => {
        getArticleById(id).then(res => {
            if(res.error) {
                setErrorHasOccurred(true);
            }
            else {
                setErrorHasOccurred(false);
                setArticle(res);
            }
        });
    }, [id]);

    const getArticleDetailOrError = () => {
        let html;

        if(errorHasOccurred) {
            html = <NotFound></NotFound>;
        }
        else {
            html = (
                <div>
                    <h1>{article.headline}</h1>
                    <hr />
                    <div><b>Date Published:</b> {article.date_published}</div>
                    <div><b>Publisher:</b> {article.publisher}</div>

                    {/* need this to be a condition since the first time this renders, these fields may not be available */}
                    {article.nlp ? <div><b>Sentiment:</b> {article.nlp.sentiment} -- <b>Subjectivity:</b> {article.nlp.subjectivity}</div> : <p></p>}
                    <hr />
                    <div>{article.content}</div>
                    
                </div>
            );
        }

        return html;
    }

    return getArticleDetailOrError();
}

export default ArticleDetail;
