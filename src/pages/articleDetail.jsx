import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../api/newsRequests';

function ArticleDetail() {
    const [article, setArticle] = useState({});
    const { id } = useParams();

    useEffect(() => {
        getArticleById(id).then(res => setArticle(res));
    }, [id]);

    return (
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
    )
}

export default ArticleDetail;
