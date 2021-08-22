import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleBand } from 'd3-scale';

const containerWidth = 700;
const containerHeight = 400;

// margins for the graph area
let margin = {
    bottom: 30,
    top: 50
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
            .rangeRound([0, containerWidth])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain([0, maxY + 50]) // give a little padding at the top of the chart
            .range([barBottom, margin.top]); // need set barBottom as the max so there are bounds for the graph, margin top allows room for title

        // container (i.e. the svg) that hold the chart
        // this also clears things out between renders so it doesn't get drawn multiple times
        const container = d3.select(svgRef.current);
        container.selectAll('*').remove();
        container.classed('graph-container', true);

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

        // container.remove('g');

        // add text labels to tell what topic each bar represents
        // TODO: see if there is a way to adjust font size
        container
            .append("g")
            .attr('transform', `translate(0,${barBottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale))
            .selectAll('text')
                .attr('font-size', '18px');

        // add ticks for the y-axis
        container
            .append('g')
            .attr('transform', `translate(${containerWidth - 35}, 0)`) // This controls the vertical position of the Axis
            .call(d3.axisRight(yScale));

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
