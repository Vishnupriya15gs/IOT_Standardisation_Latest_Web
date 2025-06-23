

//<script src="~/assets1/datepicker_normal/datepicker_normal_jquery.min.js"></script>
//<script src="~/assets1/javascripts/swal.js"></script>
//<script src="~/assets1/javascripts/swal_alert.js"></script>
//<script type="text/javascript">
    function Get_line() {
        var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
        var myData = {
            "Flag": "LineCode",
            "CompanyCode": '@Session["CompanyCode"]',
            "PlantCode" : '@Session["PlantCode"]',
        };
         var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
         $.ajax({
            type: "POST",
             url: URL + 'api/Toollife/GetSettingdatas',
             headers: {
                 Authorization: 'Bearer ' + user1
             },
            data: myData,
            dataType: "json",
            success: function (response) {

                if (response.data.length != 0) {
                    $(".Linedata").html('');
                    $('.shift').text("N/A");
                    $('.updated_time').text("N/A");
                    var j = 1;
                    var cols = '';
                    for (var i = 0; i < response.data.length; i++) {
                        cols += "<div class='col-md-3 col-xl-12'>";
                        cols += "<section class='panel'>";
                        cols += '<a style="cursor:pointer;text-decoration:none;" onclick="redirect_page(\'' + response.data[i].Code + '\' )">';
                        cols += "<header class='panel-heading bg-primary'> ";
                        cols += "<h4 class='title'> Line ID : " + response.data[i].Code + "</h4>";
                        cols += "<h4 class='title'> Line Name : " + response.data[i].Name + "</h4>";
                        cols += "</header>";
                        cols += "</a>";
                        cols += "</section>";
                        cols += "</div>";
                        j++;
                    }
                    $(".Linedata").html(cols);
                }
                else {
                    $(".Linedata").empty();
                    $(".Linedata").html('No Data Available');
                }
            },
            error: function (response) {

            }
        });
    }
    $(function () {
        var CompanyCode = '@Session["CompanyCode"]';
        var PlantCode = '@Session["PlantCode"]';
        if (CompanyCode == "" && PlantCode == "")
        {
            swal({
                icon: "error",
                title: "Please Select Customer and Plant...!",
                button: true,
                timer: 4500
            })
            return;
        }
        else if (CompanyCode == "")
        {
            swal({
                icon: "error",
                title: "Please Select Customer...!",
                title: "Please Select Customer...!",
                button: true,
                timer: 4500
            })
            return;
        }
        else if (PlantCode == "")
        {
            swal({
                icon: "error",
                title: "Please Select Plant...!",
                button: true,
                timer: 4500
                })
            return;
        }
        else
        {
            linename();
            Get_line();

        }
    });


    function linename()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('?');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        $("#linename").text(vars);
    }

    function redirect_page(data) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('?');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }


        if (vars == "OEE") {
            window.location = '@Url.Action("OEELiveDashboard", "OEE")?' + data;
        }
        else if (vars == "Operator") {
            window.location = '@Url.Action("OperatorEfficiencyLive", "OperatorEfficiency")?' + data;
        }
        else if (vars == "FirstPass") {
            window.location = '@Url.Action("FirstPassYieldLiveDashboard", "FirstPassYield")?' + data;
        }
        else if (vars == "Toollife") {
            window.location = '@Url.Action("ToolLifeLiveDashboard", "ToolLife")?' + data;
        }
        else if (vars == "Machine") {
            window.location = '@Url.Action("AvailabilityLiveDashboard", "Availability")?' + data;
        }
        else if (vars == "Andon") {
            window.location = '@Url.Action("AndonLive", "Paretoanalysis")?' + data;
        }
        else if (vars == "Hourly") {
            window.location = '@Url.Action("HourlyTrackerLive", "FirstPassYield")?' + data;
        }
         else if (vars == "Quality") {

            window.location = '@Url.Action("QualityLiveDashboard", "Quality")?'+data ;
        }
    }

//</script>

