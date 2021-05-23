import React, { useEffect, useState } from 'react';
import { getArticlePage } from '../api/newsRequests';
import ArticleCard from '../components/articleCard';
// import { getUser } from '../api/authRequests';

function Home() {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // initialize to 1 so it starts at first page
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getArticlePage(currentPage).then(res => {
            setArticles(res.articles);
            setTotalPages(res.total_pages);
        });
    }, []);

    return (
        <div>
            <h1 className="text-center animate__animated animate__flipInX">Recent Articles</h1>
            <div className="text-center">Page {currentPage} of {totalPages}</div>
            {articles.map((art, indx) => {
                return <ArticleCard key={indx} article={art} />;
            })}
        </div>
    );
}

export default Home;
