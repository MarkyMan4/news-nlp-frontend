import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getArticlePage, getPublishers, getTopicList } from '../api/newsRequests';
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
    const [publishers, setPublishers] = useState([]);
    const { pageNum } = useParams();

    // filter variables - these are used for keeping track of the value of UI components
    const [selectedTopicFilter, setSelectedTopicFilter] = useState('');
    const [publisherFilter, setPublisherFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState(''); // date represented as string
    const [endDateFilter, setEndDateFilter] = useState(''); // date represented as string
    const [searchText, setSearchText] = useState('');

    let query = useQuery();

    const filtersAsObject = () => {
        let filters = {};

        if(selectedTopicFilter !== '')
            filters['topicName'] = selectedTopicFilter;

        if(publisherFilter !== '')
            filters['publisher'] = publisherFilter

        if(startDateFilter !== '')
            filters['startDate'] = startDateFilter;

        if(endDateFilter !== '')
            filters['endDate'] = endDateFilter;

        return filters;
    }

    /*
     * Construct the query params that correspond to the page filters
     * This only includes the filter options for topic and dates. The reasons
     * for this is I don't want the text entered in the search bar to get applied
     * when the user applies these filters.
     */
    const getUrlWithFilters = (baseUrl = '/articles/1') => {
        let url = baseUrl;
        let queryParams = [];

        // check for existing query params and make sure they are included
        if(query.get('headlineLike')) {
            const appliedHeadlineFilter = query.get('headlineLike');
            queryParams.push(`headlineLike=${appliedHeadlineFilter}`);
        }

        // add selected filters to query params
        if(selectedTopicFilter !== '')
            queryParams.push(`topic=${selectedTopicFilter}`);

        if(publisherFilter !== '')
            queryParams.push(`publisher=${publisherFilter}`);

        if(startDateFilter !== '')
            queryParams.push(`startDate=${startDateFilter}`);

        if(endDateFilter !== '')
            queryParams.push(`endDate=${endDateFilter}`);

        if(queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }

        return url;
    }

    /*
     * Add the search text to the URL params when the user clicks the "Search" button
     */
    const getUrlWithFiltersIncludingSearch = (baseUrl = '/articles/1') => {
        let url = baseUrl;
        let queryParams = []; 

        // get any other filters that have been applied
        if(query.get('topic')) {
            const appliedTopicFilter = query.get('topic');
            queryParams.push(`topic=${appliedTopicFilter}`);
        }

        if(query.get('publisher')) {
            const appliedPublisherFilter = query.get('publisher');
            queryParams.push(`publisher=${appliedPublisherFilter}`);
        }

        if(query.get('startDate')) {
            const appliedStartDateFilter = query.get('topic');
            queryParams.push(`startDate=${appliedStartDateFilter}`);
        }

        if(query.get('endDate')) {
            const appliedEndDateFilter = query.get('topic');
            queryParams.push(`startDate=${appliedEndDateFilter}`);
        }

        // add search text to query params if it's not empty
        if(searchText.trim() !== '') {
            queryParams.push(`headlineLike=${searchText.trim()}`);
        }

        if(queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }

        return url;
    }

    // fetch the topic list and publishers
    useEffect(() => {
        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
        
        getPublishers()
            .then(res => setPublishers(res.publishers))
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
        
        if(query.get('publisher')) {
            setPublisherFilter(query.get('publisher'));
            filters['publisher'] = query.get('publisher');
        }

        if(query.get('startDate')) {
            setStartDateFilter(query.get('startDate'));
            filters['startDate'] = query.get('startDate');
        }
        if(query.get('endDate')) {
            setEndDateFilter(query.get('endDate'));
            filters['startDate'] = query.get('startDate');
        }

        if(query.get('headlineLike')) {
            setSearchText(query.get('headlineLike'));
            filters['headlineLike'] = query.get('headlineLike');
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

    /*
     * Page navigation menu shows 7 page links at a time.
     * The current page is highlighted
     */
    const getPageButtons = () => {
        const currentPage = parseInt(pageNum);
        const maxPageLinks = 7; // can adjust this to show more or less page links
        const numPageLinks = maxPageLinks > totalPages ? totalPages : maxPageLinks;
        let pagesLeftOfCurrent = Math.floor(numPageLinks / 2);
        let pagesRightOfCurrent = Math.floor(numPageLinks / 2);
        let pageNums = [];

        // We know the current page the user is on.
        // This calculates how many page links should be on the left and right hand side of 
        // the current page in the links. This is done to make sure the page links don't give
        // the user the option to select a page below 1 or greater than the max number of pages
        while(currentPage - pagesLeftOfCurrent <= 0) {
            pagesLeftOfCurrent--;
            pagesRightOfCurrent++;
        }

        while(currentPage + pagesRightOfCurrent > totalPages) {
            pagesRightOfCurrent--;
            pagesLeftOfCurrent++;
        }

        for(let i = currentPage - pagesLeftOfCurrent; i <= currentPage + pagesRightOfCurrent; i++) {
            pageNums.push(i);
        }

        return (
            <span>
                {pageNums.map(num => 
                    <Link 
                        to={"/articles/" + num} 
                        className={num === currentPage ? "btn btn-dark page-nav-btn" : "btn btn-outline-dark page-nav-btn"}>
                    {num}
                    </Link>
                )}
            </span>
        );
    }

    const handleTopicSelect = (event) => {
        setSelectedTopicFilter(event.target.value);
    }

    const handlePublisherSelect = (event) => {
        setPublisherFilter(event.target.value);
    }

    const handleStartDateSelect = (event) => {
        setStartDateFilter(event.target.value);
    }

    const handleEndDateSelect = (event) => {
        setEndDateFilter(event.target.value);
    }

    const handleSearchInput = (event) => {
        setSearchText(event.target.value);
    }

    const goToFirstPageAndApplyFilters = (filters) => {
        getArticlePage(1, filters)
            .then(res => {
                setArticles(res.articles);
                setTotalPages(res.total_pages);
            });
    }

    const handleSearchButtonClicked = () => {
        let filters = filtersAsObject();

        if(searchText.trim() !== '') {
            filters['headlineLike'] = searchText.trim();
        }

        goToFirstPageAndApplyFilters(filters);
    }

    const applyFilters = () => {
        goToFirstPageAndApplyFilters(filtersAsObject());
    }

    const clearFilters = () => {
        setSelectedTopicFilter('');
        setPublisherFilter('');
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
                    {/* page navigation buttons */}
                    <div className="text-center">
                        <h1 className="text-center animate__animated animate__flipInX">Browse Articles</h1>
                        <div className="d-flex justify-content-center animate__animated animate__fadeIn">
                            {/* should make the page nav controls a component so it can be reused */}
                            <div>
                                <Link to={getFirstPageUrl} className="btn btn-outline-dark page-nav-btn">&lt;&lt;</Link>
                                <Link to={getPrevPageUrl} className="btn btn-outline-dark mr-2 page-nav-btn">&lt;</Link>
                                {getPageButtons()}
                                <Link to={getNextPageUrl} className="btn btn-outline-dark ml-2 page-nav-btn">&gt;</Link>
                                <Link to={getLastPageUrl} className="btn btn-outline-dark page-nav-btn">&gt;&gt;</Link>
                            </div>
                        </div>
                        <input value={searchText} onChange={handleSearchInput} className="mt-4 mr-3" placeholder="search by headline" />
                        <Link to={getUrlWithFiltersIncludingSearch()} onClick={handleSearchButtonClicked} className="btn btn-success">Search</Link>
                    </div>
                    {/* filter controls */}
                    <div className="row w-100">
                        <div className="text-center mt-4 col-md-3 animate__animated animate__fadeIn">
                            <div className="filter-controls shadow">
                                <h4>Select filters</h4>
                                <hr />
                                <div className="row w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">Topic:</span><br />
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <select className="float-left" value={selectedTopicFilter} onChange={handleTopicSelect}>
                                            <option value="">All</option> {/* value is blank so it won't be included in query params */}
                                            {topics.map(topic => <option key={topic.topic_id} value={topic.topic_name}>{topic.topic_name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-2 w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">Publisher:</span><br />
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <select className="float-left" value={publisherFilter} onChange={handlePublisherSelect}>
                                            <option value="">All</option> {/* value is blank so it won't be included in query params */}
                                            {publishers.map((pub, indx) => <option key={indx} value={pub}>{pub}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mt-2 w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">Start date:</span>
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <input className="float-left" type="date" value={startDateFilter} onChange={handleStartDateSelect} />
                                    </div>
                                </div>
                                <div className="row mt-2 w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">End date:</span>
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <input className="float-left" type="date" value={endDateFilter} onChange={handleEndDateSelect} />
                                    </div>
                                </div>
                                <div className="row mt-2 w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">Sentiment:</span>
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <input className="float-left" type="number" min="-1" max="1"/>
                                    </div>
                                </div>
                                <div className="row mt-2 w-100">
                                    <div className="col-md-4 col-sm-4">
                                        <span className="align-middle float-right">Subjectivity:</span>
                                    </div>
                                    <div className="col-md-8 col-sm-8">
                                        <input className="float-left" type="number" min="0" max="1"/>
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
