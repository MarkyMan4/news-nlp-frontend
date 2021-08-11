import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getArticlePage, getTopicList } from '../api/newsRequests';
import ArticleCard from '../components/articleCard';
import NotFound from '../components/notFound';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Articles() {
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [errorOccurred, setErrorOccurred] = useState(false); // used when the page number doesn't exist
    const [topics, setTopics] = useState([]);
    const { pageNum } = useParams();

    // filter variables - these are used for keeping track of the value of UI components
    const [selectedTopicFilter, setSelectedTopicFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState(''); // date represented as string
    const [endDateFilter, setEndDateFilter] = useState(''); // date represented as string

    let query = useQuery();

    const filtersAsObject = () => {
        let filters = {};

        if(selectedTopicFilter !== '')
            filters['topicName'] = selectedTopicFilter;

        if(startDateFilter !== '')
            filters['startDate'] = startDateFilter;

        if(endDateFilter !== '')
            filters['endDate'] = endDateFilter;

        return filters;
    }

    // construct the query params that correspond to the page filters
    const getUrlWithFilters = (baseUrl = '/articles/1') => {
        let url = baseUrl;
        let queryParams = [];

        if(selectedTopicFilter !== '')
            queryParams.push(`topic=${selectedTopicFilter}`);

        if(startDateFilter !== '')
            queryParams.push(`startDate=${startDateFilter}`);

        if(endDateFilter !== '')
            queryParams.push(`endDate=${endDateFilter}`);

        if(queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }

        return url;
    }

    // fetch the topic list right away, only do this once
    useEffect(() => {
        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        let filters = {};

        // set filters right away if there are any available in query params
        // this sets the state based on query params and also constructs body of request
        // for getting a filtered set of articles
        // NOTE - this basically does the same work as filtersAsObject() to construct the request
        //        body. But it needs to be done using the values from the query params here because
        //        the state is set asynchronously, so the values can't be used directly after setting them
        if(query.get('topic')) {
            setSelectedTopicFilter(query.get('topic'));
            filters['topicName'] = query.get('topic');
        }
        if(query.get('startDate')) {
            setStartDateFilter(query.get('startDate'));
            filters['startDate'] = query.get('startDate');
        }
        if(query.get('endDate')) {
            setEndDateFilter(query.get('endDate'));
            filters['startDate'] = query.get('startDate');
        }
        
        getArticlePage(pageNum, filters)
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
    }, [pageNum]); // run the code in this useEffect whenever the value of pageNum changes

    const getFirstPageUrl = () => {
        let firstPageUrl = '/articles/1';

        // apply any query params if available
        firstPageUrl = getUrlWithFilters(firstPageUrl);

        return firstPageUrl;
    }

    // only decrease the page number if it is not on the last page already
    const getPrevPageUrl = () => {
        let prevPageUrl = '/articles/';
        let currentPage = parseInt(pageNum);

        if(currentPage > 1)
            prevPageUrl += (currentPage - 1);
        else
            prevPageUrl += currentPage;

        // apply any query params if available
        prevPageUrl = getUrlWithFilters(prevPageUrl);

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

        // apply any query params if available
        nextPageUrl = getUrlWithFilters(nextPageUrl);

        return nextPageUrl;
    }

    const getLastPageUrl = () => {
        let lastPageUrl = '/articles/' + totalPages;

        // apply any query params if available
        lastPageUrl = getUrlWithFilters(lastPageUrl);

        return lastPageUrl;
    }

    const handleTopicSelect = (event) => {
        setSelectedTopicFilter(event.target.value);
    }

    const handleStartDateSelect = (event) => {
        setStartDateFilter(event.target.value);
    }

    const handleEndDateSelect = (event) => {
        setEndDateFilter(event.target.value);
    }

    const goToFirstPageAndApplyFilters = (filters) => {
        getArticlePage(1, filters)
            .then(res => {
                setArticles(res.articles);
                setTotalPages(res.total_pages);
            });
    }

    const applyFilters = () => {
        goToFirstPageAndApplyFilters(filtersAsObject());
    }

    const clearFilters = () => {
        setSelectedTopicFilter('');
        setStartDateFilter('');
        setEndDateFilter('');

        // passing in empty objects since setting state is asyncronous,
        // so the old values won't be cleared out by the time this method is called
        goToFirstPageAndApplyFilters({});
    }

    // returns the Clear filters button if filters are currently in use, otherwise
    // return an empty div
    const getClearFiltersButtonOrEmpty = () => {
        const filters = filtersAsObject();
        let content = <div></div>;

        if(Object.keys(filters).length > 0) {
            content = <Link to="/articles/1" className="btn btn-danger mt-3" onClick={clearFilters}>Clear Filters</Link>;
        }

        return content;
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
                        <div className="d-flex justify-content-center animate__animated animate__fadeIn">
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
                        <div className="text-center mt-4 col-md-3 animate__animated animate__fadeIn">
                            <div className="filter-controls shadow">
                                <h4>Select filters</h4>
                                <hr />
                                <div className="row">
                                    <div className="col-md-4">
                                        <span className="align-middle float-right">Topic:</span><br />
                                    </div>
                                    <div className="col-md-8">
                                        <select className="ml-3" value={selectedTopicFilter} onChange={handleTopicSelect}>
                                            <option value="">All</option> {/* value is blank so it won't be included in query params */}
                                            {topics.map(topic => <option key={topic.topic_id} value={topic.topic_name}>{topic.topic_name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-4">
                                        <span className="align-middle float-right">Start date:</span>
                                    </div>
                                    <div className="col-md-8">
                                        <input type="date" value={startDateFilter} onChange={handleStartDateSelect} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-4">
                                        <span className="align-middle float-right">End date:</span>
                                    </div>
                                    <div className="col-md-8">
                                        <input type="date" value={endDateFilter} onChange={handleEndDateSelect} />
                                    </div>
                                </div>
                                <br />
                                {getClearFiltersButtonOrEmpty()}
                                <br />
                                <Link to={getUrlWithFilters()} className="btn btn-success mt-2 mb-4" onClick={applyFilters}>Apply</Link>
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
