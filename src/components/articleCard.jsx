import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard(props) {
    return (
        <div className="article-card shadow">
            <Link to={"/article/" + props.article.id}><h4>{props.article.headline}</h4></Link>
            <hr />
            <div><b>Date Published:</b> {props.article.date_published}</div>
            <div><b>Publisher:</b> {props.article.publisher}</div>
            <div><b>Sentiment:</b> {props.article.nlp.sentiment} -- <b>Subjectivity:</b> {props.article.nlp.subjectivity}</div>
        </div>
    )
}

export default ArticleCard;