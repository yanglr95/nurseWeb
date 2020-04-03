var patient;
var patient_id;
var AttrName = "nurse_adverse";
var JsonPro = "vital_sign:";
var strP_ACCESSRECORD_ID = 0;
var NurseRecordEvlDefaultValues = {
    BGFSData: [{ text: "主动上报", value: "1" },
          { text: "被动上报", value: "2" }]
}

$(function () {

    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
    });
    var date = new Date();
    $('#txtDate').datebox('setValue', dateFormatter(date));
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {
            if (data != "null") {
                var jsonData = $.parseJSON(data);
                if (jsonData) {
                    for (var i = 0; i < jsonData.length; i++) {
                        jsonData[i].Name = "(" + jsonData[i].Bed_No + ")" + jsonData[i].Name;
                    }
                    $("#ccPatients").combobox('loadData', jsonData);
                    if (patient_id) {
                        $("#ccPatients").combobox('setValue', patient_id);
                        PatientsComboChange();
                    }
                    var patientid = getSession("Patient_Id");
                    if (patientid != null && patientid != "null") {
                        $("#ccPatients").combobox('setValue', patientid);
                        PatientsComboChange();
                    } else {
                        setSession(jsonData[0].Patient_id);
                        $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                        PatientsComboChange();
                    }
                    loadNurseRecordAdverseReportData(jsonData[0].Patient_id, jsonData[0].Visit_id);
                }
            }
        })
    });

    $("#BGFS1").combobox("loadData",NurseRecordEvlDefaultValues.BGFSData);

    $("#tbts").click(function () {
        $("#T1").toggle()
    })

    $("#btnSave").click(saveInputData);
    loadDate();
    getweek();
});

//加载默认日期
function loadDate()
{
    var date = new Date();
    $('#SBSJ').datebox('setValue', dateFormatter(date));
    $('#txtTBRQ').datebox('setValue', dateFormatter(date));
}

function getweek()
{
    $("#FSSJ").datebox({
        onChange: function (date, oldValue) {
            $("#FSSJXQ").textbox("setValue", getweekday(date));
        }
    });
}

//格式化报告方式
function FormatterSBFS(value, Rowdata, rowIndex)
{
    for (var i = 0; i < NurseRecordEvlDefaultValues.BGFSData.length; i++) {
        if (NurseRecordEvlDefaultValues.BGFSData[i].value == value || NurseRecordEvlDefaultValues.BGFSData[i].text == value) {
            return NurseRecordEvlDefaultValues.BGFSData[i].text;
        }
    }
}

function loadNurseRecordAdverseReportData(Patient_id, Visit_id)
{
    InitEasyUIInputData($("#inputTabs"), null);
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getAdverseReportList",
        data: "patient_id=" + Patient_id + "&VISIT_ID=" + Visit_id,
        type: "get",
        success: (function (data) {
            if (data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseRecordAdverseReportList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordAdverseReportList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    })
}

function PatientsComboChange() {
    patient_id = $("#ccPatients").combobox('getValue');
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientInfoByPatientID",
        data: "patientid=" + patient_id,
        type: "get",
        success: (function (data) {
            if (data != "null") {
                var jsonData = $.parseJSON(data);
                if (jsonData) {
                    patient = jsonData;
                    SetTableValue("tabPatientInfo", jsonData);
                  
                    removeSession("patient_id");
                    setSession(patient_id);

                    $("#DEPT_NAME").text(patient.Dept_name)
                    loadNurseRecordAdverseReportData(patient.Patient_id, patient.Visit_id);
                }
            }
        })
    })
}

function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}

function formatterTime(value, Rowdata, rowIndex) {
    return value.substring(0, 10)
}

function InputListOperateField(value, rowData, rowIndex) {
    var patient_id = rowData.Patient_id;
    var Visit_id = rowData.Visit_id;
    var record_time = rowData.Fssj;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >删除</a>";
    return str;
}

//编辑
function editInputList(patient_id, Visit_id, record_time, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getAdverseReportList",
            data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
            type: "get",
            success: (function (data) {
                if (data != "null") {
                    var jsonData = $.parseJSON(data);

                    $("#BGFS1").combobox("setValue", jsonData[0].Bgfs);
                    $("#JSFSJDAY").textbox("setValue", jsonData[0].Jsfsjday);
                    $("#JSFSJHR").textbox("setValue", jsonData[0].Jsfsjhr);
                    $("#SBSJ").datebox("setValue", jsonData[0].Sbsj);

                    $("#FSSJ").datebox("setValue", jsonData[0].Fssj);

                    $("#FXRGZSJ").datebox("setValue", jsonData[0].Fxrgzsj);
                    $("#GLXZTIME").datebox("setValue", jsonData[0].Glxztime);
                    $("#HLBTIME").datebox("setValue", jsonData[0].Hlbtime);
                    
                    $("#txtKZRQZ").textbox("setValue", jsonData[0].Kzrqz);
                    $("#txtBFHSZQZ").textbox("setValue", jsonData[0].Bfhszqz);

                    InitEasyUIInputData($("#inputTabs"), jsonData[0]);
                    $("#checks").find("input[" + AttrName + "]").each(function (index, obj) {
                        var strName = $(obj).attr("id").replace("txt", "");
                        setDataList(jsonData[0], strName);
                    });
                }
                $(obj).html("取消");
            })
        });
    }
    else {
        $(obj).html("编辑");
        clearEditInfo();
    }
}

//删除数据
function delData(patient_id, Visit_id, record_time, obj)
{
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "NurseCare/deleteNurseRecordAdverseReport",
                data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
                type: "get",
                success: (function (data) {
                    clearEditInfo();
                    loadNurseRecordAdverseReportData(patient_id, Visit_id);
                })
            });
        }
    })
}

//拼接复选框
function GetDataList(o) {
    var value = "";
    var eles = $("#inputTabs").find("input[name='" + o + "']");
    for (var index = 0; index < eles.length; index++) {
        if (eles[index].checked) {
            value = value + eles[index].value + "|";
        }
    }
    return value;
}

//清除复选框
function clearEditInfo() {
    $("#JSFSJDAY").textbox("setValue", "");
    $("#JSFSJHR").textbox("setValue", "");
    $("#FSSJ").datebox("setValue","");
    $("#FXRGZSJ").datebox("setValue", "");
    $("#txtKZRQZ").textbox("setValue", "");
    $("#txtBFHSZQZ").textbox("setValue", "");

    $("#FXRGZSJ").datebox("setValue", "");
    $("#GLXZTIME").datebox("setValue", "");
    $("#HLBTIME").datebox("setValue", "");

    InitEasyUIInputData($("#inputTabs"), null);

    $("#inputTabs").find("input[type='checkbox']").each(function (inputIndex) {
        $(this).prop("checked", false);
        $(this).removeAttr("checked");
        strVar = $(this).attr("id");
        $("#" + strVar).removeClass("ui-checkbox-on");
        $("#" + strVar).addClass("ui-checkbox-off");
    });
}

//绑定复选框
function setDataList(jsonData, strName) {
    var Name =strName; //strName.toUpperCase();
    for (var data in jsonData) {
        var Strvalue = jsonData[data];
        if (data == Name) {
            $("#inputTabs").find("input[name='" + strName + "']").each(function (index, obj) {
                if ($(this).attr("type") == "checkbox" && Strvalue != null) {
                    if (Strvalue.indexOf($(this).attr("title")) != -1) {
                        document.getElementById($(this).attr("id")).checked = true;
                        var strVar = $(this).attr("id");
                        strVar = "lb" + strVar.replace("chk", "");
                        $("#" + strVar).removeClass("ui-checkbox-off");
                        $("#" + strVar).addClass("ui-checkbox-on");
                    }
                }
            })
        }
    }
}

function GetCheckboxValues() {
    //班次
    var BC = GetDataList("Bc");
    $("#txtBc").textbox("setValue", BC);
    //发 现 人
    var FXR = GetDataList("Fxr");
    $("#txtFxr").textbox("setValue", FXR);
    //事件发生时病人所处的地点
    var SJFSDD = GetDataList("Sjfsdd");
    $("#txtSjfsdd").textbox("setValue", SJFSDD);
    //事件发生前病人的状态
    var SJFSZT = GetDataList("Sjfszt");
    $("#txtSjfszt").textbox("setValue", SJFSZT);
    //服务层次
    var FWCC = GetDataList("Fwcc");
    $("#txtFwcc").textbox("setValue", FWCC);
    //环节
    var HJ = GetDataList("Hj");
    $("#txtHj").textbox("setValue", HJ);
    //事件发生后病人损害的结果
    var SHJG = GetDataList("Shjg");
    $("#txtShjg").textbox("setValue", SHJG);
    //立即通知的人员
    var LJTZRY = GetDataList("Ljtzry");
    $("#txtLjtzry").textbox("setValue", LJTZRY);
    //可能相关因素
    var XGYS = GetDataList("Knxgys");
    $("#txtKnxgys").textbox("setValue", XGYS);
}

//保存数据
function saveInputData()
{
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    GetCheckboxValues();

    var postData = "";
    postData += '{';
    
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Dept_name":"' + patient.Dept_name + '",';
    postData += '"SEX":"' + patient.Sex + '",';
    postData += '"AGE":"' + patient.Age + '",';
    postData += '"DIAGNOSIS":"' + patient.Diagnosis + '",';

    var BGFS1="";
    for (var i = 0; i < NurseRecordEvlDefaultValues.BGFSData.length; i++) {
        if (NurseRecordEvlDefaultValues.BGFSData[i].value == $("#BGFS1").combobox("getValue") || NurseRecordEvlDefaultValues.BGFSData[i].text == $("#BGFS1").combobox("getValue")) {
            BGFS1= NurseRecordEvlDefaultValues.BGFSData[i].value;
        }
    }

    postData += '"BGFS":"' + BGFS1 + '",';
    postData += '"JSFSJDAY":"' + $("#JSFSJDAY").textbox("getValue") + '",';
    postData += '"JSFSJHR":"' + $("#JSFSJHR").textbox("getValue") + '",';
    postData += '"SBSJ":"' + $("#SBSJ").datebox("getValue") + '",';

    postData += '"BC":"' + $("#txtBc").val() + '",';
    postData += '"FXR":"' + $("#txtFxr").val() + '",';
    postData += '"SJFSDD":"' + $("#txtSjfsdd").val() + '",';
    postData += '"SJFSZT":"' + $("#txtSjfszt").val() + '",';
    postData += '"FWCC":"' + $("#txtFwcc").val() + '",';
    postData += '"HJ":"' + $("#txtHj").val() + '",';
    postData += '"SHJG":"' + $("#txtShjg").val() + '",';
    postData += '"LJTZRY":"' + $("#txtLjtzry").val() + '",';
    postData += '"KNXGYS":"' + $("#txtKnxgys").val() + '",';

    postData += '"KZRQZ":"' + $("#txtKZRQZ").textbox("getValue") + '",';
    postData += '"BFHSZQZ":"' + $("#txtBFHSZQZ").textbox("getValue") + '",';
    postData += '"TBRQ":"' + $("#txtTBRQ").datebox("getValue") + '"';

    $("#inputTabs").find("input[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        for (var s in bodyChart) {
            var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
            var length = JsonPro.length;
            if (p.substr(0, length).toLowerCase() == JsonPro) {
                var value;
                if ($(obj).hasClass("easyui-combobox")) {
                    value = $(obj).combobox("getValue");
                    if (value != "" && value != NurseRecordEvlDefaultValues.defaultValue[0].value) {
                        value = '"' + value + '"';
                    }
                    else {
                        value = 'null';
                    }
                }
                else {
                    value = $(obj).numberbox("getValue");
                    if (value != "") {
                        value = '"' + value + '"';
                    }
                    else {
                        value = 'null';
                    }
                }
                postData += ',"' + p.substr(length) + '":' + value;
            }
        }
    });

    postData += "}";
    postData = "[" + postData + "]";

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/saveNurseRecordAdverseReport",
        data: { '': postData },
        type: "post",
        success: function (data) {
            $.messager.alert("提示", data);
            clearEditInfo();
            loadNurseRecordAdverseReportData(patient.Patient_id, patient.Visit_id);
        }
    })
}

function getweekday(date)
{
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    var week = weekArray[new Date(date).getDay()];
    return week;
}

