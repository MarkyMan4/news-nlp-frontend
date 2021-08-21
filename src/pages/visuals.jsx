import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
import { getArticleCountsByTopic } from '../api/newsRequests';

function Visuals() {
    const barChartRef = useRef(null);
    const [articleCounts, setArticleCounts] = useState([]);

    useEffect(() => {
        // retrieve article count for each topic
        getArticleCountsByTopic()
            .then(res => {
                // format data in a nice way for the bar chart (list of data)
                // [{<topic1>: <count1>}, {<topic2>: <count2>}, ...]
                const chartData = Object.keys(res).map(topic => {return {x: topic, y: res[topic]}});

                setArticleCounts(chartData);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="ml-5 mr-5">
            <svg ref={barChartRef}></svg>
            <BarChart chartData={articleCounts} svgRef={barChartRef} chartTitle="Article Counts by Topic" />
        </div>
    )
}

export default Visuals;
