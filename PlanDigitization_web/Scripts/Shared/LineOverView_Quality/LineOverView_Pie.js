function Pie_DprChart(response) {
    d3.select("svg").selectAll("*").remove();
    if (!response || !response.data || !response.data.Table || response.data.Table.length === 0)
    {

        $("#svg").empty();
        // Display a message in SVG
        var svg = d3.select("svg"),
            width = svg.attr("width"),
            height = svg.attr("height");

        svg.append("text")
            .attr("x", 10)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-family", "arial")
            .attr("text-anchor", "start")
            .style("font-size", 10)
            .text("Pie chart can't be generated.");

        return;
    }

    var dprPercent = response.data.Table[0].DPR_Percent;
    var rejectionPercent = response.data.Table[0].Rejection_Percent;
    var reworkPercent = response.data.Table[0].Rework_Percent;

    // Check if all values are 0
    if (dprPercent === 0 && rejectionPercent === 0 && reworkPercent === 0) {
        $("#svg").empty();
        // Display a message in SVG
        var svg = d3.select("svg"),
            width = svg.attr("width"),
            height = svg.attr("height");

        svg.append("text")
            .attr("x", 10)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-family", "arial")
            .attr("text-anchor", "start")
            .style("font-size", 10)
            .text("Pie chart can't be generated.");

        return;
    }
    if ((dprPercent || rejectionPercent || reworkPercent) > 0)
    {
     
        var data = [dprPercent, rejectionPercent, reworkPercent];
        
        $("#svg").empty();

        var svg = d3.select("svg"),
            width = svg.attr("width"),
            height = svg.attr("height"),
            radius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(['#4CAF50', '#F44336', '#4C88CD']);

        // Generate the pie
        var pie = d3.pie();

        // Generate the arcs
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Generate groups
        var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .style('stroke', 'white')
            .transition() // Add transition for smooth animation
            .duration(1000) // Set duration for animation
            .attrTween("d", function (d) {
                var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });
    }
    
}






function GetTabledata(response) {
    if (response && response.data && response.data.Table && response.data.Table.length > 0) {
        var testdata = response.data.Table[0].Parts_Produced;
        if (testdata > 0) {
            var html = "<tr> <td>" + testdata + " </td></tr > ";
            $('#pietable1').append(html);
        } else {
            var html = "<tr> <td>" + 0 + " </td></tr > ";
            $('#pietable1').append(html);
        }

        //var DPR_count = response.data.Table[0].DPR_count;
        //var Total_NOk_parts = response.data.Table[0].Total_NOk_parts;
        //var Total_Rework_Parts = response.data.Table[0].Total_Rework_Parts;
        if (response.data.Table[0].DPR_count == null) {
            var DPR_count = 0;
        }
        else {
            var DPR_count = response.data.Table[0].DPR_count;
        }
        if (response.data.Table[0].Total_NOk_parts == null) {
            var Total_NOk_parts = 0;
        }
        else {
            var Total_NOk_parts = response.data.Table[0].Total_NOk_parts;
        }
        if (response.data.Table[0].Total_Rework_Parts == null) {
            var Total_Rework_Parts = 0;
        }
        else {
            var Total_Rework_Parts = response.data.Table[0].Total_Rework_Parts;
        }

        var tbody2 = $('#pietable2');
        // Create a row and append columns to the tbody
        var row2 = $('<tr>');
        row2.append($('<td>').text(DPR_count));
        row2.append($('<td>').text(Total_NOk_parts));
        row2.append($('<td>').text(Total_Rework_Parts));
        tbody2.append(row2);

        var DPR_Percent = response.data.Table[0].DPR_Percent;
        var DPR_PercentroundedNumber = DPR_Percent.toFixed(2);
        var Rejection_Percent = response.data.Table[0].Rejection_Percent;
        var Rejection_PercentroundedNumber = Rejection_Percent.toFixed(2);
        var Rework_Percent = response.data.Table[0].Rework_Percent;
        var Rework_PercentroundedNumber = Rework_Percent.toFixed(2);
        var tbody3 = $('#pietable3');

        // Create a row and append columns to the tbody
        var row3 = $('<tr>');
        row3.append($('<td>').text(DPR_PercentroundedNumber));
        row3.append($('<td>').text(Rejection_PercentroundedNumber));
        row3.append($('<td>').text(Rework_PercentroundedNumber));
        tbody3.append(row3);
    } else {
        // If response is not available or incomplete, display a message or placeholder
        $('#pietable1').append("<tr><td colspan='3'>No data available</td></tr>");
        $('#pietable2').append("<tr><td colspan='3'>No data available</td></tr>");
        $('#pietable3').append("<tr><td colspan='3'>No data available</td></tr>");
    }
}


