import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticlePage, getTopicList } from '../api/newsRequests';
import ArticleCard from '../components/articleCard';
import NotFound from '../components/notFound';
// import { getUser } from '../api/authRequests';

function Articles() {
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [errorOccurred, setErrorOccurred] = useState(false); // used when the page number doesn't exist
    const [topics, setTopics] = useState([]);
    const { pageNum } = useParams();

    // filter variables
    const [selectedTopicFilter, setSelectedTopicFilter] = useState('');

    const filtersAsObject = () => {
        let filters = {};

        if(selectedTopicFilter !== '')
            filters['topic_name'] = selectedTopicFilter;

        return filters;
    }

    useEffect(() => {
        getArticlePage(pageNum, filtersAsObject())
            .then(res => {
                if(res.error) {
                    setErrorOccurred(true);
                }
                else {
                    setErrorOccurred(false);
                    setArticles(res.articles);
                    setTotalPages(res.total_pages);
                }
            });

        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
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

    const handleTopicSelect = (event) => {
        setSelectedTopicFilter(event.target.value);
    }

    const applyFilters = () => {
        getArticlePage(pageNum, filtersAsObject())
            .then(res => {
                setArticles(res.articles);
                setTotalPages(res.total_pages);
            });
    }

    const getArticlesOrNotFound = () => {
        let html;

        if(errorOccurred) {
            html = <NotFound></NotFound>;
        }
        else {
            html = (
                <div>
                    <div className="text-center">
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
                    </div>
                    <div className="row w-100">
                        <div className="text-center mt-4 col-md-3">
                            <div className="filter-controls shadow">
                                <h4>Select filters</h4>
                                <hr />
                                Topic:
                                <select className="ml-3" value={selectedTopicFilter} onChange={handleTopicSelect}>
                                    <option value="">All</option> {/* value is blank so it won't be included in query params */}
                                    {topics.map(topic => <option key={topic.topic_id} value={topic.topic_name}>{topic.topic_name}</option>)}
                                </select>
                                <br />
                                <button className="btn btn-success m-4" onClick={applyFilters}>Apply</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {articles.map((art, indx) => {
                                return <ArticleCard key={indx} article={art} />;
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return html;
    }

    return getArticlesOrNotFound();
}

export default Articles;
