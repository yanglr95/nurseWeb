
    var patient;
var loadData = false;
$(function () {
    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
    });

    $("#ccWeek").combobox({
        onSelect: WeekChange,
        filter: filterWeek
    });

    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {

            var jsonData = $.parseJSON(data);
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    jsonData[i].Name = "(" + jsonData[i].Bed_No + ")" + jsonData[i].Name;
                }
                $("#ccPatients").combobox('loadData', jsonData);

                var patientid = getSession("Patient_Id");
                if (patientid != null && patientid != "null") {
                    $("#ccPatients").combobox('setValue', patientid);
                    PatientsComboChange();
                } else {
                    setSession(jsonData[0].Patient_id);
                    $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                    PatientsComboChange();
                }
                //   $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                //PatientsComboChange();
            }
        })
    });
    $("[name='week']").linkbutton("disable");
    var patient_id = getUrlParam("patientid");
    var week = getUrlParam("week");
    if (patient_id && week) {
        $("#ccPatients").combobox("setValue", patient_id);
        PatientsComboChange();
        paramLoadWeek(week);

    }
})

function paramLoadWeek(week) {
    if (!loadData) {
        setTimeout("paramLoadWeek(" + week + ")", 500);
    }
    else {
        SelectWeek(week);
    }
}

function PatientsComboChange() {
    loadData = false;
    var patient_id = $("#ccPatients").combobox('getValue');
    $("#imgBTLine").removeAttr("src")
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientInfoByPatientID",
        data: "patientid=" + patient_id,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {
                SetTableValue("tabPatientInfo", jsonData);
                patient = jsonData;
                getWeek();

                removeSession("patient_id");
                setSession(patient_id);
            }
        })
    });
}
function tdDateFormatter(jsonObj) {
    return dateTimeFormatter(new Date(jsonObj.Admission_Date_Time), "yyyy-mm-dd");
}
var totalWeek;
function getWeek() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    $("#ccWeek").combobox('setValue', "");
    $("[name='week']").linkbutton("enable");
    $("#btnWeekPre").linkbutton('disable');
    $("#btnWeekNext").linkbutton('disable');
    totalWeek = 0;

    $.ajax({
        url: BaseData.WebApiUrl + "drawreport/getWeek",
        data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id,
        type: "get",
        success: (function (data) {
            totalWeek = data;
            var weekList = new Array();
            var setweek;
            for (var i = 1; i <= data; i++) 
            {
                weekList.push({ week: i, text: "第" + i + "周" });
                setweek = i;
            }
            $("#ccWeek").combobox('loadData', weekList);
            $("#btnWeekBegin").attr("onclick", " SelectWeek(1)");;
            $("#btnWeekEnd").attr("onclick", " SelectWeek(" + totalWeek + ")");
            loadData = true;
            SelectWeek(setweek);
            //$("#ccWeek").combobox("setValue", setweek);
            //WeekChange();
        })
    });
}
function WeekChange() {
    var week = $("#ccWeek").combobox("getValue");
    $("#imgBTLine").removeAttr("src")
    $.ajax({
        url: BaseData.WebApiUrl + "drawreport/getBodyTemperatureReport",
        data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&week=" + week,
        type: "get",
        success: (function (data) {
            $("#imgBTLine").attr("src", BaseData.PictureUrl + data);

        })
    });
    ChangeWeek(Number(week));
}
function filterWeek(q, row) {
    var opts = $(this).combobox("options");

    return row[opts.textField].indexOf(q) == 1;
}
function ChangeWeek(week) {
    var begin = $("#btnWeekBegin");
    var pre = $("#btnWeekPre");
    var next = $("#btnWeekNext");
    var end = $("#btnWeekEnd");
    $("[name='week']").linkbutton("enable");
    if (week == 1) {
        begin.linkbutton('disable');
        pre.linkbutton('disable');
    }
    if (week == totalWeek) {
        next.linkbutton("disable");
        end.linkbutton("disable");
    }
    if (week > 1) {
        pre.attr("onclick", "SelectWeek(" + (week - 1) + ")");
    }
    if (week < totalWeek) {
        next.attr("onclick", "SelectWeek(" + (week + 1) + ")");
    }

}
function SelectWeek(week) {
    $("#ccWeek").combobox("setValue", week);

    WeekChange();
}
function printImg() {
    if ($("#imgBTLine").attr("src")) {
        printWindow = window.open();
        printWindow.document.body.innerHTML = $("#printDiv").html();
        var week = $("#ccWeek").combobox('getValue');
        $.ajax({
            url: BaseData.WebApiUrl + "drawreport/SavePrintRecord",
            data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&week=" + week,
            type: "get"
        });
        setTimeout(printDelay, 500, printWindow);
    }
}
function printDelay(window)
{
    window.print();
}
//录入体征显示体温单方案1
function showImg() {
    printWindow = window.open('', '_blank');
    printWindow.document.body.innerHTML = $("#printDiv").html();
    $.ajax({
        url: BaseData.WebApiUrl + "drawreport/getWeek",
        data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id,
        type: "get",
        success: (function (data) {
            $.ajax({
                url: BaseData.WebApiUrl + "drawreport/getBodyTemperatureReport",
                data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&week=" + data,
                type: "get",
                success: (function (data) {
                    $(printWindow.document.body).find("img").attr("src", BaseData.PictureUrl + data)
                })
            });
        })
    });
}
//录入体征显示体温单方案2
function showBTLine() {
    window.open('../NursingCare/BTLine.html', '_blank');
}