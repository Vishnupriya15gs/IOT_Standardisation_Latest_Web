const lineTooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function bar_lineChart(id, data, lineData, xAxisData, yAxisData, lineAxisData, splitChar, xAxisLabel, yAxisLabel) {
    $(id).empty();
    //var data = response.data.Table;
    //var lineData = response.data.Table1;

    // Set the dimensions of our chart to be displayed
    var barsWidth = 500,
        barsHeight = 200,
        axisMargin = 50;

    var chartHeight = barsHeight + axisMargin,
        chartWidth = barsWidth + axisMargin;

    // Combine data from both datasets
    var combinedData = data.map(d => {
        var correspondingLineData = lineData.find(ld => ld[xAxisData] === d[xAxisData]);
        return { ...d, [lineAxisData]: correspondingLineData ? correspondingLineData[lineAxisData] : 0 };
    });

    var numBars = combinedData.length;

    var maxDataValue = d3.max(combinedData, d => Math.max(d[yAxisData], d[lineAxisData]) + 10);

    // Select the chart element on the page so we can reference it in code
    // Also set the width and height attributes of the chart SVG
    var chart = d3.select(id)
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    // Create a linear scale for our y-axis to map datapoint values to pixel heights of bars
    var yScale = d3.scaleLinear()
        .domain([0, maxDataValue])
        .range([barsHeight, 0]);

    // Create a scale that returns the bands each bar should be in along the x-axis
    let xScale = d3.scaleBand()
        .domain(combinedData.map(d => d[xAxisData])) //.split("T")[0].split("-")[splitChar]
        .range([0, barsWidth])
        .padding(0.1);

    // Calculate the bar width based on the number of bars
    if (id == '#chart') {
        var barWidth = numBars > 15 ? xScale.bandwidth() : 30; // Set a minimum bar width when only one bar is present
    }
    if (id == '#svgbarmonthly') {
        var barWidth = numBars > 6 ? xScale.bandwidth() : 30; // Set a minimum bar width when only one bar is present
    }
    
    // Create an SVG group that we will add the individual bar elements of our chart to
    var bars = chart.append('g')
        .attr('id', 'bars-container');
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Bind the data to our .bars svg elements
    // Create a rectangle for each data point and set position and dimensions using scales
    bars.selectAll('.bar')
        .data(combinedData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d[xAxisData]) + (xScale.bandwidth() - barWidth) / 2) //.split("T")[0].split("-")[splitChar]
        .attr('y', d => yScale(d[yAxisData]))
        .attr('width', barWidth)
        .style("fill", function (d, i) {
            return d[yAxisData] >= d[lineAxisData] ? "#4CAF50" : "#F44336";
        })
        .attr('height', d => barsHeight - yScale(d[yAxisData]))
        .on("mouseout", function () {
            d3.select(this).style("stroke", "");
            tooltip.style("opacity", "0");
        })

        .on("mousemove", function (d) {
            tooltip.style("opacity", "1")
                .style("top", `${d3.event.pageY - 30}px`)
                .style("left", `${d3.event.pageX + 20}px`);

            const text = `<b>${yAxisLabel}:</b> ${d[yAxisData]}<br/><b>Target Count:</b> ${d[lineAxisData]}<br/><b>${xAxisLabel}:</b>${d[xAxisData]}`;
            tooltip.html(text);
        })
        .on('click', function (event, data) {
            // Call the popup function on click
            showPopup(d);
        });

    // Move the bars so that there is space on the left for the y-axis
    bars.attr('transform', 'translate(' + axisMargin + ',0)');

    // Create a new SVG group for the y-axis elements
    // Generate the y-axis with 10 ticks and move into position
    //var yAxis = chart.append('g')
    //    .attr('id', 'y-axis')
    //    .call(d3.axisLeft(yScale).ticks(10))
    //    .attr('transform', 'translate(' + axisMargin + ',0)');
     var yAxis = chart.append('g')
        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(10).tickFormat(function (d) {
            return d >= 1000 ? d / 1000 + "K" : d;
        }))
        .attr('transform', 'translate(' + axisMargin + ',0)');
    // Create another group for the x-axis elements
    // Generate the x-axis using the our x scale and move into position
    // Select the text elements and rotate by 45 degrees
    var xAxis = chart.append('g')
        .attr('id', 'x-axis')
        .call(d3.axisBottom(xScale))
        .attr('transform', 'translate(' + axisMargin + ',' + barsHeight + ')')
        .selectAll('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(0)');

    // Set up scales for line graph
    var lineXScale = d3.scaleBand()
        .domain(combinedData.map(d => d[xAxisData]))
        .range([0, barsWidth])
        .padding(0.1);

    var lineYScale = d3.scaleLinear()
        .domain([0, maxDataValue])
        .range([barsHeight, 0]);

    // Draw line
    var line = d3.line()
        .x(d => lineXScale(d[xAxisData]) + lineXScale.bandwidth() / 2)
        .y(d => lineYScale(d[lineAxisData]));

    // Append a new group for the line graph
    var lineGraph = chart.append('g')
        .attr('id', 'line-graph')
        .attr('transform', 'translate(' + axisMargin + ',0)');

    // Bind the data to the line graph and draw the line
    lineGraph.append('path')
        .data([combinedData])
        .attr('class', 'line')
        .attr('d', line)
        .style("stroke", "black") // Set the line color to black
        .style("stroke-width", 1) // Set the line width to 1 pixel
        .style("fill", "none");


    // Adding circles
    chart.selectAll(".circle")
        .data(combinedData)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d[xAxisData]) + xScale.bandwidth() / 2 + axisMargin) // Apply axis margin to the x-coordinate //.split("T")[0].split("-")[splitChar]
        .attr("cy", d => yScale(d[lineAxisData]))
        .attr("r", 3) // Set the radius of the circle to 3 pixels
        .style("fill", "black"); // Set the fill color of the circle to black


    bars.append('text')
        .attr('x', -90)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)

    bars.append('text')
        .attr('x', 220)
        .attr('y', 235)
        .attr('text-anchor', 'middle')
        .text(xAxisLabel)
}

function Stackedgrapgh() {
    //const rawData = [
    //    { Month: "November", Year: 2023, Planned: 10, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 5, Device_Decscription: "DC Tool" },
    //    { Month: "November", Year: 2023, Planned: 7, PastMonth_Completed: 1, Completed: 3, OverDue: 2, NotDue: 1, Completed_delay: 4, Device_Decscription: "Fixture" },
    //    { Month: "December", Year: 2023, Planned: 7, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 2, Device_Decscription: "Fixture" },
    //    { Month: "December", Year: 2023, Planned: 5, PastMonth_Completed: 1, Completed: 2, OverDue: 1, NotDue: 1, Completed_delay: 1, Device_Decscription: "DC Tool" },
    //    { Month: "December", Year: 2023, Planned: 3, PastMonth_Completed: 1, Completed: 1, OverDue: 1, NotDue: 0, Completed_delay: 0, Device_Decscription: "Gauges" },
    //    { Month: "January", Year: 2024, Planned: 5, PastMonth_Completed: 1, Completed: 1, OverDue: 2, NotDue: 1, Completed_delay: 1, Device_Decscription: "Gauges" },
    //    { Month: "January", Year: 2024, Planned: 10, PastMonth_Completed: 2, Completed: 3, OverDue: 1, NotDue: 2, Completed_delay: 4, Device_Decscription: "DC Tool" },
    //    { Month: "February", Year: 2024, Planned: 20, PastMonth_Completed: 7, Completed: 6, OverDue: 2, NotDue: 8, Completed_delay: 4, Device_Decscription: "Fixture" }
    //];

    //// Aggregate data based on month
    //const aggregatedData = [];
    //const deviceDescriptionsByMonth = {};
    //rawData.forEach(entry => {
    //    const key = `${entry.Month}-${entry.Year}`; //Month Check
    //    if (!deviceDescriptionsByMonth[key]) {
    //        deviceDescriptionsByMonth[key] = new Set();
    //    }
    //    deviceDescriptionsByMonth[key].add(entry.Device_Decscription);

    //    const existingEntryIndex = aggregatedData.findIndex(item => item.Month === entry.Month && item.Year === entry.Year);
    //    if (existingEntryIndex === -1) {
    //        aggregatedData.push({ ...entry });
    //    } else {
    //        Object.keys(entry).forEach(prop => {
    //            if (typeof entry[prop] === 'number' && prop !== 'Year') {
    //                aggregatedData[existingEntryIndex][prop] += entry[prop];
    //            }
    //        });
    //    }
    //});

    //// Generate dropdown options
    //const dropdown = d3.select("#deviceDropdown");
    //dropdown.selectAll("option").remove(); // Clear existing options

    //dropdown.append("option").text("All Devices"); // Add option for all devices

    //const uniqueDeviceDescriptions = {}; // Object to store unique device descriptions for each month

    //// Iterate through aggregated data to collect unique device descriptions for each month
    //aggregatedData.forEach(d => {
    //    const key = `${d.Month}-${d.Year}`;
    //    if (!uniqueDeviceDescriptions[key]) {
    //        uniqueDeviceDescriptions[key] = new Set();
    //    }
    //    uniqueDeviceDescriptions[key].add(d.Device_Decscription);
    //});

    //// Iterate through uniqueDeviceDescriptions to append options for each month to the dropdown
    //Object.keys(uniqueDeviceDescriptions).forEach(key => {
    //    dropdown.append("optgroup").attr("label", key);
    //    uniqueDeviceDescriptions[key].forEach(device => {
    //        dropdown.append("option").text(device);
    //    });
    //});

    //const currentYear = new Date().getFullYear();
    //const lastYear = currentYear - 1;

    //const months = [];
    //for (let year = lastYear; year <= currentYear; year++) {
    //    for (let month = 0; month < 12; month++) {
    //        months.push({ name: new Date(year, month).toLocaleString('en-us', { month: 'long' }), year: year });
    //    }
    //}

    //const keys = ["PastMonth_Completed", "Completed", "OverDue", "NotDue", "Completed_delay"];

    //const svg = d3.select("#svgstacked");
    //const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    //const width = +svg.attr("width") - margin.left - margin.right;
    //const height = +svg.attr("height") - margin.top - margin.bottom;
    //const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //const x = d3.scaleBand()
    //    .rangeRound([0, width])
    //    .paddingInner(0.05)
    //    .align(0.1)
    //    .domain(months.map(month => `${month.name}-${month.year}`));

    //const y = d3.scaleLinear()
    //    .rangeRound([height, 0])
    //    .domain([0, d3.max(aggregatedData, d => d3.sum(keys, key => d[key]))]).nice();

    //const color = d3.scaleOrdinal()
    //    .range(["#808080", "#008000", "#FF0000", "#FFFF00", "#FFA500"]);

    //// Draw stacked bars
    //function drawBars(selectedData) {
    //    g.selectAll(".barGroup").remove();

    //    g.append("g")
    //        .selectAll("g")
    //        .data(d3.stack().keys(keys)(selectedData))
    //        .enter().append("g")
    //        .attr("class", "barGroup")
    //        .attr("fill", d => color(d.key))
    //        .selectAll("rect")
    //        .data(d => d)
    //        .enter().append("rect")
    //        .attr("x", d => x(`${d.data.Month}-${d.data.Year}`))
    //        .attr("y", d => y(d[1]))
    //        .attr("height", d => y(d[0]) - y(d[1]))
    //        .attr("width", x.bandwidth())
    //        .append("title") // Add tooltip
    //        .text(d => {
    //            let tooltipText = `${d.data.Device_Decscription}:\n`;
    //            keys.forEach(key => {
    //                tooltipText += `${key}: ${d.data[key]}\n`;
    //            });
    //            return tooltipText;
    //        }); // Display data on hover
    //}

    //// Draw x-axis
    //function drawXAxis() {
    //    g.select(".x-axis").remove();

    //    g.append("g")
    //        .attr("class", "x-axis")
    //        .attr("transform", "translate(0," + height + ")")
    //        .call(d3.axisBottom(x)
    //            .tickSizeOuter(0))
    //        .selectAll("text")
    //        .style("text-anchor", "end")
    //        .attr("dx", "-.8em")
    //        .attr("dy", ".15em")
    //        .attr("transform", "rotate(-65)");
    //}

    //// Draw y-axis
    //function drawYAxis() {
    //    g.select(".y-axis").remove();

    //    g.append("g")
    //        .attr("class", "y-axis")
    //        .call(d3.axisLeft(y).ticks(null, "s"))
    //        .append("text")
    //        .attr("x", 2)
    //        .attr("y", y(y.ticks().pop()) + 0.5)
    //        .attr("dy", "0.32em")
    //        .attr("fill", "#000")
    //        .attr("font-weight", "bold")
    //        .attr("text-anchor", "start")
    //        .text("Value");
    //}

    //// Draw line for planned data
    //function drawLine(selectedData) {
    //    const line = d3.line()
    //        .x(d => x(`${d.Month}-${d.Year}`) + x.bandwidth() / 2)
    //        .y(d => y(d.Planned));

    //    g.select(".line").remove();

    //    g.append("path")
    //        .datum(selectedData)
    //        .attr("class", "line")
    //        .attr("fill", "none")
    //        .attr("stroke", "#008080")
    //        .attr("stroke-width", 2)
    //        .attr("d", line)
    //        .append("title") // Add tooltip
    //        .text(d => `Planned: ${d[0].Planned}`); // Display data on hover
    //}

    //// Draw initial graph
    //function drawGraph(selectedDevice) {
    //    const selectedData = selectedDevice === "All Devices" ? aggregatedData : aggregatedData.filter(d => d.Device_Decscription === selectedDevice);
    //    const plannedData = selectedDevice === "All Devices" ? aggregatedData : aggregatedData.filter(d => d.Device_Decscription === selectedDevice);
    //    drawBars(selectedData);
    //    drawLine(plannedData); // Draw line for total planned data
    //    drawXAxis();
    //    drawYAxis();
    //}

    //// Event listener for dropdown change
    //dropdown.on("change", function () {
    //    const selectedDevice = this.value;
    //    drawGraph(selectedDevice);
    //});

    //// Draw initial graph with "All Devices" selected
    //drawGraph("All Devices");

    //Sunday Coding
    //const rawData = [
    //    { Month: "November", Year: 2023, Planned: 10, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 5, Device_Decscription: "DC Tool" },
    //    { Month: "November", Year: 2023, Planned: 7, PastMonth_Completed: 1, Completed: 3, OverDue: 2, NotDue: 1, Completed_delay: 4, Device_Decscription: "Fixture" },
    //    { Month: "December", Year: 2023, Planned: 7, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 2, Device_Decscription: "Fixture" },
    //    { Month: "December", Year: 2023, Planned: 5, PastMonth_Completed: 1, Completed: 2, OverDue: 1, NotDue: 1, Completed_delay: 1, Device_Decscription: "DC Tool" },
    //    { Month: "December", Year: 2023, Planned: 3, PastMonth_Completed: 1, Completed: 1, OverDue: 1, NotDue: 0, Completed_delay: 0, Device_Decscription: "Gauges" },
    //    { Month: "January", Year: 2024, Planned: 5, PastMonth_Completed: 1, Completed: 1, OverDue: 2, NotDue: 1, Completed_delay: 1, Device_Decscription: "Gauges" },
    //    { Month: "January", Year: 2024, Planned: 10, PastMonth_Completed: 2, Completed: 3, OverDue: 1, NotDue: 2, Completed_delay: 4, Device_Decscription: "DC Tool" },
    //    { Month: "February", Year: 2024, Planned: 20, PastMonth_Completed: 7, Completed: 6, OverDue: 2, NotDue: 8, Completed_delay: 4, Device_Decscription: "Fixture" },
    //    { Month: "March", Year: 2024, Planned: 15, PastMonth_Completed: 7, Completed: 6, OverDue: 2, NotDue: 8, Completed_delay: 4, Device_Decscription: "Fixture" }
    //];

    //function drawGraphs(selectedDevice) {
    //    let filteredData = rawData;
    //    if (selectedDevice !== "All") {
    //        filteredData = rawData.filter(d => d.Device_Decscription === selectedDevice);
    //    }

    //    const months = [...new Set(filteredData.map(d => d.Month))];
    //    const dataByMonth = months.map(month => {
    //        const monthData = filteredData.filter(d => d.Month === month);
    //        return {
    //            Month: month,
    //            Planned: d3.sum(monthData, d => d.Planned),
    //            PastMonth_Completed: d3.sum(monthData, d => d.PastMonth_Completed),
    //            Completed: d3.sum(monthData, d => d.Completed),
    //            OverDue: d3.sum(monthData, d => d.OverDue),
    //            NotDue: d3.sum(monthData, d => d.NotDue),
    //            Completed_delay: d3.sum(monthData, d => d.Completed_delay)
    //        };
    //    });

    //    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    //    const width = 400 - margin.left - margin.right;
    //    const height = 200 - margin.top - margin.bottom;

    //    const x = d3.scaleBand()
    //        .domain(dataByMonth.map(d => d.Month))
    //        .range([margin.left, width - margin.right])
    //        .padding(0.1);

    //    const y = d3.scaleLinear()
    //        .domain([0, d3.max(dataByMonth, d => Math.max(d.Planned, d.PastMonth_Completed, d.Completed, d.OverDue, d.NotDue, d.Completed_delay))])
    //        .nice()
    //        .range([height - margin.bottom, margin.top]);

    //    const svg = d3.select("#graphs").append("svg")
    //        .attr("width", width + margin.left + margin.right)
    //        .attr("height", height + margin.top + margin.bottom)
    //        .append("g")
    //        .attr("transform", `translate(${margin.left},${margin.top})`);

    //    const color = d3.scaleOrdinal()
    //        .domain(["PastMonth_Completed", "Completed", "OverDue", "NotDue", "Completed_delay"])
    //        .range(d3.schemeCategory10);

    //    const line = d3.line()
    //        .x(d => x(d.Month) + x.bandwidth() / 2)
    //        .y(d => y(d.Planned));

    //    // Draw line graph first to ensure it's on top
    //    svg.append("path")
    //        .datum(dataByMonth)
    //        .attr("class", "line") // Added class for styling
    //        .attr("fill", "none")
    //        .attr("stroke", "black") // Changed stroke color to black
    //        .attr("stroke-width", 2)
    //        .attr("d", line);

    //    // Adding circles to the line
    //    svg.selectAll("circle")
    //        .data(dataByMonth)
    //        .enter().append("circle")
    //        .attr("cx", d => x(d.Month) + x.bandwidth() / 2)
    //        .attr("cy", d => y(d.Planned))
    //        .attr("r", 4)
    //        .attr("fill", "black");

    //    svg.append("g")
    //        .selectAll("g")
    //        .data(d3.stack().keys(["PastMonth_Completed", "Completed", "OverDue", "NotDue", "Completed_delay"])(dataByMonth))
    //        .enter().append("g")
    //        .attr("fill", d => color(d.key))
    //        .selectAll("rect")
    //        .data(d => d)
    //        .enter().append("rect")
    //        .attr("x", d => x(d.data.Month))
    //        .attr("y", d => y(d[1]))
    //        .attr("height", d => y(d[0]) - y(d[1]))
    //        .attr("width", x.bandwidth());

    //    svg.append("g")
    //        .attr("transform", `translate(0,${height - margin.bottom})`)
    //        .call(d3.axisBottom(x));

    //    svg.append("g")
    //        .attr("transform", `translate(${margin.left},0)`)
    //        .call(d3.axisLeft(y));

    //    const legend = svg.append("g")
    //        .attr("font-family", "sans-serif")
    //        .attr("font-size", 10)
    //        .attr("text-anchor", "end")
    //        .selectAll("g")
    //        .data(["PastMonth_Completed", "Completed", "OverDue", "NotDue", "Completed_delay"].slice().reverse())
    //        .enter().append("g")
    //        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    //    legend.append("rect")
    //        .attr("x", width - 19)
    //        .attr("width", 19)
    //        .attr("height", 19)
    //        .attr("fill", color);

    //    legend.append("text")
    //        .attr("x", width - 24)
    //        .attr("y", 9.5)
    //        .attr("dy", "0.32em")
    //        .text(d => d);
    //}

    //const deviceDropdown = document.getElementById("device");
    //deviceDropdown.addEventListener("change", function () {
    //    const selectedDevice = this.value;
    //    document.getElementById("graphs").innerHTML = "";
    //    drawGraphs(selectedDevice);
    //});

    //// Initial call to draw the graphs with "All" selected
    //drawGraphs("All");


    //Work from home 25th March 2024
    $("#graphs").empty();
    const rawData = [
        { Month: "November", Year: 2023, Planned: 10, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 5, Device_Decscription: "DC Tool" },
        { Month: "November", Year: 2023, Planned: 7, PastMonth_Completed: 1, Completed: 3, OverDue: 2, NotDue: 1, Completed_delay: 4, Device_Decscription: "Fixture" },
        { Month: "December", Year: 2023, Planned: 7, PastMonth_Completed: 2, Completed: 2, OverDue: 1, NotDue: 2, Completed_delay: 2, Device_Decscription: "Fixture" },
        { Month: "December", Year: 2023, Planned: 5, PastMonth_Completed: 1, Completed: 2, OverDue: 1, NotDue: 1, Completed_delay: 1, Device_Decscription: "DC Tool" },
        { Month: "December", Year: 2023, Planned: 3, PastMonth_Completed: 1, Completed: 1, OverDue: 1, NotDue: 0, Completed_delay: 0, Device_Decscription: "Gauges" },
        { Month: "January", Year: 2024, Planned: 5, PastMonth_Completed: 1, Completed: 1, OverDue: 2, NotDue: 1, Completed_delay: 1, Device_Decscription: "Gauges" },
        { Month: "January", Year: 2024, Planned: 10, PastMonth_Completed: 2, Completed: 3, OverDue: 1, NotDue: 2, Completed_delay: 4, Device_Decscription: "DC Tool" },
        { Month: "February", Year: 2024, Planned: 20, PastMonth_Completed: 7, Completed: 6, OverDue: 2, NotDue: 8, Completed_delay: 4, Device_Decscription: "Fixture" },
        { Month: "March", Year: 2024, Planned: 15, PastMonth_Completed: 7, Completed: 6, OverDue: 2, NotDue: 8, Completed_delay: 4, Device_Decscription: "Fixture" }
    ];

    const svg = d3.select("#graphs"),
        margin = { top: 20, right: 20, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    const keys = ["PastMonth_Completed", "Completed", "OverDue", "NotDue", "Completed_delay"];

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#404040", "#4caf50", "#F44336", "#FFFF00", "#FFA500"]);

    const stack = d3.stack().keys(keys);

    // Define a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const updateChart = (selectedDevice) => {
        let filteredData = rawData;
        if (selectedDevice !== "All") {
            filteredData = rawData.filter(d => d.Device_Decscription === selectedDevice);
        }
        const stackedData = stack(filteredData);

        x.domain(filteredData.map(d => `${d.Month.slice(0, 3)} ${d.Year}`));
        y.domain([0, d3.max(filteredData, d => d3.sum(keys, key => d[key]))]);

        g.selectAll(".bars").remove();
        g.selectAll(".line").remove();
        g.selectAll(".circle").remove();

        g.selectAll(".bars")
            .data(stackedData)
            .enter().append("g")
            .attr("class", "bars")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            .attr("x", d => x(`${d.data.Month.slice(0, 3)} ${d.data.Year}`))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mouseover", function (d) {
                const propName = keys.find(key => d.data[key] === d[1] - d[0]);
                const propValue = d[1] - d[0];
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${propName}: ${propValue}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.select(".axis-x").remove();
        g.append("g")
            .attr("class", "axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.select(".axis-y").remove();
        g.append("g")
            .attr("class", "axis-y")
            .call(d3.axisLeft(y).ticks(null, "s"));

        const plannedData = filteredData.reduce((acc, curr) => {
            acc[`${curr.Month.slice(0, 3)} ${curr.Year}`] = (acc[`${curr.Month.slice(0, 3)} ${curr.Year}`] || 0) + curr.Planned;
            return acc;
        }, {});

        const plannedLine = d3.line()
            .x(d => x(d[0]) + x.bandwidth() / 2)
            .y(d => y(d[1]));

        g.append("path")
            .datum(Object.entries(plannedData))
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("d", plannedLine);

        // Append x axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 40)
            .style("text-anchor", "middle")
            .text("Months");

        // Append y axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height / 2))
            .attr("y", 20)
            .style("text-anchor", "middle")
            .text("Calibration value");

        g.selectAll(".circle")
            .data(Object.entries(plannedData))
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => x(`${d[0].slice(0, 3)} ${d[0].slice(4)}`) + x.bandwidth() / 2)
            .attr("cy", d => y(d[1]))
            .attr("r", 4)
            .attr("fill", "blue")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Planned: ${d[1]}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Append legend
        //const legend = d3.select("body")
        //    .append("ul")
        //    .attr("class", "legend");

        //legend.style("margin-top", "-18px"); // Applying margin-top to the ul element

        //const legendItems = legend.selectAll("li")
        //    .data(keys)
        //    .enter()
        //    .append("li");

        //legendItems.append("span")
        //    .attr("class", d => d.toLowerCase().replace(/\s+/g, "-"))
        //    .style("background-color", color);

        //legendItems.append("text")
        //    .text(d => d);
    };


    const uniqueDevices = ["All", ...new Set(rawData.map(d => d.Device_Decscription))];

    const deviceDropdown = d3.select("#device");
    deviceDropdown.selectAll("option")
        .data(uniqueDevices)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    deviceDropdown.on("change", () => {
        const selectedDevice = deviceDropdown.property("value");
        updateChart(selectedDevice);
    });

    updateChart("All"); // Initially update chart with all data


}



function stacked_bargraph() {
const data = [
  { group: 'Group 1', barValue: 20, lineValue: 15 },
  { group: 'Group 2', barValue: 30, lineValue: 25 },
  // Add more data as needed
];

// Set up the dimensions of the chart
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const xScale = d3.scaleBand()
  .domain(data.map(d => d.group))
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => Math.max(d.barValue, d.lineValue))])
  .range([height, 0]);

// Create bars
svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.group))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.barValue))
    .attr("height", d => height - yScale(d.barValue));

// Create line
const line = d3.line()
  .x(d => xScale(d.group) + xScale.bandwidth() / 2)
  .y(d => yScale(d.lineValue));

svg.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", line);

// Add axes
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));

svg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(yScale));


}

function showPopup(data) {
    // You can customize the content of the popup based on the data
    alert("Clicked on bar with value: " + data[yAxisData]);
}

function barGraph_Pareto(id, data, xAxisData, yAxisData, lineAxisData, xAxisLabel, yAxisLabel, chartHeading) {
    //if (data.length > 0) {
    //    $(id).empty();
      
    //    // Set the width of the container to 100%
    //    $(id).css("width", "100%");

    //    // Get dimensions of the container
    //    const containerHeight = $(id).height();
    //    const containerWidth = $(id).width();

    //    // Define margins and chart dimensions
    //    var margin = "";
    //    var chartHeight = "";
    //    var chartWidth = "";
    //    if (id == "#chartRejPopup" || id == "#chartRejPopup_Monthly") {
    //        margin = { top: 30, right: 28, bottom: 60, left: 200 };
    //        chartHeight = 200;
    //        chartWidth = 500;
    //    }
    //    if (id == "#chartCategoryPopup" || id == "#chartCategoryPopup_Monthly") {
    //        margin = { top: 30, right: 28, bottom: 60, left: 200 };
    //        chartHeight = 200;
    //        chartWidth = 400;
    //    }
    //    else {
    //        margin = { top: 30, right: 28, bottom: 60, left: 52 };
    //        chartHeight = 200;
    //        chartWidth = 300;
    //    }

    //    // Create scales
    //    const xScale = d3.scaleBand().rangeRound([0, chartWidth]).paddingInner(0.2).paddingOuter(0.2);
    //    xScale.domain(data.map(d => d[xAxisData]));

    //    const yhist = d3.scaleLinear().domain([0, d3.max(data, d => d[yAxisData])]).range([chartHeight, 0]);
    //    const ycum = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

    //    // Create axes
    //    const xAxis = d3.axisBottom().scale(xScale);
    //    const yAxis = d3.axisLeft().scale(yhist).tickFormat(function (d) {
    //        return d >= 1000 ? d / 1000 + "K" : d
    //    });
    //    //.tickFornat(function (d) {
    //    //    return d >= 1000 ? d / 1000 + "K" : d
    //    //});
    //    const yAxis2 = d3.axisRight().scale(ycum);

    //    // Remove existing content inside the SVG
    //    d3.select(id).selectAll("*").remove();
    //    if (id == "#svgPareto") {
    //        $(id).append(`<h4>${chartHeading}</h4>`);
    //    }
    //    if (id == "#svgCategoryPareto") {
    //        $(id).append(`<h4>${chartHeading}</h4>`);
    //    }


    //    // Create tooltip
    //    const tooltip = d3.select("body").append("div")
    //        .attr("class", "tooltip")
    //        .style("background-color", "rgba(88, 88, 88)")
    //        .style("color", "white")
    //        .style("border-radius", "5px")
    //        .style("opacity", "0")
    //        .style("position", "absolute")
    //        .style("padding", "5px")
    //        .style("overflow-wrap", "break-word")
    //        .style("z-index", "10000");

    //    // Create SVG
    //    const svg = d3.select(id).append("svg")
    //        .attr("width", containerWidth)
    //        .attr("height", chartHeight + margin.top + margin.bottom)
    //        .append("g")
    //        .attr("transform", `translate(${margin.left},${margin.top})`);

    //    // Draw histogram bars
    //    const bar_pareto = svg.selectAll(".bar")
    //        .data(data)
    //        .enter().append("g")
    //        .attr("class", "bar");

    //    bar_pareto.append("rect")
    //        .attr("x", d => xScale(d[xAxisData]) + xScale.bandwidth() / 2 - 10) // Adjust x position
    //        .attr("width", 20) // Fixed bar width
    //        .attr("y", d => yhist(d[yAxisData]))
    //        .attr("height", d => chartHeight - yhist(d[yAxisData]))
    //        .on("mouseout", function () {
    //            d3.select(this).style("stroke", "");
    //            tooltip.style("opacity", "0");
    //        })
    //        .on("mousemove", function (d) {
    //            tooltip.style("opacity", "1")
    //                .style("top", `${d3.event.pageY - 30}px`)
    //                .style("left", `${d3.event.pageX + 20}px`);
    //            if (id == "#svgCategoryPareto") {
    //                const text = `<b>Category Name:</b>${d[xAxisData]}<br/><b>Cumulative Category Count:</b> ${d[yAxisData]}<br/><b>Percentage:</b> ${d[lineAxisData]}%<br/>`;
    //                tooltip.html(text);
    //            }
    //            else if (id == "#chartCategoryPopup_Monthly") {
    //                const text = `<b>Category Name:</b>${d[xAxisData]}<br/><b>Cumulative Category Count:</b> ${d[yAxisData]}<br/><b>Percentage:</b> ${d[lineAxisData]}%<br/>`;
    //                tooltip.html(text);
    //            }
    //            else if (id == "#chartCategoryPopup") {
    //                const text = `<b>Category Name:</b>${d[xAxisData]}<br/><b>Cumulative Category Count:</b> ${d[yAxisData]}<br/><b>Percentage:</b> ${d[lineAxisData]}%<br/>`;
    //                tooltip.html(text);
    //            }
    //            else if (id == "#chartCategoryPopup_Monthly") {
    //                const text = `<b>Category Name:</b>${d[xAxisData]}<br/><b>Cumulative Category Count:</b> ${d[yAxisData]}<br/><b>Percentage:</b> ${d[lineAxisData]}%<br/>`;
    //                tooltip.html(text);
    //            }
    //            else {
    //                const text = `<b>Rework:</b> ${d[yAxisData]}<br/><b>Percentage:</b> ${d[lineAxisData]}%<br/><b>Station Name:</b>${d[xAxisData]}`;
    //                tooltip.html(text);
    //            }
    //        });

    //    // Draw Pareto-style CDF line
    //    const guide = d3.line()
    //        .x(d => xScale(d[xAxisData]) + xScale.bandwidth() / 2)
    //        .y(d => ycum(d[lineAxisData]));
    //    // .curve(d3.curveBasis); // Use step-after interpolation for Pareto style

    //    svg.append('path')
    //        .datum(data)
    //        .attr('d', guide)
    //        .attr('class', 'line')
    //        .attr('stroke', 'blue') // Change the line color to blue or any color you prefer
    //        .attr('stroke-width', 2); // Adjust the line width as needed

    //    // Draw circles on the Pareto-style CDF line
    //    svg.selectAll(".line-circle")
    //        .data(data)
    //        .enter().append("circle")
    //        .attr("class", "line-circle")
    //        .attr("r", 3)
    //        .attr("cx", d => xScale(d[xAxisData]) + xScale.bandwidth() / 2)
    //        .attr("cy", d => ycum(d[lineAxisData]))
    //        .style("fill", "black");


    //    // Draw axes
    //    svg.append("g")
    //        .attr("class", "x axis")
    //        .attr("transform", `translate(0, ${chartHeight})`)
    //        .call(xAxis)
    //        .selectAll("text")  // select all the text elements for styling
    //        .style("display", "none");  // hide the x-axis labels

    //    svg.append("g")
    //        .attr("class", "y axis")
    //        .call(yAxis);

    //    svg.append("g")
    //        .attr("class", "y axis")
    //        .attr("transform", `translate(${chartWidth}, 0)`)
    //        .call(yAxis2);

    //    // Add axis labels
    //    svg.append("text")
    //        .attr("class", "y label")
    //        .attr("y", -50)
    //        .attr("x", -50)
    //        .attr("dy", ".75em")
    //        .attr('text-anchor', 'end')
    //        .attr("transform", "rotate(-90)")
    //        .text(yAxisLabel);

    //    svg.append("text")
    //        .attr("class", "y label2")
    //        .attr("dy", ".75em")
    //        .attr('text-anchor', 'end')
    //        .attr("transform", `translate(${chartWidth - 265}, 50) rotate(-90)`)
    //        .attr("y", chartWidth)
    //        .text("Percentage");

    //    // Remove x-axis label
    //    //svg.append("text")
    //    //    .attr("class", "axis-label")
    //    //    .attr('text-anchor', 'middle')
    //    //    .attr("x", chartWidth / 2)
    //    //    .attr("y", chartHeight + (margin.bottom / 2))
    //    //    .text(xAxisLabel);
    //}
    //else {
        $(id).empty();
       
        $(id).css("width", "100%");

        // Get dimensions of the container
        const containerHeight = $(id).height();
        const containerWidth = $(id).width();

        // Define margins and chart dimensions
        var margin = "";
        var chartHeight = "";
        var chartWidth = "";
      
            margin = { top: 30, right: 28, bottom: 60, left: 52 };
            chartHeight = 200;
            chartWidth = 300;
       
        // Create SVG
        const svg = d3.select(id).append("svg")
            .attr("width", containerWidth)
            .attr("height", chartHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("x", 100)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-family", "arial")
            .attr("text-anchor", "start")
            .style("font-size", 13)
            .text("No Data for Entire Shift");
    /*}*/
}

function bar_lineHourly_Chart(id, data, lineData, xAxisData, yAxisData, lineAxisData, splitChar, xAxisLabel, yAxisLabel) {
    //if (id == "svgbarhourly")
    //{
    //    xAxisData = 
    //}
    //var data = response.data.Table;
    //var lineData = response.data.Table1;

    // Set the dimensions of our chart to be displayed
    var barsWidth = 500,
        barsHeight = 200,
        axisMargin = 50;

    var chartHeight = barsHeight + axisMargin,
        chartWidth = barsWidth + axisMargin;

    // Combine data from both datasets
    var combinedData = data.map(d => {
        var correspondingLineData = lineData.find(ld => ld[xAxisData] === d[xAxisData]);
        return { ...d, [lineAxisData]: correspondingLineData ? correspondingLineData[lineAxisData] : 0 };
    });

    //var numBars = combinedData.length;
    var minBarWidth = 30;

    var maxDataValue = d3.max(data, d => Math.max(d[yAxisData], d[lineAxisData]) + 10);
    // Select the chart element on the page so we can reference it in code
    // Also set the width and height attributes of the chart SVG
    var chart = d3.select(id)
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    // Create a linear scale for our y-axis to map datapoint values to pixel heights of bars
    var yScale = d3.scaleLinear()
        .domain([0, maxDataValue])
        .range([barsHeight, 0]);
    // Create a scale that returns the bands each bar should be in along the x-axis

    let xScale = d3.scaleBand()
        .domain(data.map(d => d[xAxisData]))
        .range([0, barsWidth])
        .padding(0.1);

       var actualBarWidth = Math.min(xScale.bandwidth(), minBarWidth);

    // Create an SVG group that we will add the individual bar elements of our chart to
    var bars = chart.append('g')
        .attr('id', 'bars-container');

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // Bind the data to our .bars svg elements
    // Create a rectangle for each data point and set position and dimensions using scales

    //if (id == '#svgbarhourly') {
    //    var actualBarWidth = numBars > 6 ? xScale.bandwidth() : 30; // Set a minimum bar width when only one bar is present
    //}
    bars.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d[xAxisData]) + (xScale.bandwidth() - actualBarWidth) / 2) // Center the bar within the band
        .attr('y', d => yScale(d[yAxisData]))
        .attr('width', actualBarWidth) // Set the actual width for the bars
        .style("fill", function (d, i) {
            return d[yAxisData] >= d[lineAxisData] ? "#4CAF50" : "#F44336";
        })
        .attr('height', d => barsHeight - yScale(d[yAxisData]))
        .on("mouseout", function () {
            d3.select(this).style("stroke", "");
            tooltip.style("opacity", "0");
        })
        .on("mousemove", function (d) {
            tooltip.style("opacity", "1")
                .style("top", `${d3.event.pageY - 30}px`)
                .style("left", `${d3.event.pageX + 20}px`);

            const text = `<b>${yAxisLabel}:</b> ${d[yAxisData]}<br/><b>Target Count:</b> ${d[lineAxisData]}<br/><b>Batch Start:</b>${d.start}<br/><b>Batch End:</b> ${d.end}<br/>`;
            tooltip.html(text);
        })
        .on('click', function (event, data) {
            // Call the popup function on click
            showPopup(d);
        });

    // Move the bars so that there is space on the left for the y-axis
    bars.attr('transform', 'translate(' + axisMargin + ',0)');

    //const yAxis = d3.axisLeft().scale(yhist).tickFormat(function (d) {
    //    return d >= 1000 ? d / 1000 + "K" : d
    //});

    // Create a new SVG group for the y-axis elements
    // Generate the y-axis with 10 ticks and move into position
    var yAxis = chart.append('g')
        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(10))
        .attr('transform', 'translate(' + axisMargin + ',0)');

    // Create another group for the x-axis elements
    // Generate the x-axis using the our x scale and move into position
    // Select the text elements and rotate by 45 degrees
    var xAxis = chart.append('g')
        .attr('id', 'x-axis')
        .call(d3.axisBottom(xScale))
        .attr('transform', 'translate(' + axisMargin + ',' + barsHeight + ')')
        .selectAll('text')
        .remove(); // Remove the x-axis label text

    // Set up scales for line graph
    var lineXScale = d3.scaleBand()
        .domain(data.map(d => d[xAxisData]))
        .range([0, barsWidth])
        .padding(0.1);

    var lineYScale = d3.scaleLinear()
        .domain([0, maxDataValue])
        .range([barsHeight, 0]);

    // Draw line
    var line = d3.line()
        .x(d => lineXScale(d[xAxisData]) + lineXScale.bandwidth() / 2)
        .y(d => lineYScale(d[lineAxisData]));

    // Append a new group for the line graph
    var lineGraph = chart.append('g')
        .attr('id', 'line-graph')
        .attr('transform', 'translate(' + axisMargin + ',0)');

    // Bind the data to the line graph and draw the line
    lineGraph.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .style("stroke", "black") // Set the line color to black
        .style("stroke-width", 1) // Set the line width to 1 pixel
        .style("fill", "none");


    // Adding circles
    chart.selectAll(".circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d[xAxisData]) + xScale.bandwidth() / 2 + axisMargin) // Apply axis margin to the x-coordinate
        .attr("cy", d => yScale(d[lineAxisData]))
        .attr("r", 3) // Set the radius of the circle to 3 pixels
        .style("fill", "black"); // Set the fill color of the circle to black


    bars.append('text')
        .attr('x', -90)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)

    bars.append('text')
        .attr('x', 220)
        .attr('y', 235)
        .attr('text-anchor', 'middle')
        .text(xAxisLabel)
}

// Data
//const data = [
//    { month: "November", planned: 7, pastMonthCompleted: 4, completed: 6, overdue: 1, notDue: 0, completedDelay: 2 },
//    { month: "December", planned: 5, pastMonthCompleted: 3, completed: 4, overdue: 1, notDue: 0, completedDelay: 1 },
//    { month: "January", planned: 3, pastMonthCompleted: 1, completed: 2, overdue: 1, notDue: 0, completedDelay: 1 }
//];

//// SVG and Margins
//const svg = d3.select("#svgstacked"),
//    margin = { top: 20, right: 20, bottom: 30, left: 50 },
//    width = +svg.attr("width") - margin.left - margin.right,
//    height = +svg.attr("height") - margin.top - margin.bottom,
//    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//// Scales
//const x = d3.scaleBand()
//    .range([0, width])
//    .padding(0.1)
//    .domain(data.map(d => d.month));

//const y = d3.scaleLinear()
//    .range([height, 0])
//    .domain([0, d3.max(data, d => d.planned)]);

//// Colors
//const color = d3.scaleOrdinal()
//    .range(["#98abc5", "#8a89a6", "#7b6888", "#a05d56", "#ff8c00"]);

//// Stack
//const keys = ["pastMonthCompleted", "completed", "overdue", "notDue", "completedDelay"];
//const stack = d3.stack().keys(keys);

//// Stack the data
//const series = stack(data);

//// Draw stacked bars
//g.selectAll("g")
//    .data(series)
//    .enter().append("g")
//    .attr("fill", d => color(d.key))
//    .selectAll("rect")
//    .data(d => d)
//    .enter().append("rect")
//    .attr("x", d => x(d.data.month))
//    .attr("y", d => y(d[1]))
//    .attr("height", d => y(d[0]) - y(d[1]))
//    .attr("width", x.bandwidth())
//    .append("title") // Add tooltip
//    .text(d => `${d.key}: ${d.data[d.key]}`); // Tooltip text corrected

//// Line generator
//const lineGenerator = d3.line()
//    .x(d => x(d.month) + x.bandwidth() / 2)
//    .y(d => y(d.planned));

//// Draw the line
//g.append("path")
//    .datum(data)
//    .attr("fill", "none")
//    .attr("stroke", "red")
//    .attr("stroke-width", 2)
//    .attr("d", lineGenerator)
//    .append("title") // Add tooltip
//    .text(d => `Planned: ${d.planned}`); // Tooltip text corrected

//// Axes
//g.append("g")
//    .attr("transform", "translate(0," + height + ")")
//    .call(d3.axisBottom(x));

//g.append("g")
//    .call(d3.axisLeft(y));