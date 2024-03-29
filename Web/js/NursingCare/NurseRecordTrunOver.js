﻿var patient;

var menu_id = getUrlParam("menu_id");

$(function () {
    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
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


    var date = new Date();
    $('#txtDate').datebox('setValue', dateFormatter(date));
    $('#NurseName').textbox('setValue', getLoginUser().UserName);
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

                removeSession("patient_id");
                setSession(patient_id);
            }
        })
    });
    InitInputData();
}
function getPulseText(value) {
    return getComboTextByValue("Pulse", value);
}
function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}

function InitInputData() {

    var record_Date = $("#txtDate").datebox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "NurseRecordTrunOver/getNurseRecordTrunOverList",
        data: "patientId=" + patient_id + "&recordDate=" + record_Date,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);

                $("#tbList").datagrid("loadData", jsonData);
            }else{
                $("#tbList").datagrid("loadData", []);
            }
        })
    });
    $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
}
function inputListDateFormatter(date) {
    var showDate = new Date(date.replace(/-/g, "/").replace(/T/g, " "));
    return dateTimeFormatter(new Date(showDate), "hh:mi");
}
function InputListOperateField(value, rowData, rowIndex) {

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + rowData.Patient_id + "\",\"" + rowData.Record_Time + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delInputList(\"" + rowData.Record_Time + "\")' >删除</a>";
    return str;
}

var editID = null;
function editInputList(patientId, RecordTime, obj) {
    clear();
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        // editID = id;
        $.ajax({
            url: BaseData.WebApiUrl + "NurseRecordTrunOver/getNurseRecordTrunOverView",
            data: "patient_id=" + patientId + "&record_time=" + RecordTime,
            type: "get",
            success: (function (data) {
                if (data) {
                    var jsonData = $.parseJSON(data);
                    $("#Drop1").textbox("setValue", jsonData.Drop1);
                    $("#Drop2").textbox("setValue", jsonData.Drop2);
                    $("#Drop3").textbox("setValue", jsonData.Drop3);
                    $("#NurseName").textbox("setValue", jsonData.Nurse_Name);
                    $("#Skin_Damage").textbox("setValue", jsonData.Skin_Damage);
                    var date = new Date(jsonData.Record_Time);
                    $("#dtInput").timespinner("setValue", inputListDateFormatter(jsonData.Record_Time));
                    $(obj).html("取消");
                }
            })
        });
    }
    else {
        editID = null;
        $(obj).html("编辑");
        clear();
        $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    }
}
function delInputList(RecordTime) {
    editID = null;
    $.ajax({
        url: BaseData.WebApiUrl + "NurseRecordTrunOver/delNurseRecordTrunOver",
        data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&record_time=" + RecordTime,
        type: "get",
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                InitInputData();
                clear();
                $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
            }
        })
    });
}

//清除复选框
function clear() {
    $("#Drop1").combobox('setValue', "");
    $("#Drop2").combobox('setValue', "");
    $("#Drop3").combobox('setValue', "");
    $('#NurseName').textbox('setValue', getLoginUser().UserName);
    $("#Skin_Damage").textbox('setValue', "");
}
function saveData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var postData = "";

    var record_Date = $("#txtDate").datebox("getValue");
    var record_time = record_Date + " " + $("#dtInput").timespinner("getValue");
    var postData = "";
    postData += '{';
    postData += '"Id":' + editID + ',';
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Record_Date":"' + record_Date + '",';
    postData += '"Record_Time":"' + record_time + '",';
    postData += '"Skin_Damage":"' + $("#Skin_Damage").textbox("getValue") + '",';
    postData += '"Drop1":"' + $("#Drop1").combobox("getValue") + '",';
    postData += '"Drop2":"' + $("#Drop2").combobox("getValue") + '",';
    postData += '"Drop3":"' + $("#Drop3").combobox("getValue") + '",';
    postData += '"Nurse_Name":"' + $("#NurseName").textbox("getValue") + '"';
    postData += "}";
    postData = "[" + postData + "]";
    $.ajax({
        url: BaseData.WebApiUrl + "NurseRecordTrunOver/saveNurseRecordTrunOver",
        type: "POST",
        data: { '': postData },
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                InitInputData();
                clear();
            }
        })
    });
}
function getScore() {
    var score = 0;
    var list = $("#tbTable").find("input[name='Factor']");
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
            score = score + parseInt($(list[i]).parent().nextAll()[0].innerHTML.substring(0, 1));
        }
    }
    return score;
}
function print() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    window.open(BaseData.WebApiUrl + "print/printNurseRecordTrunOverReport?patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id);
}