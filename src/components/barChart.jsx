import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleBand } from 'd3-scale';

const containerWidth = 700;
const containerHeight = 400;

// margins for the graph area
let margin = {
    bottom: 30,
    top: 50,
    left: 35
}

function BarChart({chartData, svgRef, chartTitle}) {
    // handle d3 usage here
    useEffect(() => {
        // find the max y value for using in the yScale
        let maxY = Number.MIN_SAFE_INTEGER;

        for(let i = 0; i < chartData.length; i++) {
            if(chartData[i].y > maxY)
                maxY = chartData[i].y;
        }

        // lowest bars will show in svg, this allows room for labels on the x-axis
        const barBottom = containerHeight - margin.bottom;

        const xScale = scaleBand()
            .domain(chartData.map(data => data.x))
            .rangeRound([margin.left, containerWidth])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain([0, maxY + 50]) // give a little padding at the top of the chart
            .range([barBottom, margin.top]); // need set barBottom as the max so there are bounds for the graph, margin top allows room for title

        // container (i.e. the svg) that hold the chart
        // this also clears things out between renders so it doesn't get drawn multiple times
        const container = d3.select(svgRef.current);
        container.selectAll('*').remove();
        container.classed('graph-container', true);

        // add grid lines on the y-axis
        container
            .append('g')
            .attr('class', 'y-axis-grid')
            .attr('transform', `translate(${margin.left}, 0)`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale).tickSize(-containerWidth).tickFormat(''));

        // add ticks on the y-axis
        container
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale));

        // add text labels to tell what topic each bar represents
        container
            .append("g")
            .attr('transform', `translate(0,${barBottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale))
            .selectAll('text')
                .attr('font-size', '18px');

        // add the chart title
        container
            .append('text')
            .classed('chart-title', true)
            .attr('x', containerWidth / 2)
            .attr('y', 25)
            .text(chartTitle);

        const handleMouseOver = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(100)
                .attr('opacity', 0.75);

            // show data value on the bar
            container
                .append('text')
                .classed('chart-data-label', true)
                .attr('x', parseFloat(d3.select(d.target).attr('x')) + (xScale.bandwidth() / 2)) // centered in the bar
                .attr('y', parseFloat(d3.select(d.target).attr('y')) + 30) // place text near the top of the bar
                .text(d.target.__data__.y);
        }

        const handleMouseOut = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(100)
                .attr('opacity', 1);

            // remove data labels
            container.selectAll('.chart-data-label').remove();
        }

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

    }, [chartData, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default BarChart;
