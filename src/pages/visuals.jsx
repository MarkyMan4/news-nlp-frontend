import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import DonutChart from '../components/donutChart';
import ScatterPlot from '../components/scatterPlot';
import LineChart from '../components/lineChart';
import { getArticleCountsByTopic, getArticleCountsBySentiment, getSentimentAndSubjectivity } from '../api/newsRequests';

function Visuals() {
    const countByTopicBarChartRef = useRef(null);
    const countBySentimentBarChartRef = useRef(null);
    const subjectivityBySentimentScatterRef = useRef(null);
    const topicCountsOverTimeRef = useRef(null);

    const [articleCountsByTopic, setArticleCountsByTopic] = useState([]);
    const [articleCountsBySentiment, setArticleCountsBySentiment] = useState([]);
    const [subjectivityBySentiment, setSubjectivityBySentiment] = useState([]);
    const [topicCountsOverTime, setTopicCountsOverTime] = useState([]);

    const [selectedTimeFrameFilter, setSelectedTimeFrameFilter] = useState('all');

    useEffect(() => {
        // retrieve article count for each topic
        getArticleCountsByTopic(selectedTimeFrameFilter)
            .then(res => {
                // format data in a nice way for the bar chart (list of data)
                // [{<topic1>: <count1>}, {<topic2>: <count2>}, ...]
                const chartData = Object.keys(res).map(topic => {return {x: topic, y: res[topic]}});

                setArticleCountsByTopic(chartData);
            })
            .catch(err => console.log(err));

        // retrieve article counts by sentiment
        getArticleCountsBySentiment(selectedTimeFrameFilter)
            .then(res => setArticleCountsBySentiment(res))
            .catch(err => console.log(err));

        // retrieve sentiment and subjectivity data for scatter plot
        getSentimentAndSubjectivity(selectedTimeFrameFilter)
            .then(res => setSubjectivityBySentiment(res))
            .catch(err => console.log(err));

        // temporarily generating dummy data for line chart
        let dummyData = [];

        for(let i = 0; i < 20; i++) {
            dummyData.push({x: i, y: Math.random() * 5});
        }

        setTopicCountsOverTime(dummyData);
    }, [selectedTimeFrameFilter]);

    const handleSelectTimeFrame = (event) => {
        setSelectedTimeFrameFilter(event.target.value);
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
        <div className="ml-5 mr-5 animate__animated animate__fadeIn">
            <div className="ml-5 mr-5 shadow" style={filterMenuStyle}>
                {/* TODO: make this look nicer */}
                <b>Select filters</b> | 
                <label className="ml-2 mr-2">Time frame</label>
                <select onChange={handleSelectTimeFrame}>
                    <option value="all">All</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div className="row m-5">
                <div className="col-md-6">
                    <svg ref={countByTopicBarChartRef}></svg>
                    <BarChart chartData={articleCountsByTopic} svgRef={countByTopicBarChartRef} chartTitle="Article Counts by Topic" />
                </div>
                <div className="col-md-6">
                    <svg ref={countBySentimentBarChartRef}></svg>
                    <DonutChart chartData={articleCountsBySentiment} svgRef={countBySentimentBarChartRef} chartTitle="Count By Sentiment" />
                </div>
            </div>
            &nbsp;
            <div className="row m-5">
                <div className="col-md-6">
                    <svg ref={subjectivityBySentimentScatterRef}></svg>
                    <ScatterPlot chartData={subjectivityBySentiment} svgRef={subjectivityBySentimentScatterRef} chartTitle="Subjectivity By Sentiment" />
                </div>
                <div className="col-md-6">
                    <svg ref={topicCountsOverTimeRef}></svg>
                    <LineChart chartData={topicCountsOverTime} svgRef={topicCountsOverTimeRef} />
                </div>
            </div>
        </div>
    )
}

export default Visuals;
