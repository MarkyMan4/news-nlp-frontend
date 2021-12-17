import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import DonutChart from '../components/donutChart';
import ScatterPlot from '../components/scatterPlot';
import LineChart from '../components/lineChart';
import { 
    getArticleCountsByTopic, 
    getArticleCountsBySentiment, 
    getSentimentAndSubjectivity,
    getCountByTopicAndDate,
    getSavedArticleCountsByTopic,
    getSavedArticleCountsBySentiment,
    getSavedArticleSentimentAndSubjectivity,
    getSavedArticleCountByTopicAndDate,
    getTopicList
} from '../api/newsRequests';
import { isUserAuthenticated } from '../utils/storage';

// const topics = ['Coronavirus', 'Social', 'Government/Politics', 'Science/Tech']; // TODO: need to get this from backend instead of hardcoding

function Visuals() {
    const countByTopicBarChartRef = useRef(null);
    const countBySentimentBarChartRef = useRef(null);
    const subjectivityBySentimentScatterRef = useRef(null);
    const topicCountsOverTimeRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [articleCountsByTopic, setArticleCountsByTopic] = useState([]);
    const [articleCountsBySentiment, setArticleCountsBySentiment] = useState([]);
    const [subjectivityBySentiment, setSubjectivityBySentiment] = useState([]);
    const [topicCountsOverTime, setTopicCountsOverTime] = useState([]);

    const [selectedTimeFrameFilter, setSelectedTimeFrameFilter] = useState('all');
    const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');
    const [topics, setTopics] = useState([]); // all available topics
    const [topicsInData, setTopicsInData] = useState([]); // topics that appear in the data
    const [savedArticlesOnly, setSavedArticlesOnly] = useState(false);

    // retrieve list of topics
    useEffect(() => {
        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        isUserAuthenticated()
            .then(res => setIsLoggedIn(res))
            .catch(err => console.log(err));
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        if(savedArticlesOnly) {
            getSavedArticleCountsByTopic(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => {
                    // format data in a nice way for the bar chart (list of data)
                    // [{<topic1>: <count1>}, {<topic2>: <count2>}, ...]
                    const chartData = Object.keys(res).map(topic => {return {x: topic, y: res[topic]}});

                    setArticleCountsByTopic(chartData);
                })
                .catch(err => console.log(err));

            // retrieve article counts by sentiment
            getSavedArticleCountsBySentiment(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => setArticleCountsBySentiment(res))
                .catch(err => console.log(err));

            // retrieve sentiment and subjectivity data for scatter plot
            getSavedArticleSentimentAndSubjectivity(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => setSubjectivityBySentiment(res))
                .catch(err => console.log(err));

            // retrieve counts by date for each topic
            // this also needs to be formatted so each topic contains an array of data points with x and y as the attributes
            getSavedArticleCountByTopicAndDate(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => parseTopicCountsByDate(res))
                .catch(err => console.log(err));
        }
        else {
            // retrieve article count for each topic
            getArticleCountsByTopic(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => {
                    // format data in a nice way for the bar chart (list of data)
                    // [{<topic1>: <count1>}, {<topic2>: <count2>}, ...]
                    const chartData = Object.keys(res).map(topic => {return {x: topic, y: res[topic]}});

                    setArticleCountsByTopic(chartData);
                })
                .catch(err => console.log(err));

            // retrieve article counts by sentiment
            getArticleCountsBySentiment(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => setArticleCountsBySentiment(res))
                .catch(err => console.log(err));

            // retrieve sentiment and subjectivity data for scatter plot
            getSentimentAndSubjectivity(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => setSubjectivityBySentiment(res))
                .catch(err => console.log(err));

            // retrieve counts by date for each topic
            // this also needs to be formatted so each topic contains an array of data points with x and y as the attributes
            getCountByTopicAndDate(selectedTimeFrameFilter, selectedTopicFilter)
                .then(res => parseTopicCountsByDate(res))
                .catch(err => console.log(err));
        }

    }, [selectedTimeFrameFilter, selectedTopicFilter, savedArticlesOnly, topics]);

    const parseTopicCountsByDate = (counts) => {
        let countsByTopicAndDate = [];
        setTopicsInData(Object.keys(counts).sort()); // these are all the topics that appear in the data with filters applied

        Object.keys(counts).forEach(topic => {
            let countsForTopic = [];

            counts[topic].forEach(dataPoint => {
                let stringDate = dataPoint['date'];
                stringDate = stringDate.split('-');

                // need to subtract 1 from date since javascript months start from 0
                const date = new Date(stringDate[0], parseInt(stringDate[1]) - 1, stringDate[2]);

                if(parseInt(stringDate[0]) >= 2020) //filtering out some additional outliers so the graph looks more uniform
                    countsForTopic.push({x: date, y: dataPoint['count']});
            });

            countsByTopicAndDate.push(countsForTopic);
        });

        setTopicCountsOverTime(countsByTopicAndDate);
    }

    const handleSelectTimeFrame = (event) => {
        setSelectedTimeFrameFilter(event.target.value);
    }

    const handleSelectTopic = (event) => {
        setSelectedTopicFilter(event.target.value);
    }

    const handleSelectSavedArticlesOnly = (event) => {
        setSavedArticlesOnly(!savedArticlesOnly);
    }

    const filterMenuStyle = {
        padding: '10px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'rgb(214, 214, 214)',
        borderRadius: '10px',
        display: 'inline-block'
    }

    return (
        <div className="ml-1 mr-5 animate__animated animate__fadeIn">
            <div className="ml-5 mr-5 shadow" style={filterMenuStyle}>
                {/* TODO: make this look nicer */}
                <h4><b>Select filters</b></h4> 
                <hr />
                <label className="ml-2 mr-2">Time frame</label>
                <select onChange={handleSelectTimeFrame}>
                    <option value="all">All</option>
                    <option value="day">Past day</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                    <option value="year">Past year</option>
                </select>
                <br />
                <label className="ml-2 mr-2">Topic</label>
                <select onChange={handleSelectTopic}>
                    <option value="all">All</option>
                    {topics.map(topic => <option key={topic.topic_id} id={topic.topic_id} value={topic.topic_name}>{topic.topic_name}</option>)}
                </select>
                <br />
                {
                    isLoggedIn 
                    ? <label>
                        <input 
                            type="checkbox" 
                            value={savedArticlesOnly}
                            onChange={handleSelectSavedArticlesOnly}
                            className="mr-3" 
                        />
                        Apply charts to my saved articles only
                    </label>
                    : <div></div>}
            </div>
            <div className="row m-5">
                <div className="col-md-6">
                    <svg ref={countByTopicBarChartRef}></svg>
                    <BarChart 
                        chartData={articleCountsByTopic} 
                        svgRef={countByTopicBarChartRef} 
                        chartTitle="Article Counts by Topic" 
                    />
                </div>
                <div className="col-md-6">
                    <svg ref={countBySentimentBarChartRef}></svg>
                    <DonutChart 
                        chartData={articleCountsBySentiment} 
                        svgRef={countBySentimentBarChartRef} 
                        chartTitle="Count By Sentiment" 
                    />
                </div>
            </div>
            &nbsp;
            <div className="row m-5">
                <div className="col-md-6">
                    <svg ref={subjectivityBySentimentScatterRef}></svg>
                    <ScatterPlot 
                        chartData={subjectivityBySentiment} 
                        svgRef={subjectivityBySentimentScatterRef} 
                        chartTitle="Subjectivity By Sentiment" 
                        xAxisTitle="Sentiment"
                        yAxisTitle="Subjectivity"
                        categories={topicsInData}
                    />
                </div>
                <div className="col-md-6">
                    <svg ref={topicCountsOverTimeRef}></svg>
                    <LineChart 
                        chartData={topicCountsOverTime} 
                        svgRef={topicCountsOverTimeRef} 
                        chartTitle="Topic Counts By Date" 
                        xAxisTitle="Date"
                        yAxisTitle="Count"
                        legendLabels={topicsInData}
                    />
                </div>
            </div>
        </div>
    )
}

export default Visuals;
