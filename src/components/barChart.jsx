import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleBand } from 'd3-scale';

const containerWidth = 700;
const containerHeight = 400;

function BarChart({chartData, svgRef, chartTitle}) {
    // handle d3 usage here
    useEffect(() => {
        // find the max y value for using in the yScale
        let maxY = Number.MIN_SAFE_INTEGER;

        for(let i = 0; i < chartData.length; i++) {
            if(chartData[i].y > maxY)
                maxY = chartData[i].y;
        }

        const xScale = scaleBand()
            .domain(chartData.map(data => data.x))
            .rangeRound([0, containerWidth])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain([0, maxY + 250]) // give a little padding at the top of the chart
            .range([containerHeight, 0]);

        // container (i.e. the svg) that hold the chart
        const container = d3.select(svgRef.current).classed('graph-container', true);

        const handleMouseOver = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(100)
                .attr('opacity', 0.75);
        }

        const handleMouseOut = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(100)
                .attr('opacity', 1);
        }

        const barBottom = containerHeight - 30;

        // create the bar chart
        container
            .selectAll('rect')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', data => xScale(data.x))
            .attr('y', data => yScale(data.y))
            .attr('width', xScale.bandwidth())
            .attr('height', data => barBottom - yScale(data.y))
            .attr('fill', 'DodgerBlue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

        // add labels to each bar to show the data value
        container
            .selectAll('.chart-data-label')
            .data(chartData)
            .enter()
            .append('text')
            .classed('chart-data-label', true)
            .attr('x', data => xScale(data.x) + (xScale.bandwidth() / 2)) // centered in bars
            .attr('y', data => yScale(data.y) + 30) // place text near the top of the bar
            .text(data => data.y);

        // add a line at the base of the bars to separate from the labels
        container
            .append('line')
            .attr('x1', 0)
            .attr('y1', barBottom)
            .attr('x2', containerWidth)
            .attr('y2', barBottom)
            .attr('stroke', 'black');

        // add text labels to tell what topic each bar represents
        container
            .selectAll('.chart-label')
            .data(chartData)
            .enter()
            .append('text')
            .classed('bar-chart-label', true)
            .attr('text-anchor', 'middle')
            .attr('x', data => xScale(data.x) + (xScale.bandwidth() / 2))
            .attr('y', containerHeight - 10)
            .text(data => data.x);

        // add the chart title
        container
            .append('text')
            .classed('chart-title', true)
            .attr('x', containerWidth / 2)
            .attr('y', 25)
            .text(chartTitle);
    }, [chartData, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default BarChart;
