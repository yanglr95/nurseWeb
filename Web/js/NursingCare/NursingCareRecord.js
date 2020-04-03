var patient;

var menu_id = getUrlParam("menu_id");

$(function () {
    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
    });
    $("#VitalSigns").combobox({
        onSelect: VitalRecordTime,
        editable: false
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
                //       $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                //      PatientsComboChange();

                var patientid = getSession("Patient_Id");
                if (patientid != null && patientid != "null") {
                    $("#ccPatients").combobox('setValue', patientid);
                    PatientsComboChange();
                } else {
                    setSession(jsonData[0].Patient_id);
                    $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                    PatientsComboChange();
                }
            }
        })
    });

    $("#comboTemplate").combobox({
        onSelect: function () {
            var value = $("#comboTemplate").combobox("getValue");
            var text = $("#txtMeasure").textbox("getValue");
            $("#txtMeasure").textbox("setValue", text + value);
        },
        valueField: 'Dict_Name',
        textField: 'Dict_Code',
    });

    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getSysDict/",
        data: "type=护理记录其他选项",
        type: "get",
        success: (function (data) {

            var jsonData = $.parseJSON(data);
            if (jsonData != null) {
                $("#comboTemplate").combobox("loadData", jsonData);
            }
            $("#comboTemplate").combobox("setValue", "模板选择");

        })
    });

    var date = new Date();
    $('#txtDate').datebox('setValue', dateFormatter(date));
    $("#comboSpecialChar").combobox({
        onSelect: function () {
            var value = $("#comboSpecialChar").combobox("getValue");
            var text = $("#txtMeasure").textbox("getValue");
            $("#txtMeasure").textbox("setValue", text + value);
        }
    });
    $("#comboSpecialChar").combobox("loadData", CommonData.SpecialChar);
    $("#comboSpecialChar").combobox("setValue", "符号选择");
    $("#btnSaveInput").click(saveData);
    $("#btnQuery").click(InitInputData);
})
function PatientsComboChange() {
    patient_id = $("#ccPatients").combobox('getValue');
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientInfoByPatientID",
        data: "patientid=" + patient_id,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {
                patient = jsonData;
                SetTableValue("tabPatientInfo", jsonData);
                $.session.set('patientData', JSON.stringify(patient));
                removeSession("patient_id");
                setSession(patient_id);
                InitInputData();
            }
        })
    });

}
function getPulseText(value) {
    return getComboTextByValue("Pulse", value);
}
function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}
function InitInputData() {

    var recording_Date = $("#txtDate").datebox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getNurseCareList",
        data: "patient_id=" + patient_id + "&recording_Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseCareList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseCareList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
    InitEventData();
    InitTableData(null);
    $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
}
function inputListDateFormatter(date) {
    var showDate = new Date(date.replace(/-/g, "/").replace(/T/g, " "));
    //var hour = showDate.getHours() + showDate.getTimezoneOffset() / 60;

    //if (hour < 0) {

    //    hour = hour + 24;
    //}
    //showDate = showDate.setHours(hour);
    return dateTimeFormatter(new Date(showDate), "hh:mi");
}
function InputListOperateField(value, rowData, rowIndex) {

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + value + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delInputList(\"" + value + "\")' >删除</a>";
    return str;
}

var editID = null;
function editInputList(id, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        editID = id;
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getNurseCareView",
            data: "id=" + id,
            type: "get",
            success: (function (data) {
                if (data) {
                    var jsonData = $.parseJSON(data);
                    InitTableData(jsonData);
                    var date = new Date(jsonData.Time_Point);
                    $("#dtInput").timespinner("setValue", inputListDateFormatter(jsonData.Time_Point));
                    $(obj).html("取消");
                }
            })
        });
    }
    else {
        editID = null;
        $(obj).html("编辑");
        InitTableData(null);
        $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    }
}
function delInputList(id) {
    editID = null;
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/delNurseCareView",
        data: "id=" + id,
        type: "get",
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                InitInputData();
                InitTableData(null);
                $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
                $("#VitalSigns").combobox("setValue", "");
            }
        })
    });
}
function InitTableData(jsonData) {
    InitComboData($("#tbNursingCare"), jsonData);
    InitNumberBoxData($("#tbNursingCare"), jsonData);

    if (jsonData && "Measure" in jsonData) {
        $("#txtMeasure").textbox("setValue", jsonData["Measure"]);
    }
    else {
        $("#txtMeasure").textbox("setValue", null);
    }
}
function InitNumberBoxData(parentObj, data) {
    $(parentObj).find(".easyui-numberbox[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        if (data) {
            for (var s in bodyChart) {
                var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
                var length = JsonPro.length;
                if (p.substr(0, length).toLowerCase() == JsonPro) {
                    $(obj).numberbox("setValue", data[p.substr(length)]);
                }
            }
        }
        else {
            $(obj).numberbox("setValue", null);
        }
    });
}
function saveData() {
    var measure = $("#txtMeasure").textbox("getValue").trim();
    var VitalSigns = $("#VitalSigns").combobox("getValue").trim();
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    if (VitalSigns.length == 0 && measure.length == 0) {
        $.messager.alert("提示", "没有要保存的数据！");
        return;
    }
    var postData = "";

    var recording_Date = $("#txtDate").datebox("getValue");
    var time_point = recording_Date + " " + $("#dtInput").timespinner("getValue");
    var postData = "";
    postData += '{';
    postData += '"Id":' + editID + ',';
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Recording_Date":"' + recording_Date + '",';
    postData += '"Time_Point":"' + time_point + '",';
    if (VitalSigns.length > 0) {
        var xyhigh = ""; var xylow = "";
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].Vital_Signs == "体温") {
                postData += '"Temperature":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "脉搏") {
                postData += '"Pulse":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血压high") {
                postData += '"Systolic_Pressure":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血压Low") {
                postData += '"Diastolic_Pressure":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "意识") {
                postData += '"Consciousness":"' + jsonData[i].Units + '",';
            } else if (jsonData[i].Vital_Signs == "呼吸") {
                postData += '"Breath":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血氧") {
                postData += '"SPO2H":"' + jsonData[i].Vital_Signs_Values + '",';
            }
        }
    }
    postData += '"Measure":"' + measure + '"';
    postData += "}";
    postData = "[" + postData + "]";
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/saveNurseCareView",
        type: "POST",
        data: { '': postData },
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                InitInputData();
            }
        })
    });
}

//查询病人的体温时间数据
function InitEventData() {
    var recording_Date = $("#txtDate").datebox("getValue");
    var patient_id = patient.Patient_id;
    var strselect = " distinct to_char(t.time_point,'HH24:mi') Vital_Signs ";//没有合适的字段，用Vital_Signs_Values暂时用这个代替
    var strwhere = " t.patient_id='" + patient_id + "' and t.recording_date = to_date('" + recording_Date + "','yyyy-mm-dd') and trim(vital_signs) in ('体温','脉搏','血压Low','血压high','呼吸','意识','血氧')";
    $.ajax({
        url: BaseData.WebApiUrl + "bodychart/getVital",
        data: "strwhere=" + strwhere + "&strselect=" + strselect,
        type: "get",
        success: (function (data) {

            var jsonData = $.parseJSON(data);

            if (!jsonData) {
                jsonData = { total: 0, rows: [] };
            } else {
                jsonData.unshift({ 'Vital_Signs': '', 'Vital_Signs': '' });
            }
            $("#VitalSigns").combobox('loadData', jsonData);
        })
    });
}
//获取病人一个时间点的体征数据
function VitalRecordTime() {
    var patient_id = patient.Patient_id;
    var time = $("#VitalSigns").combobox("getValue");
    var strselect = " *  ";
    var strwhere = " t.patient_id='" + patient_id + "' and to_char(t.time_point,'HH24:mi')='" + time + "' and trim(vital_signs) in ('体温','脉搏','血压Low','血压high','呼吸','意识','血氧')";
    $.ajax({
        url: BaseData.WebApiUrl + "bodychart/getVital",
        data: "strwhere=" + strwhere + "&strselect=" + strselect,
        type: "get",
        success: (function (data) {

            jsonData = $.parseJSON(data);
        })
    });
}

function print() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    // window.open(BaseData.WebApiUrl + "print/printNurseCareReport?patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id);
    var WinPrint = window.open('../Print/GeneralNurse.html?patient_id=' + patient.Patient_id + "&visit_id=" + patient.Visit_id);

}