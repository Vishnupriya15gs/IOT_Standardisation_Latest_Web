function CustomVariantChange(URL, company, plant, line, R_url, user1, machinecode, start, end, variant) {

    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.start = start;
    this.end = end;
    this.variant = variant;
    CustomVariant();

}


function CustomGraphCheck(URL, company, plant, line, R_url, user1, machinecode, start, end) {


    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    this.machinecode = machinecode;
    this.start = start;
    this.end = end;

    CustomGraph();
}


function CustomVariant() {

    $('.updated_time').text(new Date().toLocaleString());
    $('.shift').text("N/A");

    var syear = this.start.substr(0, 4);
    var eyear = this.end.substr(0, 4);
    if (syear != eyear && end != '') {
        swal({
            icon: "error",
            title: "Please Select Same Year for Fromdate and Todate...!",
            button: false,
            timer: 4500
        })
        d3.select("svg").remove();
        return;
    }


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

    else if (this.start == '') {
        swal({
            icon: "error",
            title: "Please Provide start date",
            button: false,
            timer: 4500
        })
    }
    else if (this.end == '') {
        swal({
            icon: "error",
            title: "Please Provide End date",
            button: false,
            timer: 4500
        })
    }
    else {
        if (this.start > this.end) {
            swal({
                icon: "error",
                title: "Please Provide Dates correctly...",
                button: false,
                timer: 4500
            })
        }


        var myData = {
            "variant": this.variant,
            "line": this.line,
            "Machine": this.machinecode,
            "FromDate": this.start,
            "ToDate": this.end,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };


        var R_url = this.R_url;
        var user1 = this.user1;



        $.ajax({
            type: "POST",
            url: URL + 'api/Paretoanalysis/DaywiseShiftProduction',
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
                d3.select(".custome_Duration svg").remove();
                if (response.status != "Error") {

                    Daywisegraph(".custome_Duration", response);
                }
                else {
                    sample = "";
                    $(".custome_Duration").empty();

                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".custome_Duration").append("svg")
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

function CustomGraph() {





    $('.updated_time').text(new Date().toLocaleString());
    $('.shift').text("N/A");


    var syear = this.start.substr(0, 4);
    var eyear = this.end.substr(0, 4);
    if (syear != eyear && end != '') {
        swal({
            icon: "error",
            title: "Please Select Same Year for Fromdate and Todate...!",
            button: false,
            timer: 4500
        })
        d3.select("svg").remove();
        return;
    }


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
    else if (this.start == '') {
        swal({
            icon: "error",
            title: "Please Provide start date",
            button: false,
            timer: 4500
        })
    }
    else if (this.end == '') {
        swal({
            icon: "error",
            title: "Please Provide End date",
            button: false,
            timer: 4500
        })
    }
    else {
        if (this.start > this.end) {
            swal({
                icon: "error",
                title: "Please Provide Dates correctly...",
                button: false,
                timer: 4500
            })
        }

        var myData = {
            "variant": 'All',
            "line": this.line,
            "Machine": this.machinecode,
            "FromDate": this.start,
            "ToDate": this.end,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;


        $.ajax({
            type: "POST",
            url: URL + 'api/Paretoanalysis/ShiwiseAggreagte',
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
                d3.select(".custome_report svg").remove();
                if (response.status != "Error") {

                    graph(".custome_report", response);
                    DaywiseShiftProductionAjax();
                }
                else {
                    DaywiseShiftProductionAjax();
                    sample = "";
                    $(".custome_report").empty();

                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".custome_report").append("svg")
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



    function DaywiseShiftProductionAjax() {

        var myData = {
            "variant": 'All',
            "line": this.line,
            "Machine": this.machinecode,
            "FromDate": this.start,
            "ToDate": this.end,
            "CompanyCode": this.company,
            "PlantCode": this.plant
        };
        var R_url = this.R_url;
        var user1 = this.user1;

        $.ajax({
            type: "POST",
            url: URL + 'api/Paretoanalysis/DaywiseShiftProduction',
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
                d3.select(".custome_Duration svg").remove();
                if (response.status != "Error") {
                    var s = '<option value="All">All</option>';
                    for (var i = 0; i < response.data.Table1.length; i++) {
                        s += '<option value="' + response.data.Table1[i].variant_code + '">' + response.data.Table1[i].variant_code + "-" + response.data.Table1[i].VariantName + '</option>';
                    }
                    $("#Variant").html(s);

                    Daywisegraph(".custome_Duration", response);
                }
                else {
                    var s = '<option >No Variant</option>';
                    $("#Variant").html(s);
                    sample = "";
                    $(".custome_Duration").empty();

                    var div_width = 400;
                    var div_height = 400;
                    var svg = d3.select(".custome_Duration").append("svg")
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