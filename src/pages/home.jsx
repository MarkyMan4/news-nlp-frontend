import React, { useEffect, useState } from 'react';
import { getArticles } from '../api/newsRequests';
// import { getUser } from '../api/authRequests';

function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles(1).then(res => setArticles(res));
        console.log(articles);
    }, []);

    return (
        <div>
            <h1 className="text-center animate__animated animate__flipInX">Welcome</h1>
            {articles.map(art => {
                return <p className="text-center">{art.headline}</p>;
            })}
        </div>
    );
}

export default Home;
