import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticlePage } from '../api/newsRequests';
import ArticleCard from '../components/articleCard';
// import { getUser } from '../api/authRequests';

function Articles() {
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const { pageNum } = useParams();

    useEffect(() => {
        getArticlePage(pageNum).then(res => {
            setArticles(res.articles);
            setTotalPages(res.total_pages);
        });
    }, [pageNum]); // run the code in this useEffect whenever the value of pageNum changes

    const getFirstPageUrl = () => {
        return '/articles/1';
    }

    // only decrease the page number if it is not on the last page already
    const getPrevPageUrl = () => {
        let prevPageUrl = '/articles/';
        let currentPage = parseInt(pageNum);

        if(currentPage > 1)
            prevPageUrl += (currentPage - 1);
        else
            prevPageUrl += currentPage;

        return prevPageUrl;
    }

    // only incrememnt the page number if it is not on the last page already
    const getNextPageUrl = () => {
        let nextPageUrl = '/articles/';
        let currentPage = parseInt(pageNum);

        if(currentPage < totalPages)
            nextPageUrl += (currentPage + 1);
        else
            nextPageUrl += currentPage;

        return nextPageUrl;
    }

    const getLastPageUrl = () => {
        return '/articles/' + totalPages;
    }

    return (
        <div>
            <h1 className="text-center animate__animated animate__flipInX">Recent Articles</h1>
            <div className="d-flex justify-content-center">
                {/* should make the page nav controls a component so it can be reused */}
                <div>
                    <Link to={getFirstPageUrl} className="btn btn-outline-dark page-nav-btn">&lt;&lt;</Link>
                    <Link to={getPrevPageUrl} className="btn btn-outline-dark mr-5 page-nav-btn">&lt;</Link>
                    Page {pageNum} of {totalPages} 
                    <Link to={getNextPageUrl} className="btn btn-outline-dark ml-5 page-nav-btn">&gt;</Link>
                    <Link to={getLastPageUrl} className="btn btn-outline-dark page-nav-btn">&gt;&gt;</Link>
                </div>
            </div>
            {articles.map((art, indx) => {
                return <ArticleCard key={indx} article={art} />;
            })}
        </div>
    );
}

export default Articles;
