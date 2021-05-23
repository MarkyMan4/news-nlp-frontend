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
    }, [currentPage]); // run the code in this useEffect whenever the value of currentPage changes

    const goToPreviousPage = () => {
        setCurrentPage((prevVal) => prevVal - 1);
    }

    const goToNextPage = () => {
        setCurrentPage((prevVal) => prevVal + 1);
    }

    const goToFirstPage = () => {
        setCurrentPage(1);
    }

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    }

    return (
        <div>
            <h1 className="text-center animate__animated animate__flipInX">Recent Articles</h1>
            <div className="d-flex justify-content-center">
                {/* should make the page nav controls a component so it can be reused */}
                <div>
                    <button onClick={goToFirstPage} className="btn btn-outline-dark page-nav-btn">&lt;&lt;</button>
                    <button onClick={currentPage > 1 ? goToPreviousPage : () => {}} className="btn btn-outline-dark mr-5 page-nav-btn">&lt;</button>
                    Page {currentPage} of {totalPages} 
                    <button onClick={currentPage < totalPages ? goToNextPage : () => {}} className="btn btn-outline-dark ml-5 page-nav-btn">&gt;</button>
                    <button onClick={goToLastPage} className="btn btn-outline-dark page-nav-btn">&gt;&gt;</button>
                </div>
            </div>
            {articles.map((art, indx) => {
                return <ArticleCard key={indx} article={art} />;
            })}
        </div>
    );
}

export default Home;
