import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';

const containerWidth = 700;
const containerHeight = 400;

// margins for the graph area
let margin = {
    bottom: 30,
    top: 50,
    left: 35
}

/*
 * This is a generic bar chart component. It is not specific to one bar chart in this website.
 * Anywhere that a bar chart is needed, this component can be used. The caller of this component
 * Is required to provide a reference to an svg, a chart title, and data in the following format:
 * 
 * [
 *     {x: <label for bar on x-axis>, y: <data for bar>},
 *     {x: <label for bar on x-axis>, y: <data for bar>},
 *     ...
 * ]
 */
function BarChart({chartData, svgRef, chartTitle}) {
    // handle d3 usage here
    useEffect(() => {
        // find the max y value for using in the yScale
        let maxY = Number.MIN_SAFE_INTEGER;

        for(let i = 0; i < chartData.length; i++) {
            if(chartData[i].y > maxY)
                maxY = chartData[i].y;
        }

        // sort data by x values (label for bar chart)
        chartData.sort((item1, item2) => item1.x > item2.x ? 1 : -1);

        // set the color scale
        const color = scaleOrdinal().domain(chartData.map(d => d.x)).range(d3.schemeTableau10);

        // lowest bars will show in svg, this allows room for labels on the x-axis
        const barBottom = containerHeight - margin.bottom;

        const xScale = scaleBand()
            .domain(chartData.map(data => data.x))
            .rangeRound([margin.left, containerWidth])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain([0, maxY + (maxY * 0.1)]) // pad the top of the bars by 10% of the max y-value
            .range([barBottom, margin.top]); // need set barBottom as the max so there are bounds for the graph, margin top allows room for title

        // container (i.e. the svg) that hold the chart
        // this also clears things out between renders so it doesn't get drawn multiple times
        const container = d3.select(svgRef.current);
        container.selectAll('*').remove();
        container.classed('graph-container', true).attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

        // add grid lines on the y-axis
        container
            .append('g')
            .attr('class', 'chart-grid')
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
            .attr('fill', data => color(data.x))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    }, [chartData, svgRef]);

    // no need to return anything since this only manipulates an svg in the parent component
    return null;
}

export default BarChart;
