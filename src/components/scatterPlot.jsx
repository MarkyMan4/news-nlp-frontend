import { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';

const width = 700;
const height = 400;

// margins for the graph area
let margin = {
    bottom: 30,
    top: 50,
    left: 35
}

function ScatterPlot({chartData, svgRef, chartTitle}) {
    useEffect(() => {
        // find the min/max x & y values for the scales
        let maxY = Number.MIN_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let minX = Number.MAX_SAFE_INTEGER;

        for(let i = 0; i < chartData.length; i++) {
            if(chartData[i].y > maxY)
                maxY = chartData[i].y;

            if(chartData[i].x > maxX)
                maxX = chartData[i].x;

            if(chartData[i].y < minY)
                minY = chartData[i].y;
            
            if(chartData[i].x < minX)
                minX = chartData[i].x;
        }

        const xScale = scaleLinear()
            .domain([minX, maxX])
            .rangeRound([margin.left, width]);

        const yScale = scaleLinear()
            .domain([minY, maxY]) // give a little padding at the top of the chart
            .range([height - margin.bottom, margin.top]);

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        
        svg.classed('graph-container', true);

        // x-axis
        svg
            .append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale));

        // y-axis
        svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale));

        // add the chart title
        svg
            .append('text')
            .classed('chart-title', true)
            .attr('x', width / 2)
            .attr('y', 25)
            .text(chartTitle);

        // add grid lines on the x-axis
        svg
            .append('g')
            .attr('class', 'chart-grid')
            .attr('transform', `translate(0, ${height - margin.bottom})`) // This controls the vertical position of the Axis
            .call(d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom).tickFormat(''));

        // add grid lines on the y-axis
        svg
            .append('g')
            .attr('class', 'chart-grid')
            .attr('transform', `translate(${margin.left}, 0)`) // This controls the vertical position of the Axis
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

        svg
            .selectAll('dataPoints')
            .data(chartData)
            .enter()
            .append('circle')
                .attr('cx', d => xScale(d.x))
                .attr('cy', d => yScale(d.y))
                .attr('r', 4)
                .attr('fill', '#4e79a7');

    }, [chartData, svgRef]);

    return null;
}

export default ScatterPlot;
