$('.month-own').datepicker({
    format: "yyyy-mm",
    viewMode: "months",
    endDate: '+0m',
    minViewMode: "months",
    orientation: "bottom"
});
$('.date-own').datepicker({
    minViewMode: 2,
    format: 'yyyy',
    endDate: '+0y',
    startView: 2,
    orientation: "bottom"
});

$(function () {
    var todaydt = new Date();
    todaydt.setDate(todaydt.getDate() - 1);
    $("#start").datepicker({
        autoclose: true,
        endDate: todaydt,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date);
        minDate.setDate(minDate.getDate());
        $('#end').datepicker('setStartDate', minDate);
    });

    $("#end").datepicker({
        autoclose: true,
        endDate: todaydt,
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date);
        minDate.setDate(minDate.getDate() - 1);
        $('#start').datepicker('setEndDate', minDate);
    });
});

$(function () {
    $('#start').keypress(function (event) {
        event.preventDefault();
        return false;
    });
});

$(function () {
    $('#end').keypress(function (event) {
        event.preventDefault();
        return false;
    });
});


 /* Select Machine*/

function SelectMachine(URL2,URL, company, plant, line, R_url, user1)
{

    this.URL2 = URL2;
    this.URL = URL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;
    slectMachine();

}


function slectMachine() {

    if (this.company == "" && this.plant == "" && this.line == "") {
        swal({
            icon: "error",
            title: "Please Select Customer, Plant and Line...!",
            button: true,
            timer: 4500
        })
        return;
    }
    else
        if (this.company == "") {
            swal({
                icon: "error",
                title: "Please Select Customer...!",
                button: true,
                timer: 4500
            })
            return;
        }
        else
            if (this.plant == "") {
                swal({
                    icon: "error",
                    title: "Please Select Plant...!",
                    button: true,
                    timer: 4500
                })
                return;
            }
    if (this.line == "") {
        swal({
            icon: "error",
            title: "Please Select Line...!",
            button: true,
            timer: 4500
        })
        return;
    }
    else {
       

        var myData1 = {
            "Flag": "Subsystem",
            "CompanyCode": this.company,
            "PlantCode": this.plant,
            "LineCode": this.line
        };

        var R_url = this.R_url;
        var user1 = this.user1;
        var URL2 = this.URL2;


        $.ajax({
            type: "POST",
            url: URL2,
            data: myData1,
            dataType: "json",
            success: function (response) {
                var s = '<option value="">Select Machine</option>';


                for (var i = 0; i < response.data.length; i++) {
                    
                    if (response.data.length == 1) {
                        s += '<option value="' + response.data[i].Code + '" selected=selected>' + response.data[i].Name + '</option>';
                    }
                    else {
                        s += '<option value="' + response.data[i].Code + '">' + response.data[i].Code + "-" + response.data[i].Name + '</option>';
                    }
                }
                $("#machinecode").html(s);
               
                $(".record").val(10);
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



/*variant selection*/


document.querySelectorAll('.nav-tabs li').forEach(function (element) {

    element.addEventListener('click', (element) => {

        query_id = element.target.parentElement.getAttribute('id');
        if (query_id == 'custom_report_tab_day' || query_id == 'yearly_report_tab_day' || query_id == 'monthly_report_tab_day') {
            element.target.parentElement.parentElement.parentElement.querySelector('.select-btn').style.display = 'inline-flex';
        } else {
            element.target.parentElement.parentElement.parentElement.querySelector('.select-btn').style.display = 'none';
        }
    });
});



document.getElementById("resetcustom").addEventListener("click", function () {
    $('#start').val('');
    $('#end').val('');
    d3.select(".custome_report svg").remove();
    d3.select(".custome_Duration svg").remove();
})
document.getElementById("resetyear").addEventListener("click", function () {
    $('#year').val('');
    d3.select(".year_report svg").remove();
    d3.select(".year_Duration svg").remove();
})
document.getElementById("resetmonth").addEventListener("click", function () {
    $('#month').val('');
    d3.select(".monthly_report svg").remove();
    d3.select(".monthly_Duration svg").remove();
})




 