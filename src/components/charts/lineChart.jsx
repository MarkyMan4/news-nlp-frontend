import { useEffect, useState } from "react";
import * as d3 from 'd3';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import Legend from './shared/legend';

const margin = {
    top: 75,
    left: 40,
    bottom: 40,
    right: 70
};

const width = 700;
const height = 400;

let legendHidden = true;

/*
 * Line chart component
 * Accepts a 2d array of data points, this is so that data for multiple lines can be provided
 * The user of this component is responsible for making sure the legend labels and chart data are in the same order.
 * e.g. 
 * [
 *      [{x: ..., y: ...}, {x: ..., y: ...}, ...],  // line 1
 *      [{x: ..., y: ...}, {x: ..., y: ...}, ...],  // line 2
 *      ...                                         // line n
 * ]
 * 
 * TODO: 
 * - handle displaying dates on x-axis - kind of done, need to do some validation
 * - accept labels for each line that can be displayed on the legend
 */
function LineChart({chartData, svgRef, chartTitle, xAxisTitle, yAxisTitle, legendLabels}) {
    const [isLegendHidden, setIsLegendHidden] = useState(true);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.classed('graph-container', true).attr('viewBox', `0 0 ${width} ${height}`);

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
            .range([0, width - margin.right]);

        const yScale = scaleLinear()
            .domain([0, d3.max(ys, y => y) + (d3.max(ys, y => y) * 0.1)]) // padding at top is 10% of the max y-value
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

        // x-axis title
        svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .text(xAxisTitle);

        // y-axis title
        svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(13, ${height / 2}) rotate(-90)`)
            .text(yAxisTitle);

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

        // button to show/hide legend
        svg
            .append('rect')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', 106)
            .attr('height', 25)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('rx', 5)
            .attr('id', 'btnBackground');

        svg
            .append('text')
            .attr('x', margin.left + 5)
            .attr('y', 17)
            .attr('id', 'toggleLegendBtnText')
            .text('Show Legend');


        // some weird workaround of react state
        const toggleLegend = (d, i) => {
            legendHidden = !legendHidden;
            setIsLegendHidden(legendHidden);
        }

        const handleMouseOver = (d, i) => {
            d3.select('#btnBackground')
                .transition()
                .duration(200)
                .attr('fill', '#D8E2FC');
        }

        const handleMouseOut = (d, i) => {
            d3.select('#btnBackground')
                .transition()
                .duration(200)
                .attr('fill', 'white');
        }

        svg
            .append('rect')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', 106)
            .attr('height', 25)
            .attr('opacity', 0)
            .attr('rx', 5)
            .on('click', toggleLegend)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    }, [chartData, svgRef]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const color = scaleOrdinal().domain(chartData.map((d, i) => i)).range(d3.schemeTableau10);
        
        // toggle show/hide button text
        svg.select('#toggleLegendBtnText').text(`${legendHidden ? 'Show Legend' : 'Hide Legend'}`)

        if(legendHidden) {
            svg.select('#legendBox').remove();
            svg.selectAll('circle[id^=legend]').remove();
            svg.selectAll('text[id^=legend]').remove();
        }
        else { // draw legend if it's toggled
            svg
                .append('rect')
                .attr('x', 75)
                .attr('y', 40)
                .attr('width', 180)
                .attr('height', 140)
                .attr('rx', 5)
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .attr('id', 'legendBox');

            // legend showing values for each piece of the chart
            svg
                .selectAll('legendCircles')
                .data(chartData)
                .enter()
                .append('circle')
                    .attr('fill', (d, i) => color(i))
                    .attr('cx', 90) // for x and y, need to remember that 0, 0 for this chart is the center
                    .attr('cy', (d, i) => (i * 30) + 60)
                    .attr('r', 10)
                    .attr('id', (d, i) => `legendCircle${i}`);

            svg
                .selectAll('legendText')
                .data(legendLabels)
                .enter()
                .append('text')
                    .attr('text-anchor', 'left')
                    .attr('x', 105)
                    .attr('y', (d, i) => (i * 30) + 65)
                    .attr('id', (d, i) => `legendText${i}`)
                    .text(d => d);
        }
    }, [legendHidden]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;

    // for using shared components, need to call them from the return statement
    // return <Legend
    //             id="count-by-date"
    //             svgRef={svgRef}
    //             labels={[{label: 'test1', color: '#FF5733'}, {label: 'test2', color: '#3352FF'}]}
    //             x={margin.left}
    //             y={0}
    //        />;
}

export default LineChart;