var patient;
var patient_id;
var AttrName = "te";
var JsonPro = "data:";
var strP_ACCESSRECORD_ID=0;
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

            var jsonData = $.parseJSON(data);

            if (jsonData.length > 0) {
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
                //  $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                //     PatientsComboChange();
                InitInputData(jsonData[0].Patient_id, jsonData[0].Visit_id);
            }
        })
    });
    $(".easyui-combobox[combodata]").each(function (index, obj) {

        var combo = $(obj);
        combo.combobox({
            valueField: 'value',
            textField: 'value',
            data: ComboData[combo.attr("combodata")],
            panelHeight: 'auto',
            editable: false
        });

    })

    $("#btnSave").click(saveInputData);
    
});

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
                $.ajax({
                    url: BaseData.WebApiUrl + "nursedocument/getTransferEvaluatio",
                    data: { "patient_id": patient.Patient_id, "visit_id": patient.Visit_id },
                    type: "get",
                    success: (function (tedata) {
             
                      //  InitEasyUIInputData($("#MainView"), $.parseJSON(tedata));
                       
                    })
                })

                removeSession("patient_id");
                setSession(patient_id);

                InitInputData(patient.Patient_id, patient.Visit_id);
            }
        })
    })
   
}

function saveInputData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }

    // 转科方式
    var Accesstype = GetDataList("Accesstype");

    var postData = "";

    var recording_Date = $("#txtDate").datebox("getValue");
    //var time_point = recording_Date + " " + $("#dtInput").timespinner("getValue");
    var postData = "";
    postData += '{';
    postData += '"P_ACCESSRECORD_ID":' + strP_ACCESSRECORD_ID + ',';
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Accesstype":"' + Accesstype + '",';
    postData += '"Accesstime":"' + recording_Date + '"';
    //postData += '"Time_Point":"' + time_point + '"';

    $("#MainView").find("input[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        for (var s in bodyChart) {
            var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
            var length = JsonPro.length;
            if (p.substr(0, length).toLowerCase() == JsonPro) {
                // data[p.substr(length)] = $(obj).combobox("getValue");
                var value;
                if ($(obj).hasClass("easyui-combobox")) {
                    value = $(obj).combobox("getValue");
                    if (value != "") {
                        value = '"' + value + '"';
                    }
                    else {
                        value = 'null';
                    }
                }
                else if ($(obj).hasClass("easyui-numberbox")) {
                    value = $(obj).numberbox("getValue");
                    if (value != "") {
                        value = '"' + value + '"';
                    }
                    else {
                        value = 'null';
                    }
                }
                else if ($(obj).hasClass("easyui-textbox")) {
                    value = $(obj).textbox("getValue");
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
    $.ajax({
        url: BaseData.WebApiUrl + "nursedocument/saveTransferEvaluatio",
        data: { '': postData },
        type: "post",
        success: (function (data) {
            alert(data);

            InitInputData(patient.Patient_id, patient.Visit_id);
        })
    });
}


function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");;
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}

var ComboData = {
    YouWu: [{ value: "有" }, { value: "无" }],
    YouWuBuXiang: [{ value: "有" }, { value: "无" }, { value: "不详" }],
    NengFou: [{ value: "能" }, { value: "否" }],
    EDUCATION: [
        { value: "文盲" },
        { value: "小学" },
        { value: "初中" },
        { value: "中专/高中" },
        { value: "大专及以上" },
    ],
    YSZT: [
        { value: "清楚" },
        { value: "嗜睡" },
        { value: "模糊" },
        { value: "昏睡" },
        { value: "昏迷" },
        { value: "朦胧" },
        { value: "镇静" },
    ],
    TIWEI: [
       { value: "主动体位" },
       { value: "被动体位" },
       { value: "被迫体位" },
       { value: "其他" },

    ],
    BPTW: [
        { value: "端坐位" },
        { value: "半做卧位" },
        { value: "被迫体位" },
        { value: "侧卧位" },
        { value: "俯卧位" },
        { value: "其他" },

    ],
    PFNM: [
       { value: "正常" },
       { value: "压疮" },
       { value: "烫伤" },
       { value: "外伤" },
       { value: "其他" },

    ],
    PBL: [
       { value: "正常" },
       { value: "便秘" },
       { value: "腹泻" },
       { value: "失禁" },
       { value: "造瘘" },
       { value: "其他" },

    ],
    PBZT: [
       { value: "正常" },
       { value: "尿失禁" },
       { value: "尿潴留" },
       { value: "排尿困难" },
       { value: "留置尿管" },
       { value: "其他" },

    ],
    XGPG: [
       { value: "0级" },
       { value: "Ⅰ级" },
       { value: "Ⅱ级" },
       { value: "Ⅲ级" },
    ],
    ZLNL: [
      { value: "完全自理" },
      { value: "部分自理" },
      { value: "完全不能自理" },
    ],
    ZJXY: [
      { value: "无" },
      { value: "佛教" },
      { value: "基督教" },
      { value: "天主教" },
      { value: "其他" },
    ],
    XLZK: [
     { value: "否认" },
     { value: "拒绝" },
     { value: "积极" },
     { value: "无所谓" },
     { value: "其他" },
    ],
    JBRZ: [
    { value: "认识" },
    { value: "部分认识" },
    { value: "不认识" },
    ],
}

function InitInputData(Patient_id, Visit_id) {
    var record_date = $("#txtDate").datebox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "nursedocument/getTransferEvaluatioList",
        data: "patient_id=" + Patient_id + "&visit_id=" + Visit_id,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                InitTableData(null);
                $("#tbNurseTransferList").datagrid("loadData", jsonData);
            }else{
                $("#tbNurseTransferList").datagrid("loadData", []);
            }
        })
    });
}

function InputListOperateField(value, rowData, rowIndex) {

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + rowData.P_ACCESSRECORD_ID + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delInputList(\"" + rowData.P_ACCESSRECORD_ID + "\",\"" + rowData.Patient_id + "\",\"" + rowData.Visit_id + "\")' >删除</a>";
    return str;
}

var editID = null;
function editInputList(P_ACCESSRECORD_ID, obj) {
    strP_ACCESSRECORD_ID = P_ACCESSRECORD_ID;
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "nursedocument/getTransferEvaluatioByP_AccessRecord_ID",
            data: "P_ACCESSRECORD_ID=" + P_ACCESSRECORD_ID,
            type: "get",
            success: (function (data) {
                if (data) {
                    var jsonData = $.parseJSON(data);
                    InitTableData(jsonData);

                    setDataList(jsonData, "Accesstype");

                    $("#txtDate").datebox("setValue", jsonData.Accesstime);
                    InitEasyUIInputData($("#MainView"), $.parseJSON(data));
                    $(obj).html("取消");
                }
            })
        });
    }
    else {
        editID = null;
        $(obj).html("编辑");
        InitTableData(null);
    }
}
function delInputList(P_ACCESSRECORD_ID, Patient_id, Visit_id) {
    editID = null;
    $.ajax({
        url: BaseData.WebApiUrl + "nursedocument/delTransferEvaluatioByP_AccessRecord_ID",
        data: "P_ACCESSRECORD_ID=" + P_ACCESSRECORD_ID,
        type: "get",
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                InitInputData(Patient_id,Visit_id);
                InitTableData(null);
            }
        })
    });
}

function InitTableData(jsondata) {
    InitEasyUIInputData($("#MainView"), "null");

    $("#MainView").find("input[type=checkbox]").each(function (index, obj) {
        $(this).prop("checked", false);
        $(obj).removeAttr("checked");
    });
}

//拼接复选框
function GetDataList(o) {
    var value = "";
    var eles = $("#MainView").find("input[name='" + o + "']");
    for (var index = 0; index < eles.length; index++) {
        if (eles[index].checked) {
            value = value + eles[index].value + "|";
        }
    }
    return value;
}

//绑定复选框
function setDataList(jsonData, strName) {
    if (jsonData[strName] != null && jsonData[strName].length > 0) {
        var Strvalue = jsonData[strName].split("|");
        for (var data in Strvalue) {
            $("#MainView").find("input[name='" + strName + "']").each(function (index, obj) {
                if ($(this).attr("type") == "checkbox" && Strvalue[data] != null) {
                    if (data == $(this).attr("value")) {
                        document.getElementById($(this).attr("id")).checked = true;
                    }
                }
            })
        }
    }
}

