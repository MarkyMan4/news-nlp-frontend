import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import { getArticleCountsByTopic, getArticleCountsBySentiment } from '../api/newsRequests';

function Visuals() {
    const countByTopicBarChartRef = useRef(null);
    const countBySentimentBarChartRef = useRef(null);

    const [articleCountsByTopic, setArticleCountsByTopic] = useState([]);
    const [articleCountsBySentiment, setArticleCountsBySentiment] = useState([]);

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
            .then(res => {
                // format data in a nice way for the bar chart (list of data)
                // [{<sentiment1>: <count1>}, {<sentiment2>: <count2>}, ...]
                const chartData = Object.keys(res).map(sentiment => {return {x: sentiment, y: res[sentiment]}});

                setArticleCountsBySentiment(chartData);
            })
    }, []);

    return (
        <div className="ml-5 mr-5">
            <div className="row">
                <div className="col-md-6">
                    <svg ref={countByTopicBarChartRef}></svg>
                    <BarChart chartData={articleCountsByTopic} svgRef={countByTopicBarChartRef} chartTitle="Article Counts by Topic" />
                </div>

                <div className="col-md-6">
                    <svg ref={countBySentimentBarChartRef}></svg>
                    <BarChart chartData={articleCountsBySentiment} svgRef={countBySentimentBarChartRef} chartTitle="Article Counts by Sentiment" />
                </div>
            </div>
        </div>
    )
}

export default Visuals;
