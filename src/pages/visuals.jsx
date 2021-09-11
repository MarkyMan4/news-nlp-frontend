import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import DonutChart from '../components/donutChart';
import ScatterPlot from '../components/scatterPlot';
import { getArticleCountsByTopic, getArticleCountsBySentiment, getSentimentAndSubjectivity } from '../api/newsRequests';

function Visuals() {
    const countByTopicBarChartRef = useRef(null);
    const countBySentimentBarChartRef = useRef(null);
    const subjectivityBySentimentScatterRef = useRef(null);

    const [articleCountsByTopic, setArticleCountsByTopic] = useState([]);
    const [articleCountsBySentiment, setArticleCountsBySentiment] = useState([]);
    const [subjectivityBySentiment, setSubjectivityBySentiment] = useState([]);

    useEffect(() => {
        // retrieve article count for each topic
        getArticleCountsByTopic()
            .then(res => {
                // format data in a nice way for the bar chart (list of data)
                // [{<topic1>: <count1>}, {<topic2>: <count2>}, ...]
                const chartData = Object.keys(res).map(topic => {return {x: topic, y: res[topic]}});

                setArticleCountsByTopic(chartData);
            })
            .catch(err => console.log(err));

        // retrieve article counts by sentiment
        getArticleCountsBySentiment()
            .then(res => setArticleCountsBySentiment(res))
            .catch(err => console.log(err));

        // retrieve sentiment and subjectivity data for scatter plot
        getSentimentAndSubjectivity()
            .then(res => setSubjectivityBySentiment(res))
            .catch(err => console.log(err));        
    }, []);

    return (
        <div className="ml-5 mr-5 animate__animated animate__fadeIn">
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
            </div>
        </div>
    )
}

export default Visuals;
