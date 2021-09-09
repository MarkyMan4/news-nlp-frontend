import { useEffect } from 'react';
import * as d3 from 'd3';

const width = 700;
const height = 400;

function ScatterPlot({chartData, svgRef}) {
    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .classed('graph-container', true)
            .style('border-style', 'solid')
            .style('border-width', '1px')
            .style('border-color', 'black');

        svg
            .selectAll('dataPoints')
            .data(chartData)
            .enter()
            .append('circle')
                .attr('cx', d => d.x * width)
                .attr('cy', d => d.y * height)
                .attr('r', 5)
                .attr('fill', '#4e79a7');

    }, [chartData, svgRef]);

    return null;
}

export default ScatterPlot;
