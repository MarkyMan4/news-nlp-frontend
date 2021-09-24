import { useEffect } from "react";
import * as d3 from 'd3';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';

const margin = {
    top: 60,
    left: 30,
    bottom: 20,
    right: 10
};

const width = 600;
const height = 400;

/*
 * Line chart component
 * Accepts a 2d array of data points, this is so that data for multiple lines can be provided
 * e.g. 
 * [
 *      [{x: ..., y: ...}, {x: ..., y: ...}, ...],  // line 1
 *      [{x: ..., y: ...}, {x: ..., y: ...}, ...],  // line 2
 *      ...                                         // line n
 * ]
 * 
 * TODO: 
 * - handle displaying dates on x-axis - kind of done, need to do some validation
 * - accept chart title as prop and display it
 * - accept labels for each line that can be displayed on the legend
 */
function LineChart({chartData, svgRef, chartTitle}) {
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.classed('graph-container', true);

        const xs = [];
        const ys = [];

        chartData.forEach(data => {
            data.forEach(d => {
                xs.push(d.x);
                ys.push(d.y);
            })
        });

        const xScale = scaleTime()
            .domain(d3.extent(xs, x => x))
            .range([0, width]);

        const yScale = scaleLinear()
            .domain([0, d3.max(ys, y => y) + (d3.max(ys, y => y) * 0.3)]) // padding at top is 30% of the max y-value
            .range([height, margin.top]);

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
            .call(d3.axisBottom(xScale).tickSize(-height + margin.top).tickFormat(''));

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

        // set the color scale
        const color = scaleOrdinal().domain(chartData.map((d, i) => i)).range(d3.schemeTableau10);

        // draw the lines
        chartData.forEach((data, indx) => {
            svg
                .append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', color(indx))
                .attr('stroke-width', 2)
                .attr('d', line);
        });

        // add the chart title
        svg
            .append('text')
            .classed('chart-title', true)
            .attr('x', width / 2)
            .attr('y', 25)
            .text(chartTitle);

    }, [chartData, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default LineChart;