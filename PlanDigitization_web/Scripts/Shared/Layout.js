 function isNumberKey(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode != 46 && charCode > 31
                && (charCode < 48 || charCode > 57))
                return false;
            return true;
        }
        function alphaOnly(evt) {
            var key = (evt.which) ? evt.which : event.keyCode
            if ((key >= 65 && key <= 90) || (key > 96 && key < 123) || key == 8)
                return true;
            return false;
        };


    var modal, loading;
        function ShowProgress() {
        modal = document.createElement("DIV");
            modal.className = "modal";
            document.body.appendChild(modal);
            loading = document.getElementsByClassName("loading")[0];
            loading.style.display = "block";
            var top = Math.max(window.innerHeight / 2 - loading.offsetHeight / 2, 0);
            var left = Math.max(window.innerWidth / 2 - loading.offsetWidth / 2, 0);
            loading.style.top = top + "px";
            loading.style.left = left + "px";
        };
        ShowProgress();
        function disableBack() {window.history.forward()}
        window.onpageshow = function (evt) { if (evt.persisted) disableBack() }
        window.onload = function () {
        disableBack();
            setTimeout(function () {
        loading.style.display = "none";
            }, 2000);
        };

    $(function () {
            var UserID = '@Session["UserID"]';
             var ll = '@Session["lastlogin"]';
            //alert(ll);
            $('#lastlogin').text('Last Login:'+ll);
            if (UserID == '' || UserID == null) {
        window.location = '@Url.Action("Login", "Main")';
            }
            $("body").on('click keypress', function () {
                if (UserID == '' || UserID == null) {
        window.location = '@Url.Action("Login", "Main")';
                }
               // ResetThisSession();
            });
        });
      var url1 = '@Url.Action("Login", "Main")';
      var timeInSecondsAfterSessionOut = 3600; // change this to change session time out (in seconds).
            var secondTick = 0;

            function ResetThisSession() {
        secondTick = 0;
            }

            //function StartThisSessionTimer() {
            //secondTick++;
            //var timeLeft = ((timeInSecondsAfterSessionOut - secondTick) / 60).toFixed(0); // in minutes
            //timeLeft = timeInSecondsAfterSessionOut - secondTick; // override, we have 30 secs only

            //    $("#spanTimeLeft").html(timeLeft);

            //    if (secondTick > timeInSecondsAfterSessionOut)
            //    {
            //        clearTimeout(tick);
            //        window.location = url1;
            //        return;
            //    }
            //    tick = setTimeout("StartThisSessionTimer()", 1000);
            //}
        //StartThisSessionTimer();

function Select_Customer() {
    var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
    var session_customer = '@Session["CompanyCode"]';
    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';

    $('#licustomer').show();

    var R_url = '@Url.Action("Login", "Main")';
    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
    //$('#liplant').hide();
    var myDatas = {
        "Flag": "Get_Customer",
        "CompanyCode": ""
    };
    $.ajax({
        type: "POST",
        url: URL + 'api/Toollife/GetSettingdatas',
        headers: {
            Authorization: 'Bearer ' + user1
        },
        data: myDatas,
        headers: {
            Authorization: 'Bearer ' + user1
        },
        dataType: "json",
        success: function (response1) {
            var s = '<option value="">Select Customer</option>';
            for (var i = 0; i < response1.data.length; i++) {
                if (response1.data[i].Code == session_customer) {
                    s += '<option value="' + response1.data[i].Code + '" selected=selected>' + response1.data[i].Name + '</option>';
                }
                else {
                    s += '<option value="' + response1.data[i].Code + '">' + response1.data[i].Name + '</option>';
                }
            }
            $("#CompanyCode").html(s);
        },
        error: function (response1) {

            swal({
                icon: "warning",
                title: "Session Timeout",
                button: true,
                closeModal: false
            })
            window.location = '@Url.Action("Login", "Main")';
        }
    })

}



function Choose_Plant() {
    var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
    var Company = $('#CompanyCode').val();

    var R_url = '@Url.Action("Login", "Main")';
    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';

    $('#liplant').hide();
    $.ajax({
        type: "POST",
        url: '@Url.Action("Set_CompanyCode", "UserSettings")',
        data: '{id: ' + JSON.stringify(Company) + '}',
        headers: {
            Authorization: 'Bearer ' + user1
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //window.location.reload();
        },
        error: function (response) {

        }
    }).error(function (response) {
        swal({
            icon: "warning",
            title: "Session Timeout",
            button: true,
            closeModal: false
        })
        window.location = R_url;
    });

    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';

    var myData = {
        "Flag": "Get_Plant",
        "CompanyCode": Company,
    };
    $.ajax({
        type: "POST",
        url: URL + 'api/Toollife/GetSettingdatas',
        headers: {
            Authorization: 'Bearer ' + user1
        },
        data: myData,
        headers: {
            Authorization: 'Bearer ' + user1
        },
        dataType: "json",
        success: function (response) {
            var s = '<option value="">Select Plant</option>';
            for (var i = 0; i < response.data.length; i++) {
                s += '<option value="' + response.data[i].Code + '">' + response.data[i].Name + '</option>';
            }
            $("#PlantCode").html(s);

            var PlantCode = $('#PlantCode').val();
            $.ajax({
                type: "POST",
                url: '@Url.Action("Set_PlantCode", "UserSettings")',
                data: '{id: ' + JSON.stringify(PlantCode) + '}',
                headers: {
                    Authorization: 'Bearer ' + user1
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    window.location = '@Url.Action("Dashboard", "Main")';
                },
                error: function (response) {
                }
            }).error(function (response) {
                swal({
                    icon: "warning",
                    title: "Session Timeout",
                    button: true,
                    closeModal: false
                })
                window.location = R_url;
            });
        },
        error: function (response) {

        }
    });

    // $('#liplant').show();

}


function select_plant() {
    var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
    var PlantCode = $('#PlantCode').val();

    var R_url = '@Url.Action("Login", "Main")';
    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';

    $.ajax({
        type: "POST",
        url: '@Url.Action("Set_PlantCode", "UserSettings")',
        data: '{id: ' + JSON.stringify(PlantCode) + '}',
        headers: {
            Authorization: 'Bearer ' + user1
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            window.location.reload();
        },
        error: function (response) {
        }
    }).error(function (response) {
        swal({
            icon: "warning",
            title: "Session Timeout",
            button: true,
            closeModal: false
        })
        window.location = R_url;
    });
    $('#liplant').show();
}


$(function () {
    var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
    var Role = '@Session["Role"]';
    var Company = '@Session["CompanyCode"]';
    var PlantCode = '@Session["PlantCode"]';
    var IsSuperAdmin = '@Session["IsSuperAdmin"]';
    var IsAdmin = '@Session["IsAdmin"]';

    var R_url = '@Url.Action("Login", "Main")';
    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';

    if (Company != '' && IsSuperAdmin == true) {
        var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
        $('#licustomer').show();
        var myDatas = {
            "Flag": "Get_Customer",
            "CompanyCode": ""
        };
        $.ajax({
            type: "POST",
            url: URL + 'api/Toollife/GetSettingdatas',
            headers: {
                Authorization: 'Bearer ' + user1
            },
            data: myDatas,
            headers: {
                Authorization: 'Bearer ' + user1
            },
            dataType: "json",
            success: function (response1) {
                var s = '<option value="">Select Customer</option>';
                for (var i = 0; i < response1.data.length; i++) {
                    if (response1.data[i].Code == Company) {
                        s += '<option value="' + response1.data[i].Code + '" selected=selected>' + response1.data[i].Name + '</option>';
                    }
                    else {
                        s += '<option value="' + response1.data[i].Code + '">' + response1.data[i].Name + '</option>';
                    }
                }
                $("#CompanyCode").html(s);
            },
            error: function (response1) {

            }
        }).error(function (response) {
            swal({
                icon: "warning",
                title: "Session Timeout",
                button: true,
                closeModal: false
            })
            window.location = R_url;
        });
    }

    if (IsAdmin == true || PlantCode != '' || Company != '') {
        $('#liplant').show();
        var myData = {
            "Flag": "Get_Plant",
            "CompanyCode": Company,
        };
        var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
        $.ajax({
            type: "POST",
            url: URL + 'api/Toollife/GetSettingdatas',
            headers: {
                Authorization: 'Bearer ' + user1
            },
            data: myData,
            headers: {
                Authorization: 'Bearer ' + user1
            },
            dataType: "json",
            success: function (response) {
                var s = '<option value="">Select Plant</option>';
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].Code == PlantCode) {
                        s += '<option value="' + response.data[i].Code + '" selected=selected>' + response.data[i].Name + '</option>';
                    }
                    else {
                        s += '<option value="' + response.data[i].Code + '">' + response.data[i].Name + '</option>';
                    }
                }

                $("#PlantCode").html(s);
            },
            error: function (response) {
            }
        }).error(function (response) {
            swal({
                icon: "warning",
                title: "Session Timeout",
                button: true,
                closeModal: false
            })
            window.location = R_url;
        });
    }
});
   