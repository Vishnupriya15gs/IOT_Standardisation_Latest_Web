function LineOverView_API_Call(URL, sURL, company, plant, line, R_url, user1, shift) {
	debugger;
	this.URL = URL;
	this.sURL = sURL;
	this.company = company;
	this.plant = plant;
	this.line = line;
	this.R_url = R_url;
	this.user1 = user1;
	this.shift_id = shift;
	var reworkData = [];

	// Show the loading spinner before starting the data loading
	//showLoadingSpinner();

	/*$('.tabcontent').empty();*/
	DPR_Charts();
	Pie_DPR();
	TotalProd();
	Stckedgraph();
	$(".tabcontent").show();
	// Hide the loading spinner when the data loading is complete
	//hideLoadingSpinner();
}

// Function to show the loading spinner
//function showLoadingSpinner() {
//	document.getElementById('loadingSpinner').style.display = 'block';
//}

//// Function to hide the loading spinner
//function hideLoadingSpinner() {
//	document.getElementById('loadingSpinner').style.display = 'none';
//}

function DPR_Charts() {
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var shift = this.shift_id;
	
	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": shift,
		"MachineCode" : "M30"
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/DPRDaily',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {
			reworkData =response.data.Table4;
			console.log("dpr response"+response);
			Call_Modal_onclick();
			Call_ModalCategory_onclick();
			//bar_lineChart("#chart", response.data.Table, response.data.Table1, "Date", "DirectPass", "target_count", "2","Day","Direct Pass");
			dprGroupedGraph("#chart", response.data.Table, "Date", "DirectPass", "target_count", "Days", "Direct Pass");
			//bar_lineChart("#svgbarmonthly", response.data.Table2, response.data.Table3, "Month", "DirectPass", "target_count", "1", "Month", "Direct Pass");
			dprGroupedGraph("#svgbarmonthly", response.data.Table1, "Month", "DirectPass", "target_count", "Months", "Direct Pass");
			barGraph_Pareto("#svgPareto", response.data.Table2, "Station", "Rework", "ParetoPercentage", "Stations", "Rework", "");
			//bar_lineHourly_Chart("#svgbar", response.data.Table5, response.data.Table5, "Hour_Batch", "dprparts", "Target_part", "0", "Hour-Batch", "Direct Pass");
			//bar_lineHourly_Chart_grouped();
			dprGroupedGraph("#svgbar", response.data.Table3, "Hour", "DirectPass", "target_count", "Hours", "Direct Pass");
			barGraph_Pareto("#svgCategoryPareto", response.data.Table4, "CategoryName", "Cumulative Rejection", "ParetoPercentage", "CategoryId", "Cumulative Rejection", "");
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


function Pie_DPR() {
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;



	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": this.shift_id,
		"MachineCode": "M30"
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/DPR_Pie',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",

		success: function (response) {
			console.log(response);
			Pie_DprChart(response);
			// Refresh the chart every 10 seconds
			//setInterval(function () {
			//	Pie_DprChart(response);
			//}, 30000);
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

function Stckedgraph() {
	
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;



	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": "S1",
		"MachineCode": "M30"
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/SP_CalculateDeviceMetrics',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",

		success: function (response) {
			//console.log(response);
			Stackedgrapgh(response);
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

function TotalProd() {
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;



	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": this.shift_id,
		"MachineCode": "M30"
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/DPR_Pie',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",

		success: function (response) {
			console.log(response);
			clearTableData();
			GetTabledata(response);
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
function clearTableData() {
	// Clear existing data in tables
	$('#pietable1').empty();
	$('#pietable2').empty();
	$('#pietable3').empty();
	// Add more table IDs as needed
}

function Call_Modal_onclick() {
	debugger;
	modalDesign('#container-modal-quality', '#svgPareto');
	var currentDate = new Date();

	// Get the current month (0-indexed)
	var currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

	// Set the selected option in the dropdown
	$('#monthSelect').val(currentMonth);
	//showTab('month');
	//getReworkData_Monthly();
}

function Call_ModalCategory_onclick() {
	debugger;
	modalDesign('#container-modal-category-quality', '#svgCategoryPareto');
	var currentDate = new Date();

	// Get the current month (0-indexed)
	var currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

	// Set the selected option in the dropdown
	$('#monthSelectcategory').val(currentMonth);
	//showTab('month1');
	//getCategoryData_Monthly();
}
function loadContentOfModals(container, ele) {

	if (ele == '#svgPareto') {

		console.log(ele);
		getReworkData(container);

	}
	if (ele == '#svgCategoryPareto') {

		console.log(ele);
		getCategoryData(container);

	}
}
function getReworkData_Custom() {
	debugger;
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var shift = this.shift_id;
	var fromDateValue = $('#fromDate').val();
	var toDateValue = $('#toDate').val();
	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": "S1",
		"MachineCode": "M30",
		"FromDate": fromDateValue,
		"ToDate": toDateValue
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/ReworkPareto_Custom',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {

			barGraph_Pareto("#chartRejPopup",response.data.Table,"Station", "Rework", "ParetoPercentage", "Stations", "");

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

function getReworkData_Monthly() {
	debugger;
	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var shift = this.shift_id;
	var month = $('#monthSelect').val();
	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": shift,
		"MachineCode": "M30",
		"Month": month
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/ReworkPareto_Monthly',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {

			barGraph_Pareto("#chartRejPopup_Monthly", response.data.Table, "Station", "Rework", "ParetoPercentage", "Stations", "Rework", "");

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

function getCategoryData_Custom() {

	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var shift = this.shift_id;
	var fromDateValue = $('#fromDate1').val();
	var toDateValue = $('#toDate1').val();
	var myData =
	{

		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": "S1",
		"MachineCode": "M30",
		"FromDate": fromDateValue,
		"ToDate": toDateValue
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/CategoryPareto_Custom',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {

			barGraph_Pareto("#svgCategoryPareto", response.data.Table4, "CategoryName", "Cumulative Rejection", "ParetoPercentage", "CategoryId", "Cumulative Rejection", "Rejection Category Pareto");

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

function getCategoryData_Monthly() {

	var URL = this.sURL;
	var R_url = this.R_url;
	var user1 = this.user1;
	var shift = this.shift_id;
	var month = $('#monthSelectcategory').val();
	var myData =
	{
		"CompanyCode": this.company,
		"PlantCode": this.plant,
		"LineCode": this.line,
		"ShiftId": shift,
		"MachineCode": "M30",
		"Month": month
	};

	$.ajax({
		type: "POST",
		url: URL + 'api/LineOverView_Quality/CategoryPareto_Monthly',
		headers: {
			Authorization: 'Bearer ' + user1
		},
		data: myData,
		dataType: "json",
		beforeSend: function () {
			$('.loading').show();
		},
		complete: function () {
			$('.loading').hide();
		},
		success: function (response) {

			barGraph_Pareto("#chartCategoryPopup_Monthly", response.data.Table, "CategoryName", "Cumulative Rejection", "ParetoPercentage", "CategoryName", "Cumulative Rejection", "");

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

function reloadGraph(shiftname) {
	// Check if a shift is selected and it matches with the current shift
	//if (shiftname !== null) {


	//	//var modalContainers = document.querySelectorAll('.column');
	//	//var displayValues = [];

	//	//for (let modalContainer of modalContainers) {
	//	//	var displayValue = window.getComputedStyle(modalContainer).getPropertyValue('display');
	//	//	displayValues.push(displayValue);
	//	//}

	//	//console.log(displayValues);

	//	//if (displayValues.includes('block')) {
	//	//	console.log('The displayValues array contains "block".');
	//	//}
	//	//else {
	//	console.log('Graph reloaded at ' + new Date().toLocaleTimeString());
	//	$('.loading').hide();
	//	LineOverView_API_Call(URL, sURL, company, plant, line, R_url, user1, shiftname)
	//	clearTimeout(timeoutId);
	//	//timeoutId = setTimeout(reloadGraph(shiftname), 60000);
	//	timeoutId = setTimeout(reloadGraph(shiftname), 6000000);
	//	//}


	//}
	//else {
	//	console.log('Graph not reloaded. Please select the correct shift.');
	//}


}

$(document).ready(function () {
	// Attach change event to both date inputs
	$("#fromDate, #toDate").change(function () {
		enableViewButton();
	});

	// Function to enable/disable the "View" button
	function enableViewButton() {
		var fromDateValue = $("#fromDate").val();
		var toDateValue = $("#toDate").val();
		var viewButton = $("#viewButton");

		// Enable the button only if both "From Date" and "To Date" are selected
		viewButton.prop("disabled", !(fromDateValue && toDateValue));
	}
});
$(document).ready(function () {
	// Attach change event to both date inputs
	$("#fromDate1, #toDate1").change(function () {
		enableViewButton1();
	});

	// Function to enable/disable the "View" button
	function enableViewButton1() {
		var fromDateValue = $("#fromDate1").val();
		var toDateValue = $("#toDate1").val();
		var viewButton = $("#viewButton1");

		// Enable the button only if both "From Date" and "To Date" are selected
		viewButton.prop("disabled", !(fromDateValue && toDateValue));
	}
});
$(document).ready(function () {
	// Attach change event to the month dropdown
	$("#monthSelect").change(function () {
		enableViewButton();
	});

	// Function to enable/disable the "View" button
	function enableViewButton() {
		var selectedMonth = $("#monthSelect").val();
		var viewButton = $("#viewButton_month");

		// Enable the button only if a month is selected
		viewButton.prop("disabled", !selectedMonth);
	}
});
$(document).ready(function () {
	// Attach change event to the month dropdown
	$("#monthSelectcategory").change(function () {
		enableViewButton1();
	});

	// Function to enable/disable the "View" button
	function enableViewButton1() {
		var selectedMonth = $("#monthSelectcategory").val();
		var viewButton = $("#viewButton_month1");

		// Enable the button only if a month is selected
		viewButton.prop("disabled", !selectedMonth);
	}
});


function dprGroupedGraph(id, data, xAxisData, yAxisData, lineAxisData, xAxisLabel, yAxisLabel) {
	//bar_lineChart("#chart", response.data.Table, response.data.Table1, "Date", "DirectPass", "target_count", "2", "Day", "Direct Pass");
	const root = document.documentElement;
	const blueColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-1');
	const redColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-2');
	const greenColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-3');

	var dataVarProd = data; var chartTitle = ``; var elementID = id;

	var labelTilte = [xAxisLabel, yAxisLabel, chartTitle];
	var tooltipBar2Labels = [xAxisData, 'DirectPass'];
	var tooltipBar2Data = [xAxisData, 'DirectPass'];
	var tooltipBar1Labels = [xAxisData, 'target_count'];
	var tooltipBar1Data = [xAxisData, 'target_count'];
	var toolitpLineLabels = [xAxisData, 'Gap'];
	var tooltipLineData = [xAxisData, 'Gap'];

	var barWidth = 5;
	if (id == "#svgbarmonthly") { barWidth = 10; }
	else if(id == "#svgbar") { barWidth = 10; }
	createBarGraphLineGraphTarget(dataVarProd, xAxisData, "target_count", "DirectPass", "Gap", elementID, barWidth, labelTilte, tooltipBar1Labels, tooltipBar2Labels, toolitpLineLabels, tooltipBar1Data, tooltipBar2Data, tooltipLineData, "2");

	const chart = document.querySelector(elementID);
	const bars2 = chart.querySelectorAll('.bar2');
	const bars1 = chart.querySelectorAll('.bar1');

	bars2.forEach((bar) => {
		console.log(`${bar.__data__.target_count}:${bar.__data__.DirectPass}`);
		const fillColor = bar.__data__.target_count >= bar.__data__.DirectPass ? redColor : greenColor;
		bar.style.fill = fillColor;
	});
	bars1.forEach((bar) => { bar.style.fill = blueColor; });
}

function bar_lineHourly_Chart_grouped() {

	const root = document.documentElement; const blueColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-1'); const redColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-2'); const greenColor = getComputedStyle(root).getPropertyValue('--bargraph-bar-fill-3');

	var data = [
		{ category: '1', value1: 30, value2: 40, lineValue: 25 },
		{ category: '2', value1: 45, value2: 20, lineValue: 35 },
		{ category: '3', value1: 25, value2: 35, lineValue: 40 },
		{ category: '4', value1: 45, value2: 20, lineValue: 35 },
		{ category: '5', value1: 25, value2: 35, lineValue: 40 },
		{ category: '6', value1: 25, value2: 35, lineValue: 40 },
		{ category: '7', value1: 45, value2: 20, lineValue: 35 },
		{ category: '8', value1: 25, value2: 35, lineValue: 40 },
	];


	var dataVarProd = data; var chartTitle = ``; var elementID = `#svgbar`;

	var labelTilte = ['Hour', 'Direct Pass', chartTitle]; var tooltipBar1Labels = ['category', 'value1']; var tooltipBar1Data = ['category', 'value1']; var tooltipBar2Labels = ['category', 'value2']; var tooltipBar2Data = ['category', 'value2']; var toolitpLineLabels = ['category', 'lineValue']; var tooltipLineData = ['category', 'lineValue'];



	createBarGraphLineGraphTarget(dataVarProd, "category", "value1", "value2", "lineValue", elementID, 20, labelTilte, tooltipBar1Labels, tooltipBar2Labels, toolitpLineLabels, tooltipBar1Data, tooltipBar2Data, tooltipLineData);

	const chart = document.querySelector(elementID); const bars2 = chart.querySelectorAll('.bar2'); const bars1 = chart.querySelectorAll('.bar1');

	bars2.forEach((bar) => { console.log(`${bar.__data__.value2}:${bar.__data__.value1}`); const fillColor = bar.__data__.value2 >= bar.__data__.value1 ? greenColor : redColor; bar.style.fill = fillColor; }); bars1.forEach((bar) => { bar.style.fill = blueColor; });
}

