

function graph(id, response) {
    //console.log(response);

    const a = $(id).height();
    const b = $(id).width();
    var m = { top: 120, right: 50, bottom: 120, left: 70 }
        , h = a - m.top - m.bottom
        , w = b - m.left - m.right
        , barWidth = 5;
    /* console.log(a + "2nd" + b);*/
    //console.log("response.data.Table[0]", response.data.Table[0].S2_OKParts)
    var dataset = null;
    //typecast Amount to #, calculate total, and cumulative amounts
    dataset = response.data.Table;

    //Axes and scales
    var xScale = d3.scale.ordinal().rangeRoundBands([0, w], dataset.length <= 2 ? 0.7 : 0.4);
    var x1Scale = d3.scale.ordinal();
    var x2Scale = d3.scale.ordinal();




    //xScale.domain(response.data.Table.map(function (d) {

    //    return d.Variant_name;
    //}));


    xScale.domain(response.data.Table.map(function (d) { return d.Variant_name; }));
    x1Scale.domain(['S1_OKParts', 'S2_OKParts', 'S3_OKParts']).rangeRoundBands([0, xScale.rangeBand()], 0.1);
    x2Scale.domain(['S1_OKParts', 'S2_OKParts', 'S3_OKParts']).rangeRoundBands([0, x1Scale.rangeBand()], 0.1);
    x1Scale.domain(['S1_NOKParts', 'S2_NOKParts', 'S3_NOKParts']).rangeRoundBands([0, xScale.rangeBand()], 0.1);
    x2Scale.domain(['S1_NOKParts', 'S2_NOKParts', 'S3_NOKParts']).rangeRoundBands([0, x1Scale.rangeBand()], 0.1);


    var yhist = d3.scale.linear()
        .domain([0, d3.max(response.data.Table, function (d) {


            var x = (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) > d.S3_OKParts ? (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) : d.S3_OKParts;
            var y = (d.S1_NOKParts > d.S2_NOKParts ? d.S1_NOKParts : d.S2_NOKParts) > d.S3_NOKParts ? (d.S1_NOKParts > d.S2_NOKParts ? d.S1_NOKParts : d.S2_NOKParts) : d.S3_NOKParts;
            return x > y ? x : y;

        })])
        .range([h, 0]);

    /*var ycum = d3.scale.linear().domain([0, 100]).range([h, 0]);*/

    var ycum = d3.scale.linear().domain([0, d3.max(response.data.Table, function (d) {
        return d.S1_OKParts + d.S1_NOKParts + d.S2_OKParts + d.S2_NOKParts + d.S3_OKParts + d.S3_NOKParts;
    })]).range([h, 0]);



    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yhist)
        .orient('left');

    var yAxis2 = d3.svg.axis()
        .scale(ycum)
        .orient('right');

    var tooltip = d3.select(id)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "tranparent")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    tooltip = d3.select("body").append("div")
        .style("background-color", "grey")
        .style("opacity", "0.9")
        .style("color", "white")
        .style("border-radius", "5px")

        .style("width", "200px")
        .style("height", "100px")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("padding", "5px");
    toolval = tooltip.append("div");




    //Draw svg
    var svg = d3.select(id).append("svg")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    //Draw histogram
    var bar = svg.selectAll(".bar")
        .data(response.data.Table)
        .enter().append("g")
        .attr("class", "bar");



    bar.append("rect")
        .attr("x", function (d) { return xScale(d.Variant_name); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S1_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S1_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .style("padding", "12px")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S1' + '<br> OK Parts :' + d.S1_OKParts + '<br> NOK Parts :' + d.S1_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )

    bar.append("rect")
        .attr("x", function (d) { return xScale(d.Variant_name); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S1_NOKParts); })
        .attr("height", function (d) { return d.S1_NOKParts > d.S1_OKParts ? (yhist(d.S1_OKParts) - yhist(d.S1_NOKParts)) : h - yhist(d.S1_NOKParts); })
        .style("fill", "rgb(243, 156, 18)")

        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S1' + '<br> OK Parts :' + d.S1_OKParts + '<br> NOK Parts :' + d.S1_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )

    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.Variant_name) + x1Scale.rangeBand() + 2); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S2_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S2_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S2' + '<br> OK Parts :' + d.S2_OKParts + '<br> NOK Parts :' + d.S2_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )


    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.Variant_name) + x1Scale.rangeBand() + 2); })
        .attr("width", x1Scale.rangeBand())
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S2_NOKParts); })
        .attr("height", function (d) { return d.S2_NOKParts > d.S2_OKParts ? (yhist(d.S2_OKParts) - yhist(d.S2_NOKParts)) : h - yhist(d.S2_NOKParts); })

        .style("fill", "rgb(243, 156, 18)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S2' + '<br> OK Parts :' + d.S2_OKParts + '<br> NOK Parts :' + d.S2_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )


    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.Variant_name) + (2 * x1Scale.rangeBand()) + 4); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S3_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S3_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S3' + '<br> OK Parts :' + d.S3_OKParts + '<br> NOK Parts :' + d.S3_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )



    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.Variant_name) + (2 * x1Scale.rangeBand()) + 4); })
        .attr("width", x1Scale.rangeBand())

        .attr("y", function (d) { return yhist(d.S3_NOKParts); })
        .attr("height", function (d) { return d.S3_NOKParts > d.S3_OKParts ? (yhist(d.S3_OKParts) - yhist(d.S3_NOKParts)) : h - yhist(d.S3_NOKParts); })
        .style("fill", "rgb(243, 156, 18)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S3' + '<br> OK Parts :' + d.S3_OKParts + '<br> NOK Parts :' + d.S3_NOKParts + '<br> Variant :' + d.Variant_name + '<br>';

            tooltip.select("div").html(text)

        }
        )




    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S1_OKParts > d.S1_NOKParts)
                return -yhist(d.S1_OKParts) + 20;
            else
                return -yhist(d.S1_NOKParts) + 20;

        })
        .attr('y', function (d) {
            return (xScale(d.Variant_name) + ((x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style('fill', '#00b6a7')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .text(function (d) { return d.S1_OKParts + d.S1_NOKParts })










    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S2_OKParts > d.S2_NOKParts)
                return -yhist(d.S2_OKParts) + 20;
            else
                return -yhist(d.S2_NOKParts) + 20;

        })
        .attr('y', function (d) {
            return (xScale(d.Variant_name) + ((3 * x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style('fill', '#00b6a7')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .text(function (d) { return d.S2_OKParts + d.S2_NOKParts })
    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S3_OKParts > d.S3_NOKParts)
                return -yhist(d.S3_OKParts) + 20;
            else
                return -yhist(d.S3_NOKParts) + 20;


        })
        .attr('y', function (d) {
            return (xScale(d.Variant_name) + ((5.5 * x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .style('fill', '#00b6a7')
        .text(function (d) { return d.S3_OKParts + d.S3_NOKParts })


    ///CDF line

    var guide = d3.svg.line()
        .x(function (d) { return xScale(d.Variant_name) + 1.75 * x1Scale.rangeBand(); })
        .y(function (d) { return ycum(d.S1_OKParts + d.S1_NOKParts + d.S2_OKParts + d.S2_NOKParts + d.S3_OKParts + d.S3_NOKParts) });


    var line = svg.append('path')
        .datum(dataset)
        .attr('d', guide)
        .attr('class', 'line');
    var selectCircle = svg.selectAll(".circle")
        .data(dataset)
    selectCircle.enter().append("circle")
        .attr("class", "circle")
        .attr("r", 3.5)
        .attr("cx", function (d) { return xScale(d.Variant_name) + 1.75 * x1Scale.rangeBand(); })
        .attr("cy", function (d) { return ycum(d.S1_OKParts + d.S1_NOKParts + d.S2_OKParts + d.S2_NOKParts + d.S3_OKParts + d.S3_NOKParts) })









    //Draw axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("rect")
        .attr("y", -300)
        .attr("x", 900)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "rgb(243, 156, 18)")

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", -250)
        .attr("x", 925)
        .style("text-anchor", "end")
        .text("NOK");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("rect")
        .attr("y", -300)
        .attr("x", 950)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#A6C54B")


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", -250)
        .attr("x", 967)
        .style("text-anchor", "end")
        .text("OK");



    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "12px")
        .text("Production Count");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 115)
        .attr("x", 500)
        .style("text-anchor", "end")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "12px")
        .text("Variant");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [w, 0] + ")")
        .call(yAxis2)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -9)
        .style("text-anchor", "end")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "12px")
        .text("Total Parts");




}




function Daywisegraph(id, response) {
    //console.log(response);

    const a = $(id).height();
    const b = $(id).width();
    var m = { top: 100, right: 50, bottom: 100, left: 70 }
        , h = a - m.top - m.bottom
        , w = b - m.left - m.right
        , barWidth = 5;
    /* console.log(a + "2nd" + b);*/
    //console.log("response.data.Table[0]", response.data.Table[0].S2_OKParts)
    var dataset = null;
    //typecast Amount to #, calculate total, and cumulative amounts
    dataset = response.data.Table;

    //Axes and scales
    var xScale = d3.scale.ordinal().rangeRoundBands([0, w], dataset.length <= 2 ? 0.7 : 0.4);
    var x1Scale = d3.scale.ordinal();
    var x2Scale = d3.scale.ordinal();


    //xScale.domain(response.data.Table.map(function (d) {

    //    return d.date;
    //}));


    xScale.domain(response.data.Table.map(function (d) { return d.date; }));
    x1Scale.domain(['S1_OKParts', 'S2_OKParts', 'S3_OKParts']).rangeRoundBands([0, xScale.rangeBand()], 0.1);
    x2Scale.domain(['S1_OKParts', 'S2_OKParts', 'S3_OKParts']).rangeRoundBands([0, x1Scale.rangeBand()], 0.1);
    x1Scale.domain(['S1_NOKParts', 'S2_NOKParts', 'S3_NOKParts']).rangeRoundBands([0, xScale.rangeBand()], 0.1);
    x2Scale.domain(['S1_NOKParts', 'S2_NOKParts', 'S3_NOKParts']).rangeRoundBands([0, x1Scale.rangeBand()], 0.1);


    var yhist = d3.scale.linear()
        .domain([0, d3.max(response.data.Table, function (d) {

            //console.log(d.date);
            //console.log(d.S1_OKParts + " " + d.S2_OKParts + " " + d.S3_OKParts);
            //console.log(
            //    (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) > d.S3_OKParts ? (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) : d.S3_OKParts

            //)
            var x = (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) > d.S3_OKParts ? (d.S1_OKParts > d.S2_OKParts ? d.S1_OKParts : d.S2_OKParts) : d.S3_OKParts;
            var y = (d.S1_NOKParts > d.S2_NOKParts ? d.S1_NOKParts : d.S2_NOKParts) > d.S3_NOKParts ? (d.S1_NOKParts > d.S2_NOKParts ? d.S1_NOKParts : d.S2_NOKParts) : d.S3_NOKParts;
            return x > y ? x : y;

        })])
        .range([h, 0]);

    var ycum = d3.scale.linear().domain([0, 100]).range([h, 0]);



    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yhist)
        .orient('left');

    var yAxis2 = d3.svg.axis()
        .scale(ycum)
        .orient('right');

    var tooltip = d3.select(id)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "tranparent")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    tooltip = d3.select("body").append("div")
        .style("background-color", "grey")
        .style("opacity", "0.9")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("height", "100px")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("padding", "5px");
    toolval = tooltip.append("div");




    //Draw svg
    var svg = d3.select(id).append("svg")
        .attr("width", w + m.left + m.right)
        .attr("height", h + m.top + m.bottom)
        .append("g")
        .attr("transform", "translate(" + m.left + "," + m.top + ")");

    //Draw histogram
    var bar = svg.selectAll(".bar")
        .data(response.data.Table)
        .enter().append("g")
        .attr("class", "bar");



    bar.append("rect")
        .attr("x", function (d) { return xScale(d.date); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S1_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S1_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .style("padding", "12px")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S1' + '<br> OK Parts :' + d.S1_OKParts + '<br> NOK Parts :' + d.S1_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )

    bar.append("rect")
        .attr("x", function (d) { return xScale(d.date); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S1_NOKParts); })
        .attr("height", function (d) { return d.S1_NOKParts > d.S1_OKParts ? (yhist(d.S1_OKParts) - yhist(d.S1_NOKParts)) : h - yhist(d.S1_NOKParts); })
        .style("fill", "rgb(243, 156, 18)")

        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S1' + '<br> OK Parts :' + d.S1_OKParts + '<br> NOK Parts :' + d.S1_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )

    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.date) + x1Scale.rangeBand() + 2); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S2_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S2_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S2' + '<br> OK Parts :' + d.S2_OKParts + '<br> NOK Parts :' + d.S2_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )


    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.date) + x1Scale.rangeBand() + 2); })
        .attr("width", x1Scale.rangeBand())
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S2_NOKParts); })
        .attr("height", function (d) { return d.S2_NOKParts > d.S2_OKParts ? (yhist(d.S2_OKParts) - yhist(d.S2_NOKParts)) : h - yhist(d.S2_NOKParts); })

        .style("fill", "rgb(243, 156, 18)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S2' + '<br> OK Parts :' + d.S2_OKParts + '<br> NOK Parts :' + d.S2_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )


    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.date) + (2 * x1Scale.rangeBand()) + 4); })
        .attr("width", x1Scale.rangeBand())
        .attr("y", function (d) { return yhist(d.S3_OKParts); })
        .attr("height", function (d) { return h - yhist(d.S3_OKParts); })
        .style("fill", "rgb(135, 195, 0)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S3' + '<br> OK Parts :' + d.S3_OKParts + '<br> NOK Parts :' + d.S3_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )



    bar.append("rect")
        .attr("x", function (d) { return (xScale(d.date) + (2 * x1Scale.rangeBand()) + 4); })
        .attr("width", x1Scale.rangeBand())

        .attr("y", function (d) { return yhist(d.S3_NOKParts); })
        .attr("height", function (d) { return d.S3_NOKParts > d.S3_OKParts ? (yhist(d.S3_OKParts) - yhist(d.S3_NOKParts)) : h - yhist(d.S3_NOKParts); })
        .style("fill", "rgb(243, 156, 18)")
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            tooltip.style("visibility", "hidden");
        }
        )

        .on("mousemove", function (d) {


            tooltip.style("visibility", "visible")
                .style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");

            var text = 'Shift :' + 'S3' + '<br> OK Parts :' + d.S3_OKParts + '<br> NOK Parts :' + d.S3_NOKParts + '<br> Date :' + d.date + '<br>';

            tooltip.select("div").html(text)

        }
        )




    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S1_OKParts > d.S1_NOKParts)
                return -yhist(d.S1_OKParts) + 20;
            else
                return -yhist(d.S1_NOKParts) + 20;

        })
        .attr('y', function (d) {
            return (xScale(d.date) + ((x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style('fill', '#00b6a7')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .text(function (d) { return d.S1_OKParts + d.S1_NOKParts })










    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S2_OKParts > d.S2_NOKParts)
                return -yhist(d.S2_OKParts) + 20;
            else
                return -yhist(d.S2_NOKParts) + 20;

        })
        .attr('y', function (d) {
            return (xScale(d.date) + ((3 * x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style('fill', '#00b6a7')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .text(function (d) { return d.S2_OKParts + d.S2_NOKParts })
    bar.append('text')
        .attr('class', 'value')
        .attr("transform", "rotate(-90)")
        .attr('x', function (d) {
            if (d.S3_OKParts > d.S3_NOKParts)
                return -yhist(d.S3_OKParts) + 20;
            else
                return -yhist(d.S3_NOKParts) + 20;


        })
        .attr('y', function (d) {
            return (xScale(d.date) + ((5.5 * x1Scale.rangeBand()) / 2) + 3);
        })
        .attr('text-anchor', 'middle')
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "10px")
        .style('fill', '#00b6a7')
        .text(function (d) { return d.S3_OKParts + d.S3_NOKParts })




    //Draw axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("rect")
        .attr("y", -340)
        .attr("x", 900)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "rgb(243, 156, 18)")

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", -300)
        .attr("x", 920)
        .style("text-anchor", "end")
        /* .text("Shift1");*/
        .text("NOK");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("rect")
        .attr("y", -340)
        .attr("x", 950)
        .attr("width", 20)
        .attr("height", 20)
        /* .style("fill", "rgb(92, 89, 80)")*/
        .style("fill", "#A6C54B")

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", -300)
        .attr("x", 975)
        .style("text-anchor", "end")
        .text("OK");





    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "12px")
        .text("Production Count");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 90)
        .attr("x", 450)
        .style("text-anchor", "end")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style("font-size", "12px")
        .text("Date");


}