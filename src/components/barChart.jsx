import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleBand } from 'd3-scale';

const dummyData = [
    {x: 1, y: 'test1'},
    {x: 2, y: 'test2'},
    {x: 3, y: 'test3'},
    {x: 4, y: 'test4'}
]

function BarChart({data, svgRef}) {
    // handle d3 usage here
    useEffect(() => {
        const container = d3.select(svgRef.current).classed('graph-container', true);

        container
            .selectAll('circle')
            .data(dummyData)
            .enter()
            .append('circle')
            .attr('cx', 50)
            .attr('cy', 50)
            .attr('r', 10);
    }, [data, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default BarChart;
