import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';

const width = 700;
const height = 450;
const radius = 150;

const margin = {
    top: 20
};

/*
 * TODO: hover text should show percentage instead of actual number
 *       could make the width and height of each graph a prop
 */ 
function DonutChart({chartData, svgRef, chartTitle}) {
    useEffect(() => {
        // these two lines are just used to clear out SVG elements between renders
        const temp = d3.select(svgRef.current);
        temp.selectAll('*').remove();

        // create the svg and remove any previous components from the
        const svg = d3.select(svgRef.current)
            .classed('graph-container', true)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('height', height) // manually adjusting the height for this chart so I can make it bigger
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // add the chart title
        svg
            .append('text')
            .classed('chart-title', true)
            .attr('x', 0)
            .attr('y', -height / 2 + margin.top)
            .text(chartTitle);

        // set the color scale
        const color = scaleOrdinal().domain(Object.keys(chartData)).range(d3.schemeDark2);

        const pie = d3.pie();
        const pieData = pie(Object.values(chartData));

        const handleMouseOver = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(150)
                .attr('opacity', 0.8);
        
            const textX = arc.centroid(i)[0];
            const textY = arc.centroid(i)[1];
        
            svg
                .append('text')
                .attr('id', 'hover-text')
                .attr('x', textX)
                .attr('y', textY)
                .attr('text-anchor', getMidangle(i) < Math.PI ? 'end' : 'start')
                .text(i.value);
        }
        
        const handleMouseOut = (d, i) => {
            d3.select(d.target)
                .transition()
                .duration(150)
                .attr('opacity', 1);
        
            d3.selectAll('#hover-text').remove();
        }
        
        // arcs for the chart - setting an inner radius makes this a donut chart
        const arc = d3.arc()
            .innerRadius(75)
            .outerRadius(radius);
        
        // arcs for drawing the text labels
        const outerArc = d3.arc()
            .innerRadius(radius * 1.2)
            .outerRadius(radius * 1.2);
        
        svg
          .selectAll('path')
          .data(pieData)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (data, indx) => color(Object.entries(chartData)[indx][0])) // lookup color based on label
          .attr('stroke', 'white')
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut);
        
        const getTextPos = (d) => {
            var pos = outerArc.centroid(d);
            // var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            // pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return pos;
        }
        
        // find the angle between two angles
        const getMidangle = (d) => {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
        
        // add text labels to each slice of the chart
        svg
            .selectAll('allLabels')
            .data(pieData)
            .enter()
            .append('text')
                .text((data, indx) => Object.entries(chartData)[indx][0])
                .attr('transform', d => 'translate(' + getTextPos(d) + ')')
                .style('text-anchor', d => {
                    var midangle = getMidangle(d)
                    return (midangle < Math.PI ? 'start' : 'end')
                });
        
        // add lines pointing labels to section of chart
        svg
            .selectAll('allPolylines')
            .data(pieData)
            .enter()
            .append('polyline')
                .attr('stroke', 'black')
                .style('fill', 'none')
                .attr('stroke-width', 1)
                .attr('points', function(d) {
                    var posA = arc.centroid(d);
                    var posB = outerArc.centroid(d);
                    var posC = outerArc.centroid(d);
                    return [posA, posB, posC]
                });

        // legend showing values for each piece of the chart
        svg
            .selectAll('legendCircles')
            .data(pieData)
            .enter()
            .append('circle')
                .attr('fill', (d, i) => color(Object.entries(chartData)[i][0]))
                .attr('cx', (width / 2) - 75) // for x and y, need to remember that 0, 0 for this chart is the center
                .attr('cy', (d, i) => (i * 30) - (height / 2 - margin.top - 15))
                .attr('r', 10);

        svg
            .selectAll('legendText')
            .data(pieData)
            .enter()
            .append('text')
                .attr('text-anchor', 'left')
                .attr('x', (width / 2) - 60)
                .attr('y', (d, i) => (i * 30) - (height / 2 - margin.top - 20))
                .text(d => d.data);
    }, [chartData, svgRef]);

    return null;
}

export default DonutChart;
