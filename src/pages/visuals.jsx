import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import DonutChart from '../components/donutChart';
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
                setArticleCountsBySentiment(res);
            })
    }, []);

    return (
        <div className="ml-5 mr-5">
            <div className="row ml-5 mr-5">
                <div className="col-md-6">
                    <svg ref={countByTopicBarChartRef}></svg>
                    <BarChart chartData={articleCountsByTopic} svgRef={countByTopicBarChartRef} chartTitle="Article Counts by Topic" />
                </div>

                <div className="col-md-6">
                    <svg ref={countBySentimentBarChartRef}></svg>
                    <DonutChart chartData={articleCountsBySentiment} svgRef={countBySentimentBarChartRef} />
                </div>
            </div>
        </div>
    )
}

export default Visuals;
