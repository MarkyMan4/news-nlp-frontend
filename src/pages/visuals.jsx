import React, { useState, useEffect, useRef } from 'react';
import BarChart from '../components/barChart';
// import { getArticleCounts } from '../api/newsRequests';

function Visuals() {
    const barChartRef = useRef(null);
    const [articleCounts, setArticleCounts] = useState([]);

    // need to wait to do this until backend has an endpoint to retrieve article counts by topic

    // useEffect(() => {
    //     getArticleCounts()
    //         .then(res => console.log(res))
    //         .catch(err => console.log(err));
    // }, []);

    return (
        <div className="ml-5 mr-5">
            <svg ref={barChartRef}></svg>
            <BarChart svgRef={barChartRef} />
        </div>
    )
}

export default Visuals;
