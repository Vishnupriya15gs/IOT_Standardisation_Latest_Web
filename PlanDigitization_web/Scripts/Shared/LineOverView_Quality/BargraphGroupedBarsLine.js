
function createBarGraphLineGraphTarget(data, xProperty, yProperty, y1Property, y2Property, eleID, barWidth, labelTitle, tooltipBar1Labels, tooltipBar2Labels, toolitpLineLabels, tooltipBar1Data, tooltipBar2Data, tooltipLineData) {
    
    if (data.length > 0) {
        debugger;
        $(eleID).empty();
        var id = (eleID + 'divmsg');
        if ($(id).length) {
            $(id).remove();
        }

        // Set default dimensions
        const defaultWidth = 600;
        const defaultHeight = 400;

        // Get the width and height of the element
        const chartElement = document.querySelector(eleID);
        const width = chartElement.clientWidth || defaultWidth;
        const height = chartElement.clientHeight || defaultHeight;

        const margin = { top: 40, right: 20, bottom: 80, left: 60 };

        // Calculate inner dimensions
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG container
        var svg = d3.select(eleID)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Set up scales
        var xScale = d3.scaleBand()
            .domain(data.map(d => d[xProperty]))
            .range([0, innerWidth]);
        //.padding(0.2);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property]))])
            .range([innerHeight, 0]);

        // Create axes
        //const xAxis = d3.axisBottom(xScale).tickFormat("");
        const xAxis = d3.axisBottom(xScale);
        //const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2~s"));
        const yAxis = d3.axisLeft(yScale).tickFormat(d => {
            if (d >= 1000) {
                return d3.format(".2s")(d).replace(/G/, "B").replace(/M/, "M").replace(/k/, "k");
            } else {
                const formattedValue = d3.format(".1f")(d); // Use ".1f" to include one decimal place
                return formattedValue.endsWith('.0') ? formattedValue.slice(0, -2) : formattedValue; // Remove trailing '.0'
            }
        });

        // Append axes to the SVG
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
            .call(xAxis)
            .selectAll(".tick text")
            .attr("class", "axis-label");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(yAxis)
            .selectAll(".tick text")
            .attr("class", "axis-label");

        // Create a div element for the tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", `tooltip`)
            .style("opacity", 0);

        // Add bars for value1
        svg.selectAll(".bar1")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth + margin.left)
            .attr("y", d => yScale(d[yProperty]) + margin.top)
            .attr("width", barWidth)
            .attr("height", d => innerHeight - yScale(d[yProperty]))
            .on("mousemove", function (d) {
                // Show tooltip
                const [x, y] = [d3.event.pageX, d3.event.pageY];

                tooltip.transition()
                    .duration(50)
                    .style("opacity", 0.9);

                let tooltipContent = "";

                // Loop through tooltipLabels and tooltipData arrays
                for (let i = 0; i < tooltipBar1Labels.length; i++) {

                    const label = tooltipBar1Labels[i];
                    const dataValue = d[tooltipBar1Data[i]];

                    tooltipContent += `${label} : ${dataValue}<br>`;
                }

                tooltip.html(tooltipContent);

                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;

                // Check if the tooltip goes beyond the right edge of the page
                if (x + tooltipWidth > window.innerWidth) {

                    tooltip.style("left", `${x - tooltipWidth}px`);
                }
                else {

                    tooltip.style("left", `${x}px`);
                }

                // Check if the tooltip goes beyond the bottom edge of the page
                if (y + tooltipHeight > window.innerHeight) {

                    tooltip.style("top", `${y - tooltipHeight}px`);
                } else {

                    tooltip.style("top", `${y}px`);
                }

            })
            .on("mouseout", function () {
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add bars for value2
        svg.selectAll(".bar2")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
            .attr("y", d => yScale(d[y1Property]) + margin.top)
            .attr("width", barWidth)
            .attr("height", d => innerHeight - yScale(d[y1Property]))
            .on("mousemove", function (d) {
                // Show tooltip
                const [x, y] = [d3.event.pageX, d3.event.pageY];
                tooltip.transition()
                    .duration(50)
                    .style("opacity", 0.9);

                let tooltipContent = "";

                // Loop through tooltipLabels and tooltipData arrays
                for (let i = 0; i < tooltipBar2Labels.length; i++) {

                    const label = tooltipBar2Labels[i];
                    const dataValue = d[tooltipBar2Data[i]];

                    tooltipContent += `${label} : ${dataValue}<br>`;
                }

                tooltip.html(tooltipContent);

                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;

                // Check if the tooltip goes beyond the right edge of the page
                if (x + tooltipWidth > window.innerWidth) {

                    tooltip.style("left", `${x - tooltipWidth}px`);
                }
                else {

                    tooltip.style("left", `${x}px`);
                }

                // Check if the tooltip goes beyond the bottom edge of the page
                if (y + tooltipHeight > window.innerHeight) {

                    tooltip.style("top", `${y - tooltipHeight}px`);
                } else {

                    tooltip.style("top", `${y}px`);
                }

            })
            .on("mouseout", function () {
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add line graph
        var line = d3.line()
            .x(d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
            .y(d => yScale(d[y2Property]) + margin.top);

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "black")
            .style("fill", "none");

        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "linegraphCircle")
            .attr("cx", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
            .attr("cy", d => yScale(d[y2Property]) + margin.top)
            .attr("r", 3)
            .on("mousemove", function (d) {
                // Show tooltip
                const [x, y] = [d3.event.pageX, d3.event.pageY];

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                let tooltipContent = "";

                for (let i = 0; i < toolitpLineLabels.length; i++) {
                    const label = toolitpLineLabels[i];
                    const dataValue = d[tooltipLineData[i]];
                    tooltipContent += `${label} : ${dataValue}<br>`;
                }

                tooltip.html(tooltipContent);

                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;

                // Check if the tooltip goes beyond the right edge of the page
                if (x + tooltipWidth > window.innerWidth) {

                    tooltip.style("left", `${x - tooltipWidth}px`);
                }
                else {

                    tooltip.style("left", `${x}px`);
                }

                // Check if the tooltip goes beyond the bottom edge of the page
                if (y + tooltipHeight > window.innerHeight) {

                    tooltip.style("top", `${y - tooltipHeight}px`);
                } else {

                    tooltip.style("top", `${y}px`);
                }

            })
            .on("mouseout", function () {
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        // Add x-axis label
        var value = svg.append("text")
            .attr("class", "x-axis-label")
            .text(labelTitle[0])
            .style("font-size", "12px");
        var valueWidth = value.node().getComputedTextLength();
        var xValueTranslate = ((innerWidth - valueWidth) / 2) + margin.left;
        value.attr("transform", "translate(" + xValueTranslate + "," + (height - (margin.bottom / 2)) + ")");

        // Add y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -height / 2)
            .attr("y", margin.left / 4)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text(labelTitle[1]);

        // Add x-axis - Title label
        var title = svg.append("text")
            .attr("class", "x-axis-title")
            .text(labelTitle[2]);
        var titleWidth = title.node().getComputedTextLength();
        var xTitleTranslate = (width - titleWidth) / 2;
        title.attr("transform", "translate(" + xTitleTranslate + "," + (margin.top / 2) + ")");

    }
    else {
      
        $(eleID).empty();
        const chartElement = document.querySelector(eleID);
        const width = chartElement.clientWidth || defaultWidth;
        const height = chartElement.clientHeight || defaultHeight;

        const margin = { top: 40, right: 20, bottom: 80, left: 60 };

        
        // Create SVG container
        var svg = d3.select(eleID)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("text")
            .attr("x", 250)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-family", "arial")
            .attr("text-anchor", "start")
            .style("font-size", 13)
            .text("No Data for Entire Shift");
    }
}