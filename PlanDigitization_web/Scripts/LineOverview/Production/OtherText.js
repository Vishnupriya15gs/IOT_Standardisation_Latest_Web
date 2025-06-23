function displayScenarioText(eleID, chartTitle, firstColumnValue ) {
	
	$(eleID).empty();


	// Set default dimensions
	const defaultWidth = 600;
	const defaultHeight = 255;

	// Get the width and height of the element
	const chartElement = document.querySelector(eleID);
	const width = chartElement.clientWidth || defaultWidth;
	const height = chartElement.clientHeight || defaultHeight;

	var svg = d3.select(eleID).append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("preserveAspectRatio", "xMidYMid")
		.append("g");

	// Title
	var title = svg.append("text")
		.attr("class", "titleText")
		.text(chartTitle);

	var titleWidth = title.node().getComputedTextLength();
	var xTitleTranslate = (width - titleWidth) / 2;
	title.attr("transform", "translate(" + xTitleTranslate + "," + (height / 11) + ")");

	// Value
	var value = svg.append("text")
		.attr("class", "scenarioText")
		.text(firstColumnValue);

	var valueWidth = value.node().getComputedTextLength();
	var xValueTranslate = (width - valueWidth) / 2;
	value.attr("transform", "translate(" + xValueTranslate + "," + (height / 2) + ")");
}