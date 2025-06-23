
function MonthlyVariantChange(URL, company, plant, line, R_url, user1, machinecode, month, variant) {
    debugger;
    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.month = month;
    this.variant = variant;
    updatemachine();

}


function MonthlyGraphCheck(URL, company, plant, line, R_url, user1, machinecode, month) {
    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.month = month;

    MonthlyGraph()
}


function updatemachine() {

    debugger;

    $('.updated_time').text(new Date().toLocaleString());
    $('.shift').text("N/A");



    if (this.line == '') {
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
    else if (this.records == '') {
        swal({
            icon: "error",
            title: "Please Provide No. of records",
            button: false,
            timer: 4500
        })
    }

    else if (this.month == '') {
        swal({
            icon: "error",
            title: "Please Provide Month",
            button: false,
            timer: 4500
        })
    }

    else {

        var chartData = [];
        var myData = {
            "variant": this.variant,
            "line": this.line,
            "Machine": this.machinecode,
            "records": this.records,
            "Year": this.month,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;

        $.ajax({
            type: "POST",
            url: URL + 'api/Paretoanalysis/monthlyDaywiseShiftProduction',
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
                d3.select(".monthly_Duration svg").remove();
                if (response.status != "Error") {


                    Daywisegraph(".monthly_Duration", response);


                }
                else {
                    sample = "";
                    $(".monthly_Duration").empty();

                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".monthly_Duration").append("svg")
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



function MonthlyGraph() {


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

    else if (this.month == '') {
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
            "Year": this.month,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: URL + 'api/Paretoanalysis/monthlyShiwiseAggreagte',
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
                d3.select(".monthly_report svg").remove();

                if (response.status != "Error") {

                    const a = $('.monthly_report').height();
                    const b = $('.monthly_report').width();
                    graph(".monthly_report", response);

                    MonthwiseShiftProductionAjax();

                }
                else {
                    $(".monthly_report").empty();
                    MonthwiseShiftProductionAjax();
                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".monthly_report").append("svg")
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

function MonthwiseShiftProductionAjax() {
    var myData = {
        "variant": 'All',
        "line": this.line,
        "Machine": this.machinecode,
        "Year": this.month,
        "CompanyCode": this.company,
        "PlantCode": this.plant
    };
    var R_url = this.R_url;
    var user1 = this.user1;

    $.ajax({
        type: "POST",
        url: URL + 'api/Paretoanalysis/monthlyDaywiseShiftProduction',
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
            d3.select(".monthly_Duration svg").remove();
            if (response.status != "Error") {
                var s = '<option value="All">All</option>';
                for (var i = 0; i < response.data.Table1.length; i++) {
                    s += '<option value="' + response.data.Table1[i].variant_code + '">' + response.data.Table1[i].variant_code + "-" + response.data.Table1[i].VariantName + '</option>';
                }
                $("#Monthly_Variant").html(s);


                Daywisegraph(".monthly_Duration", response);


            }
            else {
                sample = "";
                $(".monthly_Duration").empty();
                var s = '<option >No Variant</option>';
                $("Monthly_Variant").html(s);

                var div_width = 400;
                var div_height = 400;
                var svg = d3.select(".monthly_Duration").append("svg")
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