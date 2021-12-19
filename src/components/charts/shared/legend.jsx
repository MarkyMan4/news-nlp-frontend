import { useEffect, useState } from "react";
import * as d3 from 'd3';

/*
 * Legend that can be toggled via a button. This component includes the button to toggle
 * the legend and the legend itself. It is not visible by default.
 * 
 * Props:
 *   id: unique identifier for the legend
 *   svgRef: reference to an svg to draw the legend on
 *   labels: List of labels and colors that should be displayed for each legend entry.
 *           e.g. 
 *          [
 *              {
 *                  label: <label>
 *                  color: <hex color value>
 *              }
 *              ...
 *          ]
 *   x: x position of legend button (legend will display relative to this button)
 *   y: y position of legend button (legend will display relative to this button)
 */
function Legend({id, svgRef, labels, x, y}) {
    // initial useEffect to draw the button for toggling the legend
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        // button to show/hide legend
        svg
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 106)
            .attr('height', 25)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('rx', 5)
            .attr('id', 'btn-background-' + id);

        // text on toggle button
        svg
            .append('text')
            .attr('x', x + 5)
            .attr('y', y + 17)
            .attr('id', 'toggle-legend-btn-text' + id)
            .text('Show Legend');

        // handle button click, if the legend is on the screen, remove it.
        // otherwise draw it
        const toggleLegend = (d, i) => {
            if(svg.select('#legend-box-' + id).empty()) {
                // update button text
                svg.select('#toggle-legend-btn-text' + id).text('Hide Legend')

                svg
                    .append('rect')
                    .attr('x', x + 35)
                    .attr('y', y + 40)
                    .attr('width', 180)
                    .attr('height', 140)
                    .attr('rx', 5)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('id', 'legend-box-' + id);

                // legend showing values for each piece of the chart
                svg
                    .selectAll('legendCircles')
                    .data(labels)
                    .enter()
                    .append('circle')
                        .attr('fill', data => data.color)
                        .attr('cx', x + 50) // for x and y, need to remember that 0, 0 for this chart is the center
                        .attr('cy', (data, i) => (i * 30) + (y + 60))
                        .attr('r', 10)
                        .attr('id', (data, i) => `legend-circle-${id}-${i}`);

                svg
                    .selectAll('legendText')
                    .data(labels)
                    .enter()
                    .append('text')
                        .attr('text-anchor', 'left')
                        .attr('x', 105)
                        .attr('y', (data, i) => (i * 30) + 65)
                        .attr('id', (data, i) => `legend-text-${id}-${i}`)
                        .text(data => data.label);
            }
            else {
                // update button text
                svg.select('#toggle-legend-btn-text' + id).text('Show Legend')

                svg.select('#legend-box-' + id).remove();
                svg.selectAll('circle[id^=legend]').remove();
                svg.selectAll('text[id^=legend]').remove();
            }
        }

        const handleMouseOver = (d, i) => {
            d3.select('#btn-background-' + id)
                .transition()
                .duration(200)
                .attr('fill', '#D8E2FC');
        }

        const handleMouseOut = (d, i) => {
            d3.select('#btn-background-' + id)
                .transition()
                .duration(200)
                .attr('fill', 'white');
        }

        svg
            .append('rect')
            .attr('id', 'legend-btn-' + id)
            .attr('x', x)
            .attr('y', y)
            .attr('width', 106)
            .attr('height', 25)
            .attr('opacity', 0)
            .attr('rx', 5)
            .on('click', toggleLegend)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
    }, [svgRef, labels]);

    // // Runs whenever the legend is toggled. This handles showing/hiding the legend
    // useEffect(() => {
    //     const svg = d3.select(svgRef.current);

    //     // toggle show/hide button text
    //     svg.select('#toggle-legend-btn-text' + id).text(`${legendHidden ? 'Show Legend' : 'Hide Legend'}`)

    //     if(legendHidden) {
    //         svg.select('#legend-box-' + id).remove();
    //         svg.selectAll('circle[id^=legend]').remove();
    //         svg.selectAll('text[id^=legend]').remove();
    //     }
    //     else { // draw legend if it's toggled
    //         svg
    //             .append('rect')
    //             .attr('x', x + 35)
    //             .attr('y', y + 40)
    //             .attr('width', 180)
    //             .attr('height', 140)
    //             .attr('rx', 5)
    //             .attr('fill', 'white')
    //             .attr('stroke', 'black')
    //             .attr('id', 'legend-box-' + id);

    //         // legend showing values for each piece of the chart
    //         svg
    //             .selectAll('legendCircles')
    //             .data(labels)
    //             .enter()
    //             .append('circle')
    //                 .attr('fill', data => data.color)
    //                 .attr('cx', x + 50) // for x and y, need to remember that 0, 0 for this chart is the center
    //                 .attr('cy', (data, i) => (i * 30) + (y + 60))
    //                 .attr('r', 10)
    //                 .attr('id', (data, i) => `legend-circle-${id}-${i}`);

    //         svg
    //             .selectAll('legendText')
    //             .data(labels)
    //             .enter()
    //             .append('text')
    //                 .attr('text-anchor', 'left')
    //                 .attr('x', 105)
    //                 .attr('y', (data, i) => (i * 30) + 65)
    //                 .attr('id', (data, i) => `legend-text-${id}-${i}`)
    //                 .text(data => data.label);
    //     }
    // }, [legendHidden]);

    return null;
}

export default Legend;
