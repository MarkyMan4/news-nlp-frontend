import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';

const width = 600;
const height = 400;
const radius = 150;

/*
 * TODO: add chart title, hover text should show percentage instead of actual number
 */ 
function DonutChart({chartData, svgRef}) {
    useEffect(() => {
        // create the svg and remove any previous components from the
        const svg = d3.select(svgRef.current)
            .classed('graph-container', true)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // set the color scale
        const color = d3.scaleOrdinal().domain(Object.keys(chartData)).range(d3.schemeDark2);

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
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d);
              var posB = outerArc.centroid(d);
              var posC = outerArc.centroid(d);
              return [posA, posB, posC]
            });
    }, [chartData, svgRef]);

    return null;
}

export default DonutChart;