
//const { auto } = require("@popperjs/core");

function FactoryKPIIndex(URL, sURL, company, plant, line, R_url, user1) {
    this.URL = URL;
    this.sURL = sURL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;

    carouselMachine();
}

//Carousel
function carouselMachine() {
    var machine = 5;

    //$.getScript("../Scripts/d3.min.js");

    var URL = this.sURL;

    var R_url = this.R_url;
    var user1 = this.user1;

    var myData = {
        CompanyCode: this.company,
        PlantCode: this.plant,
        /*"LineCode": this.line,*/
    };

    $.ajax({
        type: "POST",
        url: URL + "api/OEE/Get_FactoryKPI_data",
        headers: {
            Authorization: "Bearer " + user1,
        },
        data: myData,
        dataType: "json",
        success: function (response) {
            
            var ItemNo = response.data.Table.length / 2;
            var ajaxResult = [];

            var cols = "";
            var cols_btn = "";
            var cols_status = [];

            let machine_no = 0;

            for (let i = 0; i < ItemNo; i++) {
               // console.log("ItemNo" + ItemNo + "i" + i + "machine_no " + machine_no);
                if (i == 0) {
                    cols += "<div class='item active item_" + i + "' id='darkg'>";
                } else {
                    cols += "<div class='item item_" + i + "' id='darkg'>";
                }

                cols += "<div class='panel panel-default panel0' id='darkg'>";
                cols += "<div class='panel-body panel0_body' id='darkg' style='padding-top: 5px;'>";
                cols += "<div class='row' id='darkg'>";
                cols += "<div class='col-md-12' id='darkg'>";
                cols += "<div class='row' style='color:white;' id='darkg'>";

                for (let jj = 0; jj < 2; jj++) {

                    if (machine_no < response.data.Table.length) {
                       // console.log(`loop1--> i1:${i} ItemNo:${ItemNo} jj1:${jj} machineno:${machine_no} length:${response.data.Table.length}`);
                        var Line = response.data.Table[machine_no].FunctionID;

                        var myData = {
                            CompanyCode: company,
                            PlantCode: plant,
                            LineCode: Line,
                        };

                        //   console.log(Line);

                        $.ajax({
                            type: "POST",
                            url: URL + "api/OEE/getoeeutilization",
                            data: myData,
                            async: false,
                            headers: {
                                Authorization: "Bearer " + user1,
                            },
                            dataType: "json",
                            beforeSend: function () {
                                $(".loading").show();
                            },
                            complete: function () {
                                $(".loading").hide();
                            },
                            success: function (response2) {

                                var response1 = response;
                                if (response2.data.Table != null || response2.status != "Error" )
                                    ajaxResult.push(response2.data);
                                else
                                    ajaxResult.push(null);

                                var machine_nos = machine_no + 1;
                                var machine_no1 = machine_no;
                                var MTTR = "-";
                                var Min = "";
                                if (response2.status != "Error") {
                                    if (response2.data.Table[0].MTTR != 0) {
                                        MTTR = response2.data.Table[0].MTTR;
                                        Min = "mins";
                                    }

                                    var MTBF = "-";
                                    var Min_MTBF = "";
                                    if (response2.data.Table[0].MTBF != 0) {
                                        MTBF = response2.data.Table[0].MTBF;
                                        Min_MTBF = "mins";
                                    }
                                }     //   console.log(response2.data.Table[0]);

                                

                                if (response2.data.Table == null || response2.status == "Error" )
                                {

                                  

                                   
                                    cols += `<div class='col-md-6'>
				  <section class='panel panel1'   style = 'box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;' >
				  <header class='panel-heading' style='padding: 6px !important; color:black; '>
					  <div class='row'>
						  <div class='col-md-12 fontSanserif titleTooltipLine'  >
                                                               
                                                                 
																<span  style='color:black;  font-weight:bold;'  >Line ${machine_nos} - ${response1.data.Table[machine_no].FunctionName}  </span>
 <li class="breadcrumb-item titleTooltip">
                                                                <i style='color:grey;' class="fa fa-bar-chart-o pointer "  onclick="get_tooltipline('${response1.data.Table[machine_no].FunctionID}');"></i> 	
															      <span class="tooltiptext3">Line Details </span>  
															</li>
                             
                               
                       
                            <div class="right-wrapper pull-right">
                                
							  <ol class="breadcrumb">
                                
								  <li class="breadcrumb-item titleTooltip">
                                   
								     <a href="#" onclick='get_selected_line("${response.data.Table[machine_no].FunctionID}")' >
                                      <i class="fa fa-arrow-right text-muted pointer" ></i> 
											<span class="tooltiptext">Main Dashboard</span> 
									  </a>
								  </li>
							  </ol>
						  </div>
                            <div id=' ' class='machineBatchcode' style='height:22px;'> 
						  </div>
					  </div>
				  </header>
				  <div class='panel-body' style='color:black'>
					  <div class='row'>
              
						  <div class='col-md-4'>
                                      
							  <div  style='border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-left: 0px; '>
								 
								  <div class='row'>
									  <center>
										  <div class='widget_${machine_nos} carouselWidget oee'></div>
									  </center>
								  </div>
								  
							  </div>
						  </div>
						  <div class='col-md-12 ' id='bm'>
                            
							  <div class=' productionCard prodCardMargin'>
                                
								  <div class='row ' id='bm' style='font-size: 9px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
									  
								  </div>
								  <div class='row ' id='bm' style='font-size: 9px; margin-top: 1%; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
										  <h4  style='text-align:center;' ><b>No Data Available</b></h4>  
								  </div>
								  <div class='row zoom' id='bm' style='font-size: 9px; margin-top: 1%; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
                                      
									 
									  <div id='utli_overview_${machine_no1}' style='height:101px;display:none;'></div>
								  
								  </div>
							  </div>
						  </div>
					  </div>
					    <div class="statusbar_flex status_bar_flex_${machine_no1}"></div>
				  </div>
				  </section>
			  </div>`;


                                  
                                    machine_no++;


                                }
                                else
                                    if (response2.status != "Error") {


                                        //console.log("Variantname before:", response2.data.Table[0].Variantname);
                                        var Variantname = 'Unknown Variant';
                                        if (response2.data.Table[0].Variantname == null) {
                                            response2.data.Table[0].Variantname = Variantname;
                                        }
                                        else
                                            response2.data.Table[0].Variantname;
                                        //console.log("Variantname after:", Variantname);
                                        //console.log("TCT before:", response2.data.Table[0].TCT);
                                        var TCT = '-';
                                        if ((response2.data.Table[0].TCT != (0.00 || null))) {

                                            response2.data.Table[0].TCT = response2.data.Table[0].TCT + "s"; //0.02 s
                                        }
                                        else
                                            response2.data.Table[0].TCT = TCT; // "-" if value if less than 0.001
                                //console.log("TCT after:", TCT);


                                      
                                        cols += `<div class='col-md-6'>
				  <section class='panel panel1'   style = 'box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;' >
				  <header class='panel-heading' style='padding: 6px !important; color:black; '>
					  <div class='row'>
						  <div class='col-md-12 fontSanserif titleTooltipLine'  >
                                                               
                                                                 
																<span  style='color:black;  font-weight:bold;'  >Line ${machine_nos} - ${response1.data.Table[machine_no].FunctionName}  </span>
 <li class="breadcrumb-item titleTooltip">
                                                                <i style='color:grey;' class="fa fa-bar-chart-o pointer "  onclick="get_tooltipline('${response1.data.Table[machine_no].FunctionID}');"></i> 	
															      <span class="tooltiptext3">Line Details </span>  
															</li>
                             
                               
                       
                            <div class="right-wrapper pull-right">
                                
							  <ol class="breadcrumb">
                                
								  <li class="breadcrumb-item titleTooltip">
                                   
								     <a href="#" onclick='get_selected_line("${response.data.Table[machine_no].FunctionID}")' >
                                      <i class="fa fa-arrow-right text-muted pointer" ></i> 
											<span class="tooltiptext">Main Dashboard</span> 
									  </a>
								  </li>
							  </ol>
						  </div>
                            <div id=' ' class='machineBatchcode' style='font-size:9px'> Batch Code : ${response2.data.Table[0].Batch_code}
						  </div>
					  </div>
				  </header>
				  <div class='panel-body' style='color:black'>
					  <div class='row'>
						  <div class='col-md-4 kpiCard'>

							  <div class='col-md-12' style='border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-left: 0px; '>
								  <div class='row'>
									  <div class='col-md-12' >
										  <div style='font-size :9px;margin-top:10px;margin-bottom:10px;color:grey';'shift_label'>SHIFT&nbsp;
											  <span style='font-size:18px; color:black;vertical-align: bottom;'> ${response2.data.Table[0].Shift_ID} </span>
										  </div>
									  </div>
								  </div>
								  <div class='row'>
									  <center>
										  <div class='widget_${machine_nos} carouselWidget oee'></div>
									  </center>
								  </div>
								  <div class='row' id='bm' style='font-size: 9px;'>
									  <div class='container'>
										  <progress style='width: 7%;' id='file' value=${response2.data.Table[0].Availability} max='100'></progress>&nbsp;&nbsp;
										  <span style="font-size:12px"><b>A-</b>
											  <span style='font-size:12px;'>${response2.data.Table[0].Availability}%</span>
										  </span>
										  <br />
										  <progress style='width: 7%;' id='file' value=${response2.data.Table[0].Performance} max='100'></progress>&nbsp;&nbsp;
										  <span style="font-size:12px"><b>P-</b>
											  <span style='font-size:12px;'>${response2.data.Table[0].Performance}%</span>
										  </span>
										  <br />
										  <progress style='width: 7%;' id='file' value=${response2.data.Table[0].Quality} max='100'></progress>&nbsp;&nbsp;
										  <span style="font-size:12px"><b>Q-</b>
											  <span style='font-size:12px;'>${response2.data.Table[0].Quality}%</span>
										  </span>
									  </div>
								  </div>
							  </div>
						  </div>
						  <div class='col-md-8 productionCard' id='bm'>
                            
							  <div class='col-md-12 productionCard prodCardMargin'>
                                
								  <div class='row ' id='bm' style='font-size: 9px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
									  <div style='padding:6px;'>
										  <div class='col-md-3 '>
											  <div class='row'>
												  <div class='col-md-12 '>
													  <div class='col-md-4 nopadding'>
														  <span style='color:grey'>OK</span>
													  </div>
													  <div class='col-md-8 noRpadding'>
														  <span style='font-size:15px;color:black;'>${response2.data.Table[0].OK_Parts}</span>
													  </div>
												  </div>
											  </div>
											  <div class='row'>
												  <div class='col-md-12'>
													  <div class='col-md-4 nopadding'>
														  <span style='color:grey'>NOK</span>
													  </div>
													  <div class='col-md-8 noRpadding'>
														  <span style='font-size:15px;color:black;'>${response2.data.Table[0].NOK_Parts}</span>
													  </div>
												  </div>
											  </div>
										  </div>
										  <div class='col-md-6'>
											  <div class='row centreText'>
												  <span style='color:grey;'>VARIANT</span>
											  </div>
											  <div class='row centreText'>
												  <span style='font-size:13px;color:black;'>${response2.data.Table[0].Variantname}
												  </span>
											  </div>
                                              
											  <div class="mycontent-left"> </div>
										  </div>
										  <div class='col-md-3'>
											  <div class='row'>
												  <div class='col-md-12 '>
													  <div class='col-md-4 nopadding'>
														  <span style='color:grey'>CT</span>
													  </div>
													  <div class='col-md-8 noRpadding'>
														  <span style='font-size:15px;color:black;'>${response2.data.Table[0].CT}s
														  </span>
													  </div>
												  </div>
											  </div>
											  <div class='row'>
												  <div class='col-md-12 '>
													  <div class='col-md-4 nopadding'>
														  <span style='color:grey'>TCT</span>
													  </div>
													  <div class='col-md-8 noRpadding'>
														  <span style='font-size:15px;color:black;'>${response2.data.Table[0].TCT}</span>
													  </div>
												  </div>
											  </div>
										  </div>
									  </div>
								  </div>
								  <div class='row ' id='bm' style='font-size: 9px; margin-top: 1%; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
										  <div style='padding:6px;'>
											  <div class='col-md-4 centreText'>
												  <ul class="notifications">
													  <li class="titleTooltip">
														  <a href="#" class="dropdown-toggle notification-icon" data-toggle="dropdown">
															  <i class="fa fa-bell"></i>
															  <span class="badge">${response2.data.Table[0].livealarm_count}</span>
															  <span class="tooltiptext">Total Stoppage : ${response2.data.Table[0].no_of_stoppage}</br>
                                                                                        Live Alarms  : ${response2.data.Table[0].livealarm_count}
                                                              </span>
														  </a>
													  </li>
												  </ul>
											  </div>
											  <div class='col-md-4'>
												  <div class='row centreText'>
													  <span style='color:grey'>MTTR</span>
												  </div>
												  <div class='row centreText'>
													  <span style='font-size:15px;'>${MTTR} </span>
											            <span style='font-size:10px;'>${Min} </span>
												  </div>
											  </div>
											  <div class='col-md-4'>
												  <div class='row centreText'>
													  <span style='color:grey'>MTBF</span>
												  </div>
												  <div class='row centreText'>
													  <span style='font-size:15px;'>${MTBF}</span>
													    <span style='font-size:10px;'>${Min_MTBF}</span>
													 
												  </div>
                                                            
											  </div>
										  </div>
								  </div>
								  <div class='row zoom' id='bm' style='font-size: 9px; margin-top: 1%; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; margin-right: 0px; '>
									  <div class='col-md-12'>
									  <div id='utli_overview_${machine_no1}' style='height:101px;'></div>
								  </div>
								  </div>
							  </div>
						  </div>
					  </div>
					    <div class="statusbar_flex status_bar_flex_${machine_no1}"></div>
				  </div>
				  </section>
			  </div>`;
                                        // console.log("var" + response2.data.Table[0].Variantname);
                                        //                      for (var i = 0; i < response2.data.Table1.length; i++) {



                                        //                          cols_status[machine_no] += `<div class='flex-item-status_bar_box titleTooltip_status' id="carouselStatusBar${response1.data.Table[machine_no].FunctionID+i+1}" style='margin: 5px;height: 50px;min-width: 88px;text-align: center;border-radius: 5px;color: black;'>
                                        //<label id="statusbar_hov" style="font-weight: bold;">${response2.data.Table1[i].Machine_code}</label><br> 
                                        //<label id="okpart_id" style="font-size: 19px;">${response2.data.Table1[i].OK_Parts}</label>/
                                        //                                          <label id="nok_id">${response2.data.Table1[i].NOK_Parts}</label>
                                        //   <span class="tooltiptext_status" id="statusbar_toltip${response1.data.Table[machine_no].FunctionID+i + 1}"></span>
                                        //                                      </div>`;
                                        //                          console.log(machine_no + " " + cols_status[machine_no]);
                                        //                      }

                                        var data = [
                                            {
                                                name: "Production Time",
                                                value: response2.data.Table[0].Uptime,
                                            },
                                            {
                                                name: "Loss Time",
                                                value: response2.data.Table[0].Losstime,
                                            },
                                            {
                                                name: "Down Time",
                                                value: response2.data.Table[0].Downtime,
                                            },
                                            {
                                                name: "Break Time",
                                                value: response2.data.Table[0].Breaktime,
                                            },
                                        ];

                                        var totalCal =
                                            response2.data.Table[0].Uptime +
                                            response2.data.Table[0].Losstime +
                                            response2.data.Table[0].Downtime +
                                            response2.data.Table[0].Breaktime;
                                        var text = "";
                                        var width = 90;
                                        var height = 90;
                                        var thickness = 20;
                                        var duration = 750;
                                        var padding = 2;
                                        var opacity = 0.8;
                                        var opacityHover = 1;
                                        var otherOpacityOnHover = 0.8;
                                        var tooltipMargin = 2;

                                        var radius = Math.min(width, height) / 2;
                                        var color = d3.scaleOrdinal([
                                            "#87c300",
                                            "#fac316 ",
                                            "#f31212",
                                            "#3d85c6",
                                        ]);

                                        var svg = d3
                                            .select(
                                                "#utli_overview_" +
                                                response2.data.Table[0].Machine_code
                                            )
                                            .append("svg")
                                            .attr("class", "pie")
                                            .attr("width", width)
                                            .attr("height", height)
                                            .style("margin-top", "18px")
                                            .style("margin-left", "5px");

                                        var g = svg
                                            .append("g")
                                            .attr(
                                                "transform",
                                                "translate(" + height / 2 + "," + height / 2 + ")"
                                            );

                                        var arc = d3.arc().innerRadius(0).outerRadius(radius);

                                        var pie = d3
                                            .pie()
                                            .value(function (d) {
                                                return d.value;
                                            })
                                            .sort(null);

                                        var path = g
                                            .selectAll("path")
                                            .data(pie(data))
                                            .enter()
                                            .append("g")
                                            .append("path")
                                            .attr("d", arc)
                                            .attr("fill", (d, i) => color(i))
                                            .style("opacity", opacity)
                                            .style("stroke", "white")

                                            .on("mouseout", function (d) {
                                                d3.select("svg")
                                                    .style("cursor", "none")
                                                    .select(".tooltip")
                                                    .remove();
                                                d3.selectAll("path").style("opacity", opacity);
                                            })
                                            .on("touchstart", function (d) {
                                                d3.select("svg").style("cursor", "none");
                                            })
                                            .each(function (d, i) {
                                                this._current = i;
                                            });

                                        let legend = d3
                                            .select(
                                                "#utli_overview_" +
                                                response2.data.Table[0].Machine_code
                                            )
                                            .append("div")
                                            .attr("class", "legend1")
                                            .style("margin-top", "-105px");


                                        legend
                                            .append("text")
                                            .text("UTILISATION")
                                            .style("color", "grey")
                                            .style("font-size", "10px");

                                        let keys = legend
                                            .selectAll(".key")
                                            .data(data)
                                            .enter()
                                            .append("div")
                                            .attr("class", "key")
                                            .style("display", "flex")
                                            .style("align-items", "center")
                                            .style("height", "13px")
                                            .style("margin-right", "40px");

                                        keys
                                            .append("div")
                                            .attr("class", "symbol")
                                            .style("height", "7px")
                                            .style("width", "7px")
                                            .style("margin", "0px 10px 1px 1px")
                                            .style("background-color", (d, i) => color(i));

                                        keys
                                            .append("div")
                                            .attr("class", "name")
                                            .text(
                                                (d) =>
                                                    `${d.name} - ${d.value} (mins) - ${Math.round(
                                                        (d.value * 100) / totalCal
                                                    )}%`
                                            );

                                        keys.exit().remove();

                                        machine_no++;

                                    } else {
                                        //$(".Historic_details").empty();
                                        //$(".Historic_details").append(response.msg);
                                    }
                            },
                            error: function (response2) {
                                if (response2.status == "401") {
                                    swal({
                                        icon: "warning",
                                        title: "Session Expired",
                                        button: true,
                                        closeModal: false,
                                    });
                                    window.location = R_url;
                                } else {
                                    swal({
                                        icon: "warning",
                                        title: response2.responseText,
                                        button: true,
                                        closeModal: false,
                                    });
                                }
                            },
                        });


                    }

                }



                cols += "</div>";
                cols += "</div>";
                cols += "</div>";
                cols += "</div>";
                cols += "</div>";
                cols += "</div>";

                let ii = 2;
                if (i == 0) {
                    cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Machine Status Bar  Line 1 - 2' class='active' id="slide_nav_button"></li>`;
                } else {
                    var st1 = i + ii;
                    var st2 = i + (ii + 1);

                    cols_btn += `<li data-target='#myCarousel' data-slide-to='${i}' title='Machine Status Bar  Line ${st1} - ${st2}' class='car_nav_list_${i}' id="slide_nav_button"></li>`;

                }
            }

            $(".item_div").html(cols);

            $("#carousel_btn").html(cols_btn);







            let machine_no1 = 0;
            for (let i1 = 0; i1 < ItemNo; i1++) {


                for (let jj1 = 0; jj1 < 2; jj1++) {



                    //console.log(`loop2--> i1:${i1} ItemNo:${ItemNo} jj1:${jj1}`);
                    // console.log("iteam"+i1+"jj1" + jj1 + "machine_no1" + machine_no1);

                    //   console.log("ajaxResult[i1]" + ajaxResult.length);

                    // if (machine_no1 < ajaxResult[i1].Table.length) {


                    if (machine_no1 < ajaxResult.length) {
                        var cols_status = "";
                        //console.log("gffjhgkh" + ajaxResult[machine_no1].Table1.length);
                        if (ajaxResult[machine_no1] != null ) {
                            for (var mac = 0; mac < ajaxResult[machine_no1].Table1.length; mac++) {



                                cols_status += `<div class='flex-item-status_bar_box titleTooltip_status machine_status_bars' id="carouselStatusBar${response.data.Table[machine_no1].FunctionID + mac + 1}" style='margin: 5px;height: 50px;min-width: 88px;width:fit-content;text-align: center;border-radius: 5px;color: black;'>
														<label id="statusbar_hov" style="font-weight: bold;">${ajaxResult[machine_no1].Table1[mac].AssetName}</label><br> 
														<label id="okpart_id" class="${ajaxResult[machine_no1].Table1[mac].OK_Parts}">
    ${ajaxResult[machine_no1].Table1[mac].OK_Parts}
</label>/
                                                        <label id="nok_id" class="${ajaxResult[machine_no1].Table1[mac].NOK_Parts}">
    ${ajaxResult[machine_no1].Table1[mac].NOK_Parts}
</label>
													    <span class="tooltiptext_status" id="statusbar_toltip${response.data.Table[machine_no1].FunctionID + mac + 1}"></span>
                                                    </div>`;
                                // console.log(machine_no + " " + cols_status[machine_no]);
                            }





                            $(".status_bar_flex_" + machine_no1).html(cols_status);

                            //-----------Utilization Chart-----------------//

                            var data = [
                                {
                                    name: "Production Time",
                                    value: ajaxResult[machine_no1].Table[0].UpTime,
                                },
                                {
                                    name: "Loss Time",
                                    value: ajaxResult[machine_no1].Table[0].LossTime,
                                },
                                {
                                    name: "Down Time",
                                    value: ajaxResult[machine_no1].Table[0].DownTime,
                                },
                                {
                                    name: "Break Time",
                                    value: ajaxResult[machine_no1].Table[0].BreakTime,
                                },
                            ];

                            var totalCal =
                                ajaxResult[machine_no1].Table[0].UpTime +
                                ajaxResult[machine_no1].Table[0].LossTime +
                                ajaxResult[machine_no1].Table[0].DownTime +
                                ajaxResult[machine_no1].Table[0].BreakTime;
                            var text = "";
                            var width = 90;
                            var height = 90;
                            var thickness = 20;
                            var duration = 750;
                            var padding = 2;
                            var opacity = 0.8;
                            var opacityHover = 1;
                            var otherOpacityOnHover = 0.8;
                            var tooltipMargin = 2;

                            var radius = Math.min(width, height) / 2;
                            var color = d3.scaleOrdinal([
                                "#87c300",
                                "#fac316 ",
                                "#f31212",
                                "#3d85c6",
                            ]);

                            var svg = d3
                                .select(
                                    //"#utli_overview_" +
                                    //ajaxResult[machine_no1].Table[0].Machine_code
                                    "#utli_overview_" +
                                    machine_no1
                                )
                                .append("svg")
                                .attr("class", "pie")
                                .attr("width", width)
                                .attr("height", height)
                                .style("margin-top", "18px")
                                .style("margin-left", "5px");

                            var g = svg
                                .append("g")
                                .attr(
                                    "transform",
                                    "translate(" + height / 2 + "," + height / 2 + ")"
                                );

                            var arc = d3.arc().innerRadius(0).outerRadius(radius);

                            var pie = d3
                                .pie()
                                .value(function (d) {
                                    return d.value;
                                })
                                .sort(null);

                            var path = g
                                .selectAll("path")
                                .data(pie(data))
                                .enter()
                                .append("g")
                                .append("path")
                                .attr("d", arc)
                                .attr("fill", (d, i) => color(i))
                                .style("opacity", opacity)
                                .style("stroke", "white")

                                .on("mouseout", function (d) {
                                    d3.select("svg")
                                        .style("cursor", "none")
                                        .select(".tooltip")
                                        .remove();
                                    d3.selectAll("path").style("opacity", opacity);
                                })
                                .on("touchstart", function (d) {
                                    d3.select("svg").style("cursor", "none");
                                })
                                .each(function (d, i) {
                                    this._current = i;
                                });

                            let legend = d3
                                .select(
                                    "#utli_overview_" +
                                    machine_no1
                                )
                                .append("div")
                                .attr("class", "legend1");

                            legend
                                .append("text")
                                .text("UTILISATION")
                                .style("color", "grey")
                                .style("font-size", "13px");

                            let keys = legend
                                .selectAll(".key")
                                .data(data)
                                .enter()
                                .append("div")
                                .attr("class", "key")
                                .style("display", "flex")
                                .style("align-items", "center")
                                .style("height", "13px")
                                .style("font-size", "11px")
                                .style("margin-right", "40px");

                            keys
                                .append("div")
                                .attr("class", "symbol")
                                .style("height", "7px")
                                .style("width", "7px")
                                .style("margin", "0px 10px 1px 1px")
                                .style("background-color", (d, i) => color(i));

                            keys
                                .append("div")
                                .attr("class", "name")
                                .text(
                                    (d) =>
                                        `${d.name} - ${d.value} (mins) - ${Math.round(
                                            (d.value * 100) / totalCal
                                        )}%`
                                );

                            keys.exit().remove();

                            //-----------Circular Bar Chart-----------------//

                            function radialProgress(selector, labelText) {
                                const parent = d3.select(selector);

                                const size = {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    height: 117,
                                    width: 117,
                                    x: 10,
                                    y: 10,
                                };

                                d3.select(selector + " svg").remove();
                                const svg = parent
                                    .append("svg")
                                    .attr("width", 199)
                                    .attr("height", 199);

                                const outerRadius =
                                    Math.min(size.width, size.height) * 0.45; //radius
                                const thickness = 8; //bar thickness
                                let value = 0;

                                const mainArc = d3
                                    .arc()
                                    .startAngle(0)
                                    .endAngle(Math.PI * 2)
                                    .innerRadius(outerRadius - thickness)
                                    .outerRadius(outerRadius);

                                svg
                                    .append("path")
                                    .attr("class", "progress-bar-bg")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2})`
                                    )
                                    .attr("d", mainArc());

                                const mainArcPath = svg
                                    .append("path")
                                    .attr("class", "progress-bar")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2})`
                                    );

                                svg
                                    .append("circle")
                                    .attr("class", "progress-bar")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2
                                        })`
                                    )
                                    .attr("width", thickness)
                                    .attr("height", thickness)
                                    .attr("r", thickness / 2);

                                const end = svg
                                    .append("circle")
                                    .attr("class", "progress-bar")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2
                                        })`
                                    )
                                    .attr("width", thickness)
                                    .attr("height", thickness)
                                    .attr("r", thickness / 2);

                                let percentLabel = svg
                                    .append("text")
                                    .attr("class", "progress-label")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2 - size.height / 25
                                        })`
                                    )
                                    .text("0");
                                let percentLabel1 = svg
                                    .append("text")
                                    .attr("class", "progress-label1")
                                    .attr(
                                        "transform",
                                        `translate(${size.width / 2},${size.height / 2 + size.height / 6
                                        })`
                                    )
                                    .text("0");
                                return {
                                    update: function (progressPercent) {
                                        //console.log(progressPercent);
                                        const startValue = value
                                        const startAngle = Math.PI * startValue / 50
                                        const angleDiff = Math.PI * progressPercent / 50 - startAngle;
                                        const startAngleDeg = startAngle / Math.PI * 180
                                        const angleDiffDeg = angleDiff / Math.PI * 180
                                        const transitionDuration = 1500

                                        mainArcPath
                                            .transition()
                                            .duration(transitionDuration)
                                            .attrTween("d", function () {
                                                return function (t) {
                                                    mainArc.endAngle(startAngle + angleDiff * t);
                                                    return mainArc();
                                                }
                                            })
                                        end
                                            .transition()
                                            .duration(transitionDuration)
                                            .attrTween('transform', function () {
                                                return function (t) {
                                                    return (
                                                        `translate(${size.width / 2},${size.height / 2
                                                        })` +
                                                        `rotate(${startAngleDeg + angleDiffDeg * t})` +
                                                        `translate(0,-${outerRadius - thickness / 2})`
                                                    );
                                                };
                                            });
                                        percentLabel
                                            .transition()
                                            .duration(transitionDuration)
                                            .tween("bla", function () {
                                                return function (t) {
                                                    percentLabel.text(
                                                        Math.round(
                                                            startValue +
                                                            (progressPercent - startValue) * t
                                                        ) + " %"
                                                    );
                                                    percentLabel1.text(labelText);
                                                };
                                            });
                                        value = progressPercent;
                                        //console.log(progressPercent)
                                        //console.log("value:" + value);
                                        //console.log("startAngle:" + startAngle);
                                        //console.log(Math.PI * startValue / 50);
                                        //console.log("angleDiff:" + angleDiff);
                                        //console.log(Math.PI * progressPercent / 50 - startAngle);
                                        //console.log("startAngleDeg:" + startAngleDeg);
                                        //console.log(startAngle / Math.PI * 180);
                                        //console.log("angleDiffDeg:" + angleDiffDeg);
                                        //console.log(angleDiff / Math.PI * 180);

                                    }
                                }
                            }

                            let chart = radialProgress(
                                ".widget_" + (machine_no1 + 1),
                                "OEE"
                            );
                            let progress = ajaxResult[machine_no1].Table[0].OEE;
                            let state = 0;

                            //console.log("progress:" + progress[state] + ":" + progress + ":" + state);
                            chart.update(progress);
                            state = (state + 1) % progress.length;

                            // console.log(ajaxResult[machine_no1].Table[0].OEE);


                        }
                    }

                    machine_no1++;
                    // }
                   

                }
            }

            for (var index = 0; index < ajaxResult.length; index++) {

                if (ajaxResult[index] != null) {

                    for (var machine_count = 0; machine_count < ajaxResult[index].Table1.length; machine_count++) {


                        var machineStatusColor = '';
                        var machineStatusText = '';
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == "0") {
                            machineStatusColor = '#f31212';
                            machineStatusText = 'M/C under Error';
                        }
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == '1') {
                            machineStatusColor = '#82CD47';
                            machineStatusText = 'M/C Running';
                        }
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == '2') {
                            machineStatusColor = '#FFD93D';
                            machineStatusText = 'Machine is Idle/Loss';
                        }
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == '3') {
                            machineStatusColor = '#FFD93D';
                            machineStatusText = 'Machine is Idle/Loss';
                        }
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == '4') {
                            machineStatusColor = '#5B8FB9';
                            machineStatusText = 'Planned Break';
                        }
                        if (ajaxResult[index].Table1[machine_count].Machine_Status == '5') {
                            machineStatusColor = '#D8D8D8';
                            machineStatusText = 'PLC disconnect with Gateway';
                        }

                        // console.log('carouselStatusBar' + (response.data.Table[0].FunctionID + machine_count + 1));

                        //  console.log(machineStatusColor);
                        // var carouselMachineStatus = document.getElementById('carouselMachineStatus' + (machine_count+1));
                        // console.log(carouselMachineStatus);
                        var carouselStatusBar = document.getElementById('carouselStatusBar' + (response.data.Table[index].FunctionID + machine_count + 1));
                        //console.log(carouselStatusBar);
                        //var carouselMachineStatusText = document.getElementById('carouselMachineStatusText' + (machine_count+1));
                        var statusbarToolTip = document.getElementById('statusbar_toltip' + (response.data.Table[index].FunctionID + machine_count + 1));

                        // carouselMachineStatus.style.color = machineStatusColor;
                        // carouselMachineStatusText.innerHTML = machineStatusText;
                        
                        
                        carouselStatusBar.style.backgroundColor = machineStatusColor;
                        //var variantName = ajaxResult[index].Table1[machine_count].Variant;
                        var Variantname = 'Unknown Variant';
                        if (ajaxResult[index].Table1[machine_count].Variant == null) {
                            ajaxResult[index].Table1[machine_count].Variant =Variantname ;
                        }
                        else
                            ajaxResult[index].Table1[machine_count].Variant;
                        //var tooltipText = (variantName !== null ? ("Variant: " + variantName) : ("Variant: Unknown Variant"));
                        //statusbarToolTip.innerHTML = tooltipText;
                        statusbarToolTip.innerHTML = "Variantname : " + ajaxResult[index].Table1[machine_count].Variant + "<br>" + "Status : <b>" + machineStatusText + "</b><br>OEE : " + ajaxResult[index].Table1[machine_count].OEE + " %</b><br>Batch : " + ajaxResult[index].Table1[machine_count].batch + " </b>";


                    }

                }
               
            }







        },
        error: function (response) {
            if (response.status == "401") {
                swal({
                    icon: "warning",
                    title: "Session Timeout",
                    button: true,
                    closeModal: false,
                });
                window.location = R_url;
            } else {
                swal({
                    icon: "warning",
                    title: response.responseText,
                    button: true,
                    closeModal: false,
                });
            }
        },
    });

    setTimeout(carouselMachine, 60000);
}

function get_tooltipline(FunctionID) {
    var URL = this.sURL;
    //console.log(FunctionID);
    var R_url = this.R_url;
    var user1 = this.user1;
    var company = this.company;
    var plant = this.plant;

    var myData = {
        CompanyCode: company,
        PlantCode: plant,
        LineCode: FunctionID,
    };

    $.ajax({
        type: "POST",
        url: URL + "api/OEE/get_tooltipline",
        headers: {
            Authorization: "Bearer " + user1,
        },
        data: myData,
        dataType: "json",
        success: function (response) {
            //console.log(response.data.Table[0]);
            var myData1 = {
                CompanyCode: company,
                PlantCode: plant,
                LineCode: FunctionID,
            };

            $.ajax({
                type: "POST",
                url: URL + "api/OEE/get_tooltipline1",
                headers: {
                    Authorization: "Bearer " + user1,
                },
                data: myData1,
                dataType: "json",
                success: function (response1) {
                    // console.log(response1);

                    $("#myModal1").modal("show");

                    if (response.status != "Error" && response1.status != "Error") {
                        const j = 0;
                        var rowsCnt = document
                            .getElementById("datatable-default")
                            .getElementsByTagName("tbody")[0]
                            .getElementsByTagName("tr").length;
                        if (rowsCnt > 0) {
                            for (var i = 0; i < rowsCnt; i++) {
                                document.getElementById("datatable-default").deleteRow(1);
                            }
                        }
                        if ($.fn.DataTable.isDataTable("#datatable-default")) {
                            $("#datatable-default").DataTable().clear();
                        }

                        if ($.fn.DataTable.isDataTable("#datatable-default")) {
                            $("#datatable-default").DataTable().destroy();
                        }

                        $(".rejection_error").empty();

                        for (var jj = 0; jj < response.data.Table.length; jj++) {
                            var newRow = $("<tr>");
                            var cols = "";
                            //cols +=
                            //    "<td style='width:50px;text-align:center;'> " + j + "</td> ";
                            cols +=
                                "<td style='text-align:center;'> " +
                                response.data.Table[jj].Dept_Name +
                                "</td> ";
                            cols +=
                                "<td style='text-align:center;'> " +
                                response.data.Table[jj].Area_Name +
                                "</td> ";
                            //cols +=
                            //    "<td style='text-align:center;'> " +
                            //    response.data.Table[jj].No_of_users +
                            //    "</td> ";
                            //cols +=
                            //    "<td style='text-align:center;'> " +
                            //    response1.data.Table[jj].EOL +
                            //    "</td> ";
                            cols +=
                                "<td style='text-align:center;'> " +
                                response1.data.Table[jj].EOL_Name +
                                "</td> ";
                            cols +=
                                "<td style='text-align:center;'> " +
                                response1.data.Table[jj].Total_Variant +
                                "</td> ";
                            cols +=
                                "<td style='text-align:center;'> " +
                                response1.data.Table[jj].Total_Station +
                                "</td> ";

                            cols += "</tr>";
                            newRow.append(cols);
                            $(".Historic_details").append(newRow);
                            j++;
                        }

                        $("#datatable-default").DataTable({
                            responsive: true,
                            scrollY: "50vh",
                            autoWidth: false,
                        });
                    } else {
                        var rowsCnt = document
                            .getElementById("datatable-default")
                            .getElementsByTagName("tbody")[0]
                            .getElementsByTagName("tr").length;
                        if (rowsCnt > 0) {
                            for (var i = 0; i < rowsCnt; i++) {
                                document.getElementById("datatable-default").deleteRow(1);
                            }
                        }
                        if ($.fn.DataTable.isDataTable("#datatable-default")) {
                            $("#datatable-default").DataTable().clear();
                        }

                        if ($.fn.DataTable.isDataTable("#datatable-default")) {
                            $("#datatable-default").DataTable().destroy();
                        }
                        $(".rejection_error").text(response.msg);
                    }
                },
                error: function (response) {
                    if (response.status == "401") {
                        swal({
                            icon: "warning",
                            title: "Session Timeout",
                            button: true,
                            closeModal: false,
                        });
                        window.location = R_url;
                    } else {
                        swal({
                            icon: "warning",
                            title: response.responseText,
                            button: true,
                            closeModal: false,
                        });
                    }
                },
            });
        },
    });
   // setTimeout(carouselMachine, 60000);
}

function get_selected_line(FunctionID) {

    var URL = this.URL;
    var LineCode = FunctionID;


    var R_url = this.R_url;
    var user1 = this.user1;

    $.ajax({
        type: "POST",
        url: '../UserSettings/Set_LineCode',
        /* @Url.Action("Set_LineCode", "UserSettings") ',*/
        data: '{id: ' + JSON.stringify(LineCode) + '}',
        headers: {
            Authorization: 'Bearer ' + user1
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //console.log('MDB');
            window.location = '../MainDashboard/MainDashboard';
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

    $('#liline').show();
}

$(document).ready(function () {
    $('#my-dataTables').DataTable({
        paging: false,
        ordering: false,
        info: false,
    });

    // Removes icon 
    $('.sorting_asc').removeClass('sorting_asc');
});

