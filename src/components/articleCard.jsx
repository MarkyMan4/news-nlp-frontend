import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard(props) {
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
                </div>
            </div>
        </div>
    )
}

export default ArticleCard;