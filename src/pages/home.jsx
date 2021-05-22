import React, { useEffect, useState } from 'react';
import { getArticles } from '../api/newsRequests';
import ArticleCard from '../components/articleCard';
// import { getUser } from '../api/authRequests';

function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles(1).then(res => setArticles(res));
    }, []);

    return (
        <div>
            <h1 className="text-center animate__animated animate__flipInX">Recent Articles</h1>
            {articles.map((art, indx) => {
                return <ArticleCard key={indx} article={art} />;
            })}
        </div>
    );
}

export default Home;
