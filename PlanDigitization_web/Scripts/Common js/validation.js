


function validateInput(input, id) {
    const value = input.value;

    if (value == "") {
        document.getElementById(id).textContent = "";
        return;
    }



    if (id == "errormsg1") {
        const numericRegex = new RegExp(/^\d*\.?\d*$/);
        const intValue = parseFloat(value);
        if (!numericRegex.test(value)) {

            input.value = value.replace(/[^\d.]/g, '');
            document.getElementById(id).textContent = "Special Character not allow";
        } else
            if (isNaN(intValue)) {
                document.getElementById(id).textContent = "Enter Proper Number";

                input.value = value.slice(0, 1);

            }
            else if (intValue > 15) {
                document.getElementById(id).textContent = "Enter Count between 0 - 15";

                input.value = Math.min(15, intValue);


            } else
                if (intValue < 0) {
                    document.getElementById(id).textContent = "Enter Count between 0 - 15";
                    input.value = value.slice(0, 2);
                }
                else {
                    document.getElementById(id).textContent = "";
                }
    }
    else
        if (id == "errormsg2") {



            const numericRegex = new RegExp(/^\d*\.?\d*$/);
            const intValue = parseFloat(value);
            if (!numericRegex.test(value)) {

                input.value = value.replace(/[^\d.]/g, '');
                document.getElementById(id).textContent = "Special Character not allow";
            } else
                if (isNaN(intValue)) {
                    document.getElementById(id).textContent = "Enter Proper Number";

                    input.value = value.slice(0, 1);

                }
                else if (intValue > 100) {
                    document.getElementById(id).textContent = "Enter Percentage between 0-100";

                    input.value = Math.min(100, intValue);


                } else
                    if (intValue < 0) {
                        document.getElementById(id).textContent = "Enter Percentage between 0-100";
                        input.value = value.slice(0, 2);
                    }
                    else {
                        document.getElementById(id).textContent = "";
                    }




        }
        else
            if (id == "errormsg3") {
                const numericRegex = new RegExp('^[0-9]+$');
                const intValue = parseInt(value);
                if (isNaN(intValue)) {
                    document.getElementById(id).textContent = "Enter Proper Number";

                    input.value = value.slice(0, 0);
                }
                else
                    if (!numericRegex.test(value)) {
                        input.value = value.slice(0, 0);
                        document.getElementById(id).textContent = "Special Character not allow";
                    } else
                        if (intValue > 15) {
                            document.getElementById(id).textContent = "Enter Count between 0-15";

                            input.value = Math.min(15, intValue);


                        } else
                            if (intValue < 0) {
                                document.getElementById(id).textContent = "Enter Count between 4-15";
                                
                            }
                            else {
                                document.getElementById(id).textContent = "";
                            }
            }

}


var invalidChars = ["-", "e", "+", "E"];

$("input[type='number']").on("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
})


function Reset2() {
    $("#offset").val('');
    $("#per").val('');
    $("#Count").val('');
    d3.select(".Range_chart_customwise svg").remove();


}

