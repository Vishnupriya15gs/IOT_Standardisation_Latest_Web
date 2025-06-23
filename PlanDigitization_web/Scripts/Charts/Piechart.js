function createPieChart(data, valueProperty, labelProperty, eleID, tooltipLabels, tooltipData, legendTitle, chartTitle) {
    // Clear the existing chart
    $(eleID).empty();

    // Get the width and height of the parent element
    const chartElement = document.querySelector(eleID);
    const width = chartElement.clientWidth;
    const height = chartElement.clientHeight;

    // Set margins
    const margin = { top: 70, right: 150, bottom: 50, left: 50 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

    // Create SVG container
    const svg = d3.select(eleID)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Add x-axis - Title label
    var title = svg.append("text")
        .attr("class", "x-axis-title")
        .text(chartTitle);
    var titleWidth = title.node().getComputedTextLength();
    //console.log(height+":"+width)
    var xTitleTranslate = (width - titleWidth-margin.left-margin.right/2) / 2;
    title.attr("transform", "translate(" + xTitleTranslate + "," + -((3*margin.top) / 4) + ")");

    // Create pie generator
    const pie = d3.pie()
        .value(d => d[valueProperty])
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create arc generator for hover effect
    const arcHover = d3.arc()
        .innerRadius(0)
        .outerRadius(radius + 2);  // Increase the outer radius for hover effect

    // Create color scale with custom palette
    const color = d3.scaleOrdinal(["#4CAF50", "#FFBF00", "#F44336", "#3D85C6", "#BBBBBB"]);

    // Create pie chart
    const path = svg.append("g")
        .attr("transform", `translate(${radius},${radius})`)
        .selectAll("path")
        .data(pie(data))
        .enter().append("path")
        .attr("d", arc)
        .style("stroke", "white")
        .attr("fill", d => color(d.data[labelProperty]))
        .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(200).attr("d", arcHover);
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition().duration(200).attr("d", arc);
        });

    // Calculate total value for percentage calculation
    const totalValue = d3.sum(data, d => d[valueProperty]);

    // Add legends
    const legend = svg.append("g")
        .attr("transform", `translate(${radius * 2 + 20},${margin.top})`);

    // Add legend title
    legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("class", "legend-Title")
        .style("font-size", "12px")
        .text(legendTitle);

    legend.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("id", d => `legend-${d[labelProperty]}`)
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)  // Adjust spacing
        .attr("width", 12)  // Smaller width
        .attr("height", 12)  // Smaller height
        .attr("fill", d => color(d[labelProperty]));

    legend.selectAll("text.legend-label")
        .data(data)
        .enter().append("text")
        .attr("class", "legend-label")
        .attr("x", 16)  // Adjust position
        .attr("y", (d, i) => i * 20 + 6)  // Adjust spacing and position
        .attr("dy", "0.35em")
        .style("font-size", "10px")  // Smaller font size
        .text(d => {
            const value = d[valueProperty];
            const percentage = ((value / totalValue) * 100).toFixed(2);
            return `${d[labelProperty]}: ${value} min (${percentage}%)`;
        });

    // Calculate the height of the legend dynamically
    const legendBBox = legend.node().getBBox();
    const legendHeight = legendBBox.height;

    // Calculate the center position
    const centerY = (height - legendHeight) / 4;

    // Update the legend position
    legend.attr("transform", `translate(${radius * 2 + 20}, ${centerY})`);
}
