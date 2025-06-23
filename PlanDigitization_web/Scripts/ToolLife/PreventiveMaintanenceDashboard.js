
    String.prototype.escape = function () {
        var tagsToReplace = {
        '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return this.replace(/[&<>]/g, function (tag) {
            return tagsToReplace[tag] || tag;
        });
    };



   
        var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
        function Clear()
        {
            $('#linecode').val('');
        $('#subsystem').val('');
        }

    function Viewdetails() {
        var active_tab = $('ul .active').attr("id");
        var linecode = $('#linecode').val();
        var subsystem = $('#subsystem').val();

        $('.line_name').text(linecode);
        $(".custom_pre_error").text('');

         if (linecode == '') {
            swal({
                icon: "error",
                title: "Please Provide Line details",
                button: false,
                timer: 4500
            })
        }
        else if (subsystem == '') {
            swal({
                icon: "error",
                title: "Please Provide Machine details",
                button: false,
                timer: 4500
            })
        }
        else {

            var preData = {
            "Flag": "preventive",
                "linename": linecode,
                "subsystem": subsystem,
                "CompanyCode": '@Session["CompanyCode"]',
                "PlantCode": '@Session["PlantCode"]'
             };
             //var R_url = '@Url.Action("Login", "Main")';
             var R_url = '/Main/Login';
                   var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
                    //$.ajax({
            //    type: 'Get',
            //    url: URL + 'api/UserSettings/GetEmployee',
            //    headers: {
            //        Authorization: 'Bearer ' + user1
            //    },
            //    dataType: 'json'
            //}).success(function (response) {
            $.ajax({
                type: "POST",
                url: URL + 'api/Toollife/GetPreventiveMain',
                headers: {
                    Authorization: 'Bearer ' + user1
                },
                data: preData,
                dataType: "json",
                beforeSend: function () {
                    $('.loading').show();
                },
                complete: function () {
                    $('.loading').hide();
                },
                success: function (response) {
                    var rowsCnt = document.getElementById("custom_preventive").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
                    if (rowsCnt > 0) {
                        for (var i = 0; i < rowsCnt; i++) {
                            document.getElementById("custom_preventive").deleteRow(1);
                        }
                    }
                    if (response.data.length != 0) {
                        $('.updated_time').text(new Date().toLocaleString());
                        $('.shift').text("N/A");

                        var j = 1;
                        for (var i = 0; i < response.data.length; i++) {
                            var newRow = $("<tr>");
                            var cols = '';
                            cols += "<td> " + j + "</td> ";
                            cols += "<td> " + response.data[i].linename + "</td> ";
                            cols += "<td> " + response.data[i].subsystem + "</td> ";
                            cols += "<td> " + response.data[i].element + "</td> ";
                            cols += "<td> " + response.data[i].make + "</td> ";
                            cols += "<td> " + response.data[i].partnumber + "</td> ";
                            cols += "<td> " + response.data[i].classification + " <input type='hidden' id='ToolID' value='" + response.data[i].ToolID + "'> <input type='hidden' id='currentlifecle' value='" + response.data[i].currentusage + "'> </td> ";
                            cols += "<td> <span>" + response.data[i].lastmain + " </span>  <input type='text' class='datepic' id='lastmain' value='" + response.data[i].lastmain + "' name='lastmain' style='display:none;width:80px;'/></td> ";
                            cols += "<td> <span>" + response.data[i].isreplaced + "</span>  <input type='text' id='isreplaced' name='isreplaced' style='display:none;width:80px;' value='" + response.data[i].isreplaced + "'/> </td> ";
                            cols += "<td> <span>" + response.data[i].noofreplace + " </span> <input type='text' id='noofreplace' value='" + response.data[i].noofreplace + "' name='noofreplace' style='display:none;width:80px;'/> </td> ";
                            cols += "<td> " + response.data[i].currentusage + "</td> ";
                            cols += "<td> " + response.data[i].uom + "</td> ";
                            cols += "<td> <span>" + response.data[i].remarks + " </span> <input type='text' id='remarks' value='" + response.data[i].remarks + "' name='remarks' style='display:none;width:80px;'/> </td> ";
                            cols += "<td> <a class='Edit' href='javascript: ; '>Edit</a><a class='Update' href = 'javascript:;' style ='display:none'>Update</a></td > ";
                            cols += "</tr>";
                            newRow.append(cols);
                            $(".custom_preventive").append(newRow);
                            j++;
                        }
                    }
                    else {
                        $(".custom_pre_error").text(response.msg);
                    }
                    //$('#custom_preventive').DataTable({
                    //    "ordering": true,
                    //    "bDestroy": true
                    //});
                },
                error: function (response) {
                    swal({
                        icon: "warning",
                        title: "Session Timeout",
                        button: true,
                        closeModal: false
                    })
                    window.location = R_url;
                }
            });
                    //}).error(function (response) {
            //    swal({
            //        icon: "warning",
            //        title: "Session Timeout",
            //        button: true,
            //        closeModal: false
            //    })
            //    window.location = R_url;
            //});
        }
    }
$("body").on("click", "#custom_preventive .Edit", function () {
    var row = $(this).closest("tr");
    $("td", row).each(function () {
        if ($(this).find("input").length > 0) {
            $(this).find("input").show();
            $(this).find("span").hide();
        }
    });
    row.find(".Update").show();
    $(this).hide();
});

    $("body").on("click", "#custom_preventive .Update", function () {
        var row = $(this).closest("tr");
        $("td", row).each(function () {
            if ($(this).find("input").length > 0) {
                var span = $(this).find("span");
                var input = $(this).find("input");
                span.html(input.val());
                span.show();
                input.hide();
            }
        });
        row.find(".Edit").show();
        row.find(".Cancel").hide();
        $(this).hide();
        var isrepl = row.find("#isreplaced").val();
        alert(isrepl);

        var test1 = /^[A-Z] ?[A-Z]$/i;
        var isrepl1 = test1.test(isrepl);
        alert(isrepl1);

        var myData = {
            "ToolID": row.find("#ToolID").val(),
            "LastMaintenaceDate": row.find("#lastmain").val(),
            "IsReplaced": row.find("#isreplaced").val(),
            "No_of_Replacements": row.find("#noofreplace").val(),
            "Currentusage": row.find("#currentlifecle").val(),
            "Remarks": row.find("#remarks").val(),
            "CompanyCode": '@Session["CompanyCode"]',
            "PlantCode": '@Session["PlantCode"]',
            "LineCode":'@Session["LineCode"]'
        };
        //var R_url = '@Url.Action("Login", "Main")';
        var R_url = '/Main/Login';
                   var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
                    //$.ajax({
            //    type: 'Get',
            //    url: URL + 'api/UserSettings/GetEmployee',
            //    headers: {
            //        Authorization: 'Bearer ' + user1
            //    },
            //    dataType: 'json'
            //}).success(function (response) {
            $.ajax({
                type: "POST",
                url: URL + 'api/Toollife/Addtoolmaintenance',
                headers: {
                    Authorization: 'Bearer ' + user1
                },
                data: myData,
                dataType: "json",
                success: function (response) {
                },

                error: function (response) {
                    swal({
                        icon: "warning",
                        title: "Session Timeout",
                        button: true,
                        closeModal: false
                    })
                    window.location = R_url;
                }
            });
                    //}).error(function (response) {
            //    swal({
            //        icon: "warning",
            //        title: "Session Timeout",
            //        button: true,
            //        closeModal: false
            //    })
            //    window.location = R_url;
            //});
        });
   
   
        $(function () {
        var CompanyCode = '@Session["CompanyCode"]';
        var PlantCode = '@Session["PlantCode"]';
        if (CompanyCode == "" && PlantCode == "") {
            swal({
                icon: "error",
                title: "Please Select Customer and Plant...!",
                button: true,
                timer: 4500
            })
            return;
        }
        else
            if (CompanyCode == "") {
            swal({
                icon: "error",
                title: "Please Select Customer...!",
                button: true,
                timer: 4500
            })
                return;
            }
            else
                if (PlantCode == "") {
            swal({
                icon: "error",
                title: "Please Select Plant...!",
                button: true,
                timer: 4500
            })
                    return;
                }
                else {
                    var URL = '@System.Configuration.ConfigurationManager.AppSettings["url"]';
                    var myData = {
            "Flag": "LineCode",
                        "CompanyCode": '@Session["CompanyCode"]',
                        "PlantCode": '@Session["PlantCode"]',
                    };

                    //var R_url = '@Url.Action("Login", "Main")';
                    var R_url = '/Main/Login';
                    var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
                    //$.ajax({
            //    type: 'Get',
            //    url: URL + 'api/UserSettings/GetEmployee',
            //    headers: {
            //        Authorization: 'Bearer ' + user1
            //    },
            //    dataType: 'json'
            //}).success(function (response) {
            $.ajax({
                type: "POST",
                url: URL + 'api/Toollife/GetSettingdatas',
                headers: {
                    Authorization: 'Bearer ' + user1
                },
                data: myData,
                dataType: "json",
                success: function (response) {
                    var s = '<option value="">Select Line</option>';
                    for (var i = 0; i < response.data.length; i++) {
                        s += '<option value="' + response.data[i].Code + '">' + response.data[i].Name + '</option>';
                    }
                    $("#linecode").html(s);
                },
                //error: function (response) {
                //    swal({
                //        icon: "warning",
                //        title: "Session Timeout",
                //        button: true,
                //        closeModal: false
                //    })
                //    window.location = R_url;
                //}
            });
                        //}).error(function (response) {
            //    swal({
            //        icon: "warning",
            //        title: "Session Timeout",
            //        button: true,
            //        closeModal: false
            //    })
            //    window.location = R_url;
            //});

            //});
        }

    });
   


   
        $('#linecode').on('change', function() {
        //alert(this.value);


            var myData1 = {
            "Flag": "Subsystem",
                        "CompanyCode": '@Session["CompanyCode"]',
                "PlantCode": '@Session["PlantCode"]',
                         "LineCode":this.value,
                    };
            //var R_url = '@Url.Action("Login", "Main")';
            var R_url = '/Main/Login';
                   var user1 = '@Session["Token"]' + ':' + '@Session["UserName"]';
                    //$.ajax({
            //    type: 'Get',
            //    url: URL + 'api/UserSettings/GetEmployee',
            //    headers: {
            //        Authorization: 'Bearer ' + user1
            //    },
            //    dataType: 'json'
            //}).success(function (response) {
            $.ajax({
                type: "POST",
                url: URL + 'api/Toollife/GetSettingdatas',
                headers: {
                    Authorization: 'Bearer ' + user1
                },
                data: myData1,
                dataType: "json",
                success: function (response) {
                    var s = '<option value="">Select Subsystem</option>';
                    for (var i = 0; i < response.data.length; i++) {
                        s += '<option value="' + response.data[i].Code + '">' + response.data[i].Name + '</option>';
                    }
                    $("#subsystem").html(s);
                },
                error: function (response) {
                    swal({
                        icon: "warning",
                        title: "Session Timeout",
                        button: true,
                        closeModal: false
                    })
                    window.location = R_url;
                }
            });
                    //}).error(function (response) {
            //    swal({
            //        icon: "warning",
            //        title: "Session Timeout",
            //        button: true,
            //        closeModal: false
            //    })
            //    window.location = R_url;
            //});
        });



        function exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        // Specify file name
        filename = filename ? filename + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }