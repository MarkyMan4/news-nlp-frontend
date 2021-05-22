import React from 'react';
import { useParams } from 'react-router-dom';

function ArticleDetail() {
    const { id } = useParams();

    return (
        <div>
            Article ID: {id}
        </div>
    )
}

export default ArticleDetail;
