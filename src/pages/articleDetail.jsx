import React from 'react';
import NotFound from '../components/notFound';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../api/newsRequests';
import BasicCard from '../components/basicCard';

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
                <div className="m-5">
                    <h1>{article.headline}</h1>
                    <hr />
                    <div><b>Date Published:</b> {article.date_published}</div>
                    <div><b>Publisher:</b> {article.publisher}</div>
                    <hr />

                    <div className="row">
                        {/* need this to be a condition since the first time this renders, these fields may not be available */}
                        <BasicCard title="Sentiment" content={article.nlp ? article.nlp.sentiment : ''}></BasicCard>
                        <BasicCard title="Subjectivity" content={article.nlp ? article.nlp.subjectivity : ''}></BasicCard>
                        <BasicCard title="Topic" content={article.nlp ? article.nlp.topic_name : ''}></BasicCard>
                    </div>
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
