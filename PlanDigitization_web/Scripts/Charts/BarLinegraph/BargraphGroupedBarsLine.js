/**
 * 
 * @param {any} data
 * @param {any} xProperty
 * @param {any} yProperty
 * @param {any} y1Property
 * @param {any} y2Property
 * @param {any} eleID
 * @param {any} barWidth
 * @param {any} labelTitle
 * @param {any} tooltipBar1Labels
 * @param {any} tooltipBar2Labels
 * @param {any} toolitpLineLabels
 * @param {any} tooltipBar1Datas
 * @param {any} tooltipBar2Data
 * @param {any} tooltipLineData
 */

//function createChartLegend(mainDiv, group) {
//    var keys = group;
//    var colors = ["#77A5D9", "#EC3D34", "#2AB835"];
//    $("#legend_chartTarget").html("");
//    keys.forEach((d, i) => {
//        $("#legend_chartTarget").append(`
//            <span class='team-graph team1' style='display: inline-block; margin-right:10px;'>
//                <span style='background:${colors[i]}; width: 10px; height: 10px; display: inline-block; vertical-align: middle;'>&nbsp;</span>
//                <span style='padding-top: 0; font-family:Source Sans Pro, sans-serif; font-size: 13px; display: inline;'>${d} </span>
//            </span>
//        `);
//    });
//}

function createGroupedBarLineGraph(data, xProperty, yProperty, y1Property, y2Property, eleID, barWidth, labelTitle, tooltipBar1Labels, tooltipBar2Labels, toolitpLineLabels, tooltipBar1Data, tooltipBar2Data, tooltipLineData, graph_type,legendEnable,heightEnable) {

    $(eleID).empty();
    const defaultWidth = 600;
    const defaultHeight = 400;
    const chartElement = document.querySelector(eleID);
    const width = chartElement.clientWidth || defaultWidth;
    const height = chartElement.clientHeight || defaultHeight;

    

    var margin = { top: 50, right: 20, bottom: 60, left: 60 };
    var margintop = margin.top;
    const marginMultiple = 2;

    if (heightEnable) {
        //console.log(eleID+":"+heightEnable)
        margin.top = marginMultiple * margin.top;
    }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //$("#legend_chartTarget").html("");
    const leg_name = ["Plant for the Shift", "Actual < Plan", "Actual"];
    //createChartLegend("#charts2", leg_name);

    const svg = d3.select(eleID)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //console.log(data.map(d => d[xProperty])); // Should output ['A', 'B', 'C']


    const xScale = d3.scaleBand()
        .domain(data.map(d => d[xProperty]))
        .range([0, innerWidth])
        .padding(0.2);

    const max_value = d3.max(data, d => Math.max(d[yProperty], d[y1Property], d[y2Property]));
    const yScale = d3.scaleLinear()
        .domain([0, max_value])
        .range([innerHeight, 0]);

    const tickValues = Array.from({ length: 5 }, (_, i) => (max_value / 5) * (i + 1));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat(d => d >= 1000 ? d3.format(".2s")(d).replace(/G/, "B").replace(/M/, "M").replace(/k/, "k") : d3.format(".1f")(d));

    // Add x-axis - Title label
    var title = svg.append("text")
        .attr("class", "x-axis-title")
        .text(labelTitle[2]);
    var titleWidth = title.node().getComputedTextLength();
    var xTitleTranslate = (width - titleWidth) / 2;
    title.attr("transform", "translate(" + xTitleTranslate + "," + (margintop / 2) + ")");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(yAxis);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
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
        //.on("mousemove", function (event, d) {
        //    // Tooltip logic for bar1
        //})
        .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

    // Add bars for value2
    svg.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[y1Property]) + margin.top)
        .attr("width", barWidth)
        .attr("height", d => innerHeight - yScale(d[y1Property]))
        //.on("mousemove", function (event, d) {
        //    // Tooltip logic for bar2
        //})
        .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

    // Add labels, axes labels, and titles...

    //const customFormat = value => {
    //    if (typeof value !== 'number' || isNaN(value)) {
    //        return ''; // Handle non-numeric values
    //    }
    //    return value < 1000 ? d3.format(",")(value) : d3.format(".2~s")(value);
    //};

    function customFormat(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return ''; // Handle non-numeric values
        }
        if (value < 1000) {
            return d3.format(",")(value); // Format numbers less than 1000
        } else if (value < 1e6) {
            return d3.format(".2f")(value / 1e3) + 'k'; // Thousands
        } else if (value < 1e9) {
            return d3.format(".2f")(value / 1e6) + 'M'; // Millions
        } else {
            return d3.format(".2f")(value / 1e9) + 'G'; // Billions
        }
    }


    // Add bar labels
    if (graph_type === "hourly") {
        svg.selectAll(".bar-label")
            .data(data)
            .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth / 2 + margin.left)
            .attr("y", d => yScale(d[yProperty]) + margin.top)
            .attr("text-anchor", "middle")
            //.attr("transform", d => {
            //    const x = xScale(d[xProperty]) + xScale.bandwidth() / 2 - barWidth + margin.left;
            //    const y = yScale(d[y1Property]) + margin.top - barWidth;
            //    return `rotate(-90, ${x}, ${y})`;
            //})
            .text(d => customFormat(d[yProperty]));
    }

    //// Add x-axis and y-axis labels and titles...
    //const labels1 = svg.selectAll(".bar2-label")
    //    .data(data)
    //    .enter().append("text")
    //    .attr("class", "bar2-label")
    //    .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
    //    .attr("y", d => yScale(d[y1Property]) + margin.top - 6)
    //    .attr("text-anchor", "middle")
    //    .text(function (d) { return customFormat(d[y1Property]); });

    const labels1 = svg.selectAll(".bar2-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar2-label")
        .attr("x", d => xScale(d[xProperty]) + xScale.bandwidth() / 2 + margin.left)
        .attr("y", d => yScale(d[y1Property]) + margin.top)
        .attr("text-anchor", "middle")
        .attr("transform", d => {
            const x = xScale(d[xProperty]) + xScale.bandwidth() / 2  + margin.left;
            const y = yScale(d[y1Property]) + margin.top - barWidth;
            return `rotate(-90, ${x}, ${y})`;
        })
        .text(d => customFormat(d[y1Property]));

    // Add x-axis label
    var value = svg.append("text")
        .attr("class", "x-axis-label")
        .text(labelTitle[0])
        .style("font-size", "12px");
    var valueWidth = value.node().getComputedTextLength();
    var xValueTranslate = ((innerWidth - valueWidth) / 2) + margin.left;
    value.attr("transform", "translate(" + xValueTranslate + "," + (height - (margin.bottom / 3)) + ")");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", margin.left / 4)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text(labelTitle[1]);

    
    

    if (legendEnable) {
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${0}, ${margin.top / 2})`);

        const legendData = [
            { label: "Plant for the Shift", color: "#77A5D9" },
            { label: "Actual < Plan", color: "#EC3D34" },
            { label: "Actual", color: "#2AB835" }
        ];

        const legendItemWidth = width / legendData.length;
        const legendSpacing = legendItemWidth /4;

        const legendItem = legend.selectAll(".legend-item")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(${i * legendItemWidth + legendSpacing}, 0)`);

        legendItem.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", d => d.color);

        legendItem.append("text")
            .attr("x", 16)
            .attr("y", 6)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .style("font-size", "10px")
            .text(d => d.label);
    }

    



}

function lessThanEqual(x, y) {
    return x <= y;
}

function greaterThanEqual(x, y) {
    return x >= y;
}
