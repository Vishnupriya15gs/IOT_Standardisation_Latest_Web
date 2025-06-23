function YearlyVariantChange(URL, company, plant, line, R_url, user1, machinecode, year, variant) {

    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.year = year;
    this.variant = variant;
    YearlyVariantchange();

}


function YearlyGraphCheck(URL, company, plant, line, R_url, user1, machinecode, year) {
    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.year = year;

    YearlyGraph()
}


function YearlyVariantchange() {


    $('.updated_time').text(new Date().toLocaleString());
    $('.shift').text("N/A");




    if (this.linecode == '') {
        swal({
            icon: "error",
            title: "Please Provide Line details",
            button: false,
            timer: 4500
        })
    }
    else if (this.machinecode == '') {
        swal({
            icon: "error",
            title: "Please Provide Machine details",
            button: false,
            timer: 4500
        })
    }

    else if (this.year == '') {
        swal({
            icon: "error",
            title: "Please Provide Year",
            button: false,
            timer: 4500
        })
    }
    else {

        var myData = {
            "variant": this.variant,
            "line": this.line,
            "Machine": this.machinecode,
            "Year": this.year,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;


        $.ajax({
            type: "POST",
            url: URL + 'api/Paretoanalysis/yearlyDaywiseShiftProduction',
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
                d3.select(".year_Duration svg").remove();
                if (response.status != "Error") {


                    Daywisegraph(".year_Duration", response);


                }
                else {
                    sample = "";
                    $(".year_Duration").empty();

                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".year_Duration").append("svg")
                        .attr("width", div_width)
                        .attr("height", div_height)
                        .attr("preserveAspectRatio", "xMidYMid")
                        .append("g")
                        .attr("transform", "translate(" + (div_width / 2 - 50) + "," + (div_height / 2 - 50) + ")");

                    svg.append("text")
                        .text("No Data Available")
                        .style("font-size", "40px");
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

}




function YearlyGraph() {


    $('.updated_time').text(new Date().toLocaleString());
    $('.shift').text("N/A");


    if (this.linecode == '') {
        swal({
            icon: "error",
            title: "Please Provide Line details",
            button: false,
            timer: 4500
        })
    }
    else if (this.machinecode == '') {
        swal({
            icon: "error",
            title: "Please Provide Machine details",
            button: false,
            timer: 4500
        })
    }

    else if (this.year == '') {
        swal({
            icon: "error",
            title: "Please Provide Month",
            button: false,
            timer: 4500
        })
    }
    else {

        var myData = {
            "variant": 'All',
            "line": this.line,
            "Machine": this.machinecode,
            "Year": this.year,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: URL + 'api/Paretoanalysis/yearlyShiwiseAggreagte',
            headers: {
                Authorization: 'Bearer ' + user1
            },
            data: myData,
            beforeSend: function () {
                $('.loading').show();
            },
            complete: function () {
                $('.loading').hide();
            },
            success: function (response) {
                d3.select(".year_report svg").remove();

                if (response.status != "Error") {

                    graph(".year_report", response);

                    DaywiseShiftProductionAjax();

                }
                else {
                    $(".year_report").empty();
                    DaywiseShiftProductionAjax();
                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".year_report").append("svg")
                        .attr("width", div_width)
                        .attr("height", div_height)
                        .attr("preserveAspectRatio", "xMidYMid")
                        .append("g")
                        .attr("transform", "translate(" + (div_width / 2 - 50) + "," + (div_height / 2 - 50) + ")");

                    svg.append("text")
                        .text("No Data Available")
                        .style("font-size", "40px");
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

}

function DaywiseShiftProductionAjax() {
    var myData = {
        "variant": 'All',
        "line": this.line,
        "Machine": this.machinecode,
        "Year": this.year,
        "CompanyCode": this.company,
        "PlantCode": this.plant
    };
    var R_url = this.R_url;
    var user1 = this.user1;


    $.ajax({
        type: "POST",
        url: URL + 'api/Paretoanalysis/yearlyDaywiseShiftProduction',
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
            d3.select(".year_Duration svg").remove();
            if (response.status != "Error") {
                var s = '<option value="All">All</option>';
                for (var i = 0; i < response.data.Table1.length; i++) {
                    s += '<option value="' + response.data.Table1[i].variant_code + '">' + response.data.Table1[i].variant_code + "-" + response.data.Table1[i].VariantName + '</option>';
                }
                $("#Yearly_Variant").html(s);


                Daywisegraph(".year_Duration", response);


            }
            else {
                sample = "";
                $(".year_Duration").empty();
                var s = '<option >No Variant</option>';
                $("#Yearly_Variant").html(s);
                var div_width = 400;
                var div_height = 400;
                var svg = d3.select(".year_Duration").append("svg")
                    .attr("width", div_width)
                    .attr("height", div_height)
                    .attr("preserveAspectRatio", "xMidYMid")
                    .append("g")
                    .attr("transform", "translate(" + (div_width / 2 - 50) + "," + (div_height / 2 - 50) + ")");

                svg.append("text")
                    .text("No Data Available")
                    .style("font-size", "40px");
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
