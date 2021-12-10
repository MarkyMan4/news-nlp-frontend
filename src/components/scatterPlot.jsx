import { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';

const width = 700;
const height = 400;

// margins for the graph area
let margin = {
    bottom: 40,
    top: 50,
    left: 45
}

function ScatterPlot({chartData, svgRef, chartTitle, xAxisTitle, yAxisTitle}) {
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
        
        svg.classed('graph-container', true).attr('viewBox', `0 0 ${width} ${height}`);

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


        // increase radius on mouse over
        const handleMouseOver = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(200)
                .attr('r', 10);
        }

        // decrease radius on mouse out
        const handleMouseOut = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(200)
                .attr('r', 3);
        }

        // show tooltip when a point is clicked
        const handlePointClicked = (d, i) => {
            svg.selectAll('#tooltip-box').remove();

            // data used for this data point
            const sentiment = d.target.__data__.x;
            const subjectivity = d.target.__data__.y;
            const articleId = d.target.__data__.id;

            // get x and y coordinates of selected point
            const pointX = parseInt(d3.select(d.target).attr('cx'));
            const pointY = parseInt(d3.select(d.target).attr('cy'));

            const boxWidth = 150;
            const boxHeight = 75;
            const boxX = pointX - (boxWidth / 2);
            const boxY = pointY >= height / 2 ? pointY - boxHeight - 10 : pointY + 10; // show tool tip above or below based on where the point is

            const tooltip = svg.append('g').attr('id', 'tooltip-box');

            // add a box
            tooltip
                .append('rect')
                .attr('x', boxX)
                .attr('y', boxY)
                .attr('width', boxWidth)
                .attr('height', boxHeight)
                .attr('rx', 5)
                .attr('fill', 'white')
                .attr('stroke', '#4A4A4A');

            // sentiment text
            tooltip
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', boxX + (boxWidth / 2))
                .attr('y', boxY + (boxHeight / 2) - 15)
                .text(`Sentiment: ${sentiment}`);

            // subjectivity text
            tooltip
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', boxX + (boxWidth / 2))
                .attr('y', boxY + (boxHeight / 2) + 5)
                .text(`Subjectivity: ${subjectivity}`);

            // add a link to the article
            tooltip
                .append('a')
                .attr('href', `http://localhost:3000/#/article/${articleId}`)
                .attr('target', '_blank') // open link in new tab
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('x', boxX + (boxWidth / 2))
                    .attr('y', boxY + (boxHeight / 2) + 30)
                    .attr('fill', 'blue')
                    .text('Link to article');
        }

        svg
            .selectAll('dataPoints')
            .data(chartData)
            .enter()
            .append('circle')
                .attr('cx', d => xScale(d.x))
                .attr('cy', d => yScale(d.y))
                .attr('r', 3)
                .attr('fill', '#4e79a7')
                .attr('opacity', 0.5)
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut)
                .on('click', handlePointClicked);

    }, [chartData, svgRef]);

    return null;
}

export default ScatterPlot;
