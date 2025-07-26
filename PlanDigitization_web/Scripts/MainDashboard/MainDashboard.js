

function MainDashboard(URL, sURL, company, plant, line, R_url, user1) {
	this.URL = URL;
	this.sURL = sURL;
	this.company = company;
	this.plant = plant;
	this.line = line;
	this.R_url = R_url;
	this.user1 = user1;
	////debugger;
	carouselMachine();

}

var flag = 1;
var loadingFlag = false;


//MTBF
function get_MTBF(Machine, response) {



	d3.select(".mtbf_graph svg").remove();
	if (response.status != "Error") {
		if (response.data.Table1.length > 0) {

			var batch = response.data.Table8[0].Batch;
			$('#popupMTBFDate').html(`<b>LATEST TOP 10 MTBF</b></br>BATCH : ${batch}`);

			var propertyValues = Object.values(response.data.Table1[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(response.data.Table1[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {

				$(".mtbf_graph").empty();
				var div_width = 330;
				var div_height = 230;
				var svg = d3.select(".mtbf_graph").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

			}
			else {

				// Sample data with key-value pairs
				var data =
					response.data.Table1;
				//	[
				//	{ Alarm_Description: 'A', MTTR: 20 },
				//	{ Alarm_Description: 'B', MTTR: 40 },
				//	{ Alarm_Description: 'C', MTTR: 15 },
				//		{ Alarm_Description: 'D', MTTR: 30 },
				//		{ Alarm_Description: 'E', MTTR: 15 },
				//		{ Alarm_Description: 'F', MTTR: 30 },


				//];

				// Set up the SVG canvas dimensions
				const svgWidth = 320;
				const svgHeight = 200;

				const barWidth = 20;

				// Set up the margins to leave space for labels and axes
				const margin = { top: 20, right: 20, bottom: 50, left: 50 };
				const width = svgWidth - margin.left - margin.right;
				const height = svgHeight - margin.top - margin.bottom;

				// Create an SVG element
				const svg = d3.select(".mtbf_graph")
					.append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight);

				// Create a group (g) element to contain the chart
				const g = svg.append("g")
					.attr("transform", `translate(${margin.left},${margin.left})`);

				// Create a scale for the x-axis
				const xScale = d3.scaleBand()
					.domain(data.map(d => d.Alarm_Description))
					.range([0, width])
					.padding(0.1);

				// Create a scale for the y-axis
				const yScale = d3.scaleLinear()
					.domain([0, d3.max(data, d => d.MTBF)])
					.nice()
					.range([height, 0]);

				// Create the x-axis
				g.append("g")
					.attr("class", "x-axis")
					.attr("transform", `translate(0, ${height})`)
					.call(d3.axisBottom(xScale).tickFormat(""));

				// Create the y-axis
				g.append("g")
					.attr("class", "y-axis")
					.call(d3.axisLeft(yScale));

				// Create the Tooltip
				var tooltip = d3.select(".mtbf_graph")
					.append("div")
					.style("opacity", 0)
					.attr("class", "tooltip")
					.style("background-color", "tranparent")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")

				tooltip = d3.select("body").append("div")
					.style("display", "inline-block")
					.style("background", "rgba(88, 88, 88,1)")
					.style("color", "white")
					.style("border-radius", "5px")
					.style("position", "absolute")
					.style("visibility", "hidden")
					.style("padding", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("overflow-wrap", "break-word")
					.style("z-index", "10000");
				toolval = tooltip.append("div");


				// Create the bars
				g.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", d => xScale(d.Alarm_Description) + xScale.bandwidth() / 2 - (barWidth / 2))
					.attr("y", d => yScale(d.MTBF))
					.attr("width", barWidth)
					.attr("height", d => height - yScale(d.MTBF))
					.on("mousemove", function (d) {
						tooltip.style("visibility", "visible")
							.style('opacity', '0.9')
							.style("top", (d3.event.pageY - 10) + "px")
							.style("left", (d3.event.pageX + 5) + "px");
						var text = '<b>Frequency: ' + d.no_of_occurence + '</b><b><br/>MTBF: ' + d.MTBF + ' min</b><br/>' + d.Alarm_Description;
						tooltip.select("div").html(text)
						d3.select(this).style('opacity', '1');
					})
					.on("mouseout", function () {
						d3.select(this)
							.style('stroke-width', '0')
							.style('opacity', '0.5');
						tooltip.style("visibility", "hidden");
					})

				// Add labels for the bars
				g.selectAll(".bar-label")
					.data(data)
					.enter().append("text")
					.attr("class", "bar-label")
					.attr("x", d => xScale(d.Alarm_Description) + xScale.bandwidth() / 2)
					.attr("y", d => yScale(d.MTBF) - 10)
					.attr("text-anchor", "middle")
					.text(d => d.MTBF);

				// Add x-axis label
				g.append("text")
					.attr("class", "x-axis-label")
					.attr("x", width / 2)
					.attr("y", height + margin.bottom - 10)
					.attr("text-anchor", "middle")
					.text("Alarms");

				// Add y-axis label
				g.append("text")
					.attr("class", "y-axis-label")
					.attr("x", -height / 2)
					.attr("y", -margin.left + 10)
					.attr("transform", "rotate(-90)")
					.attr("text-anchor", "middle")
					.text("MTBF (min)");

			}
		}
		else {

			//var dates = new Date(response.data.Table1[0].Dates);
			//const dateTimeInParts = dates.toISOString().split("T"); // DateTime object => "2021-08-31T15:15:41.886Z" => [ "2021-08-31", "15:15:41.886Z" ]
			//const date = dateTimeInParts[0];
			//$('#popupMTBFDate').html(`<b>LATEST MTBF</b></br>DATE : ${date}`);

			var batch = response.data.Table8[0].Batch;
			$('#popupMTBFDate').html(`<b>LATEST MTBF</b></br>BATCH : ${batch}`);

			$(".mtbf_graph").empty();
			var div_width = 330;
			var div_height = 230;
			var svg = d3.select(".mtbf_graph").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

		}
	}
	else {
		var batch = response.data.Table8[0].Batch;
		$('#popupMTBFDate').html(`<b>LATEST MTBF</b></br>BATCH : ${batch}`);

		$(".mtbf_graph").empty();
		var div_width = 330;
		var div_height = 230;
		var svg = d3.select(".mtbf_graph").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");



	}




}


//MTTR
function get_MTTR(Machine, response) {



	d3.select(".mttr_graph svg").remove();
	if (response.status != "Error") {
		if (response.data.Table.length > 0) {
			var propertyValues = Object.values(response.data.Table[0]);
			var firstColumnValue = propertyValues[0];

			var batch = response.data.Table8[0].Batch;
			$('#popupMTTRDate').html(`<b>LATEST TOP 10 MTTR</b></br>BATCH : ${batch}`);


			var columns = Object.keys(response.data.Table[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {

				$(".mttr_graph").empty();
				var div_width = 330;
				var div_height = 230;
				var svg = d3.select(".mttr_graph").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");


			}
			else {


				sample = response.data.Table;
				// Sample data with key-value pairs
				var data =
					response.data.Table;
				//	[
				//	{ Alarm_Description: 'A', MTTR: 20 },
				//	{ Alarm_Description: 'B', MTTR: 40 },
				//	{ Alarm_Description: 'C', MTTR: 15 },
				//		{ Alarm_Description: 'D', MTTR: 30 },
				//		{ Alarm_Description: 'E', MTTR: 15 },
				//		{ Alarm_Description: 'F', MTTR: 30 },


				//];
				var flag = 0;

				Object.values(response.data.Table).forEach((element) => {
					if (element.MTTR) {
						flag = 1;
					}
				}

				);

				if (flag == 1) {

					// Set up the SVG canvas dimensions
					const svgWidth = 320;
					const svgHeight = 200;

					const barWidth = 20;

					// Set up the margins to leave space for labels and axes
					const margin = { top: 20, right: 20, bottom: 50, left: 50 };
					const width = svgWidth - margin.left - margin.right;
					const height = svgHeight - margin.top - margin.bottom;

					// Create an SVG element
					const svg = d3.select(".mttr_graph")
						.append("svg")
						.attr("width", svgWidth)
						.attr("height", svgHeight);

					// Create a group (g) element to contain the chart
					const g = svg.append("g")
						.attr("transform", `translate(${margin.left},${margin.left})`);

					// Create a scale for the x-axis
					const xScale = d3.scaleBand()
						.domain(data.map(d => d.Alarm_Description))
						.range([0, width])
						.padding(0.1);

					// Create a scale for the y-axis
					const yScale = d3.scaleLinear()
						.domain([0, d3.max(data, d => d.MTTR)])
						.nice()
						.range([height, 0]);

					// Create the x-axis
					g.append("g")
						.attr("class", "x-axis")
						.attr("transform", `translate(0, ${height})`)
						.call(d3.axisBottom(xScale).tickFormat(""));

					// Create the y-axis
					g.append("g")
						.attr("class", "y-axis")
						.call(d3.axisLeft(yScale));

					// Create the Tooltip
					var tooltip = d3.select(".mttr_graph")
						.append("div")
						.style("opacity", 0)
						.attr("class", "tooltip")
						.style("background-color", "tranparent")
						.style("border", "solid")
						.style("border-width", "2px")
						.style("border-radius", "5px")
						.style("padding", "5px")

					tooltip = d3.select("body").append("div")
						.style("display", "inline-block")
						.style("background", "rgba(88, 88, 88,1)")
						.style("color", "white")
						.style("border-radius", "5px")
						.style("position", "absolute")
						.style("visibility", "hidden")
						.style("padding", "5px")
						.style("font-size", "12px")
						.style("line-height", "14px")
						.style("letter-spacing", "0.05em")
						.style("overflow-wrap", "break-word")
						.style("z-index", "10000");
					toolval = tooltip.append("div");


					// Create the bars
					g.selectAll(".bar")
						.data(data)
						.enter().append("rect")
						.attr("class", "bar")
						.attr("x", d => xScale(d.Alarm_Description) + xScale.bandwidth() / 2 - (barWidth / 2))
						.attr("y", d => yScale(d.MTTR))
						.attr("width", barWidth)
						.attr("height", d => height - yScale(d.MTTR))
						.on("mousemove", function (d) {
							tooltip.style("visibility", "visible")
								.style('opacity', '0.9')
								.style("top", (d3.event.pageY - 10) + "px")
								.style("left", (d3.event.pageX + 5) + "px");
							var text = '<b>Downtime: ' + d.tot_downtime + ' min</b><b> <br/> No of Occurence: ' + d.no_of_occurence + '</b></br>' + d.Alarm_Description;
							tooltip.select("div").html(text)

							d3.select(this).style('opacity', '1');
						})
						.on("mouseout", function () {
							d3.select(this)
								.style('stroke-width', '0')
								.style('opacity', '0.5');
							tooltip.style("visibility", "hidden");
						})

					// Add labels for the bars
					g.selectAll(".bar-label")
						.data(data)
						.enter().append("text")
						.attr("class", "bar-label")
						.attr("x", d => xScale(d.Alarm_Description) + xScale.bandwidth() / 2)
						.attr("y", d => yScale(d.MTTR) - 10)
						.attr("text-anchor", "middle")
						.on("mousemove", function (d) {
							if (d.tot_downtime == 0) {
								tooltip.style("visibility", "visible")
									.style('opacity', '0.9')
									.style("top", (d3.event.pageY - 10) + "px")
									.style("left", (d3.event.pageX + 5) + "px");
								var text = '<b>Downtime: ' + d.tot_downtime + ' min</b><b> <br/> No of Occurence: ' + d.no_of_occurence + '</b></br>' + d.Alarm_Description;
								tooltip.select("div").html(text)

								d3.select(this).style('opacity', '1');
							}
						})
						.on("mouseout", function () {
							d3.select(this)
								.style('stroke-width', '0');
							tooltip.style("visibility", "hidden");
						})
						.text(d => d.MTTR);

					// Add x-axis label
					g.append("text")
						.attr("class", "x-axis-label")
						.attr("x", width / 2)
						.attr("y", height + margin.bottom - 10)
						.attr("text-anchor", "middle")
						.text("Alarms");

					// Add y-axis label
					g.append("text")
						.attr("class", "y-axis-label")
						.attr("x", -height / 2)
						.attr("y", -margin.left + 10)
						.attr("transform", "rotate(-90)")
						.attr("text-anchor", "middle")
						.text("MTTR (min)");

				}
				else {
					var batch = response.data.Table8[0].Batch;
					$('#popupMTTRDate').html(`<b>LATEST MTTR</b></br>BATCH : ${batch}`);
					$(".mttr_graph").empty();
					var div_width = 330;
					var div_height = 230;
					var svg = d3.select(".mttr_graph").append("svg")
						.attr("width", div_width)
						.attr("height", div_height)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svg.append("text")
						.text("No MTTR")
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width - textWidth) / 2;
					svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
				}
			}
		}
		else {
			var batch = response.data.Table8[0].Batch;
			$('#popupMTTRDate').html(`<b>LATEST MTTR</b></br>BATCH : ${batch}`);
			$(".mttr_graph").empty();
			var div_width = 330;
			var div_height = 230;
			var svg = d3.select(".mttr_graph").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
		}
	}
	else {
		var batch = response.data.Table8[0].Batch;
		$('#popupMTTRDate').html(`<b>LATEST MTTR</b></br>BATCH : ${batch}`);
		$(".mttr_graph").empty();
		var div_width = 330;
		var div_height = 230;
		var svg = d3.select(".mttr_graph").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");


	}



}

//DownPareto
function get_downtime_pareto(Machine, response) {



	d3.select(".custome_report svg").remove();

	if (response.status != "Error") {
		if (response.data.Table2.length > 0) {
			var batch = response.data.Table8[0].Batch;
			$('#popupDownDate').html(`<b>LATEST TOP 10 DOWNTIME</b></br>BATCH : ${batch}`);

			var propertyValues = Object.values(response.data.Table2[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(response.data.Table2[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {
				sample = "";


				$(".custome_report").empty();
				var div_width = 330;
				var div_height = 230;
				var svg = d3.select(".custome_report").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");


			}
			else {



				$('.custome_report').css("width", "100%");

				const a = $('.custome_report').height();
				const b = $('.custome_report').width();

				//var m = { top: 50, right: 50, bottom: 200, left: 50 }
				//    , h = a - m.top - m.bottom
				//    , w = b - m.left - m.right
				//    , barWidth = 5;

				var m = { top: 25, right: 28, bottom: 150, left: 50 }
					, h = (a + 150) - m.top - m.bottom - 25
					, w = b - m.left - m.right
					, barWidth = 5;

				m = { top: 50, right: 28, bottom: 50, left: 52 };
				w = 250;
				h = 150;

				var barWidth = 20;

				var dataset = null;
				//typecast Amount to #, calculate total, and cumulative amounts
				dataset = response.data.Table2;

				//Axes and scales
				var xScale = d3.scaleBand().rangeRound([0, w], 0.1);

				xScale.domain(dataset.map(function (d) { return d.Alarm_Description; }));
				xScale.paddingInner(0.2)
				xScale.paddingOuter(0.2);


				var yhist = d3.scaleLinear()
					.domain([0, d3.max(dataset, function (d) { return d.tot_downtime; })])
					.range([h, 0]);

				var ycum = d3.scaleLinear().domain([0, 100]).range([h, 0]);

				var xAxis = d3.axisBottom()
					.scale(xScale);
				// .orient('bottom');

				var yAxis = d3.axisLeft()
					.scale(yhist);
				//.orient('left');

				var yAxis2 = d3.axisRight()
					.scale(ycum);
				//  .orient('right');

				var tooltip = d3.select(".custome_report")
					.append("div")
					.attr("class", "tooltip")
					.style("background-color", "tranparent")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")



				//tooltip = d3.select("body").append("div").style("width", "110px").style("height", "60px").style("background", "white")
				//    .style("opacity", "1").style("position", "absolute").style("visibility", "hidden").style("padding", "5px");
				//toolval = tooltip.append("div");

				tooltip = d3.select("body").append("div")
					//.style("width", "150px").style("height", "150px")
					.style("display", "inline-block")
					//.style("background", "rgba(0, 0, 0, 0.9)")
					.style("background", "rgba(88, 88, 88)").style("color", "white")
					.style("border-radius", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("opacity", "1").style("position", "absolute").style("visibility", "hidden").style("padding", "5px").style("overflow-wrap", "break-word").style("z-index", "10000");
				toolval = tooltip.append("div");



				//Draw svg
				var svg = d3.select(".custome_report").append("svg")
					.attr("width", w + m.left + m.right)
					.attr("height", h + m.top + m.bottom)
					.append("g")
					.attr("transform", "translate(" + (m.left + 8) + "," + m.top + ")");

				//Draw histogram
				var bar = svg.selectAll(".bar")
					.data(dataset)
					.enter().append("g")
					.attr("class", "bar");

				bar.append("rect")
					.attr("x", function (d) { return xScale(d.Alarm_Description) + xScale.bandwidth() / 2 - (barWidth / 2); })
					//.attr("width", xScale.bandwidth() - 2)
					.attr("width", barWidth)
					.attr("y", function (d) { return yhist(d.tot_downtime); })
					.attr("height", function (d) { return h - yhist(d.tot_downtime); })

					.on("mouseout", function () {
						d3.select(this).style("stroke", "");
						tooltip.style("visibility", "hidden");
					})

					.on("mousemove", function (d) {
						tooltip.style("visibility", "visible")
							.style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

						var text = 'Frequency: ' + d.no_of_occurence + '<br/> Downtime: ' + d.tot_downtime + ' min<br/> Percentage: ' + d.Percentage + ' % <br/> Reason: ' + d.Alarm_Description;

						tooltip.select("div").html(text)

					});

				//Draw CDF line
				var guide = d3.line()
					.x(function (d) { return xScale(d.Alarm_Description) + xScale.bandwidth() / 2; })
					.y(function (d) { return ycum(d.Percentage) });


				var line = svg.append('path')
					.datum(dataset)
					.attr('d', guide)
					.attr('class', 'line');

				svg.selectAll(".line")
					.data(dataset)
					.enter().append("circle")
					.attr("r", 2)
					.attr("cx", function (d) { return xScale(d.Alarm_Description) + xScale.bandwidth() / 2; })
					.attr("cy", function (d) { return ycum(d.Percentage) });


				// Labels for each Bars
				bar.append("text")
					.attr("class", "bar-label")
					.attr("x", function (d) { return xScale(d.Alarm_Description) + xScale.bandwidth() / 2; })
					.attr("y", function (d) { return yhist(d.tot_downtime) - 5; })
					.text(function (d) { return d.tot_downtime; })
					.style('fill', 'black')
					.style("text-anchor", "middle")
					.on("mouseout", function () {
						d3.select(this).style("stroke", "");
						tooltip.style("visibility", "hidden");
					})

					.on("mousemove", function (d) {
						if (d.tot_downtime == 0) {
							tooltip.style("visibility", "visible")
								.style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");
							var text = 'Frequency: ' + d.no_of_occurence + '<br/> Downtime: ' + d.tot_downtime + ' min<br/> Percentage: ' + d.Percentage + ' % <br/> Reason: ' + d.Alarm_Description;
							tooltip.select("div").html(text)
						}
					});

				//Draw axes
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + h + ")")
					.call(d3.axisBottom(xScale)
						.tickFormat(""))

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Frequency");

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + [w, 0] + ")")
					.call(yAxis2)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0)
					.attr("dy", "-.71em")
					.style("text-anchor", "end")
					.text("Percentage (%)");



				svg.append("text")
					.attr("class", "y label")
					//.attr("text-anchor", "end")
					.attr("y", -60)
					.attr("dy", ".75em")
					.attr('text-anchor', 'end')

					.attr("transform", "rotate(-90)")
					.text("Duration (min)");

				svg.append("text")
					.attr("class", "y label2")
					//.attr("text-anchor", "end")
					//.attr("y", -50)
					.attr("y", w + 30)
					.attr("dy", ".75em")
					.attr('text-anchor', 'end')

					.attr("transform", "translate(" + [w, 0] + ")")
					.attr("transform", "rotate(-90)")

					.text("Percentage (%)");

				svg.append("text")
					.attr("class", "axis-label")
					.attr("text-anchor", "middle")
					.attr("x", w / 2)
					.attr("y", h + (m.bottom / 2))
					.text("Alarms");
			}
		}
		else {
			var batch = response.data.Table8[0].Batch;
			$('#popupDownDate').html(`<b>LATEST DOWNTIME</b></br>BATCH : ${batch}`);
			$(".custome_report").empty();
			var div_width = 330;
			var div_height = 230;
			var svg = d3.select(".custome_report").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
		}
	}
	else {

		var batch = response.data.Table8[0].Batch;
		$('#popupDownDate').html(`<b>LATEST DOWNTIME</b></br>BATCH : ${batch}`);
		$(".custome_report").empty();
		var div_width = 330;
		var div_height = 230;
		var svg = d3.select(".custome_report").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");


	}



}


//RejPareto
function get_RejPar(Machine, response) {



	d3.select(".rej_custom svg").remove();

	if (response.status != "Error") {
		if (response.data.Table3.length > 0) {
			//added
			var batch = response.data.Table8[0].Batch;
			$('#popupRejDate').html(`<b>LATEST TOP 10 REJECTION PARETO</b></br>BATCH : ${batch}`);

			sample_pareto = response.data.Table3;


			var propertyValues = Object.values(response.data.Table3[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(response.data.Table3[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {
				$(".rej_custom").empty();
				var div_width = 330;
				var div_height = 230;
				var svg = d3.select(".rej_custom").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
			}
			else {

				$('.rej_custom').css("width", "100%");

				const a = $('.rej_custom').height();
				const b = $('.rej_custom').width();



				var m = { top: 25, right: 50, bottom: 150, left: 50 }
					, h = (a + 150) - m.top - m.bottom - 25
					, w = b - m.left - m.right
					, barWidth = 5;

				m = { top: 50, right: 28, bottom: 50, left: 52 };//m = { top: 50, right: 80, bottom: 50, left: 80 };
				w = 250;//w=380
				h = 150;
				var dataset = null;
				//typecast Amount to #, calculate total, and cumulative amounts
				var barWidth = 20;

				//Axes and scales
				var xScale = d3.scaleBand().rangeRound([0, w], 0.1);
				xScale.domain(sample_pareto.map(function (d) { return d.RejectionDescription; }));
				xScale.paddingInner(0.2)
				xScale.paddingOuter(0.2);

				var yhist = d3.scaleLinear()
					.domain([0, d3.max(sample_pareto, function (d) { return d.Frequency; })])
					.range([h, 0]);

				var ycum = d3.scaleLinear().domain([0, 100]).range([h, 0]);

				var xAxis = d3.axisBottom()
					.scale(xScale);


				var yAxis = d3.axisLeft()
					.scale(yhist)


				var yAxis2 = d3.axisRight()
					.scale(ycum);
				d3.selectAll(".rej_custom > *").remove();

				var tooltip = d3.select(".rej_custom")
					.append("div")
					.style("opacity", 0)
					.attr("class", "tooltip")
					.style("background-color", "tranparent")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")



				tooltip = d3.select("body").append("div")
					//.style("width", "150px").style("height", "150px")
					.style("display", "inline-block")
					//.style("background", "rgba(0, 0, 0, 0.9)")
					.style("background", "rgba(88, 88, 88)").style("color", "white")
					.style("border-radius", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("opacity", "1").style("position", "absolute").style("visibility", "hidden").style("padding", "5px").style("overflow-wrap", "break-word").style("z-index", "10000");
				toolval = tooltip.append("div");

				////Draw svg
				var svg_pareto = d3.select(".rej_custom").append("svg")
					.attr("width", w + m.left + m.right)
					.attr("height", h + m.top + m.bottom)
					.append("g")
					.attr("transform", "translate(" + m.left + "," + m.top + ")");




				//var color = d3.scaleOrdinal(d3.schemeCategory10);
				//var color = d3.scaleOrdinal(['#B9770E', '#D4AC0D', '#F1C40F','#F4D03F ','#F7DC6F', '#F8C471', '#F5B041', '#F39C12', '#D68910', '#B9770E']);


				//Draw histogram
				var bar_pareto = svg_pareto.selectAll(".bar")
					.data(sample_pareto)
					.enter().append("g")
					.attr("class", "bar")




				bar_pareto.append("rect")
					.attr("x", function (d) { return xScale(d.RejectionDescription) + xScale.bandwidth() / 2 - (barWidth / 2); })
					.attr("width", barWidth)
					//.attr("width", 16)
					.attr("y", function (d) { return yhist(d.Frequency); })
					.attr("height", function (d) { return h - yhist(d.Frequency); })
					//.style("fill", function (d) {
					//	//console.log(color(d.Frequency))
					//	return color(d.Frequency)
					//})
					//.attr("fill", color)
					.attr("text", function (d) { return `${d.Frequency}` })

					//.on("mouseout", function () {
					//	d3.select(this).style("stroke", "none");
					//	tooltip.style("visibility", "hidden");
					//})

					.on("mouseout", function () {
						d3.select(this).style("stroke", "");
						tooltip.style("visibility", "hidden");

					})

					.on("mousemove", function (d) {
						tooltip.style("visibility", "visible")
							.style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

						var text = '<b>Frequency: ' + d.Frequency + '</b><br/><b> Percentage: ' + d.Percentage + ' %' + '</b></br>' + d.RejectionDescription;;

						tooltip.select("div").html(text)

					})



				////Draw CDF line
				var guide = d3.line()
					.x(function (d) { return xScale(d.RejectionDescription) + xScale.bandwidth() / 2; })
					.y(function (d) { return ycum(d.Percentage) });


				var line = svg_pareto.append('path')
					.datum(sample_pareto)
					.attr('d', guide)
					.attr('class', 'line');
				svg_pareto.selectAll(".line")
					.data(sample_pareto)
					.enter().append("circle")
					.attr("r", 2)
					.attr("cx", function (d) { return xScale(d.RejectionDescription) + xScale.bandwidth() / 2; })
					.attr("cy", function (d) { return ycum(d.Percentage) });

				// Labels for each Bars
				bar_pareto.append("text")
					.attr("class", "bar-label")
					.attr("x", function (d) { return xScale(d.RejectionDescription) + xScale.bandwidth() / 2; })
					.attr("y", function (d) { return yhist(d.Frequency) - 5; })
					.text(function (d) { return d.Frequency; })
					.style('fill', 'black')
					.style("text-anchor", "middle");

				//Draw axes
				svg_pareto.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + h + ")")
					.call(d3.axisBottom(xScale)
						.tickFormat(""))
				//   .call(xAxis)
				//   .selectAll("text")
				//   .style("text-anchor", "end")
				//.attr("transform", "rotate(-65)");


				svg_pareto.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -50)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Frequency");

				svg_pareto.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + [w, 0] + ")")
					.call(yAxis2)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 50)
					.attr("dy", "-.71em")
					.style("text-anchor", "end")
					.text("Percentage (%)");


				svg_pareto.append("text")
					.attr("class", "y label")
					//.attr("text-anchor", "end")
					.attr("y", -50)
					.attr("dy", ".75em")
					.attr('text-anchor', 'end')
					.attr("transform", "rotate(-90)")
					.text("Frequency");

				svg_pareto.append("text")
					.attr("class", "y label2")
					//.attr("text-anchor", "end")
					//.attr("y", -50)
					.attr("dy", ".75em")
					.attr('text-anchor', 'end')
					.attr("transform", "translate(" + [w, 0] + ")")
					.attr("transform", "rotate(-90)")
					.attr("y", w + 30)
					.text("Percentage (%)");

				svg_pareto.append("text")
					.attr("class", "axis-label")
					.attr('text-anchor', 'middle')
					.attr("x", w / 2)
					.attr("y", h + (m.bottom / 2))
					.text("Rejection Reasons");

			}
		}
		else {
			var batch = response.data.Table8[0].Batch;
			$('#popupRejDate').html(`<b>LATEST REJECTION PARETO</b></br>BATCH : ${batch}`);
			$(".rej_custom").empty();
			$(".rej_custom").empty();
			var div_width = 330;
			var div_height = 230;
			var svg = d3.select(".rej_custom").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

		}
	}
	else {
		var batch = response.data.Table8[0].Batch;
		$('#popupRejDate').html(`<b>LATEST REJECTION PARETO</b></br>BATCH : ${batch}`);
		$(".rej_custom").empty();
		$(".rej_custom").empty();
		var div_width = 330;
		var div_height = 230;
		var svg = d3.select(".rej_custom").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
	}



}

//Heatmap
function get_Heatmap(Machine, response) {




	d3.select("#heatmap_customs svg").remove();

	if (response.status != "Error") {
		if (response.data.Table4.length > 0) {
			//added

			const dateTimeInParts = response.data.Table8[0].Date.toString().split("T");
			const date = dateTimeInParts[0];
			$('#popupRejHeatDate').html(`<b>DAYWISE SUMMARY</b></br>DATE : ${date}`);

			var propertyValues = Object.values(response.data.Table4[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(response.data.Table4[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {

				$("#heatmap_customs").empty();
				var div_width = 800;
				var div_height = 230;
				var svg = d3.select("#heatmap_customs").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

			}
			else {


				var obj1 = response.data.Table4;

				const a = $('#heatmap_customs').height();
				const b = $('#heatmap_customs').width();

				//var margin = { top: 30, right: 30, bottom: 30, left: 80 },
				//    width = (b - margin.left - margin.right) / 2,
				//    height = (a - margin.top - margin.bottom) / 2,
				//    gridSize = Math.floor(width / 24);


				var margin = { top: 30, right: 25, bottom: 30, left: 30 },
					width = 650,
					height = 150,



					gridSize = Math.floor(width / 24);


				d3.selectAll("#heatmap_customs > *").remove();
				// append the svg object to the body of the page

				var svg = d3.select("#heatmap_customs")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform",
						"translate(" + (margin.left + 30) + "," + margin.top + ")");

				// Labels of row and columns
				var mygroups1 = d3.map(obj1, function (d) { return d.RejectionName; }).keys()
				var vars = d3.map(obj1, function (d) { return d.Shift_id; }).keys()

				var values = [];

				for (var item in obj1) {
					values.push(obj1[item].Frequency)
				}


				var min_heat = Math.min.apply(Math, values); // Min:0
				var max_heat = Math.max.apply(Math, values); // Max:194



				// Build X scales and axis:
				var x = d3.scaleBand()
					.range([0, width])
					.domain(mygroups1)

					.padding(response.data.Table4.length <= 2 ? 0.8 : 0.01);

				//Lable
				//svg.append("g")
				//    .attr("transform", "translate(0," + height + ")")
				//    .call(d3.axisBottom(x))

				// Build X scales and axis:
				var y = d3.scaleBand()
					.range([height, 0])
					.domain(vars)
					.padding(0.01);
				svg.append("g")
					.call(d3.axisLeft(y));

				var colorrange = ['#D6EAF8', '#AED6F1', '#85C1E9', '#5DADE2', '#3498DB', '#2E86C1', '#2874A6', '#21618C'];

				//var colorrange = ['#0E6251', '#148F77', '#B7950B', '#F1C40F', '#E67E22', '#C0392B'];
				//var colorrange = ['#87C300', '#FAC316', '#F39C12', '#F38312', '#F35312'];
				var myColor1 = d3.scaleQuantile()
					.domain([max_heat, min_heat])
					.range(colorrange);

				// Build color scale
				var myColor = d3.scaleLinear()
					.range(["white", "#69b3a2"])
					.domain([0, 100])

				//Read the data
				var tooltip = d3.select("#heatmap_customs")
					.append("div")
					.style("opacity", 0)
					.attr("class", "tooltip")
					.style("background-color", "white")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")




				//tooltip = d3.select("body").append("div").style("width", "150px").style("height", "60px")
				//    //.style("background", "#C3B3E5")
				//    .style("opacity", "1").style("position", "absolute").style("visibility", "hidden")
				//   // .style("box-shadow", "0px 0px 6px #7861A5")
				//   // .style("padding", "10px");

				//toolval = tooltip.append("div");

				tooltip = d3.select("body").append("div")
					//.style("width", "150px").style("height", "150px")
					.style("display", "inline-block")
					//.style("background", "rgba(0, 0, 0, 0.9)")
					.style("background", "rgba(88, 88, 88)").style("color", "white")
					.style("border-radius", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("opacity", "1").style("position", "absolute").style("visibility", "hidden").style("padding", "5px").style("overflow-wrap", "break-word").style("z-index", "10000");
				toolval = tooltip.append("div");


				svg.selectAll()
					.data(obj1, function (d) { return d.reason + ':' + d.shift; })
					.enter()
					.append("rect")
					.text(function (d) { return d.Frequency })
					.attr("x", function (d) { return x(d.RejectionName) })
					.attr("y", function (d) { return y(d.Shift_id) })

					.attr("width", x.bandwidth())
					.attr("height", y.bandwidth())
					.style("fill", function (d) { return myColor1(d.Frequency) })


					.on("mouseover", function (d) {
						////console.log(d);
						//d3.select(this).attr("fill","#655091");
						d3.select(this).style("stroke", "white").style("stroke-width", "3px")

						d3.select(".LegText").select("text").text(d.Frequency)

					})
					.on("mouseout", function () {
						//d3.select(this).attr('fill', function(d) { return colorScale(window.bandClassifier(d.perChange,100));});
						d3.select(this).style("stroke", "none");
						tooltip.style("visibility", "hidden");
					})
					.on("mousemove", function (d) {
						//tooltip.style("visibility", "visible")
						//    .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

						//////console.log(d3.mouse(this)[0])
						//tooltip.select("div").html(d.Frequency)


						tooltip.style("visibility", "visible")
							.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 5) + "px");

						var text = 'Frequency: ' + d.Frequency + ' <br/> Reason :  ' + d.RejectionName;

						tooltip.select("div").html(text)

					})



				//Draw axes
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x)
						.tickFormat(""))

				//for appending text

				svg.selectAll()
					.data(obj1)
					.enter().append("text")
					.attr("class", "hourlabel")
					.attr("x", function (d) { return x(d.RejectionName) + 10 })
					.attr("y", function (d) { return y(d.Shift_id) + 15 })
				//.text(function (d) {
				//    return d.Frequency;
				//})




				svg.append("text")
					.attr("class", "x_label")
					.attr("text-anchor", "end")
					.attr("x", (width + 80) / 2)
					.attr("y", height + 30)
					.text("Rejection Reason");


				//y axis labels

				svg.append("text")
					.attr("class", "y label")
					.attr("text-anchor", "middle")
					.attr("x", -height / 2)
					.attr("y", -(margin.left + 15))
					.attr("dy", ".75em")
					.attr("transform", "rotate(-90)")
					.text("Shift");

			}
		}
		else {
			const dateTimeInParts = response.data.Table8[0].Date.toString().split("T");
			const date = dateTimeInParts[0];
			$('#popupRejHeatDate').html(`<b>DAYWISE SUMMARY</b></br>DATE : ${date}`);
			$("#heatmap_customs").empty();
			var div_width = 800;
			var div_height = 230;
			var svg = d3.select("#heatmap_customs").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

		}
	}
	else {
		const dateTimeInParts = response.data.Table8[0].Date.toString().split("T");
		const date = dateTimeInParts[0];
		$('#popupRejHeatDate').html(`<b>DAYWISE SUMMARY</b></br>DATE : ${date}`);
		$("#heatmap_customs").empty();
		var div_width = 800;
		var div_height = 230;
		var svg = d3.select("#heatmap_customs").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
	}


}

//Loss Table
function get_Losstable(Machine, response) {





	/*$("#top_10_duration_pareto").show();*/



	d3.select("#top_10_pareto_chart svg").remove();

	if (response.status != "Error") {

		if (response.data.Table5.length > 0) {
			var batch = response.data.Table8[0].Batch;
			$('#popupLossDate').html(`<b>LATEST TOP 10 LOSS</b></br>BATCH : ${batch}`);;

			var propertyValues = Object.values(response.data.Table5[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(response.data.Table5[0]);
			//console.log(columns[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {
				$("#top_10_pareto_chart").empty();
				var div_width = 530;
				var div_height = 230;
				var svg = d3.select("#top_10_pareto_chart").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
			}
			else {
				sample_pareto = response.data.Table5;
				const a = $('#top_10_pareto_chart').height();
				const b = $('#top_10_pareto_chart').width();

				//var m = { top: 25, right: 60, bottom: 5, left: 60 }
				//	, h = a - m.top - m.bottom - 25
				//	, w = b - m.left - m.right
				//	, barWidth = 5;
				var m = { top: 50, right: 50, bottom: 50, left: 60 };//m = { top: 50, right: 80, bottom: 50, left: 80 };
				w = 420;//w=380
				h = 150;

				var barWidth = 20;

				var dataset = null;

				//Axes and scales
				var xScale = d3.scaleBand().rangeRound([0, w], 0.1);
				xScale.domain(sample_pareto.map(function (d) { return d.loss_description; }));

				var yhist = d3.scaleLinear()
					.domain([0, d3.max(sample_pareto, function (d) { return d.duration; })])
					.range([h, 0]);

				var ycum = d3.scaleLinear().domain([0, 100]).range([h, 0]);

				var xAxis = d3.axisBottom()
					.scale(xScale);


				var yAxis = d3.axisLeft()
					.scale(yhist)


				var yAxis2 = d3.axisRight()
					.scale(ycum);
				d3.selectAll("#top_10_pareto_chart > *").remove();
				var tooltip = d3.select("#top_10_pareto_chart")
					.append("div")
					.style("opacity", 0)
					.attr("class", "tooltip")
					.style("background-color", "tranparent")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")

				tooltip = d3.select("body").append("div")
					//.style("width", "150px").style("height", "150px")
					.style("display", "inline-block")
					.style("background", "rgba(88, 88, 88)").style("color", "white")
					.style("border-radius", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("opacity", "1").style("position", "absolute").style("visibility", "hidden").style("padding", "5px").style("z-index", "10000");
				toolval = tooltip.append("div");

				////Draw svg
				var svg_pareto = d3.select("#top_10_pareto_chart").append("svg")
					.attr("width", w + m.left + m.right)
					.attr("height", h + m.top + m.bottom)
					.append("g")
					.attr("transform", "translate(" + m.left + "," + m.top + ")");


				//var color = d3.scaleOrdinal(d3.schemeCategory10);
				//var color = d3.scaleOrdinal(['#B9770E', '#D4AC0D', '#F1C40F', '#F4D03F ', '#F7DC6F', '#F8C471', '#F5B041', '#F39C12', '#D68910', '#B9770E']);

				//Draw histogram
				var bar_pareto = svg_pareto.selectAll(".bar")
					.data(sample_pareto)
					.enter().append("g")
					.attr("class", "bar")



				var duration_tot = 0;

				for (var i = 0; i < sample_pareto.length; i++) {
					duration_tot += sample_pareto[i].duration;
				}
				var Cum_percentage = 0;



				bar_pareto.append("rect")
					//.attr("x", function (d) { return xScale(d.loss_description) + 5; })
					//.attr("width", xScale.bandwidth() - 10)
					.attr("x", function (d) { return xScale(d.loss_description) + xScale.bandwidth() / 2 - (barWidth / 2); })
					.attr("width", barWidth)
					.attr("y", function (d) { return yhist(d.duration); })
					.attr("height", function (d) { return h - yhist(d.duration); })
					//.style("fill", function (d) {
					//	//console.log(color(d.duration))
					//	return color(d.duration)
					//})
					//.attr("fill", color)
					.attr("text", function (d) { return `${d.duration}` })
					.on("mouseout", function () {
						d3.select(this).style("stroke", "");
						tooltip.style("visibility", "hidden");
					})


					.on("mousemove", function (d) {
						tooltip.style("visibility", "visible")
							.style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

						var text = '<b>Duration: ' + d.duration + ' min</br>Loss: ' + d.loss_description;

						tooltip.select("div").html(text)

					})


				////Draw CDF line
				var guide = d3.line()
					.x(function (d) { return xScale(d.loss_description) + xScale.bandwidth() / 2; })
					.y(function (d) {
						return ycum(d.Percentage)
					});


				var line = svg_pareto.append('path')
					.datum(sample_pareto)
					.attr('d', guide)
					.attr('class', 'line');
				svg_pareto.selectAll(".line")
					.data(sample_pareto)
					.enter().append("circle")
					.attr("r", 2)
					.attr("cx", function (d) { return xScale(d.loss_description) + xScale.bandwidth() / 2; })
					.attr("cy", function (d) { return ycum(d.Percentage) });

				//Draw axes
				svg_pareto.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + h + ")")
					.call(d3.axisBottom(xScale).tickFormat(""));

				// Labels for each Bars
				bar_pareto.append("text")
					.attr("class", "bar-label")
					.attr("x", function (d) { return xScale(d.loss_description) + xScale.bandwidth() / 2; })
					.attr("y", function (d) { return yhist(d.duration) - 5; })
					.text(function (d) { return d.duration; })
					.style('fill', 'black')
					.style("text-anchor", "middle");


				svg_pareto.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -50)
					.attr("dy", ".71em")
					.style("text-anchor", "end")

					.text("Duration (min)");

				svg_pareto.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + [w, 0] + ")")
					.call(yAxis2)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 50)
					.attr("dy", "-.71em")
					.style("text-anchor", "end")
					.text("Cumulative (%)");

				svg_pareto.append("text")
					.attr("class", "y label")
					.attr("y", -50)
					.attr("dy", ".75em")
					.attr('text-anchor', 'end')
					.attr("transform", "rotate(-90)")
					.text("Duration (min)");

				svg_pareto.append("text")
					.attr("class", "y label2")
					.attr("y", w + 40)
					.attr("dy", ".70em")
					.attr('text-anchor', 'end')
					.attr("transform", "translate(" + [w, 0] + ")")
					.attr("transform", "rotate(-90)")
					.text("Cumulative (%)");

				svg_pareto.append("text")
					.attr("class", "axis-label")
					.attr("text-anchor", "middle")
					.attr("x", w / 2)
					.attr("y", h + (m.bottom / 2))
					.text('Loss');

			}
		}
		else {
			var batch = response.data.Table8[0].Batch;
			$('#popupLossDate').html(`<b>LATEST LOSS</b></br>BATCH : ${batch}`);;
			$("#top_10_pareto_chart").empty();
			var div_width = 530;
			var div_height = 230;
			var svg = d3.select("#top_10_pareto_chart").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Loss Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
		}
	}
	else {
		var batch = response.data.Table8[0].Batch;
		$('#popupLossDate').html(`<b>LATEST LOSS</b></br>BATCH : ${batch}`);;
		$("#top_10_pareto_chart").empty();
		var div_width = 530;
		var div_height = 230;
		var svg = d3.select("#top_10_pareto_chart").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
	}



}

//CT Distri
function get_CTDistribution(Machine, response) {


	/*$("#daywise_histogram").show();*/

	d3.select(".Range_chart_daywise svg").remove();
	$("#err_Range_chart_daywise").html("");

	if (response.status != "Error") {
		if (response.data.Table6.length > 0) {
			sample = response.data.Table6;

			var batch = response.data.Table8[0].Batch;
			var variants = response.data.Table8[0].Variant != null ? response.data.Table8[0].Variant : 'Unknown Variant';
			$('#popupCTDate').html(`<b>LATEST CYCLETIME</b>
										</br>BATCH : ${batch}</br>VARIANT : ${variants}`);


			var propertyValues = Object.values(sample[0]);
			var firstColumnValue = propertyValues[0];
			var columns = Object.keys(sample[0]);

			if (typeof (firstColumnValue) == 'string' && columns[0] == 'StatusText') {

				$(".Range_chart_daywise").empty();
				var div_width = 530;
				var div_height = 230;
				var svg = d3.select(".Range_chart_daywise").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text(firstColumnValue)
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
			}
			else {

				// Sample data with key-value pairs
				var data =
					response.data.Table6;
				//	[
				//	{ Alarm_Description: 'A', MTTR: 20 },
				//	{ Alarm_Description: 'B', MTTR: 40 },
				//	{ Alarm_Description: 'C', MTTR: 15 },
				//		{ Alarm_Description: 'D', MTTR: 30 },
				//		{ Alarm_Description: 'E', MTTR: 15 },
				//		{ Alarm_Description: 'F', MTTR: 30 },


				//];

				// Set up the SVG canvas dimensions
				const svgWidth = 520;
				const svgHeight = 200;

				const barWidth = 20;

				// Set up the margins to leave space for labels and axes
				const margin = { top: 20, right: 20, bottom: 50, left: 50 };
				const width = svgWidth - margin.left - margin.right;
				const height = svgHeight - margin.top - margin.bottom;

				// Create an SVG element
				const svg = d3.select(".Range_chart_daywise")
					.append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight);

				// Create a group (g) element to contain the chart
				const g = svg.append("g")
					.attr("transform", `translate(${margin.left},${margin.left})`);

				// Create a scale for the x-axis
				const xScale = d3.scaleBand()
					.domain(data.map(d => d.Range))
					.range([0, width])
					.padding(0.1);

				// Create a scale for the y-axis
				const yScale = d3.scaleLinear()
					.domain([0, d3.max(data, d => d.Frequency)])
					.nice()
					.range([height, 0]);

				// Create the x-axis
				g.append("g")
					.attr("class", "x-axis")
					.attr("transform", `translate(0, ${height})`)
					.call(d3.axisBottom(xScale).tickFormat(""));

				// Create the y-axis
				g.append("g")
					.attr("class", "y-axis")
					.call(d3.axisLeft(yScale));

				// Create the Tooltip
				var tooltip = d3.select(".Range_chart_daywise")
					.append("div")
					.style("opacity", 0)
					.attr("class", "tooltip")
					.style("background-color", "tranparent")
					.style("border", "solid")
					.style("border-width", "2px")
					.style("border-radius", "5px")
					.style("padding", "5px")

				tooltip = d3.select("body").append("div")
					.style("display", "inline-block")
					.style("background", "rgba(88, 88, 88,1)")
					.style("color", "white")
					.style("border-radius", "5px")
					.style("position", "absolute")
					.style("visibility", "hidden")
					.style("padding", "5px")
					.style("font-size", "12px")
					.style("line-height", "14px")
					.style("letter-spacing", "0.05em")
					.style("overflow-wrap", "break-word")
					.style("z-index", "10000");
				toolval = tooltip.append("div");


				// Create the bars
				g.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", d => xScale(d.Range) + xScale.bandwidth() / 2 - (barWidth / 2))
					.attr("y", d => yScale(d.Frequency))
					.attr("width", barWidth)
					.attr("height", d => height - yScale(d.Frequency))
					.on("mousemove", function (d) {
						tooltip.style("visibility", "visible")
							.style('opacity', '0.9')
							.style("top", (d3.event.pageY - 10) + "px")
							.style("left", (d3.event.pageX + 5) + "px");
						var text = `No. of Cycles : ${d.Frequency}<br/>Cycletime Range : ${d.Range}<br/>Cycletime Percentage : ${d.per}<br/>Set Cycletime(sec) : ${d.setcycle}
											<br/>Percentage Offset : ${d.offsetPer}<br/>Cycletime Offset : ${d.offset}`;
						tooltip.select("div").html(text)
						d3.select(this).style('opacity', '1');
					})
					.on("mouseout", function () {
						d3.select(this)
							.style('stroke-width', '0')
							.style('opacity', '0.5');
						tooltip.style("visibility", "hidden");
					})

				// Add labels for the bars
				g.selectAll(".bar-label")
					.data(data)
					.enter().append("text")
					.attr("class", "bar-label")
					.attr("x", d => xScale(d.Range) + xScale.bandwidth() / 2)
					.attr("y", d => yScale(d.Frequency) - 10)
					.attr("text-anchor", "middle")
					.text(d => d.Frequency);

				// Add x-axis label
				g.append("text")
					.attr("class", "x-axis-label")
					.attr("x", width / 2)
					.attr("y", height + margin.bottom - 10)
					.attr("text-anchor", "middle")
					.text("Cycle Time Range");

				// Add y-axis label
				g.append("text")
					.attr("class", "y-axis-label")
					.attr("x", -height / 2)
					.attr("y", -margin.left + 10)
					.attr("transform", "rotate(-90)")
					.attr("text-anchor", "middle")
					.text("Frequency");

			}
		}
		else {
			var batch = response.data.Table8[0].Batch;
			var variants = response.data.Table8[0].Variant != null ? response.data.Table8[0].Variant : 'Unknown Variant';
			$('#popupCTDate').html(`<b>LATEST CYCLETIME</b>
										</br>BATCH : ${batch}</br>VARIANT : ${variants}`);
			$(".Range_chart_daywise").empty();
			var div_width = 530;
			var div_height = 230;
			var svg = d3.select(".Range_chart_daywise").append("svg")
				.attr("width", div_width)
				.attr("height", div_height)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
			var text = svg.append("text")
				.text("No Data Available")
				.style("font-size", "15px");
			var textWidth = text.node().getComputedTextLength();
			var xTranslate = (div_width - textWidth) / 2;
			svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

		}
	}

	else {
		var batch = response.data.Table8[0].Batch;
		$('#popupCTDate').html(`<b>LATEST CYCLETIME</b>
										</br>BATCH : ${batch}`);
		$(".Range_chart_daywise").empty();
		var div_width = 530;
		var div_height = 230;
		var svg = d3.select(".Range_chart_daywise").append("svg")
			.attr("width", div_width)
			.attr("height", div_height)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Data Available")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (div_width - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");

	}


}

//Popup KPI
function get_PopupKPI(Machine, response) {

	$('.updated_maindashboardtime').text(new Date().toLocaleString());

	if (response.data.Table8.length > 0) {


		var responseData = response.data.Table8;
		$('#popupKpiBatch').html('');
		$('#popupKpiBatch').html(`<b>LATEST KEY PERFORMANCE INDICATOR</b> </br>BATCH : ${responseData[0].Batch} </br> OK PARTS : ${responseData[0].OK_Parts} </br> NOK PARTS : ${responseData[0].NOK_Parts}`);

		let chart = radialProgress('.widget', 'Availability')
		let progress = [responseData[0].Availability]
		let state = 0

		chart.update(progress[state])
		state = (state + 1) % progress.length



		let chart1 = radialProgress('.widget1', 'Performance')
		let progress1 = [responseData[0].Performance]
		let state1 = 0

		chart1.update(progress1[state1])
		state1 = (state1 + 1) % progress1.length



		let chart2 = radialProgress('.widget2', 'Quality')
		let progress2 = [responseData[0].Quality]
		let state2 = 0

		chart2.update(progress2[state2])
		state2 = (state2 + 1) % progress2.length



		let chart3 = radialProgress('.widget3', 'OEE')
		let progress3 = [responseData[0].OEE]
		let state3 = 0

		chart3.update(progress3[state3])
		state3 = (state3 + 1) % progress3.length


	}

	else {

	}





}


//Popup Util
function get_PopupUtil(Machine, response) {


	if (response.data.Table8.length > 0) {

		var responseData = response.data.Table8;

		$('#popupUtilBatch').html('');
		$('#popupUtilBatch').html(`<b>LATEST UTILISATION</b> </br>BATCH : ${responseData[0].Batch}`);


		d3.select("#utli_overview svg").remove();
		d3.select("#utli_overview div").remove();


		var data = [
			{ name: "Production Time", value: responseData[0].Uptime },
			{ name: "Loss/Idle Time", value: responseData[0].Losstime },
			{ name: "Down Time", value: responseData[0].Downtime },
			//{ name: "Break Time", value: responseData[0].Breaktime },
			{ name: "PLC-DLK Disconnect Time", value: responseData[0].DLK_to_PLC_Disconnect_time }

		];

		//var totalCal = responseData[0].Uptime + responseData[0].Losstime + responseData[0].Downtime + responseData[0].Breaktime + responseData[0].DLK_to_PLC_Disconnect_time;

		//console.log(totalCal);

		var totalCal = parseInt(responseData[0].Uptime, 10) + parseInt(responseData[0].Losstime, 10) + parseInt(responseData[0].Downtime, 10) + parseInt(responseData[0].Breaktime, 10) + parseInt(responseData[0].DLK_to_PLC_Disconnect_time, 10);


		var text = "";

		var width = 160;
		var height = 160;
		var thickness = 20;
		var duration = 750;
		var padding = 2;
		var opacity = 0.7;
		var opacityHover = 1;
		var otherOpacityOnHover = 0.8;
		var tooltipMargin = 2;


		var radius = Math.min(width - padding, height - padding) / 2;
		//var color = d3.scaleOrdinal(['#87c300', '#fac316 ', '#F39C12', '#3d85c6']);
		var color = d3.scaleOrdinal(["#4CAF50", "#FFBF00", "#F44336", "#3D85C6", "#BBBBBB"]);

		var svg = d3.select("#utli_overview")
			.append('svg')
			.attr('class', 'pie')
			.attr('width', width)
			.attr('height', height);

		var g = svg.append('g')
			.attr('transform', 'translate(' + (height / 2) + ',100)');

		var arc = d3.arc()
			.innerRadius(0)
			.outerRadius(radius);

		var pie = d3.pie()
			.value(function (d) { return d.value; })
			.sort(null);

		var path = g.selectAll('path')
			.data(pie(data))
			.enter()
			.append("g")
			.append('path')
			.attr('d', arc)
			.attr('fill', (d, i) => color(i))
			//.style('opacity', opacity)
			.style('stroke', 'white')
			.on("mouseover", function (event, d) {
				const darkenFactor = 0.2;
				const enlargedRadius = radius + 2; // Increase the radius by 10 (adjust as needed)
				d3.select(this)
					.transition()
					.duration(200) // Set the duration of the transition
					.attr("d", d3.arc().innerRadius(0).outerRadius(enlargedRadius))
					.attr("fill", d3.rgb(color(d)).darker(darkenFactor));
			})
			.on("mouseout", function (event, d) {
				d3.select(this)
					.transition()
					.duration(200) // Set the duration of the transition
					.attr("d", arc)
					.attr("fill", color(d));
			})


			.each(function (d, i) { this._current = i; });


		// Add hover effect on pie chart slices
		//path
		//	.on("mouseover", function (event, d) {
		//		d3.select(this).attr("fill", d3.rgb(color(d.index)).brighter(0.5));
		//	})
		//	.on("mouseout", function (event, d) {
		//		d3.select(this).attr("fill", color(d.index));
		//	});



		let legend = d3.select("#utli_overview").append('div')
			.attr('class', 'legend');

		let keys = legend.selectAll('.key')
			.data(data)
			.enter().append('div')
			.attr('class', 'key')
			.style('display', 'flex')
			.style('align-items', 'center')
			.style('height', '20px')
			.style('margin-top', '10px');

		keys.append('div')
			.attr('class', 'symbol')
			.style('height', '6px')
			.style('width', '6px')
			.style('margin', '1px 5px')
			//.style('opacity','0.8')
			.style('background-color', (d, i) => color(i));

		keys.append('div')
			.attr('class', 'name')
			.html(d => `${d.name} - ${d.value} (min)</br>${totalCal == 0 ? 0 : (Math.round((d.value * 100) / totalCal))}%`)
			.style('line-height', '105%')
			.style('font-size', '10px');

		keys.exit().remove();

	}
	else {

	}

}

//Carousel
function carouselMachine() {
	var machine = 5;

	//$.getScript("../Scripts/d3.min.js");
	////debugger;
	var URL = this.sURL;

	var R_url = this.R_url;
	var user1 = this.user1;



	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/OEE/Get_NewUI_data',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			if (loadingFlag == false) {
				$('.loading').show();
				console.log(loadingFlag);
			}
		},
		complete: function () {
			loadingFlag = true;
			$('.loading').hide();
			console.log(loadingFlag);
		},
		success: function (response) {
			if (response.data.Table == null) {
				//console.log("No Data Available");Data Logging Kit(s) is not transmitting the data (or) The Analysis Job didn't execute
				$(".item_div").html(`<div class="col-md-12 item_div_nodata">Data Not Available</div>`);
			}
			else {


				var sarr = [];

				var ItemNo = (response.data.Table.length) / 2;


				var cols = "";
				var cols_btn = "";
				var cols_status = "";
				var ajaxResult = [];

				let machine_no = 0;

				for (let i = 0; i < ItemNo; i++) {



					if (i == 0) {
						cols += "<div class='item active item_" + i + "' id='darkg'>";
					} else {
						cols += "<div class='item item_" + i + "' id='darkg'>";
					}

					cols += "<div class='panel panel-default panel0' id='darkg'>";
					cols += "<div class='panel-body ' id='darkg'>";
					cols += "<div class='row' id='darkg'>";
					cols += "<div class='col-md-12' id='darkg'>";
					cols += "<div class='row row_slide'  id='darkg'>";

					for (let jj = 0; jj < 2; jj++) {

						if (machine_no < response.data.Table.length) {
							ajaxResult.push(response.data.Table[machine_no].AssetName);


							var machine_nos = machine_no + 1;
							var MTTR = '-';
							var Min = '';
							if (response.data.Table[machine_no].MTTR != 0) {
								MTTR = response.data.Table[machine_no].MTTR;
								Min = "min";
							}

							var MTBF = '-';
							var Min_MTBF = '';
							if (response.data.Table[machine_no].MTBF != 0 && response.data.Table[machine_no].No_of_stopage != 0) {
								MTBF = response.data.Table[machine_no].MTBF;
								Min_MTBF = "min";
							}
							var Variant = 'Unknown Variant';
							if (response.data.Table[machine_no].Variant !== null) {
								Variant = response.data.Table[machine_no].Variant;
							}
							var TCycletime = '-';
							if (response.data.Table[machine_no].TCycletime != 0.00) {
								TCycletime = response.data.Table[machine_no].TCycletime + "s";
							}
							var Station_Number = response.data.Table[machine_no].Machine_code.substring(1);

							var Performance = response.data.Table[machine_no].Performance;
							if (response.data.Table[machine_no].Performance > 100) {
								Performance = 100;
							}
							//console.log("Station Number:" + Station_Number);
							var CT = '-';
							if (response.data.Table[machine_no].Cycletime != 0.00) {
								CT = response.data.Table[machine_no].Cycletime + "s";
							}

							cols += `<div class='col-md-6'>
									<section class='panel panel1'  >
										<header class='panel-heading'>
											<div class='row'>
												<div class='col-md-12 fontSanserif' >
													${response.data.Table[machine_no].AssetName} - ${response.data.Table[machine_no].AssetDescription}
													<li class="breadcrumb-item titleTooltip">
														<a href="#" class="dropdown-toggle notification-icon no_hand_cursor" data-toggle="dropdown">
															<i class="fa fa-database " id="carouselMachineStatus${machine_nos}"></i>
															<span class="tooltiptext2" id="carouselMachineStatusText${machine_nos}">Status Text</span>
														</a>
													</li>
													<div class="right-wrapper pull-right">
														<ol class="breadcrumb">
																<li class="breadcrumb-item titleTooltip">
																	<a href="#" class="dropdown-toggle notification-icon" data-toggle="dropdown"   onclick="get_HourlyData('${response.data.Table[machine_no].Machine_code}','${response.data.Table[machine_no].AssetDescription}','${response.data.Table[machine_no].Shift_id}','${response.data.Table[machine_no].AssetName}');">
																		<i class="fa fa-clock-o text-primary"></i>
																		<span class="tooltiptext">Hourly Tracker</span>
																	</a>
																</li>
															<li class="breadcrumb-item titleTooltip">
																<a href="#" class="dropdown-toggle notification-icon" data-toggle="dropdown" onclick='get_machine_code("${response.data.Table[machine_no].Machine_code}","${response.data.Table[machine_no].AssetName}","${response.data.Table[machine_no].Shift_id}","${response.data.Table[machine_no].AssetDescription}","${response.data.Table[machine_no].VariantCode}")'>
																	<i class="fa fa-bar-chart-o text-muted"></i>
																	<span class="tooltiptext">KPI</span>
																</a>
															</li>
														</ol>
													</div>
												</div>
											</div>
											<div class="row">
												<div class='col-md-12'>
													<div id=' ' class='machineBatchcode'>Batch Code : ${response.data.Table[machine_no].Batch}
														<div class="right-wrapper pull-right">
															<ol class="breadcrumb">
																
															</ol>
														</div>
													</div>
												</div>
											</div>
										</header>
										<div class='panel-body' >
											<div class='row'>
												<div class='col-md-4 kpiCard'>
													<div class='col-md-12 kpiCard_outer'>
														<div class='row row_shift'>
															<div class='col-md-12 kpicard_Shift'>
																<div>
																	<span class='shift_label'>SHIFT&nbsp;</span>
																	<span class='shift_id'> ${response.data.Table[machine_no].Shift_id} </span>
																</div>
															</div>
														</div>
														<div class='row row_oee'>
															<center>
																<div class='widget_${machine_nos} carouselWidget oee'></div>
															</center>
														</div>
														<div class='row row_apq' id='bm'>
															<div class="progress-container">
																<div class="progress progress-xs progress-half-rounded m-md light">
																	<div class="progress-bar progress-bar-info prog_avail" role="progressbar" aria-valuenow="${response.data.Table[machine_no].Availability}" aria-valuemin="0" aria-valuemax="100" style="width: ${response.data.Table[machine_no].Availability}%;">
																		${response.data.Table[machine_no].Availability}%
																	</div>
																</div>
																<div class="progress-labels">
																	<span class='apq_label'>A</span>
																	<span class="kpicard_apq_value">${response.data.Table[machine_no].Availability}%</span>
																</div>
															</div>
															<div class="progress-container">
																<div class="progress progress-xs progress-half-rounded m-md light">
																	<div class="progress-bar progress-bar-info prog_perf" role="progressbar" aria-valuenow="${response.data.Table[machine_no].Performance}" aria-valuemin="0" aria-valuemax="100" style="width: ${response.data.Table[machine_no].Performance}%;">
																		${response.data.Table[machine_no].Performance}%
																	</div>
																</div>
																<div class="progress-labels">
																	<span class='apq_label'>P</span>
																	<span class="kpicard_apq_value">${response.data.Table[machine_no].Performance}%</span>
																</div>
																
															</div>
															<div class="progress-container">
																<div class="progress progress-xs progress-half-rounded m-md light">
																	<div class="progress-bar progress-bar-info prog_qual" role="progressbar" aria-valuenow="${response.data.Table[machine_no].Quality}" aria-valuemin="0" aria-valuemax="100" style="width: ${response.data.Table[machine_no].Quality}%;">
																		${response.data.Table[machine_no].Quality}%
																	</div>
																</div>
																<div class="progress-labels">
																	<span class='apq_label'>Q</span>
																	<span class="kpicard_apq_value">${response.data.Table[machine_no].Quality}%</span>
																</div>
															</div>
														</div>

													</div>
												</div>
												<div class='col-md-8 productionCard' id='bm'>
													<div class='col-md-12 productionCard prodCardMargin'>
														<div class='row row_ProdCard' id='bm' >
															<div class="carousel_inner_padding">
																<div class='col-md-3 '>
																	<div class='row'>
																		<div class='col-md-12 '>
																			<div class='col-md-4 nopadding'>
																				<span class="carousel_Label">OK</span>
																			</div>
																			<div class='col-md-8 noRpadding titleTooltip'>
																				<span class="carousel_Value">${response.data.Table[machine_no].OK_Parts}</span>
																				<span class="tooltiptext3">Rework parts : ${response.data.Table[machine_no].Rework_Parts}</span>
																			</div>
																		</div>
																	</div>
																	<div class='row'>
																		<div class='col-md-12'>
																			<div class='col-md-4 nopadding'>
																				<span class="carousel_Label">NOK</span>
																			</div>
																			<div class='col-md-8 noRpadding'>
																				<span class="carousel_Value">${response.data.Table[machine_no].NOK_Parts}</span>
																			</div>
																		</div>
																	</div>
																</div>
																<div class='col-md-6'>
																	<div class='row centreText'>
																		<span class="carousel_Label">VARIANT</span>
																	</div>
																	<div class='row centreText'>
																		<span class="carousel_Value carousel_Var">${Variant}
																		</span>
																	</div>
																	<div class="mycontent-left"> </div>
																</div>
																<div class='col-md-3'>
																	<div class='row'>
																		<div class='col-md-12 '>
																			<div class='col-md-4 nopadding'>
																				<span class="carousel_Label">CT</span>
																			</div>
																			<div class='col-md-8 noRpadding'>
																				<span class="carousel_Value">${CT}
																				</span>
																			</div>
																		</div>
																	</div>
																	<div class='row'>
																		<div class='col-md-12 '>
																			<div class='col-md-4 nopadding'>
																				<span class="carousel_Label">TCT</span>
																			</div>
																			<div class='col-md-8 noRpadding'>
																				<span class="carousel_Value">${TCycletime}</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div class='row row_alarm' id='bm'>
															<div class="carousel_inner_padding">
																<div class='col-md-4 centreText'>
																	<ul class="notifications">
																		<li class="titleTooltip">
																			<a href="#" class="dropdown-toggle notification-icon no_hand_cursor" data-toggle="dropdown">
																				<i class="fa fa-bell"></i>
																				<span class="badge">${response.data.Table[machine_no].LiveAlarmCounts}</span>
																				<span class="tooltiptext">
																					Total Stoppage : ${response.data.Table[machine_no].No_of_stopage}</br>
																					Live Alarms : ${response.data.Table[machine_no].LiveAlarmCounts}
																				</span>
																			</a>
																		</li>
																	</ul>
																</div>
																<div class='col-md-4'>
																	<div class='row centreText'>
																		<span class="carousel_Label">MTTR</span>
																	</div>
																	<div class='row centreText'>
																		<span class="carousel_Value">${MTTR}
																			<span class="row_alarm_Min">${Min}</span>
																		</span>
																	</div>
																</div>
																<div class='col-md-4'>
																	<div class='row centreText'>
																		<span class="carousel_Label">MTBF</span>
																	</div>
																	<div class='row centreText'>
																		<span class="carousel_Value">${MTBF}
																			<span class="row_alarm_Min">${Min_MTBF}</span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
														<div class='row zoom row_util' id='bm'>
															<div class='col-md-12'>
																<div class="util_overview" id='utli_overview_${response.data.Table[machine_no].Machine_code}' ></div>
															</div>
														</div>

													</div>
												</div>
											</div>
										</div>
									</section>
								</div>`;


							cols_status += `<div class='flex-item-status_bar_box titleTooltip_status machine_status_bars' id="carouselStatusBar${machine_nos}" data-target='#myCarousel' data-slide-to='${i}'>
												<label id="statusbar_hov">${response.data.Table[machine_no].AssetName}</label><br>
												<label id="okpart_id">${response.data.Table[machine_no].OK_Parts}</label>/
												<label id="nok_id">${response.data.Table[machine_no].NOK_Parts}</label>`;
							cols_status += `<span class="tooltiptext_status" id="statusbar_toltip${machine_nos}"></span>
											</div>`;

							machine_no++;




						}


					}



					cols += "</div>";
					cols += "</div>";
					cols += "</div>";
					cols += "</div>";
					cols += "</div>";
					cols += "</div>";


					//let ii = 2;
					//if (i == 0) {
					//	//cols_btn += "<li data-target='#myCarousel' data-slide-to='" + i + "' title='Machine Status Bar  Station 1 - 2' class='active' style='background-color: darkgrey; color: darkgrey; '></li>";
					//	cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Machine Status Bar  Station 1 - 2' class='active' id="slide_nav_button"></li>`;
					//} else {
					//	var st1 = (i + (ii));
					//	var st2 = (i + (ii + 1));
					//	//cols_btn += "<li data-target='#myCarousel' data-slide-to='" + i + "' title='Machine Status Bar  Station " + st1 + " - " + st2 + "' class='car_nav_list_" + i + "' style='background-color: darkgrey; color: darkgrey; '></li>";
					//	cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Machine Status Bar  Station ${st1} - ${st2}' class='car_nav_list_${i}' id="slide_nav_button"></li>`;
					//}



					if (!ajaxResult[1])

						cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Station ${ajaxResult[0]}' class='car_nav_list_${i}' id="slide_nav_button"></li>`;

					else
						cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Station ${ajaxResult[0]} & ${ajaxResult[1]}' class='car_nav_list_${i}' id="slide_nav_button"></li>`;



					ajaxResult.splice(0, ajaxResult.length);


				}

				$(".item_div").html(cols);

				$("#carousel_btn").html(cols_btn);
				$(".statusbar_flex").html(cols_status);
				let machine_no1 = 0;

				for (let i1 = 0; i1 < ItemNo; i1++) {
					for (let jj1 = 0; jj1 < 2; jj1++) {
						if (machine_no1 < response.data.Table.length) {

							//-----------Utilization Chart-----------------//

							var data = [
								{ name: "Production Time", value: response.data.Table[machine_no1].Uptime },
								{ name: "Loss/Idle Time", value: response.data.Table[machine_no1].Losstime },
								{ name: "Down Time", value: response.data.Table[machine_no1].Downtime },
								//{ name: "Break Time", value: response.data.Table[machine_no1].Breaktime },
								{ name: "PLC-DLK Disconnect Time", value: response.data.Table[machine_no1].DLK_to_PLC_Disconnect_time }

							];



							var totalCal = response.data.Table[machine_no1].Uptime + response.data.Table[machine_no1].Losstime + response.data.Table[machine_no1].Downtime + response.data.Table[machine_no1].Breaktime + response.data.Table[machine_no1].DLK_to_PLC_Disconnect_time;
							var text = "";
							var width = 90;
							var height = 90;
							var thickness = 20;
							var duration = 750;
							var padding = 2;
							var opacity = 0.9;
							var opacityHover = 1;
							var otherOpacityOnHover = 0.8;
							var tooltipMargin = 2;

							var radius = Math.min(width, height) / 2;
							//var color = d3.scaleOrdinal(['#87c300', '#fac316 ', '#F39C12', '#3d85c6']);
							var color = d3.scaleOrdinal(["#4CAF50", "#FFBF00", "#F44336", "#3D85C6", "#BBBBBB"]);
							var svg = d3.select("#utli_overview_" + response.data.Table[machine_no1].Machine_code)
								.append('svg')
								.attr('class', 'pie')
								.attr('width', width)
								.attr('height', height)
								.style('margin-top', '18px')
								.style('margin-left', '5px');

							var g = svg.append('g')
								.attr('transform', 'translate(' + (height / 2) + ',' + (height / 2) + ')');

							var arc = d3.arc()
								.innerRadius(0)
								.outerRadius(radius);

							var pie = d3.pie()
								.value(function (d) { return d.value; })
								.sort(null);

							var path = g.selectAll('path')
								.data(pie(data))
								.enter()
								.append("g")
								.append('path')
								.attr('d', arc)
								.attr('fill', (d, i) => color(i))
								//.style('opacity', opacity)
								.style('stroke', 'white')
								.on("mouseover", function (event, d) {
									const darkenFactor = 0.2;
									const enlargedRadius = radius + 1; // Increase the radius by 10 (adjust as needed)
									d3.select(this)
										.transition()
										.duration(200) // Set the duration of the transition
										.attr("d", d3.arc().innerRadius(0).outerRadius(enlargedRadius))
										.attr("fill", d3.rgb(color(d)).darker(darkenFactor));
								})
								.on("mouseout", function (event, d) {
									d3.select(this)
										.transition()
										.duration(200) // Set the duration of the transition
										.attr("d", arc)
										.attr("fill", color(d));
								})
								//.on("mouseout", function (d) {
								//	d3.select("svg")
								//		.style("cursor", "none")
								//		.select(".tooltip").remove();
								//	d3.selectAll('path')
								//		.style("opacity", opacity);
								//})
								.on("touchstart", function (d) {
									d3.select("svg")
										.style("cursor", "none");
								})
								.each(function (d, i) { this._current = i; });

							let legend = d3.select("#utli_overview_" + response.data.Table[machine_no1].Machine_code).append('div')
								.attr('class', 'legend1')
								.style('margin-top', '-105px');

							legend.append("text")
								.text("UTILIZATION")
								.style("color", "grey")
								.style("font-size", "10px");

							let keys = legend.selectAll('.key')
								.data(data)
								.enter().append('div')
								.attr('class', 'key')
								.style('display', 'flex')
								.style('align-items', 'center')
								.style('height', '13px')
								.style('margin-right', '40px');

							keys.append('div')
								.attr('class', 'symbol')
								.style('height', '7px')
								.style('width', '7px')
								.style('margin', '0px 10px 1px 1px')
								//.style('opacity', opacity)
								.style('background-color', (d, i) => color(i));

							keys.append('div')
								.attr('class', 'name')
								.text(d => `${d.name} - ${d.value} (min) - ${totalCal == 0 ? 0 : (Math.round((d.value * 100) / totalCal))}%`);

							keys.exit().remove();



							//-----------Circular Bar Chart-----------------//
							function radialProgress(selector, labelText) {
								const parent = d3.select(selector)

								const size = { top: 0, right: 0, bottom: 0, left: 0, height: 117, width: 117, x: 10, y: 10 };

								d3.select(selector + " svg").remove();
								const svg = parent.append('svg');
								//	.attr('width', 199)
								//	.attr('height', 199);

								const outerRadius = Math.min(size.width, size.height) * 0.45;//radius
								const thickness = 8; //bar thickness
								let value = 0;

								const mainArc = d3.arc()
									.startAngle(0)
									.endAngle(Math.PI * 2)
									.innerRadius(outerRadius - thickness)
									.outerRadius(outerRadius)

								svg.append("path")
									.attr('class', 'progress-bar-bg')
									.attr('transform', `translate(${size.width / 2},${size.height / 2})`)
									.attr('d', mainArc())

								const mainArcPath = svg.append("path")
									.attr('class', 'progress-bar')
									.attr('transform', `translate(${size.width / 2},${size.height / 2})`)

								svg.append("circle")
									.attr('class', 'progress-bar')
									.attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
									.attr('width', thickness)
									.attr('height', thickness)
									.attr('r', thickness / 2)

								const end = svg.append("circle")
									.attr('class', 'progress-bar')
									.attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
									.attr('width', thickness)
									.attr('height', thickness)
									.attr('r', thickness / 2)

								let percentLabel = svg.append("text")
									.attr('class', 'progress-label')
									.attr('transform', `translate(${size.width / 2},${((size.height / 2) - (size.height / 25))})`)
									.text('0')
								let percentLabel1 = svg.append("text")
									.attr('class', 'progress-label1')
									.attr('transform', `translate(${size.width / 2},${((size.height / 2) + (size.height / 6))})`)
									.text('0')
								return {
									update: function (progressPercent) {
										const startValue = value
										const startAngle = Math.PI * startValue / 50
										const angleDiff = Math.PI * progressPercent / 50 - startAngle;
										const startAngleDeg = startAngle / Math.PI * 180
										const angleDiffDeg = angleDiff / Math.PI * 180
										const transitionDuration = 1500

										mainArcPath.transition().duration(transitionDuration).attrTween('d', function () {
											return function (t) {
												mainArc.endAngle(startAngle + angleDiff * t)
												return mainArc();
											}
										})
										end.transition().duration(transitionDuration).attrTween('transform', function () {
											return function (t) {
												return `translate(${size.width / 2},${size.height / 2})` +
													`rotate(${(startAngleDeg + angleDiffDeg * t)})` +
													`translate(0,-${outerRadius - thickness / 2})`
											}
										})
										percentLabel.transition().duration(transitionDuration).tween('bla', function () {
											return function (t) {
												percentLabel.text((Math.round(startValue + (progressPercent - startValue) * t)) + " %");
												percentLabel1.text(labelText);
											}
										})
										value = progressPercent
									}
								}
							}


							let chart = radialProgress(('.widget_' + (machine_no1 + 1)), 'OEE')
							let progress = [response.data.Table[machine_no1].OEE]
							let state = 0
							chart.update(progress[state])
							state = (state + 1) % progress.length


							var machineStatusColor = '';
							var machineStatusText = '';
							if (response.data.Table1[machine_no1].Machine_Status == "0") {
								machineStatusColor = 'rgb(244,67,54)';
								machineStatusText = 'Machine under Error';
							}
							if (response.data.Table1[machine_no1].Machine_Status == '1') {
								machineStatusColor = 'rgb(76,175,80)';
								machineStatusText = 'Machine Running';
							}
							if (response.data.Table1[machine_no1].Machine_Status == '2') {
								machineStatusColor = 'rgb(255, 191, 0)';
								machineStatusText = 'Machine is Idle/Loss';
							}
							if (response.data.Table1[machine_no1].Machine_Status == '3') {
								machineStatusColor = 'rgb(255, 191, 0)';
								machineStatusText = 'Machine is Idle/Loss';
							}
							if (response.data.Table1[machine_no1].Machine_Status == '4') {
								machineStatusColor = 'rgb(61,133,198)';
								machineStatusText = 'Planned Break';
							}
							if (response.data.Table1[machine_no1].Machine_Status == '5') {
								machineStatusColor = 'rgba(187, 187, 187)';
								machineStatusText = 'PLC disconnect with Gateway';
							}

							var machineDataStatusColor = '';
							var machineDataStatusText = '';
							if (response.data.Table1[machine_no1].LiveStatus == "0") {
								machineDataStatusColor = 'rgb(244,67,54)';
								machineDataStatusText = 'Data receiving interrupted</br>More than 10 min ago</br>Last Update';
							}
							if (response.data.Table1[machine_no1].LiveStatus == "1") {
								machineDataStatusColor = 'rgb(76,175,80)';//#82CD47
								machineDataStatusText = 'Live</br>Last Update';
							}



							var carouselMachineStatus = document.getElementById('carouselMachineStatus' + (machine_no1 + 1));
							var carouselStatusBar = document.getElementById('carouselStatusBar' + (machine_no1 + 1));
							var carouselMachineStatusText = document.getElementById('carouselMachineStatusText' + (machine_no1 + 1));
							var statusbarToolTip = document.getElementById('statusbar_toltip' + (machine_no1 + 1));

							carouselMachineStatus.style.color = machineDataStatusColor;
							carouselMachineStatusText.innerHTML = machineDataStatusText + " - " + response.data.Table1[machine_no1].time_stamp;
							carouselStatusBar.style.backgroundColor = machineStatusColor;
							//statusbarToolTip.innerHTML = "Station Name : " + "<b>" + response.data.Table[machine_no1].AssetDescription + "</b><br>" + "Status : <b>" + machineStatusText + "</b><br>OEE : <b>" + progress + " %</b>";
							statusbarToolTip.innerHTML = `${response.data.Table[machine_no1].AssetDescription}<br>Status : ${machineStatusText}<br>OEE : <b>${progress}%</b>&emsp;Rework Parts : ${response.data.Table[machine_no1].Rework_Parts}`;

							machine_no1++;
						}

					}

				}


			}

		},
		error: function (response) {
			if (response.status == "401") {
				swal({
					icon: "warning",
					title: "Session Timeout",
					button: true,
					closeModal: false
				})
				window.location = R_url;
			}
			else {
				swal({
					icon: "warning",
					title: response.responseText,
					button: true,
					closeModal: false
				})

			}
		}
	});


	if (flag == 1)
		setTimeout(carouselMachine, 60000);


}

//Latest Alarm
function get_AlarmData(Machine, MachineName, MachineDesc) {
	$("#myModalLatestAlarmTitle").html(`${MachineDesc} - ${MachineName} <p hidden id='mcCode'>- ${Machine}</p>`);
	$(".Historic_details").empty();
	$("#myModalLatestAlarm").modal('show');

	var date = new Date();
	var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

	var Fdate = current_date;
	var Tdate = current_date;


	if (Fdate != "" && Tdate != "") {

		var URL = this.URL;
		var user1 = this.user1;
		var myData = {

			"QueryType": "Alarm",
			"CompanyCode": this.company,
			"PlantCode": this.plant,
			"Line_Code": this.line,
			"Machine_Code": Machine

		};

		$.ajax({
			type: "POST",
			url: URL + 'api/Live_Alarm/Popup_Machinewise_Live_AlarmLoss',
			data: myData,
			headers: {
				Authorization: 'Bearer ' + user1
			},
			dataType: "json",
			beforeSend: function () {
				$('.loading').show();
			},
			complete: function () {
				$('.loading').hide();
			},
			success: function (response) {

				if (response.status != "Error") {
					var j = 1;

					var rowsCnt = document.getElementById("datatable-default1").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
					if (rowsCnt > 0) {
						for (var i = 0; i < rowsCnt; i++) {
							//document.getElementById("datatable-default1").deleteRow(1);
						}
					}
					if ($.fn.DataTable.isDataTable('#datatable-default1')) {
						$('#datatable-default1').DataTable().clear();
					}

					if ($.fn.DataTable.isDataTable('#datatable-default1')) {
						$('#datatable-default1').DataTable().destroy();
					}
					//$(".alarm_error").empty();
					$(".Historic_details").empty();
					for (var i = 0; i < response.data.Table.length; i++) {


						var newRow = $("<tr>");
						var cols = '';
						cols += "<td> " + j + "</td> ";
						//cols += "<td> " + response.data.Table[i].Machine_Code + "</td> ";
						cols += "<td> " + response.data.Table[i].Alarm_ID + "</td> ";
						cols += "<td> " + response.data.Table[i].Alarm_Description + `</td> `;
						cols += "<td> " + response.data.Table[i].s_time + "</td> ";
						cols += "<td style='display: none' class='id'> " + response.data.Table[i].Help + "</td> ";
						cols += "<td style='text-align:center;'>"
							+ " <button class='btn btn-primary btn-sm' onclick='get_AlarmHelpFile(" + response.data.Table[i].Help + ")' type='button' class='download'><i class='fa fa-question-circle' aria-hidden='true'></i></button>"
							+ " </td>";
						cols += "</tr>";
						newRow.append(cols);
						$(".Historic_details").append(newRow);
						j++;
					}

					$('#datatable-default1').DataTable({
						"responsive": true,
						"autoWidth": false,
					});
				}

				else {
					$(".Historic_details").empty();
					$(".Historic_details").append(`<tr><td colspan="6"><b>${response.msg}</b></td></tr>`).css("text-align", "center");

				}
			},
			error: function (response) {
				if (response.status == "401") {
					swal({
						icon: "warning",
						title: "Session Expired",
						button: true,
						closeModal: false
					})
					window.location = R_url;
				}
				else {
					swal({
						icon: "warning",
						title: response.responseText,
						button: true,
						closeModal: false
					})

				}
			}
		});


	}
	else {

		swal({
			icon: "warning",
			title: "Please Select Date",
			button: true,
			closeModal: false
		})
	}

}

//Latest Alarm Help
function get_AlarmHelpFile(id, Machine) {

	var URL = this.URL;

	var CompanyCode = this.company;
	var PlantCode = this.plant;
	var LineCode = this.line;
	//console.log(id);

	if (!id) {

		swal({
			icon: "warning",
			title: "Alarm help file not configured",
			button: false,
			timer: 1500
		})

	}
	else {


		var myDatas2 = {
			"QueryType": "File",
			"CompanyCode": CompanyCode,
			"PlantCode": PlantCode,
			"LineCode": LineCode,
			"Unique_id": id,
		};
		var user1 = this.user1;

		$.ajax({
			type: "POST",
			data: myDatas2,
			headers: {
				Authorization: 'Bearer ' + user1
			},
			url: URL + 'api/Values/CollectFileName_settings_details',
			dataType: "json",
			success: function (response3) {

				try {
					var filename = response3.data.Table[0].filename;
					var path1 = window.location.protocol + "//" + window.location.host + "/Manuals/" + CompanyCode + "/" + PlantCode + "/" + LineCode + "/" + filename;

					//console.log(path1)
					// window.open(path1, '_blank');
					var link = document.createElement("a");
					link.download = filename;
					link.href = path1;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					delete link;

					return false;

				}
				catch (err) {

					swal({
						icon: "warning",
						title: " File  not Found",
						button: false,
						timer: 1500
					})

				}
			}
		}).error(function (response3) {
			if (response.status == "401") {
				swal({
					icon: "warning",
					title: "Session Timeout",
					button: true,
					closeModal: false
				})
				window.location = R_url;
			}
			else {
				swal({
					icon: "warning",
					title: response.responseText,
					button: true,
					closeModal: false
				})

			}
		});

	}
}

//Latest Loss
function get_LossData(Machine, MachineName, MachineDesc) {
	//debugger;
	//$("#myModalLatestLossTitle").html(MachineDesc + " - " + MachineName);
	$("#myModalLatestLossTitle").html(`${MachineDesc} - ${MachineName} <p hidden id='mcCode'>- ${Machine}</p>`);
	$(".Historic_detail_loss").empty();
	$("#myModalLatestLoss").modal('show');

	var date = new Date();
	var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

	var Fdate = current_date;
	var Tdate = current_date;


	if (Fdate != "" && Tdate != "") {

		var URL = this.URL;
		var user1 = this.user1;
		var myData = {

			"QueryType": "Loss",
			"CompanyCode": this.company,
			"PlantCode": this.plant,
			"Line_Code": this.line,
			"Machine_Code": Machine

		};

		$.ajax({
			type: "POST",
			url: URL + 'api/Live_Alarm/Popup_Machinewise_Live_AlarmLoss',
			data: myData,
			headers: {
				Authorization: 'Bearer ' + user1
			},
			dataType: "json",
			beforeSend: function () {
				$('.loading').show();
			},
			complete: function () {
				$('.loading').hide();
			},
			success: function (response) {

				if (response.status != "Error") {
					var j = 1;

					var rowsCnt = document.getElementById("datatable-default2").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
					if (rowsCnt > 0) {
						for (var i = 0; i < rowsCnt; i++) {
							//document.getElementById("datatable-default1").deleteRow(1);
						}
					}
					if ($.fn.DataTable.isDataTable('#datatable-default2')) {
						$('#datatable-default2').DataTable().clear();
					}

					if ($.fn.DataTable.isDataTable('#datatable-default2')) {
						$('#datatable-default2').DataTable().destroy();
					}
					$(".Historic_detail_loss").empty();
					//$(".Loss_error").empty();

					for (var i = 0; i < response.data.Table.length; i++) {


						var newRow = $("<tr>");
						var cols = '';
						cols += "<td> " + j + "</td> ";
						//cols += "<td> " + response.data.Table[i].Machine_Code + "</td> ";
						cols += "<td> " + response.data.Table[i].Loss_ID + "</td> ";
						cols += "<td> " + response.data.Table[i].Loss_Description + `</td> `;
						cols += "<td> " + response.data.Table[i].s_time + "</td> ";
						cols += "</tr>";
						newRow.append(cols);
						$(".Historic_detail_loss").append(newRow);
						j++;
					}

					$('#datatable-default2').DataTable({
						"responsive": true,
						"autoWidth": false,
					});
				}

				else {
					$(".Historic_detail_loss").empty();
					$(".Historic_detail_loss").append(`<tr><td colspan="6"><b>No Live Loss</b></td></tr>`).css("text-align", "center");;

				}
			},
			error: function (response) {
				if (response.status == "401") {
					swal({
						icon: "warning",
						title: "Session Expired",
						button: true,
						closeModal: false
					})
					window.location = R_url;
				}
				else {
					swal({
						icon: "warning",
						title: response.responseText,
						button: true,
						closeModal: false
					})

				}
			}
		});


	}
	else {

		swal({
			icon: "warning",
			title: "Please Select Date",
			button: true,
			closeModal: false
		})
	}
}

//Hourly Tracker
function get_HourlyData(Machine, MachineDesc, Shift, MachineName) {

	$('.updated_maindashboardtime').text(new Date().toLocaleString());

	$("#myModalHourlyTrackerTitle").html(MachineName + " - " + MachineDesc);
	$(".Hourly_OEE").empty();
	$(".Hourly_Utilisation").empty();
	$(".Hourly_Downtime").empty();
	$(".Hourly_Production_Alignment").empty();
	$(".Hourly_Production").empty();

	$("#myModalHourlyTracker").modal('show');

	var date = new Date();
	var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

	var myData = {

		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"Line_Code": this.line,
		"Machine": Machine,
		"Date": current_date,
		"Shift": Shift

	};

	$.ajax({
		type: "POST",
		url: URL + 'api/UserSettings/Popup_Machinewise_Live_Hourly',
		data: myData,
		headers: {
			Authorization: 'Bearer ' + user1
		},
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {

			if (response.status != "Error") {

				//const dateTimeInParts = response.data.Table8[0].Date.toString().split("T");
				//const date = dateTimeInParts[0];

				var dates = response.data.Table[0].Dates;
				const dateTimeInParts = dates.toString().split("T"); // DateTime object => "2021-08-31T15:15:41.886Z" => [ "2021-08-31", "15:15:41.886Z" ]

				const date = dateTimeInParts[0]; // "2021-08-31"
				const time = dateTimeInParts[1];
				//console.log(date);

				$('#popupHourlyDate').html(`Date : ${date}</br>Shift : ${response.data.Table[0].Shift}`);
				$('#popupHourlyDate1').html(`Date : ${date}</br>Shift : ${response.data.Table[0].Shift}`);
				$('#popupHourlyDate2').html(`Date : ${date}</br>Shift : ${response.data.Table[0].Shift}`);
				$('#popupHourlyDate3').html(`Date : ${date}</br>Shift : ${response.data.Table[0].Shift}`);
				$('#popupHourlyDate4').html(`Date : ${date}</br>Shift : ${response.data.Table[0].Shift}`);

				get_HourlyOEE(response);
				get_HourlyUtilisation(response);
				get_HourlyDowntime(response);
				get_HourlyProductionAlignment(response);
				get_HourlyProduction(response);

			}

			else {
				$('#popupHourlyDate').text('');
				$('#popupHourlyDate1').text('');
				$('#popupHourlyDate2').text('');
				$('#popupHourlyDate3').text('');
				$('#popupHourlyDate4').text('');
				//Hourly OEE
				$(".Hourly_OEE").empty();
				var div_width = 1188;
				var div_height = 230;
				var svg = d3.select(".Hourly_OEE").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text("No Data Available")
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
				//Hourly Utilisation
				$(".Hourly_Utilisation").empty();
				var div_width = 564;
				var div_height = 230;
				var svg = d3.select(".Hourly_Utilisation").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text("No Data Available")
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
				//Houlry Downtime
				$(".Hourly_Downtime").empty();
				var div_width = 564;
				var div_height = 230;
				var svg = d3.select(".Hourly_Downtime").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text("No Data Available")
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
				//Hourly Production Alignment
				$(".Hourly_Production_Alignment").empty();
				var div_width = 564;
				var div_height = 230;
				var svg = d3.select(".Hourly_Production_Alignment").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text("No Data Available")
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
				//Houlry Production
				$(".Hourly_Production").empty();
				var div_width = 564;
				var div_height = 230;
				var svg = d3.select(".Hourly_Production").append("svg")
					.attr("width", div_width)
					.attr("height", div_height)
					.attr("preserveAspectRatio", "xMidYMid")
					.append("g")
				var text = svg.append("text")
					.text("No Data Available")
					.style("font-size", "15px");
				var textWidth = text.node().getComputedTextLength();
				var xTranslate = (div_width - textWidth) / 2;
				svg.attr("transform", "translate(" + xTranslate + "," + (div_height / 3) + ")");
			}
		},
		error: function (response) {
			if (response.status == "401") {
				swal({
					icon: "warning",
					title: "Session Expired",
					button: true,
					closeModal: false
				})
				window.location = R_url;
			}
			else {
				swal({
					icon: "warning",
					title: response.responseText,
					button: true,
					closeModal: false
				})

			}
		}
	});


}

//Hourly OEE
function get_HourlyOEE(response) {
	var sample = response.data.Table;
	$(".Hourly_OEE").empty();


	// Set up dimensions and margins
	const width = 1200;
	const height = 360;
	const margin = { top: 40, right: 130, bottom: 60, left: 130 };
	const innerWidth = width - margin.left - margin.right - 100;
	const innerHeight = height - margin.top - margin.bottom;

	//Set width of bars
	const barWidth = 10;

	// Create an SVG element
	const svg = d3.select(".Hourly_OEE")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Create tooltips
	const tooltip = d3.select(".Hourly_OEE")
		.append("div")
		.attr("class", "tooltipHourlyOEE")
		.style("opacity", 0);



	// Define x and y scales
	const xScale = d3.scaleBand()
		.domain(sample.map((s) => s.Hour_Batch))
		.range([0, innerWidth])
		.paddingInner(0.1)
		.paddingOuter(0.1);

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(response.data.Table, d => Math.max(d.Availability, d.Performance, d.Quality, d.OEE))])
		.range([innerHeight, 0]);


	// Create grouped bars
	const barGroups = svg.selectAll(".bar-group")
		.data(sample)
		.enter()
		.append("g")
		.attr("class", "bar-group")
		.attr("transform", d => `translate(${xScale(d.Hour_Batch)}, 0)`);

	// Create bars for value1
	barGroups.append("rect")
		.attr("class", "bar1")
		.attr("x", d => xScale.bandwidth() / 2 - (barWidth * 2) - 1)
		.attr("y", d => yScale(d.Availability))
		.attr("width", barWidth)
		.attr("height", d => innerHeight - yScale(d.Availability))
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Availability : ${d.Availability} %</br > Hour : ${d.Hour}</br > Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
				.style("left", `${d3.event.offsetX + 40}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});

	// Create bars for value2
	barGroups.append("rect")
		.attr("class", "bar2")
		.attr("x", d => xScale.bandwidth() / 2 - (barWidth) - 0.5)
		.attr("y", d => yScale(d.Performance))
		.attr("width", barWidth)
		.attr("height", d => innerHeight - yScale(d.Performance))
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Performance : ${d.Performance} %</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
				.style("left", `${d3.event.offsetX + 40}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});

	// Create bars for value3
	barGroups.append("rect")
		.attr("class", "bar3")
		.attr("x", d => xScale.bandwidth() / 2 + 0.5)
		.attr("y", d => yScale(d.Quality))
		.attr("width", barWidth)
		.attr("height", d => innerHeight - yScale(d.Quality))
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Quality : ${d.Quality} %</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
				.style("left", `${d3.event.offsetX + 40}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});

	// Create bars for value4
	barGroups.append("rect")
		.attr("class", "bar4")
		.attr("x", d => xScale.bandwidth() / 2 + (barWidth) + 1)
		.attr("y", d => yScale(d.OEE))
		.attr("width", barWidth)
		.attr("height", d => innerHeight - yScale(d.OEE))
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`OEE : ${d.OEE} %</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
				.style("left", `${d3.event.offsetX + 40}px`)
				.style("top", `${d3.event.offsetY - 28}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});


	//// Add x-axis
	//svg.append("g")
	//	//.attr("class", "x-axis")
	//	.attr("transform", `translate(0, ${innerHeight})`)
	//	.call(d3.axisBottom(xScale).tickFormat(""));


	// Add x-axis
	svg.append("g")
		.attr("class", "x-axis-ticks")
		.attr("transform", `translate(0, ${innerHeight})`)
		.call(d3.axisBottom(xScale).tickFormat(""));

	// Set up the x and y scales
	const x1Scale = d3.scaleBand()
		.domain(sample.map(d => d.Hour_Batch + 10))
		.range([0, width - (3 * margin.left)])
	//.padding(0.1);


	//// Add tick lines
	//svg.selectAll(".x-axis-ticks line")
	//	.attr("class", "tick-line")
	//	.style("stroke", "grey")
	//	.style("stroke-width", 1)
	//	.style("shape-rendering", "crispEdges")
	//	.attr("transform", "translate(" + ((xScale.bandwidth() - (xScale.bandwidth() * 1.5)) + 43) + ",0)"); // Translate the tick lines to align with bars


	// Add y-axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(d3.axisLeft(yScale));

	// Add x-axis label
	svg.append("text")
		.attr("class", "x-axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + margin.bottom - 40)
		.attr("text-anchor", "middle")
		.text("Hourly - Batch");

	// Add y-axis label
	svg.append("text")
		.attr("class", "y-axis-label")
		.attr("x", -innerHeight / 2)
		.attr("y", -margin.left + 70) // Adjust position as needed
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Percentage (%)");

	// Create labels for the bars and rotate them by 90 degrees
	barGroups.append("text")
		.attr("class", "bar-label")
		.attr("x", d => xScale.bandwidth() / 2 - (barWidth * 2) + 1 + barWidth / 2)
		.attr("y", d => yScale(d.Availability) + 3.5)
		.attr("transform", d => `rotate(-90, ${(xScale.bandwidth() / 2 - (barWidth * 2) - 1 + barWidth / 2)}, ${yScale(d.Availability)})`) // Rotate by -90 degrees
		.style("font-size", "10px")
		.style("letter-spacing", "0.1em")
		.text(d => d.Availability);

	barGroups.append("text")
		.attr("class", "bar-label")
		.attr("x", d => xScale.bandwidth() / 2 - (barWidth) + 1.5 + barWidth / 2)
		.attr("y", d => yScale(d.Performance) + 3.5)
		.attr("transform", d => `rotate(-90, ${(xScale.bandwidth() / 2 - (barWidth) - 0.5 + barWidth / 2)}, ${yScale(d.Performance)})`) // Rotate by -90 degrees
		.style("font-size", "10px")
		.style("letter-spacing", "0.1em")
		.text(d => d.Performance);

	barGroups.append("text")
		.attr("class", "bar-label")
		.attr("x", d => xScale.bandwidth() / 2 + 2.5 + barWidth / 2)
		.attr("y", d => yScale(d.Quality) + 3.5)
		.attr("transform", d => `rotate(-90, ${(xScale.bandwidth() / 2 + 0.5 + barWidth / 2)}, ${yScale(d.Quality)})`) // Rotate by -90 degrees
		.style("font-size", "10px")
		.style("letter-spacing", "0.1em")
		.text(d => d.Quality);

	barGroups.append("text")
		.attr("class", "bar-label")
		.attr("x", d => xScale.bandwidth() / 2 + (barWidth) + 3 + barWidth / 2)
		.attr("y", d => yScale(d.OEE) + 3.5)
		.attr("transform", d => `rotate(-90, ${(xScale.bandwidth() / 2 + (barWidth) + 1 + barWidth / 2)}, ${yScale(d.OEE)})`) // Rotate by -90 degrees
		.style("font-size", "10px")
		.style("letter-spacing", "0.1em")
		.text(d => d.OEE);



	//// Define the desired distance between grouped bars
	//var groupPadding = 100;

	//// Adjust the distance between grouped bars
	//svg.selectAll(".bar-group")
	//	.attr("transform", function (d) { return "translate(" + (xScale(d.Batch) + groupPadding) + ",0)"; });

	// Define the legend
	const legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(500," + height / 4 + ")");

	// Define the color scale
	const colorScale = d3.scaleOrdinal()
		.domain(["Availability", "Performance", "Quality", "OEE"])
		.range(["#4CAF50", "#BBBBBB", "#3D85C6", "#7934A0"]);

	// Add colored rectangles and text to the legend
	const legendItems = legend.selectAll(".legend-item")
		.data(["Availability", "Performance", "Quality", "OEE"])
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => "translate(400," + (i * 30) + ")");

	legendItems.append("rect")
		.attr("width", 8)
		.attr("height", 8)
		.attr("fill", d => colorScale(d));

	legendItems.append("text")
		.attr("x", 20)
		.attr("y", 8)
		.text(d => d);



}

//Hourly Utilisation
function get_HourlyUtilisation(response) {
	$(".Hourly_Utilisation").empty();
	var div_width = 564;
	var div_height = 230;

	var data = response.data.Table;

	var data_legend = [
		{ name: "Production Time" },
		{ name: "Loss/Idle Time" },
		{ name: "Down Time" },
		{ name: "Break Time" },
		{ name: "PLC-DLK Disconnect Time" }

	];



	// Set up the margin, width, and height of the graph
	const margin = { top: 40, right: 20, bottom: 40, left: 60 };
	const width = 564 - margin.left - margin.right;
	const height = 230 - margin.top - margin.bottom;

	// Set width of bars
	const barWidth = 10;

	// Set up the SVG element
	const svg = d3.select(".Hourly_Utilisation").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create tooltips
	const tooltip = d3.select(".Hourly_Utilisation")
		.append("div")
		.attr("class", "tooltipHourlyUtil")
		.style("opacity", 0);


	// Set up the x and y scales
	const xScale = d3.scaleBand()
		.domain(data.map(d => { return d.Hour }))
		.range([0, width - (2 * margin.left)]);
	//.paddingInner(0.1)
	//.paddingOuter(0.1);


	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.Uptime + d.Downtime + d.Breaktime + d.Losstime + d.DLK_to_PLC_Disconnect_time)])
		.range([height, 0]);


	// Create the stacked data
	const stackedData = d3.stack().keys(["Uptime", "Losstime", "Downtime", "Breaktime", "DLK_to_PLC_Disconnect_time"])(data);



	// Create the stacked bars
	svg.selectAll(".bar")
		.data(stackedData)
		.enter().append("g")
		.attr("class", (d, i) => "bar-group bar-group-" + i)
		.selectAll("rect")
		.data(d => d)
		.enter().append("rect")
		.attr("class", "bar1")
		.attr("x", d => xScale(d.data.Hour) + xScale.bandwidth() / 2 - (barWidth / 2))
		.attr("y", d => yScale(d[1]))
		.attr("height", d => yScale(d[0]) - yScale(d[1]))
		.attr("width", barWidth);
	//.attr("width", xScale.bandwidth());
	//.attr("fill", "none");


	// Apply styling to the bars
	svg.selectAll(".bar1")
		.style("stroke", "none")
		.style("opacity", 1);

	// Apply styling to the bar groups
	svg.selectAll(".bar-group")
		.style("stroke", "white")
		.style("stroke-width", 1);

	// Apply hover effect to the bars
	svg.selectAll(".bar1")
		.on("mouseover", function (d) {
			//d3.select(this).style("opacity", 0.8);
			const key = d3.select(this.parentNode).datum().key;
			var indexKey = key == "Uptime" ? data_legend[0].name : key == "Losstime" ? data_legend[1].name : key == "Downtime" ? data_legend[2].name : key == "Breaktime" ? data_legend[3].name : data_legend[4].name;
			//console.log(indexKey);
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`${indexKey} : ${d[1] - d[0]}min</br>Hour : ${d.data.Hour}</br>Batch : ${d.data.Batch}</br> Batch Start time : ${d.data.start}</br> Batch End time : ${d.data.end}`)
				.style("left", `${d3.event.offsetX + 50}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			//d3.select(this).style("opacity", 1);
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});


	// Add the x-axis
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));
	//svg.append("g")
	//	.data(data)
	//	.attr("transform", `translate(0,${height})`)
	//	.call(d3.axisBottom(xScale).tickFormat(""));

	// Set up the x and y scales
	const x1Scale = d3.scaleBand()
		.domain(data.map(d => d.Hour + 10))
		.range([0, width - (2 * margin.left)])
		.paddingInner(0.1)
		.paddingOuter(0.1);

	svg.append("g")
		.attr("class", "x-axis-ticks")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale).tickFormat(""));

	//// Add tick lines
	//svg.selectAll(".x-axis-ticks line")
	//	.attr("class", "tick-line")
	//	.style("stroke", "grey")
	//	.style("stroke-width", 1)
	//	.style("shape-rendering", "crispEdges")
	//	.attr("transform", "translate(" + ((xScale.bandwidth() - (xScale.bandwidth() * 1.5)) + 10) + ",0)"); // Translate the tick lines to align with bars



	// Add the y-axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(d3.axisLeft(yScale));


	// Define the legend
	const legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(20," + height / 4 + ")");

	// Extract the keys from the stackedData
	const keys = data_legend.map(d => d.name);

	// Define the color scale
	const colorScale = d3.scaleOrdinal()
		.domain(keys)
		.range(["#4CAF50", "#F3E03A", "#F44336", "#3D85C6", "#BBBBBB"]);

	// Add colored rectangles and text to the legend
	const legendItems = legend.selectAll(".legend-item")
		.data(keys)
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => "translate(360," + (i * 20) + ")");

	legendItems.append("rect")
		.attr("width", 6)
		.attr("height", 6)
		//.style('opacity', '0.8')
		.attr("fill", d => colorScale(d));

	legendItems.append("text")
		.attr("x", 15)
		.attr("y", 6)
		.style('font-size', '12px')
		.text(d => d);

	svg.append("text")
		.attr("class", "y label")
		.attr("x", -height / 4)
		.attr("y", -margin.left + 10)
		.attr('text-anchor', 'end')
		.attr("transform", "rotate(-90)")
		.style('font-size', '12px')
		.style('font-family', "sans-serif")
		.style('letter-spacing', '0.25px')
		.text("Utilization (min)");

	svg.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "middle")
		.attr("x", (width - (2 * margin.left)) / 2)
		.attr("y", height + (margin.bottom / 1.5))
		.text('Hourly - Batch');


}

//Hourly Downtime
function get_HourlyDowntime(response) {

	//const data = [
	//  { month: "Jan", value: 100, lineValue: 80 },
	//  { month: "Feb", value: 200, lineValue: 120 },
	//  { month: "Mar", value: 150, lineValue: 90 },
	//  { month: "Apr", value: 300, lineValue: 180 },
	//  { month: "May", value: 250, lineValue: 150 }
	//];

	var data = response.data.Table;

	var flag = 0;

	Object.values(response.data.Table).forEach((element) => {
		if (element.stoppage && element.Downtime) {
			flag = 1;
		}
	}

	);

	if (flag == 1) {

		// Set up the SVG container
		const containerWidth = 564;
		const containerHeight = 230;
		const margin = { top: 40, right: 70, bottom: 40, left: 60 };
		const width = containerWidth - margin.left - margin.right;
		const height = containerHeight - margin.top - margin.bottom;

		// Create scales for x and y axes
		const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
		const y1 = d3.scaleLinear().rangeRound([height, 0]);
		const y2 = d3.scaleLinear().rangeRound([height, 0]);

		// Set domains for x and y axes
		x.domain(data.map(d => d.Hour_Batch));
		y1.domain([0, d3.max(data, d => d.Downtime)]);
		y2.domain([0, d3.max(data, d => d.stoppage)]);

		// Set width of bar
		const barWidth = 10;

		// Create the SVG container
		const svg = d3.select("#Hourly_Downtime_container")
			.append("svg")
			.attr("width", containerWidth)
			.attr("height", containerHeight);

		// Create tooltip element
		const tooltip = d3.select("#Hourly_Downtime_container").append("div")
			.attr("class", "tooltip");

		// Create a group for the chart
		const chartGroup = svg.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		//// Draw x-axis line
		//chartGroup.append("g")
		//	.attr("class", "x-axis")
		//	.attr("transform", `translate(0, ${height})`)
		//	.call(d3.axisBottom(x).tickFormat(""));

		// Set up the x and y scales
		const xScale = d3.scaleBand()
			.domain(data.map(d => d.Hour_Batch))
			.range([0, width])
			.padding(0.1);

		chartGroup.append("g")
			.attr("class", "x-axis-ticks")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickFormat(""));

		//// Add tick lines
		//chartGroup.selectAll(".x-axis-ticks line")
		//	.attr("class", "tick-line")
		//	.style("stroke", "grey")
		//	.style("stroke-width", 1)
		//	.style("shape-rendering", "crispEdges")
		//	.attr("transform", "translate(" + ((x.bandwidth() - (x.bandwidth() * 1.5)) + 10) + ",0)"); // Translate the tick lines to align with bars

		// Draw y1-axis line
		chartGroup.append("g")
			.attr("class", "y1-axis")
			.call(d3.axisLeft(y1));

		// Draw y2-axis line
		chartGroup.append("g")
			.attr("class", "y2-axis")
			.attr("transform", `translate(${width}, 0)`)
			.call(d3.axisRight(y2));


		// Draw the bars
		chartGroup.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", d => x(d.Hour_Batch) + x.bandwidth() / 2 - (barWidth / 2))
			.attr("y", d => y1(d.Downtime))
			.attr("width", barWidth)
			.attr("height", d => height - y1(d.Downtime))
			.on("mouseover", function (d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 0.9);
				tooltip.html(`Downtime : ${d.Downtime} min</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
					.style("left", `${d3.event.offsetX + 40}px`)
					.style("top", `${d3.event.offsetY}px`);
				tooltip.append("div")
					.attr("class", "tooltip-arrow tooltip-rotate");
			})
			.on("mouseout", function (d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0)
					.on("end", function () {
						tooltip.selectAll(".tooltip-arrow").remove();
					});
			});

		// Add labels to the bars and rotate them by 90 degrees
		chartGroup.selectAll(".bar-label")
			.data(data)
			.enter().append("text")
			.attr("class", "bar-label")
			.attr("x", d => x(d.Hour_Batch) + x.bandwidth() / 2 + (barWidth))
			.attr("y", d => y1(d.Downtime) - 7.5) // Adjust the Y position for proper placement
			.attr("text-anchor", "middle") // Center-align text
			.attr("transform", d => `rotate(-90, ${(x(d.Hour_Batch) + x.bandwidth() / 2)}, ${(y1(d.Downtime) - 10)})`) // Rotate by 90 degrees
			.style("font-size", "10px")
			.style("letter-spacing", "0.1em")
			.text(d => `${d.Downtime}`);

		// Create a line generator
		const line = d3.line()
			.x(d => x(d.Hour_Batch) + x.bandwidth() / 2)
			.y(d => y2(d.stoppage));

		// Draw the line graph
		chartGroup.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

		// Draw the circles
		chartGroup.selectAll(".circle")
			.data(data)
			.enter().append("circle")
			.attr("class", "circle")
			.attr("cx", d => x(d.Hour_Batch) + x.bandwidth() / 2)
			.attr("cy", d => y2(d.stoppage))
			.attr("r", 4)
			.on("mouseover", function (d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 0.9);
				tooltip.html(`Stoppage : ${d.stoppage}</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
					.style("left", `${d3.event.offsetX + 40}px`)
					.style("top", `${d3.event.offsetY}px`);
				tooltip.append("div")
					.attr("class", "tooltip-arrow tooltip-rotate");
			})
			.on("mouseout", function (d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0)
					.on("end", function () {
						tooltip.selectAll(".tooltip-arrow").remove();
					});
			});

		chartGroup.append("text")
			.attr("class", "y label")
			.attr("x", -height / 4)
			.attr("y", -margin.left + 10)
			.attr('text-anchor', 'end')
			.attr("transform", "rotate(-90)")
			.style('font-size', '12px')
			.style('font-family', "sans-serif")
			.style('letter-spacing', '0.25px')
			.text("Downtime (min)");

		chartGroup.append("text")
			.attr("class", "y2 label")
			.attr("x", -height / 3)
			.attr("y", width + (margin.right / 2) + 10)
			.attr("dy", ".75em")
			.attr('text-anchor', 'end')
			.attr("transform", "rotate(-90)")
			.style('font-size', '12px')
			.style('font-family', "sans-serif")
			.style('letter-spacing', '0.25px')
			.text("Stoppage");

		chartGroup.append("text")
			.attr("class", "axis-label")
			.attr("text-anchor", "middle")
			.attr("x", (width) / 2)
			.attr("y", height + (margin.bottom / 2))
			.text('Hourly - Batch');
	}
	else {
		$("#Hourly_Downtime_container").empty();
		const containerWidth = 564;
		const containerHeight = 230;
		var svg = d3.select("#Hourly_Downtime_container").append("svg")
			.attr("width", containerWidth)
			.attr("height", containerHeight)
			.attr("preserveAspectRatio", "xMidYMid")
			.append("g")
		var text = svg.append("text")
			.text("No Downtime")
			.style("font-size", "15px");
		var textWidth = text.node().getComputedTextLength();
		var xTranslate = (containerWidth - textWidth) / 2;
		svg.attr("transform", "translate(" + xTranslate + "," + (containerHeight / 3) + ")");
	}

}

//Hourly Production Alignment
function get_HourlyProductionAlignment(response) {


	$(".Hourly_Production_Alignment").empty();
	var div_width = 564;
	var div_height = 230;
	//const data1 = [
	//	{ x: 0, y: 10},
	//	{ x: 1, y: 20 },
	//	{ x: 2, y: 15 },
	//	{ x: 3, y: 25 }
	//];

	//const data2 = [
	//	{ x: 0, y: 5 },
	//	{ x: 1, y: 15 },
	//	{ x: 2, y: 20 },
	//	{ x: 3, y: 10 }
	//];

	const svgWidth = 564;
	const svgHeight = 230;
	const margin = { top: 30, right: 20, bottom: 40, left: 60 };
	const width = svgWidth - margin.left - margin.right - 120;
	const height = svgHeight - margin.top - margin.bottom;

	// Create the SVG element
	const svg = d3.select(".Hourly_Production_Alignment")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// Define a tooltip div
	const tooltip = d3.select(".Hourly_Production_Alignment")
		.append("div")
		.attr("class", "tooltipHourly")
		.style("opacity", 0);

	//const xScale = d3.scaleLinear()
	//	.domain([0, d3.max(response.data.Table, d => d.Hour)])
	//	.range([0, width]);

	var sample = response.data.Table;

	const xScale = d3.scaleBand()
		.range([0, width])
		.domain(sample.map((s) => s.Hour_Batch))
		.padding(1)

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(response.data.Table, d => Math.max(d.Cumulative_Target, d.Cumulative_OkParts))])
		.range([height, 0]);

	const line1 = d3.line()
		.x(d => xScale(d.Hour_Batch))
		.y(d => yScale(d.Cumulative_Target));

	const line2 = d3.line()
		.x(d => xScale(d.Hour_Batch))
		.y(d => yScale(d.Cumulative_OkParts));
	//.curve(d3.curveBasis); // Curve line to smooth the edges

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	const chartGroup = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	//chartGroup.append("g")
	//	.attr("class", "x-axis")
	//	.attr("transform", `translate(0, ${height})`)
	//	.call(xAxis);

	// Add x-axis
	chartGroup.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(xScale).tickFormat(""));

	chartGroup.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

	chartGroup.append("path")
		.datum(response.data.Table)
		.attr("class", "line")
		.attr("d", line1);

	chartGroup.append("path")
		.datum(response.data.Table)
		.attr("class", "line")
		.attr("d", line2);


	// Define the color scale for circles
	const circleColorScale = d3.scaleOrdinal()
		.domain(["Cumulative_Target", "Cumulative_OkParts"])
		.range(["#3D85C6", "#4CAF50"]);

	// Draw circles for data points
	chartGroup.selectAll(".circle")
		.data(response.data.Table)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("cx", d => xScale(d.Hour_Batch))
		.attr("cy", d => yScale(d.Cumulative_Target))
		.attr("r", 4) // Adjust the radius of the circles as desired
		.style("fill", d => circleColorScale("Target_part")) // Use the color scale for the fill color
		.on("mouseover", (d, i) => {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Cumulative Target Count : ${d.Cumulative_Target}</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end} `)
				.style("left", `${d3.event.pageX}px`)
				.style("top", `${d3.event.pageY - 28}px`);


			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");

		})
		.on("mouseout", () => {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});

	chartGroup.selectAll(".circle1")
		.data(response.data.Table)
		.enter()
		.append("circle")
		.attr("class", "circle1")
		.attr("cx", d => xScale(d.Hour_Batch))
		.attr("cy", d => yScale(d.Cumulative_OkParts))
		.attr("r", 4) // Adjust the radius of the circles as desired
		.style("fill", d => circleColorScale("Cumulative_OkParts")) // Use the color scale for the fill color
		.on("mouseover", (d, i) => {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Cumulative OK Part Count : ${d.Cumulative_OkParts}</br>Hour : ${d.Hour}</br>Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end} `)
				.style("left", `${d3.event.pageX}px`)
				.style("top", `${d3.event.pageY - 28}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", () => {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});

	// Create a legend
	const legend = chartGroup.append("g")
		.attr("class", "legend")
		.attr("transform", `translate(${width + 10}, 10)`); // Adjust the position as needed

	// Add legend items
	const legendItems = legend.selectAll(".legend-item")
		.data(["Cumulative_Target", "Cumulative_OkParts"])
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => `translate(0, ${i * 20})`);

	// Add legend circles
	legendItems.append("circle")
		.attr("cx", 5)
		.attr("cy", 5)
		.attr("r", 4)
		.style("fill", d => circleColorScale(d));

	// Add legend labels
	legendItems.append("text")
		.attr("x", 20)
		.attr("y", 8)
		.style("font-size", "12px")
		.text(d => d);




	// Add x-axis label
	chartGroup.append("text")
		.attr("class", "x-axis-label")
		.attr("x", width / 2)
		.attr("y", height + margin.bottom - 10) // Adjust position as needed
		.attr("text-anchor", "middle")
		.text("Hourly - Batch");

	// Add y-axis label
	chartGroup.append("text")
		.attr("class", "y-axis-label")
		.attr("x", -height / 2)
		.attr("y", -margin.left + 10) // Adjust position as needed
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Production Count");



}

//Hourly Production
function get_HourlyProduction(response) {

	$(".Hourly_Production").empty();
	var div_width = 564;
	var div_height = 230;

	var data = response.data.Table;

	var data_legend = [
		{ name: "OK" },
		{ name: "NOK" }

	];



	// Set up the margin, width, and height of the graph
	const margin = { top: 20, right: 20, bottom: 40, left: 60 };
	const width = 564 - margin.left - margin.right;
	const height = 230 - margin.top - margin.bottom;

	// Set width of bars
	const barWidth = 10;

	// Set up the SVG element
	const svg = d3.select(".Hourly_Production").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create tooltips
	const tooltip = d3.select(".Hourly_Production")
		.append("div")
		.attr("class", "tooltipHourlyProd")
		.style("opacity", 0);


	// Set up the x and y scales
	const xScale = d3.scaleBand()
		.domain(data.map(d => d.Hour_Batch))
		.range([0, width - (2 * margin.left)]);
	//.paddingInner(0.1)
	//.paddingOuter(0.1);



	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => Math.max((d.okparts + d.nokparts), d.Target_part))])
		.range([height, 0]);

	const yScale1 = d3.scaleLinear()
		.domain([0, d3.max(data, d => (d.okparts + d.nokparts))])
		.range([height, 0]);


	// Create the stacked data
	const stackedData = d3.stack().keys(["okparts", "nokparts"])(data);

	// Create the line data
	const lineData = d3.stack().keys(["Target_part"])(data);

	// Create the stacked bars
	svg.selectAll(".bar")
		.data(stackedData)
		.enter().append("g")
		.attr("class", (d, i) => "bar-group bar-group-" + i)
		.selectAll("rect")
		.data(d => d)
		.enter().append("rect")
		.attr("class", "bar1")
		.attr("x", d => xScale(d.data.Hour_Batch) + xScale.bandwidth() / 2 - (barWidth / 2))
		.attr("y", d => yScale(d[1]))
		.attr("height", d => yScale(d[0]) - yScale(d[1]))
		.attr("width", barWidth);
	//.attr("width", xScale.bandwidth());
	//.attr("fill", "none"); 


	// Apply styling to the bars
	svg.selectAll(".bar1")
		.style("stroke", "none")
		.style("opacity", 1);

	// Apply styling to the bar groups
	svg.selectAll(".bar-group")
		.style("stroke", "white")
		.style("stroke-width", 1);

	// Apply hover effect to the bars
	svg.selectAll(".bar1")
		.on("mouseover", function (d) {
			//d3.select(this).style("opacity", 0.8);
			const key = d3.select(this.parentNode).datum().key;
			var indexKey = key == "okparts" ? data_legend[0].name : data_legend[1].name;
			//console.log(indexKey);
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`${indexKey} : ${d[1] - d[0]}</br>Hour : ${d.data.Hour}</br>Batch : ${d.data.Batch}</br> Batch Start time : ${d.data.start}</br> Batch End time : ${d.data.end}`)
				.style("left", `${d3.event.offsetX + 50}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			//d3.select(this).style("opacity", 1);
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});


	//code for line for target count
	const line = d3.line()
		.x(d => xScale(d.Hour_Batch) + xScale.bandwidth() / 2)
		.y(d => yScale(d.Target_part))
		.curve(d3.curveLinear);

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
	svg.selectAll(".circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("cx", d => xScale(d.Hour_Batch) + xScale.bandwidth() / 2)
		.attr("cy", d => yScale(d.Target_part))
		.attr("r", 4)
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
			tooltip.html(`Target Count : ${d.Target_part}</br > Hour : ${d.Hour}</br > Batch : ${d.Batch}</br> Batch Start time : ${d.start}</br> Batch End time : ${d.end}`)
				.style("left", `${d3.event.offsetX + 40}px`)
				.style("top", `${d3.event.offsetY}px`);
			tooltip.append("div")
				.attr("class", "tooltip-arrow tooltip-rotate");
		})
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.selectAll(".tooltip-arrow").remove();
				});
		});


	// Add the x-axis
	//svg.append("g")
	//	.attr("class", "x-axis")
	//	.attr("transform", "translate(0," + height + ")")
	//	.call(d3.axisBottom(xScale));
	//svg.append("g")
	//	.data(data)
	//	.attr("transform", `translate(0,${height})`)
	//	.call(d3.axisBottom(xScale).tickFormat(""));

	// Set up the x and y scales
	const x1Scale = d3.scaleBand()
		.domain(data.map(d => d.Hour_Batch + 10))
		.range([0, width - (2 * margin.left)])
		.paddingInner(0.1)
		.paddingOuter(0.1);

	svg.append("g")
		.attr("class", "x-axis-ticks")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale).tickFormat(""));

	//// Add tick lines
	//svg.selectAll(".x-axis-ticks line")
	//	.attr("class", "tick-line")
	//	.style("stroke", "grey")
	//	.style("stroke-width", 1)
	//	.style("shape-rendering", "crispEdges")
	//	.attr("transform", "translate(" + ((xScale.bandwidth() - (xScale.bandwidth() * 1.5)) + 10) + ",0)"); // Translate the tick lines to align with bars



	// Add the y-axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(d3.axisLeft(yScale));


	// Define the legend
	const legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(20," + height / 4 + ")");

	// Extract the keys from the stackedData
	const keys = data_legend.map(d => d.name);

	// Define the color scale
	const colorScale = d3.scaleOrdinal()
		.domain(keys)
		.range(['#4CAF50', '#F44336']);

	// Add colored rectangles and text to the legend
	const legendItems = legend.selectAll(".legend-item")
		.data(keys)
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => "translate(360," + (i * 20) + ")");

	legendItems.append("rect")
		.attr("width", 6)
		.attr("height", 6)
		//.style('opacity', '0.8')
		.attr("fill", d => colorScale(d));

	legendItems.append("text")
		.attr("x", 15)
		.attr("y", 6)
		.style('font-size', '12px')
		.text(d => d);

	svg.append("text")
		.attr("class", "y label")
		.attr("x", -height / 4)
		.attr("y", -margin.left + 10)
		.attr('text-anchor', 'end')
		.attr("transform", "rotate(-90)")
		.style('font-size', '12px')
		.style('font-family', "sans-serif")
		.style('letter-spacing', '0.25px')
		.text("Production Count");

	svg.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "middle")
		.attr("x", (width - (2 * margin.left)) / 2)
		.attr("y", height + (margin.bottom / 2))
		.text('Hourly - Batch');


}

//Exec all function by passing machine code and Machine name
function get_machine_code(Val, mcName, shiftID, mcDesc, variantCode) {


	debugger;

	$("#modalLabelLarge").html(mcName + " - " + mcDesc);

	$("#status_bar").empty(); //Machine Status Line
	$(".mtbf_graph").empty(); //MTBF
	$(".mttr_graph").empty(); //MTTR
	$(".custome_report").empty(); //Downtime Pareto
	$(".rej_custom").empty(); //Rejection Pareto
	$("#heatmap_customs").empty(); //Rejection Heatmap
	$("#top_10_pareto_chart").empty(); //Loss Distribution
	$(".Range_chart_daywise").empty(); // CT

	$("#largeShoes").modal('show');
	//get_PopupKPI(Val);
	//get_PopupUtil(Val);
	//get_machine_status(Val);




	var myData =
	{
		"line": this.line,
		"Machine": Val,
		"CompanyCode": this.company,
		"PlantCode": this.plant
	};
	var user1 = this.user1;

	$.ajax({

		type: "POST",
		url: this.URL + 'api/Paretoanalysis/Check_NoDataAVailable',
		data: myData,
		headers: {
			Authorization: 'Bearer ' + user1
		},
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {
			if (response.status != "Error") {
				//console.log(response.data.Table[0].CheckText);
				if (response.data.Table[0].CheckText == 'Data Available') {

					//get_MTTR(Val);
					//get_MTBF(Val);
					//get_downtime_pareto(Val);
					//get_RejPar(Val);
					//get_Heatmap(Val);
					//get_Losstable(Val);
					//get_CTDistribution(Val);
					call_all_historic_fn(Val, shiftID, variantCode);
				}
				else {

					var dates = new Date(response.data.Table[0].Dates);
					const dateTimeInParts = dates.toISOString().split("T"); // DateTime object => "2021-08-31T15:15:41.886Z" => [ "2021-08-31", "15:15:41.886Z" ]

					const date = dateTimeInParts[0]; // "2021-08-31"
					const time = dateTimeInParts[1];

					$('#popupMTTRDate').text('DATE : ' + date);

					$('#popupMTBFDate').text('DATE : ' + date);

					$('#popupDownDate').text('DATE : ' + date);

					$('#popupRejDate').text('DATE : ' + date);

					$('#popupRejHeatDate').text('DATE : ' + date);

					$('#popupCTDate').text("DATE : " + date)

					$('#popupLossDate').text('DATE : ' + date);

					//MTBF
					$(".mtbf_graph").empty();
					var div_width_mttr = 330;
					var div_height_mttr = 230;
					var svgmttr = d3.select(".mtbf_graph").append("svg")
						.attr("width", div_width_mttr)
						.attr("height", div_height_mttr)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g");
					var text = svgmttr.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_mttr - textWidth) / 2;
					svgmttr.attr("transform", "translate(" + xTranslate + "," + (div_height_mttr / 3) + ")");

					//MTTR
					$(".mttr_graph").empty();
					var div_width_mtbf = 330;
					var div_height_mtbf = 230;
					var svgmtbf = d3.select(".mttr_graph").append("svg")
						.attr("width", div_width_mtbf)
						.attr("height", div_height_mtbf)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svgmtbf.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_mtbf - textWidth) / 2;
					svgmtbf.attr("transform", "translate(" + xTranslate + "," + (div_height_mtbf / 3) + ")");

					//DownTime Pareto
					$(".custome_report").empty();
					var div_width_down = 330;
					var div_height_down = 230;
					var svgdown = d3.select(".custome_report").append("svg")
						.attr("width", div_width_down)
						.attr("height", div_height_down)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svgdown.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_down - textWidth) / 2;
					svgdown.attr("transform", "translate(" + xTranslate + "," + (div_height_down / 3) + ")");

					//Rej Pareto
					$(".rej_custom").empty();
					var div_width_rej = 330;
					var div_height_rej = 230;
					var svg_rej = d3.select(".rej_custom").append("svg")
						.attr("width", div_width_rej)
						.attr("height", div_height_rej)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svg_rej.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_rej - textWidth) / 2;
					svg_rej.attr("transform", "translate(" + xTranslate + "," + (div_height_rej / 3) + ")");

					//Rej Heatmap
					$("#heatmap_customs").empty();
					var div_width_rejHeat = 650;
					var div_height_rejHeat = 230;
					var svg_rejHeat = d3.select("#heatmap_customs").append("svg")
						.attr("width", div_width_rejHeat)
						.attr("height", div_height_rejHeat)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svg_rejHeat.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_rejHeat - textWidth) / 1.5;
					svg_rejHeat.attr("transform", "translate(" + xTranslate + "," + (div_height_rejHeat / 3) + ")");

					//Loss
					$("#top_10_pareto_chart").empty();
					var div_width_loss = 420;
					var div_height_loss = 150;
					var svg_loss = d3.select("#top_10_pareto_chart").append("svg")
						.attr("width", div_width_loss)
						.attr("height", div_height_loss)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svg_loss.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_loss - textWidth) / 1.5;
					svg_loss.attr("transform", "translate(" + xTranslate + "," + (div_height_loss / 3) + ")");

					//CT
					$(".Range_chart_daywise").empty();
					var div_width_CT = 420;
					var div_height_CT = 150;
					var svg_CT = d3.select(".Range_chart_daywise").append("svg")
						.attr("width", div_width_CT)
						.attr("height", div_height_CT)
						.attr("preserveAspectRatio", "xMidYMid")
						.append("g")
					var text = svg_CT.append("text")
						.text(response.data.Table[0].CheckText)
						.style("font-size", "15px");
					var textWidth = text.node().getComputedTextLength();
					var xTranslate = (div_width_CT - textWidth) / 1.5;
					svg_CT.attr("transform", "translate(" + xTranslate + "," + (div_height_CT / 3) + ")");

				}

			}
		},
		error: function (response) {
			if (response.status == "401") {
				swal({
					icon: "warning",
					title: "Session Timeout",
					button: true,
					closeModal: false
				})
				window.location = R_url;
			}
			else {
				swal({
					icon: "warning",
					title: response.responseText,
					button: true,
					closeModal: false
				})
			}
		}
	});



}


//--Circular progress bar chart for popup--//
function radialProgress(selector, labelText) {
	const parent = d3.select(selector)

	const size = { top: 0, right: 0, bottom: 0, left: 0, height: 175, width: 175, x: 10, y: 10 };

	d3.select(selector + " svg").remove();
	const svg = parent.append('svg')
		.attr('width', size.width)
		.attr('height', size.height);

	const outerRadius = Math.min(size.width, size.height) * 0.45;//radius
	const thickness = 10; //bar thickness
	let value = 0;

	const mainArc = d3.arc()
		.startAngle(0)
		.endAngle(Math.PI * 2)
		.innerRadius(outerRadius - thickness)
		.outerRadius(outerRadius)

	svg.append("path")
		.attr('class', 'progress-bar-bg')
		.attr('transform', `translate(${size.width / 2},${size.height / 2})`)
		.attr('d', mainArc())

	const mainArcPath = svg.append("path")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${size.width / 2},${size.height / 2})`)

	svg.append("circle")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
		.attr('width', thickness)
		.attr('height', thickness)
		.attr('r', thickness / 2)

	const end = svg.append("circle")
		.attr('class', 'progress-bar')
		.attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
		.attr('width', thickness)
		.attr('height', thickness)
		.attr('r', thickness / 2)

	let percentLabel = svg.append("text")
		.attr('class', 'progress-label')
		.attr('transform', `translate(${size.width / 2},${((size.height / 2) - (size.height / 25))})`)
		.text('0')
	let percentLabel1 = svg.append("text")
		.attr('class', 'progress-label1')
		.attr('transform', `translate(${size.width / 2},${((size.height / 2) + (size.height / 6))})`)
		.text('0')
	return {
		update: function (progressPercent) {
			const startValue = value
			const startAngle = Math.PI * startValue / 50
			const angleDiff = Math.PI * progressPercent / 50 - startAngle;
			const startAngleDeg = startAngle / Math.PI * 180
			const angleDiffDeg = angleDiff / Math.PI * 180
			const transitionDuration = 1500

			mainArcPath.transition().duration(transitionDuration).attrTween('d', function () {
				return function (t) {
					mainArc.endAngle(startAngle + angleDiff * t)
					return mainArc();
				}
			})
			end.transition().duration(transitionDuration).attrTween('transform', function () {
				return function (t) {
					return `translate(${size.width / 2},${size.height / 2})` +
						`rotate(${(startAngleDeg + angleDiffDeg * t)})` +
						`translate(0,-${outerRadius - thickness / 2})`
				}
			})
			percentLabel.transition().duration(transitionDuration).tween('bla', function () {
				return function (t) {
					percentLabel.text((Math.round(startValue + (progressPercent - startValue) * t)) + " %");
					percentLabel1.text(labelText);
				}
			})
			value = progressPercent
		}
	}
}


//Get the Machine Status Timeline data
function get_machine_status(Val, response, shiftID) {


	var live_URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var company = this.company;
	var plant = this.plant;
	var user1 = this.user1;
	var batch = response.data.Table8[0].Batch;


	var bar_id = '#status_bar';
	var data_bargraph = {
		"CompanyCode": company,
		"PlantCode": plant,
		"Linecode": line,
		"Machine_Code": Val,
		"Batch": batch
	};
	var R_url = '@Url.Action("Login", "Main")';

	//console.log(data_bargraph);
	$('#popupMachineStatusShift').html(`<b>LATEST MACHINE STATUS</b></br>BATCH : ${response.data.Table8[0].Batch}`);


	$.ajax({
		type: 'POST',
		url: live_URL + 'api/Quality/Getmachine_status',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: data_bargraph,
		//async: false,
		dataType: 'json'
	}).success(function (response) {
		//console.log(response);
		var test22 = '[{"Table":' + JSON.stringify(response.data) + '}]'
		var obj2 = JSON.parse(test22)
		var width_t = 500
		var chart_t = display_machine_status();
		var newid = bar_id + " > *";
		d3.selectAll(newid).remove();

		d3.select(bar_id).append("svg").attr("width", width_t)
			.datum(obj2).call(chart_t);

	}).error(function (response) {
		if (response.status == "401") {
			swal({
				icon: "warning",
				title: "Session Timeout",
				button: true,
				closeModal: false
			})
			window.location = R_url;
		}
		else {
			swal({
				icon: "warning",
				title: response.responseText,
				button: true,
				closeModal: false
			})

		}
	});






}




function close_modal() {
	$("#myModalLatestAlarm").modal('hide');
}

$(document).ready(function () {
	var myCarousel = $('#myCarousel');

	// Pause the carousel when the modal is shown
	$('#largeShoes').on('shown.bs.modal', function () {
		myCarousel.carousel('pause');
		flag = 0;
	});

	// Resume the carousel when the modal is closed
	$('#largeShoes').on('hidden.bs.modal', function () {
		console.log("closed");
		myCarousel.carousel();
		flag = 1;
		carouselMachine();
	});

	// Pause the carousel when the modal is shown
	$('#myModalLatestAlarm').on('shown.bs.modal', function () {
		myCarousel.carousel('pause');
		flag = 0;
		var modalLatestAlarmTitleText = $("#myModalLatestAlarmTitle").text();
		var mcDetail = modalLatestAlarmTitleText.split(' - ')
		//Event listener on referesh
		var element = document.getElementById("refreshModal");
		element.addEventListener("click", function () {
			console.log(mcDetail);
			get_AlarmData(mcDetail[2], mcDetail[1], mcDetail[0]);
		});


	});

	// Resume the carousel when the modal is closed
	$('#myModalLatestAlarm').on('hidden.bs.modal', function () {
		console.log("closed");
		myCarousel.carousel();
		flag = 1;
		carouselMachine();
	});

	// Pause the carousel when the modal is shown
	$('#myModalLatestLoss').on('shown.bs.modal', function () {
		myCarousel.carousel('pause');
		flag = 0;
		var modalLatestLossTitleText = $("#myModalLatestLossTitle").text();
		var mcDetail = modalLatestLossTitleText.split(' - ')
		//Event listener on referesh
		var element = document.getElementById("refreshModal1");
		element.addEventListener("click", function () {
			console.log(mcDetail);
			get_LossData(mcDetail[2], mcDetail[1], mcDetail[0]);
		});
	});

	// Resume the carousel when the modal is closed
	$('#myModalLatestLoss').on('hidden.bs.modal', function () {
		console.log("closed");
		myCarousel.carousel();
		flag = 1;
		carouselMachine();
	});



});



function display_machine_status() {

	var DISPLAY_TYPES = ["circle", "rect"];
	d3.select(".toolTip").remove();
	var tooltip = d3.select("body").append("div").attr("class", "toolTip");
	var hover = function () { },
		mouseover = function (d, index, datum) {
			var status = '';
			var alarm = '';
			var loss = '';
			var totalstatus = '';
			console.log(datum.Table[index]);
			if (datum.Table[index].color == 'rgb(76,175,80)') {
				status = 'Machine Running'
			}
			else if (datum.Table[index].color == 'rgb(244,67,54)') {
				status = 'Machine under Error'
			}
			else if (datum.Table[index].color == 'rgb(255,191,0)') {
				status = 'Machine is Idle/Loss'
			}
			else if (datum.Table[index].color == 'rgb(187,187,187)') {
				status = 'PLC disconnect with Gateway'
			}
			else if (datum.Table[index].color == 'rgb(61,133,198)') {
				status = 'Planned Break'
			}

			if (datum.Table[index].Alarm == "0") {
				alarm = "No Alarm"
			}
			else {
				alarm = datum.Table[index].Alarm
			}
			if (datum.Table[index].Loss == "0") {
				loss = "No Loss"
			}
			else {
				loss = datum.Table[index].Loss
			}
			// var totalstatus = datum.Table[index].Loss + status
			//if (datum.Table[index].Alarm != "0") {
			//	totalstatus = 'Alarm:' + datum.Table[index].Alarm + ','
			//}
			//if (datum.Table[index].Loss != "0") {
			//	totalstatus = 'Loss:' + datum.Table[index].Loss + ','
			//}

			// var totalstatus='Alarm:'+alarm+'\r\n'+' Loss:'+loss+'\r\n'+'Machine status'+status
			tooltip
				.style("left", d3.event.pageX - 50 + "px")
				.style("top", d3.event.pageY - 100 + "px")
				.style("display", "inline-block").style("z-index", "10000")
				.style("background", "rgba(88, 88, 88, 0.9)").style("color", "white")
				.style("border-radius", "5px")

				.style("font-size", "12px")
				.style("line-height", "14px")
				.style("letter-spacing", "0.05em")
				.html(`${totalstatus}${status}</br>${new Date(datum.Table[index].starting_time).toLocaleTimeString()} - ${new Date(datum.Table[index].ending_time).toLocaleTimeString()}</br>Duration : ${datum.Table[index].Duration} min`);

		},
		mouseout = function () { tooltip.style("display", "none"); },
		click = function () { },
		scroll = function () { },
		labelFunction = function (label) { return label; },
		navigateLeft = function () { },
		navigateRight = function () { },
		orient = "bottom",
		width = document.getElementById("status_bar").clientWidth,
		height = null,
		rowSeparatorsColor = null,
		backgroundColor = null,
		tickFormat = {
			//format: d3.timeFormat("%I %p"),
			format: d3.timeFormat("%H:%M"),
			tickTime: d3.timeFormat.hours,
			tickInterval: 1,
			tickSize: 6,
			tickValues: null
		},
		colorCycle = d3.scaleOrdinal(d3.schemeCategory10);
	colorPropertyName = null,
		display = "rect",
		beginning = 0,
		labelMargin = 0,
		ending = 0,
		margin = { left: 30, right: 30, top: 20, bottom: 30 },
		stacked = false,
		rotateTicks = false,
		timeIsRelative = false,
		fullLengthBackgrounds = true,
		itemHeight = 20,
		itemMargin = 5,
		navMargin = 60,
		showTimeAxis = true,
		showAxisTop = false,
		showTodayLine = false,
		timeAxisTick = false,
		timeAxisTickFormat = { stroke: "stroke-dasharray", spacing: "4 10" },
		showTodayFormat = { marginTop: 25, marginBottom: 0, width: 1, color: colorCycle },
		showBorderLine = false,
		showBorderFormat = { marginTop: 25, marginBottom: 0, width: 1, color: colorCycle },
		showAxisHeaderBackground = false,
		showAxisNav = false,
		showAxisCalendarYear = false,
		axisBgColor = "white",
		chartData = {}
		;

	var appendTimeAxis = function (g, xAxis, yPosition) {

		if (showAxisHeaderBackground) { appendAxisHeaderBackground(g, 0, 0); }

		if (showAxisNav) { appendTimeAxisNav(g) };

		var axis = g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + 0 + "," + yPosition + ")")
			.call(xAxis);
	};

	var appendTimeAxisCalendarYear = function (nav) {
		var calendarLabel = beginning.getFullYear();

		if (beginning.getFullYear() != ending.getFullYear()) {
			calendarLabel = beginning.getFullYear() + "-" + ending.getFullYear()
		}

		nav.append("text")
			.attr("transform", "translate(" + 20 + ", 0)")
			.attr("x", 0)
			.attr("y", 14)
			.attr("class", "calendarYear")
			.text(calendarLabel)
			;
	};
	var appendTimeAxisNav = function (g) {
		var timelineBlocks = 6;
		var leftNavMargin = (margin.left - navMargin);
		var incrementValue = (width - margin.left) / timelineBlocks;
		var rightNavMargin = (width - margin.right - incrementValue + navMargin);

		var nav = g.append('g')
			.attr("class", "axis")
			.attr("transform", "translate(0, 20)")
			;

		if (showAxisCalendarYear) { appendTimeAxisCalendarYear(nav) };

		nav.append("text")
			.attr("transform", "translate(" + leftNavMargin + ", 0)")
			.attr("x", 0)
			.attr("y", 14)
			.attr("class", "chevron")
			.text("<")
			.on("click", function () {
				return navigateLeft(beginning, chartData);
			})
			;

		nav.append("text")
			.attr("transform", "translate(" + rightNavMargin + ", 0)")
			.attr("x", 0)
			.attr("y", 14)
			.attr("class", "chevron")
			.text(">")
			.on("click", function () {
				return navigateRight(ending, chartData);
			})
			;
	};

	var appendAxisHeaderBackground = function (g, xAxis, yAxis) {
		g.insert("rect")
			.attr("class", "row-green-bar")
			.attr("x", xAxis)
			.attr("width", width)
			.attr("y", yAxis)
			.attr("height", itemHeight)
			.attr("fill", axisBgColor);
	};

	var appendTimeAxisTick = function (g, xAxis, maxStack) {
		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + 0 + "," + (margin.top + (itemHeight + itemMargin) * maxStack) + ")")
			.attr(timeAxisTickFormat.stroke, timeAxisTickFormat.spacing)
			.call(xAxis.tickFormat("").tickSize(-(margin.top + (itemHeight + itemMargin) * (maxStack - 1) + 3), 0, 0));
	};

	var appendBackgroundBar = function (yAxisMapping, index, g, data, datum) {
		var greenbarYAxis = ((itemHeight + itemMargin) * yAxisMapping[index]) + margin.top;
		g.selectAll("svg").data(data).enter()
			.insert("rect")
			.attr("class", "row-green-bar")
			.attr("x", fullLengthBackgrounds ? 0 : margin.left)
			.attr("width", fullLengthBackgrounds ? width : (width - margin.right - margin.left))
			.attr("y", greenbarYAxis)
			.attr("height", itemHeight)
			.attr("fill", backgroundColor instanceof Function ? backgroundColor(datum, index) : backgroundColor)
			;
	};

	var appendLabel = function (gParent, yAxisMapping, index, hasLabel, datum) {
		var fullItemHeight = itemHeight + itemMargin;
		var rowsDown = margin.top + (fullItemHeight / 2) + fullItemHeight * (yAxisMapping[index] || 1);

		gParent.append("text")
			.attr("class", "timeline-label")
			.attr("transform", "translate(" + labelMargin + "," + rowsDown + ")")
			.text(hasLabel ? labelFunction(datum.label) : datum.id)
			.on("click", function (d, i) { click(d, index, datum); });
	};

	function timeline(gParent) {

		var g = gParent.append("g");
		//var gParentSize = gParent[0][0].getBoundingClientRect();
		var gParentSize = gParent.node().getBoundingClientRect();
		var gParentItem = d3.select(gParent.node());

		var yAxisMapping = {},
			maxStack = 1,
			minTime = 0,
			maxTime = 0;

		setWidth();

		// check if the user wants relative time
		// if so, substract the first timestamp from each subsequent timestamps
		if (timeIsRelative) {
			g.each(function (d, i) {
				d.forEach(function (datum, index) {
					datum.Table.forEach(function (time, j) {//change here
						if (index === 0 && j === 0) {
							originTime = new Date(time.starting_time).getTime();               //Store the timestamp that will serve as origin
							time.starting_time = 0;                        //Set the origin
							time.ending_time = new Date(time.ending_time.getTime()) - originTime;     //Store the relative time (millis)
						} else {
							time.starting_time = new Date(time.starting_time).getTime() - originTime;
							time.ending_time = new Date(time.ending_time).getTime() - originTime;
						}
					});
				});
			});
		}



		// check how many stacks we're gonna need
		// do this here so that we can draw the axis before the graph
		if (stacked || ending === 0 || beginning === 0) {
			g.each(function (d, i) {
				d.forEach(function (datum, index) {

					// create y mapping for stacked graph
					if (stacked && Object.keys(yAxisMapping).indexOf(index) == -1) {
						yAxisMapping[index] = maxStack;
						maxStack++;
					}
					// figure out beginning and ending times if they are unspecified
					datum.Table.forEach(function (time, i) { //change here
						if (beginning === 0)
							if (new Date(time.starting_time).getTime() < minTime || (minTime === 0 && timeIsRelative === false))
								minTime = new Date(time.starting_time).getTime();
						if (ending === 0)
							if (new Date(time.ending_time).getTime() > maxTime)
								maxTime = new Date(time.ending_time).getTime();
					});
				});
			});

			if (ending === 0) {
				ending = maxTime;
			}
			if (beginning === 0) {
				beginning = minTime;
			}
		}

		var scaleFactor = (1 / (ending - beginning)) * (width - margin.left - margin.right);

		// draw the axis
		var xScale = d3.scaleTime()
			.domain([beginning, ending])
			.range([margin.left, width - margin.right]);

		var xAxis = d3.axisBottom(xScale)

			.tickFormat(tickFormat.format)
			.tickSize(tickFormat.tickSize);

		if (tickFormat.tickValues != null) {
			xAxis.tickValues(tickFormat.tickValues);
		} else {
			xAxis.ticks(tickFormat.numTicks || tickFormat.tickTime, tickFormat.tickInterval);
		}

		// draw the chart
		g.each(function (d, i) {
			chartData = d;
			d.forEach(function (datum, index) {
				var data = datum.Table;//change here
				var hasLabel = (typeof (datum.label) != "undefined");

				// issue warning about using id per data set. Ids should be individual to data elements
				if (typeof (datum.id) != "undefined") {
					//console.warn("d3Timeline Warning: Ids per dataset is deprecated in favor of a 'class' key. Ids are now per data element.");
				}

				if (backgroundColor) { appendBackgroundBar(yAxisMapping, index, g, data, datum); }

				g.selectAll("svg").data(data).enter()
					.append(function (d, i) {
						return document.createElementNS(d3.namespaces.svg, "display" in d ? d.display : display);
					})
					.attr("x", getXPos)
					.attr("y", getStackPosition)
					.attr("width", function (d, i) {
						return (new Date(d.ending_time).getTime() - new Date(d.starting_time).getTime()) * scaleFactor;
					})
					.attr("cy", function (d, i) {
						return getStackPosition(d, i) + itemHeight / 2;
					})
					.attr("cx", getXPos)
					.attr("r", itemHeight / 2)
					.attr("height", itemHeight)
					.style("fill", function (d, i) {
						var dColorPropName;
						if (d.color) return d.color;
						if (colorPropertyName) {
							dColorPropName = d[colorPropertyName];
							if (dColorPropName) {
								return colorCycle(dColorPropName);
							} else {
								return colorCycle(datum[colorPropertyName]);
							}
						}
						return colorCycle(index);
					})
					.on("mousemove", function (d, i) {
						hover(d, index, datum);
					})
					.on("mouseover", function (d, i) {
						mouseover(d, i, datum);
					})
					.on("mouseout", function (d, i) {
						mouseout(d, i, datum);
					})
					.on("click", function (d, i) {
						click(d, index, datum);
					})
					.attr("class", function (d, i) {
						return datum.class ? "timelineSeries_" + datum.class : "timelineSeries_" + index;
					})
					.attr("id", function (d, i) {
						// use deprecated id field
						if (datum.id && !d.id) {
							return 'timelineItem_' + datum.id;
						}

						return d.id ? d.id : "timelineItem_" + index + "_" + i;
					})
					;

				g.selectAll("svg").data(data).enter()
					.append("text")
					.attr("x", getXTextPos)
					.attr("y", getStackTextPosition)
					.text(function (d) {
						return d.label;
					})
					;

				if (rowSeparatorsColor) {
					var lineYAxis = (itemHeight + itemMargin / 2 + margin.top + (itemHeight + itemMargin) * yAxisMapping[index]);
					gParent.append("svg:line")
						.attr("class", "row-separator")
						.attr("x1", 0 + margin.left)
						.attr("x2", width - margin.right)
						.attr("y1", lineYAxis)
						.attr("y2", lineYAxis)
						.attr("stroke-width", 1)
						.attr("stroke", rowSeparatorsColor);
				}

				// add the label
				if (hasLabel) { appendLabel(gParent, yAxisMapping, index, hasLabel, datum); }

				if (typeof (datum.icon) !== "undefined") {
					gParent.append("image")
						.attr("class", "timeline-label")
						.attr("transform", "translate(" + 0 + "," + (margin.top + (itemHeight + itemMargin) * yAxisMapping[index]) + ")")
						.attr("xlink:href", datum.icon)
						.attr("width", margin.left)
						.attr("height", itemHeight);
				}

				function getStackPosition(d, i) {
					if (stacked) {
						return margin.top + (itemHeight + itemMargin) * yAxisMapping[index];
					}
					return margin.top;
				}
				function getStackTextPosition(d, i) {
					if (stacked) {
						return margin.top + (itemHeight + itemMargin) * yAxisMapping[index] + itemHeight * 0.75;
					}
					return margin.top + itemHeight * 0.75;
				}
			});
		});

		var belowLastItem = (margin.top + (itemHeight + itemMargin) * maxStack);
		var aboveFirstItem = margin.top;
		var timeAxisYPosition = showAxisTop ? aboveFirstItem : belowLastItem;
		if (showTimeAxis) { appendTimeAxis(g, xAxis, timeAxisYPosition); }
		if (timeAxisTick) { appendTimeAxisTick(g, xAxis, maxStack); }

		if (width > gParentSize.width) {
			var move = function () {
				var x = Math.min(0, Math.max(gParentSize.width - width, d3.event.translate[0]));
				zoom.translate([x, 0]);
				g.attr("transform", "translate(" + x + ",0)");
				scroll(x * scaleFactor, xScale);
			};

			var zoom = d3.behavior.zoom().x(xScale).on("zoom", move);

			gParent
				.attr("class", "scrollable")
				.call(zoom);
		}

		if (rotateTicks) {
			g.selectAll(".tick text")
				.attr("transform", function (d) {
					return "rotate(" + rotateTicks + ")translate("
						+ (this.getBBox().width / 2 + 10) + "," // TODO: change this 10
						+ this.getBBox().height / 2 + ")";
				});
		}

		var gSize = g.node().getBoundingClientRect();
		setHeight();

		if (showBorderLine) {
			g.each(function (d, i) {
				d.forEach(function (datum) {
					var times = datum.Table;  //change here
					times.forEach(function (time) {
						appendLine(xScale(new Date(time.starting_time).getTime()), showBorderFormat);
						appendLine(xScale(new Date(time.ending_time).getTime()), showBorderFormat);
					});
				});
			});
		}

		if (showTodayLine) {
			var todayLine = xScale(new Date());
			appendLine(todayLine, showTodayFormat);
		}

		function getXPos(d, i) {
			return margin.left + (new Date(d.starting_time).getTime() - beginning) * scaleFactor;
		}

		function getXTextPos(d, i) {
			return margin.left + (new Date(d.starting_time).getTime() - beginning) * scaleFactor + 5;
		}

		function setHeight() {
			if (!height && !gParentItem.attr("height")) {
				if (itemHeight) {
					// set height based off of item height
					height = gSize.height + gSize.top - gParentSize.top;
					// set bounding rectangle height
					d3.select(gParent.node()).attr("height", height);
				} else {
					throw "height of the timeline is not set";
				}
			} else {
				if (!height) {
					height = gParentItem.attr("height");
				} else {
					gParentItem.attr("height", height);
				}
			}
		}

		function setWidth() {
			if (!width && !gParentSize.width) {
				try {
					width = gParentItem.attr("width");
					if (!width) {
						throw "width of the timeline is not set. As of Firefox 27, timeline().with(x) needs to be explicitly set in order to render";
					}
				} catch (err) {
					//console.log(err);
				}
			} else if (!(width && gParentSize.width)) {
				try {
					width = gParentItem.attr("width");
				} catch (err) {
					//console.log(err);
				}
			}
			// if both are set, do nothing
		}

		function appendLine(lineScale, lineFormat) {
			gParent.append("svg:line")
				.attr("x1", lineScale)
				.attr("y1", lineFormat.marginTop)
				.attr("x2", lineScale)
				.attr("y2", height - lineFormat.marginBottom)
				.style("stroke", lineFormat.color)//"rgb(6,120,155)")
				.style("stroke-width", lineFormat.width);
		}

	}

	// SETTINGS

	timeline.margin = function (p) {
		if (!arguments.length) return margin;
		margin = p;
		return timeline;
	};

	timeline.orient = function (orientation) {
		if (!arguments.length) return orient;
		orient = orientation;
		return timeline;
	};

	timeline.itemHeight = function (h) {
		if (!arguments.length) return itemHeight;
		itemHeight = h;
		return timeline;
	};

	timeline.itemMargin = function (h) {
		if (!arguments.length) return itemMargin;
		itemMargin = h;
		return timeline;
	};

	timeline.navMargin = function (h) {
		if (!arguments.length) return navMargin;
		navMargin = h;
		return timeline;
	};

	timeline.height = function (h) {
		if (!arguments.length) return height;
		height = h;
		return timeline;
	};

	timeline.width = function (w) {
		if (!arguments.length) return width;
		width = w;
		return timeline;
	};

	timeline.display = function (displayType) {
		if (!arguments.length || (DISPLAY_TYPES.indexOf(displayType) == -1)) return display;
		display = displayType;
		return timeline;
	};

	timeline.labelFormat = function (f) {
		if (!arguments.length) return labelFunction;
		labelFunction = f;
		return timeline;
	};

	timeline.tickFormat = function (format) {
		if (!arguments.length) return tickFormat;
		tickFormat = format;
		return timeline;
	};

	timeline.hover = function (hoverFunc) {
		if (!arguments.length) return hover;
		hover = hoverFunc;
		return timeline;
	};

	timeline.mouseover = function (mouseoverFunc) {
		if (!arguments.length) return mouseover;
		mouseover = mouseoverFunc;
		return timeline;
	};

	timeline.mouseout = function (mouseoutFunc) {
		if (!arguments.length) return mouseout;
		mouseout = mouseoutFunc;
		return timeline;
	};

	timeline.click = function (clickFunc) {
		if (!arguments.length) return click;
		click = clickFunc;
		return timeline;
	};

	timeline.scroll = function (scrollFunc) {
		if (!arguments.length) return scroll;
		scroll = scrollFunc;
		return timeline;
	};

	timeline.colors = function (colorFormat) {
		if (!arguments.length) return colorCycle;
		colorCycle = colorFormat;
		return timeline;
	};

	timeline.beginning = function (b) {
		if (!arguments.length) return beginning;
		beginning = b;
		return timeline;
	};

	timeline.ending = function (e) {
		if (!arguments.length) return ending;
		ending = e;
		return timeline;
	};

	timeline.labelMargin = function (m) {
		if (!arguments.length) return labelMargin;
		labelMargin = m;
		return timeline;
	};

	timeline.rotateTicks = function (degrees) {
		if (!arguments.length) return rotateTicks;
		rotateTicks = degrees;
		return timeline;
	};

	timeline.stack = function () {
		stacked = !stacked;
		return timeline;
	};

	timeline.relativeTime = function () {
		timeIsRelative = !timeIsRelative;
		return timeline;
	};

	timeline.showBorderLine = function () {
		showBorderLine = !showBorderLine;
		return timeline;
	};

	timeline.showBorderFormat = function (borderFormat) {
		if (!arguments.length) return showBorderFormat;
		showBorderFormat = borderFormat;
		return timeline;
	};

	timeline.showToday = function () {
		showTodayLine = !showTodayLine;
		return timeline;
	};

	timeline.showTodayFormat = function (todayFormat) {
		if (!arguments.length) return showTodayFormat;
		showTodayFormat = todayFormat;
		return timeline;
	};

	timeline.colorProperty = function (colorProp) {
		if (!arguments.length) return colorPropertyName;
		colorPropertyName = colorProp;
		return timeline;
	};

	timeline.rowSeparators = function (color) {
		if (!arguments.length) return rowSeparatorsColor;
		rowSeparatorsColor = color;
		return timeline;

	};

	timeline.background = function (color) {
		if (!arguments.length) return backgroundColor;
		backgroundColor = color;
		return timeline;
	};

	timeline.showTimeAxis = function () {
		showTimeAxis = !showTimeAxis;
		return timeline;
	};

	timeline.showAxisTop = function () {
		showAxisTop = !showAxisTop;
		return timeline;
	};

	timeline.showAxisCalendarYear = function () {
		showAxisCalendarYear = !showAxisCalendarYear;
		return timeline;
	};

	timeline.showTimeAxisTick = function () {
		timeAxisTick = !timeAxisTick;
		return timeline;
	};

	timeline.fullLengthBackgrounds = function () {
		fullLengthBackgrounds = !fullLengthBackgrounds;
		return timeline;
	};

	timeline.showTimeAxisTickFormat = function (format) {
		if (!arguments.length) return timeAxisTickFormat;
		timeAxisTickFormat = format;
		return timeline;
	};

	timeline.showAxisHeaderBackground = function (bgColor) {
		showAxisHeaderBackground = !showAxisHeaderBackground;
		if (bgColor) { (axisBgColor = bgColor) };
		return timeline;
	};

	timeline.navigate = function (navigateBackwards, navigateForwards) {
		if (!arguments.length) return [navigateLeft, navigateRight];
		navigateLeft = navigateBackwards;
		navigateRight = navigateForwards;
		showAxisNav = !showAxisNav;
		return timeline;
	};

	return timeline;


}



function call_all_historic_fn(Val, shiftID, variantCode) {
	debugger;
	var myData =
	{
		"line": this.line,
		"Machine": Val,
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"Variant": variantCode,
		"Shift": shiftID
	};
	var user1 = this.user1;

	$.ajax({

		type: "POST",
		url: this.URL + 'api/Paretoanalysis/Popup_Machinewise_Batchwise_Data',
		data: myData,
		headers: {
			Authorization: 'Bearer ' + user1
		},
		dataType: "json",
		async: false,
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {
			if (response.status != "Error") {

				get_PopupKPI(Val, response);
				get_PopupUtil(Val, response);
				get_machine_status(Val, response, shiftID);
				get_MTTR(Val, response);
				get_MTBF(Val, response);
				get_downtime_pareto(Val, response);
				get_RejPar(Val, response);
				get_Heatmap(Val, response);
				get_Losstable(Val, response);
				get_CTDistribution(Val, response);



			}
		},
		error: function (response) {
			if (response.status == "401") {
				swal({
					icon: "warning",
					title: "Session Timeout",
					button: true,
					closeModal: false
				})
				window.location = R_url;
			}
			else {
				swal({
					icon: "warning",
					title: response.responseText,
					button: true,
					closeModal: false
				})
			}
		}
	});

}