var patient;
var Crl_Item;
var menu_id = getUrlParam("menu_id");
$(function () {
    $("#VitalSigns").combobox({
        onSelect: VitalRecordTime,
        editable: false
    });
    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient
    });
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getCrlDic",

        type: "get",
        data: "menu_id=" + menu_id,
        success: (function (data) {
            if (data) {
                Crl_Item = $.parseJSON(data);

                $("#cbCrlType").combobox("loadData", Crl_Item);

                $("#cbCrlType").combobox({
                    onSelect: function (record) {
                        var Note = "";
                        if (record.Kind == 0) {
                            Note = "入量";
                        }
                        else {
                            Note = "出量";
                        }
                        $("#spCrlNote").html(Note);
                        $("#spCrlUnit").html(record.Unit);
                    }
                });
                //      $("#cbCrlType").combobox("select", Crl_Item[0].Xm);
            }
            //  alert(data);
        })
    });
    $("#tbCareList").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        columns: [[
          { field: 'Time_Point', width: 50, title: '时间', formatter: function (value) { return inputListDateFormatter(value); }, rowspan: 2 },
           { field: '体温', width: 50, title: '体温', formatter: getDefaultComboText, rowspan: 2 },
          { field: '脉搏', width: 50, title: '脉搏', formatter: getDefaultComboText, rowspan: 2 },

           { field: '血压Low', width: 50, title: '舒张压', formatter: getDefaultComboText, rowspan: 2 },
            { field: '血压high', width: 50, title: '收缩压', formatter: getDefaultComboText, rowspan: 2 },
           { field: '血氧', width: 50, title: '血氧', rowspan: 2 },
            { field: '呼吸', width: 50, title: '呼吸', formatter: getBreathComboText, rowspan: 2 },
          { field: '意识', width: 60, title: '意识', formatter: getConsciousnessComboText, rowspan: 2 },
        { field: 'r1c1', title: '瞳孔大小', width: 110, colspan: 2 },
        { field: 'r1c2', title: '对光反应', width: 110, colspan: 2 },
          {
              field: 'aa', width: 110, title: '操作', formatter: InputListOperateField, rowspan: 2
          },
        ], [
               { field: '左瞳孔大小', width: 55, title: '左' },
        { field: '右瞳孔大小', width: 55, title: '右' },
           { field: '左瞳孔光', width: 55, formatter: getPupilComboText, title: '左' },
        { field: '右瞳孔光', width: 55, formatter: getPupilComboText, title: '右' },
        ]]
    });
    $("#tbCrl").datagrid({
        singleSelect: true,
        style: { 'text-align': 'center' },
        columns: [[
          { field: 'Recording_Date', title: '日期', width: 90, formatter: function (value) { return dateFormatter(new Date(value.replace(/-/g, "/").replace(/T/g, " "))); } },
          {
              field: 'Time_Point', title: '时间', width: 70, formatter: function (value) { return inputListDateFormatter(value); },
          },
           {
               field: 'Vital_Signs', title: '出入量类别', width: 140,
           },
          {
              field: 'Vital_Signs_Values', title: '出入量数量', width: 80,
          },
           {
               field: 'Note', title: '类型', width: 70,
           },
           { field: 'Units', title: '单位', width: 70 },
             { field: 'Content', title: '名称', width: 110 },
          {
              field: 'operate', title: '操作', width: 120, formatter: function (value, Rowdata, rowIndex) {
                  var str = "<a href='#' name='btnEdit' onclick='editCrlList(" + rowIndex + ")' >编辑</a>";
                  str += "&nbsp;&nbsp;"
                  str += "<a href='#' onclick='delCrl(\"" + rowIndex + "\")' >删除</a>";
                  return str;
              }
          },
        ]]
    });
    $("#tbEventRecord").datagrid({
        singleSelect: true,
        style: { 'text-align': 'center' },
        columns: [[
              { field: 'Record_Time', width: "10%", title: '时间', formatter: function (value) { return inputListDateFormatter(value); } },
              { field: 'Sputum', width: "10%", title: '痰液性质', formatter: function (value) { return getComboTextByValue('Sputum', value); } },
              { field: 'Posture', width: "10%", title: '翻身体位', formatter: function (value) { return getComboTextByValue('Posture', value); } },
              { field: 'Skin', width: "10%", title: '皮肤情况', formatter: function (value) { return getComboTextByValue('Skin', value); } },
              { field: 'Wound', width: "10%", title: '伤口情况', formatter: function (value) { return getComboTextByValue('Wound', value); } },
              { field: 'Piping', width: "10%", title: '管路情况', formatter: function (value) { return getComboTextByValue('Piping', value); } },
              { field: 'Memo', width: "25%", title: '治疗措施', },
              {
                  field: 'Record_id', width: "15%", title: '操作', formatter: function (value) {
                      var str = "<a href='#' name='btnEditEvent' onclick='editEvent(\"" + value + "\",this)' >编辑</a>";
                      str += "&nbsp;&nbsp;"
                      str += "<a href='#' onclick='delEvent(\"" + value + "\")' >删除</a>";
                      return str;
                  }
              },
        ]]
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
                //   $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                // PatientsComboChange();

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

    $("#btnQuery").click(InitInputData);
    $("#btnSaveInput").click(saveInputData);


    $('#dd').window({
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closed: true
    });
    $("#addCrl").click(addCrl);
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

    $("#comboTemplate").combobox({
        onSelect: function () {
            var value = $("#comboTemplate").combobox("getValue");
            var text = $("#txtMeasure").textbox("getValue");
            $("#txtMeasure").textbox("setValue", text + value);
        },
        valueField: 'Dict_Name',
        textField: 'Dict_Code',
    });

    $("#comboSpecialChar").combobox({
        onSelect: function () {
            var value = $("#comboSpecialChar").combobox("getValue");
            var text = $("#txtMeasure").textbox("getValue");
            $("#txtMeasure").textbox("setValue", text + value);
        }
    });

    $("#comboSpecialChar").combobox("loadData", CommonData.SpecialChar);
    $("#comboSpecialChar").combobox("setValue", "符号选择");
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
                InitData();
                $.session.set('patientData', JSON.stringify(patient));
                removeSession("patient_id");
                setSession(patient_id);
            }
        })
    });

}
function InitData() {
    $(".easyui-timespinner").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    InitInputData();
    InitCrlData();
    InitEventData();
};
function InitInputData() {
    var recording_Date = $("#txtDate").datebox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "nursecare/getDangerSignsListData",
        data: "patient_id=" + patient.Patient_id + "&recording_Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data) {
                var jsonData = $.parseJSON(data);
                for (var i in jsonData) {
                    for (var key in jsonData[i]) {
                        if (key.indexOf('(') > -1 && key.indexOf(')') > -1) {
                            var newkey = key.replace('(', '').replace(')', '');
                            jsonData[i][newkey] = jsonData[i][key];
                        }
                    }
                }
                $("#tbCareList").datagrid("loadData", jsonData);
            }
        })
    });
    InitEasyUIInputData($("#tbInput"), null);
    getVitalSigns();
}
function InitEventData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var recording_Date = $("#txtDate").datebox("getValue");
    clearDataGrid("tbEventRecord");
    $.ajax({
        url: BaseData.WebApiUrl + "nursecare/getDangerEventRecord",
        data: "patient_id=" + patient.Patient_id + "&recording_Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data) {
                var jsonData = $.parseJSON(data);
                if (jsonData != null) {
                    $("#tbEventRecord").datagrid("loadData", jsonData);
                }
            }
        })
    });
    InitEasyUIInputData($("#tbEvent"), null);
}
function saveInputData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var VitalSigns = $("#VitalSigns").combobox("getValue").trim();
    var postData = "";

    var recording_Date = $("#txtDate").datebox("getValue");
    var time_point = recording_Date + " " + $("#dtInput").timespinner("getValue");
    var postData = "";
    postData += '{';
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Recording_Date":"' + recording_Date + '",';
    postData += '"Time_Point":"' + time_point + '",';
    if (VitalSigns.length > 0) {
        var xyhigh = ""; var xylow = "";
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].Vital_Signs == "体温") {
                postData += '"体温":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "脉搏") {
                postData += '"脉搏":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血压high") {
                postData += '"血压high":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血压Low") {
                postData += '"血压Low":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "意识") {
                postData += '"意识":"' + jsonData[i].Units + '",';
            } else if (jsonData[i].Vital_Signs == "呼吸") {
                postData += '"呼吸":"' + jsonData[i].Vital_Signs_Values + '",';
            } else if (jsonData[i].Vital_Signs == "血氧") {
                postData += '"血氧":"' + jsonData[i].Vital_Signs_Values + '",';
            }
        }
    }
    postData= postData.substr(0, postData.length - 1);
    $("#tbInput").find("input[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        for (var s in bodyChart) {
            var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
            var length = JsonPro.length;
            if (p.substr(0, length).toLowerCase() == JsonPro) {
                // data[p.substr(length)] = $(obj).combobox("getValue");
                var value;
                if ($(obj).hasClass("easyui-combobox")) {
                    value = $(obj).combobox("getValue");
                    if (value != "" && value != CriticalCareDefaultValues.defaultValue[0].value) {
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
    postData = "[" + postData + "]";
    $.ajax({
        url: BaseData.WebApiUrl + "nursecare/saveCriticalCareInputData",
        type: "POST",
        data: { '': postData },
        success: (function (data) {
            $.messager.alert("提示", data);
            // InitEasyUIInputData($("#tbInput"), null);
            InitInputData();
            $("#VitalSigns").combobox("setValue", "");
        })
    });
}



function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
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
    dateTime = rowData.Time_Point;
    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + dateTime + "\",this)' >编辑</a>";
    return str;
}
function editInputList(timepoint, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "nursecare/getDangerSignsViewData",
            data: "patient_id=" + patient.Patient_id + "&time_point=" + timepoint,
            type: "get",
            success: (function (data) {
                var jsonData = $.parseJSON(data);
                //InitComboData($("#tbInput"), jsonData);
                //InitNumberBoxData($("#tbInput"), jsonData);
                InitEasyUIInputData($("#tbInput"), jsonData);
                var date = new Date(jsonData.Time_Point);
                $("#dtInput").timespinner("setValue", inputListDateFormatter(jsonData.Time_Point));
                $(obj).html("取消");
            })
        });
    }
    else {
        $(obj).html("编辑");
        InitEasyUIInputData($("#tbInput"), null);

        $("#dtInput").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    }
}
var editRecord_id = null;
function editEvent(record_id, obj) {

    var state = $(obj).html();
    $("a[name='btnEditEvent']").html("编辑");
    if (state == "编辑") {
        var eventDataList = $("#tbEventRecord").datagrid("getData");
        var eventData;
        for (var i in eventDataList.rows) {

            if (eventDataList.rows[i].Record_id == record_id) {
                eventData = eventDataList.rows[i];
                break;
            }
        }
        if (eventData) {
            InitEasyUIInputData($("#tbEvent"), eventData);
            editRecord_id = record_id;
            $(obj).html("取消");
        }

    }
    else {
        $(obj).html("编辑");
        InitEasyUIInputData($("#tbEvent"), null);
        editRecord_id = null;
        $("#dtEvent").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    }
}

function saveEventData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var recording_Date = $("#txtDate").datebox("getValue");
    var time_point = recording_Date + " " + $("#dtEvent").timespinner("getValue");
    var postData = "";
    postData += '{';
    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Record_Date":"' + recording_Date + '",';
    postData += '"Record_Time":"' + time_point + '"';
    var isInsert = (editRecord_id != null);
    if (editRecord_id != null) {
        postData += ',"Record_id":' + editRecord_id;
    }
    $("#tbEvent").find("input[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        for (var s in bodyChart) {
            var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
            var length = JsonPro.length;
            if (p.substr(0, length).toLowerCase() == JsonPro) {
                // data[p.substr(length)] = $(obj).combobox("getValue");
                var value;
                if ($(obj).hasClass("easyui-combobox")) {
                    value = $(obj).combobox("getValue");
                    if (value != "" && value != CriticalCareDefaultValues.defaultValue[0].value) {
                        value = '"' + value + '"';
                        isInsert = true;
                    }
                    else {
                        value = 'null';
                    }
                }
                else if ($(obj).hasClass("easyui-numberbox")) {
                    value = $(obj).numberbox("getValue");
                    if (value != "") {
                        value = '"' + value + '"';
                        isInsert = true;
                    }
                    else {
                        value = 'null';
                    }
                }
                else if ($(obj).hasClass("easyui-textbox")) {
                    value = $(obj).textbox("getValue");
                    if (value != "") {
                        value = '"' + value + '"';
                        isInsert = true;
                    }
                    else {
                        value = 'null';
                    }
                }
                postData += ',"' + p.substr(length) + '":' + value;
            }
        }
    });
    if (isInsert) {
        postData += "}";

        $.ajax({
            url: BaseData.WebApiUrl + "nursecare/saveDangerEvent",
            type: "POST",
            data: { '': postData },
            success: (function (data) {
                $.messager.alert("提示", data);
                // InitEasyUIInputData($("#tbEvent"), null);
                editRecord_id = null;
                InitEventData();
            })
        });
    }
    else {
        $.messager.alert("提示", "请输入有效数据！");
    }
}



function getDefaultComboText(value) {
    return getComboTextByValue("defaultInput", value);
}
function getPupilComboText(value) {
    return getComboTextByValue("pupil", value);
}
function getConsciousnessComboText(value) {
    return getComboTextByValue("Consciousness", value);
}
function getBreathComboText(value) {
    return getComboTextByValue("breath", value);
}


function InitCrlData() {
    var recording_Date = $("#txtDate").datebox("getValue");
    var date = dateTimeFormatter(new Date(), "yyyy-mm-dd hh:mi");

    clearDataGrid("tbCrl");
    $.ajax({
        url: BaseData.WebApiUrl + "nursecare/getCrlListData",
        data: "patient_id=" + patient.Patient_id + "&recording_Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data.length > 0) {

                var jsonData = $.parseJSON(data);
                if (jsonData != null) {
                    $("#tbCrl").datagrid("loadData", jsonData);
                }
            }
        })
    });

}


var crlEditRowIndex;
function editCrlList(rowIndex) {

    crlEditRowIndex = rowIndex;
    $("#dateCrl").datebox({
        disabled: true
    });
    $("#tsCrl").timespinner({
        disabled: true
    });

    var row = $('#tbCrl').datagrid('getData').rows[rowIndex];
    $("#dateCrl").datebox("setValue", row.Recording_Date);
    $("#tsCrl").timespinner("setValue", inputListDateFormatter(row.Time_Point));
    $("#cbCrlType").combobox("select", row.Vital_Signs);
    $("#txtCrlValue").numberbox("setValue", row.Vital_Signs_Values);
    $("#txtContent").textbox("setValue", row.Content);

    $("#addCrlData").css("display", "none");
    $("#saveCrlData").css("display", "block");
    $('#dd').window('open');

}

function addCrl() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    crlEditRowIndex = -1;
    $("#dateCrl").datebox({
        disabled: false
    });
    $("#tsCrl").timespinner({
        disabled: false
    });

    $("#dateCrl").datebox("setValue", dateFormatter(new Date()));
    $("#tsCrl").timespinner("setValue", dateTimeFormatter(new Date(), "hh:mi"));
    $("#cbCrlType").combobox("select", Crl_Item[0].Xm);
    $("#txtCrlValue").numberbox("setValue", 0);
    $("#txtContent").textbox("setValue", "");


    $("#addCrlData").css("display", "block");
    $("#saveCrlData").css("display", "none");
    $('#dd').window('open');
}
function saveCrl() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var dataStr = "";
    if (crlEditRowIndex != -1) {
        var data = $('#tbCrl').datagrid('getData').rows[crlEditRowIndex];
        data["Operate"] = "original";
        dataStr += JSON.stringify(data);
        dataStr += ',';
    }


    var recording_Date = $("#dateCrl").datebox("getValue");
    var time_point = recording_Date + " " + $("#tsCrl").timespinner("getValue");

    dataStr += '{';
    dataStr += '"Patient_id":"' + patient.Patient_id + '",';
    dataStr += '"Visit_id":"' + patient.Visit_id + '",';
    dataStr += '"Recording_Date":"' + recording_Date + '",';
    dataStr += '"Time_Point":"' + time_point + '",';
    dataStr += '"Vital_Signs":"' + $("#cbCrlType").combobox("getValue") + '",';
    dataStr += '"Vital_Signs_Values":"' + $("#txtCrlValue").numberbox("getValue") + '",';
    dataStr += '"Units":"' + $("#spCrlUnit").html() + '",';
    dataStr += '"Note":"' + $("#spCrlNote").html() + '",';
    dataStr += '"Content":"' + $("#txtContent").textbox("getValue") + '"}';
    dataStr = "[" + dataStr + "]";
    $.ajax({
        url: BaseData.WebApiUrl + "nursecare/saveCrlData",
        type: "POST",
        data: { '': dataStr },
        success: (function (data) {
            $.messager.alert("提示", data);
            InitCrlData();
        })
    });
    $('#dd').window('close');
}

function delEvent(record_id) {
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({

                url: BaseData.WebApiUrl + "nursecare/deleteDangerEvent?record_id=" + record_id,
                type: "get",
                success: (function (data) {
                    $.messager.alert("提示", data);
                    InitEventData();
                })
            })
        }
    })
}
function delCrl(rowIndex) {
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            var row = $('#tbCrl').datagrid('getData').rows[rowIndex];
            $.ajax({

                url: BaseData.WebApiUrl + "nursecare/deleteDangerCrl?patient_id=" + row.Patient_id + "&time_point=" + row.Time_Point + "&danger_signs=" + row.Vital_Signs,
                type: "get",
                success: (function (data) {
                    $.messager.alert("提示", data);
                    InitCrlData();
                })
            })
        }
    })
}
//查询病人的体温时间数据
function getVitalSigns() {
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
    // window.open(BaseData.WebApiUrl + "print/printDangerCareReport?patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id);
    var WinPrint = window.open('../Print/CriticalCare.html?patient_id=' + patient.Patient_id + "&visit_id=" + patient.Visit_id);
}

