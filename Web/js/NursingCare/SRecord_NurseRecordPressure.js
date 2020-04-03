
var AttrName = "nurse_pressure";
var JsonPro = "vital_sign:";
var patient_id;
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
                }
            }
        })
    });
    loaddate();
    loadusername();
    $("#btnSaveInput").click(saveData);
    $("#btnQuery").click(searchdata);
    
});

function loaddate()
{
    var date = new Date();
    $('#dtInput').datebox('setValue', dateFormatter(date));
}

//加载护士签名
function loadusername() {
    var username;
    var jsonUser = getLoginUser();
    if (jsonUser) {
        username = jsonUser.UserName;
    }
    $("#txtSignatory").textbox("setValue", username);
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

                    InitInputData(patient.Patient_id, patient.Visit_id, null);
                }
            }
        })
    })
}

function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
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

//绑定复选框
function setDataList(jsonData, strName) {
    var Name = strName; //strName.toUpperCase();
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

//获取选中数据
function GetCheckboxValues() {
    //感觉
    var Feelscore = GetDataList("Feelscore");
    $("#txtFeelscore").textbox("setValue", Feelscore);
    //潮湿
    var Humidscore = GetDataList("Humidscore");
    $("#txtHumidscore").textbox("setValue", Humidscore);
    //活动力
    var Energyscore = GetDataList("Energyscore");
    $("#txtEnergyscore").textbox("setValue", Energyscore);
    //移动力
    var Locomotivityscore = GetDataList("Locomotivityscore");
    $("#txtLocomotivityscore").textbox("setValue", Locomotivityscore);
    //营养
    var Nutritionscore = GetDataList("Nutritionscore");
    $("#txtNutritionscore").textbox("setValue", Nutritionscore);
    //摩擦力 剪切力
    var Shearforcescore = GetDataList("Shearforcescore");
    $("#txtShearforcescore").textbox("setValue", Shearforcescore);
    //护理措施
    var Measure = GetDataList("Measure");
    $("#txtMeasure").textbox("setValue", Measure);
}

//格式化日期显示数据
function formatterTime(value, Rowdata, rowIndex) {
    return value.substring(0, 10)
}

//初始化数据
function InitInputData(pid, vid, datetimes) {

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getNursingRecordPressureList",
        type: "get",
        data: "pid=" + pid + "&vid=" + vid + "&datetimes=" + datetimes + "",
        success: function (data) {
            if (data != "null") {
                jsonData = $.parseJSON(data);
                $("#tbNurseRecordPressureList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordPressureList").datagrid("loadData", { total: 0, rows: [] });
            }
        }
    })
}

function InputListOperateField(value, rowData, rowIndex) {
    var patient_id = rowData.Pid;
    var Visit_id = rowData.Vid;
    var record_time = rowData.Datetimes;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >删除</a>";
    return str;
}

function editInputList(patient_id, Visit_id, recorddate, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getNursingRecordPressureList",
            data: "pid=" + patient_id + "&vid=" + Visit_id + "&datetimes=" + recorddate + "",
            type: "get",
            success: (function (data) {
                if (data != "null") {
                    var jsonData = $.parseJSON(data);
                    $("#dtInput").datebox("setValue", jsonData[0].Datetimes.replace("T", " "));

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
        cleareditinfo();
    }
}

//删除数据
function delData(patient_id, Visit_id, record_time, obj) {
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "NurseCare/delNursingRecordPressure",
                data: "pid=" + patient_id + "&vid=" + Visit_id + "&datetimes=" + record_time + "",
                type: "get",
                success: (function (data) {
                    cleareditinfo();
                    InitInputData(patient_id, Visit_id, null)
                })
            });
        }
    })
}

//清空数据
function cleareditinfo()
{
    $("#inputTabs").find("input[type='checkbox']").each(function (inputIndex) {
        $(this).prop("checked", false);
        $(this).removeAttr("checked");
        strVar = $(this).attr("id");
        $("#" + strVar).removeClass("ui-checkbox-on");
        $("#" + strVar).addClass("ui-checkbox-off");
    });
}

function getscore(strfield)
{
    var field = $("#" + strfield + "").val();
    var score = 0;
    if (field != "") {
        var arrayscore = field.split("|");
        for (var i = 0; i < arrayscore.length; i++) {
            if (arrayscore[i] != "") {
                score += parseInt(arrayscore[i])
            }
        }
    }
    return score;
}

//保存数据
function saveData()
{
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    var countsum = 0;

    GetCheckboxValues();

    var txtFeelscore = getscore("txtFeelscore");
    var txtHumidscore = getscore("txtHumidscore");
    var txtEnergyscore = getscore("txtEnergyscore");
    var txtLocomotivityscore = getscore("txtLocomotivityscore");
    var txtNutritionscore = getscore("txtNutritionscore");
    var txtShearforcescore = getscore("txtShearforcescore");

    countsum = txtFeelscore + txtHumidscore + txtEnergyscore + txtLocomotivityscore + txtNutritionscore + txtShearforcescore;

    var postData = "";
    postData += '{';

    postData += '"Pid":"' + patient.Patient_id + '",';
    postData += '"Vid":"' + patient.Visit_id + '",';
    postData += '"Datetimes":"' + $("#dtInput").datebox("getValue") + '",';
    postData += '"Countsum":"' + countsum + '",';
    postData += '"Measure":"' + $("#txtMeasure").val() + '",';
    postData += '"Sign":"' + $("#txtSignatory").textbox("getValue") + '",';
    postData += '"Feelscore":"' + $("#txtFeelscore").val() + '",';
    postData += '"Humidscore":"' + $("#txtHumidscore").val() + '",';
    postData += '"Energyscore":"' + $("#txtEnergyscore").val() + '",';
    postData += '"Locomotivityscore":"' + $("#txtLocomotivityscore").val() + '",';
    postData += '"Nutritionscore":"' + $("#txtNutritionscore").val() + '",';
    postData += '"Shearforcescore":"' + $("#txtShearforcescore").val() + '"';

    postData += "}";
    postData = "[" + postData + "]";

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/saveNursingRecordPressureData",
        data: { '': postData },
        type: "post",
        success: function (data) {
            $.messager.alert("提示", data);
            cleareditinfo();
            InitInputData(patient.Patient_id, patient.Visit_id, null)
        }
    })
}

//查询数据
function searchdata() {
    InitInputData(patient_id, null, $("#txtDate").textbox("getValue"));
}

//function print()
//{
//    if (!patient) {
//        $.messager.alert("提示", "请选择病人！");
//        return;
//    }
//    window.open(BaseData.WebApiUrl + "print/printNurseRecordPressureReport?patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id);
//}