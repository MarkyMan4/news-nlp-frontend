import { useEffect } from "react";
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';

const margin = {
    top: 10,
    left: 30,
    bottom: 30,
    right: 10
};

const width = 600;
const height = 400;

function LineChart({chartData, svgRef}) {
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.classed('graph-container', true);

        const xScale = scaleLinear()
            .domain([0, d3.max(chartData, d => d.x) + 1]) // giving one unit of padding right now, should find a more dynamic way to calculate this
            .range([0, width]);

        const yScale = scaleLinear()
            .domain([0, d3.max(chartData, d => d.y) + (d3.max(chartData, d => d.y) * 0.3)]) // padding at top is 30% of the max y-value
            .range([height, 0]);

        // x-axis
        svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale));

        // y-axis
        svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${-margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale));

        // add grid lines on the x-axis
        svg
            .append('g')
            .attr('class', 'chart-grid')
            .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom).tickFormat(''));

        // add grid lines on the y-axis
        svg
            .append('g')
            .attr('class', 'chart-grid')
            .attr('transform', `translate(${margin.left}, ${-margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

        // need to add margin left and bottom to align the line with the axis
        const line = d3.line()
            .x(d => xScale(d.x) + margin.left)
            .y(d => yScale(d.y) - margin.bottom);

        // draw the line
        svg
            .append('path')
            .datum(chartData)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1)
            .attr('d', line);

    }, [chartData, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default LineChart;