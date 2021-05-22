import React from 'react';

function ArticleCard(props) {
    return (
        <div className="article-card shadow">
            <h4>{props.article.headline}</h4>
            <div>Date Published: {props.article.date_published}</div>
            <div>Publisher: {props.article.publisher}</div>
            <div>Sentiment: {props.article.sentiment} -- Subjectivity: {props.article.subjectivity}</div>
        </div>
    )
}

export default ArticleCard;