
var patient;
var patient_id;
var AttrName = "nurse_education";
var JsonPro = "vital_sign:";
var NurseRecordEvlDefaultValues = {
    targetData: [{ text: "病人", value: "1" },
          { text: "家属", value: "2" },
          { text: "病人及家属", value: "3" }]
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
                }
            }
        })
    });

    $("#btnSaveInput").click(saveInputData);
    $("#btnQuery").click(searchData);

    $("#target_name").combobox("loadData", NurseRecordEvlDefaultValues.targetData);
    loadUserName();
    loadtime();
});

function loadUserName()
{
    var username;
    var jsonUser = getLoginUser();
    if (jsonUser) {
        username = jsonUser.UserName;
    }
    $("#nurse_name").textbox("setValue", username);
}


function loadtime()
{
    $('#WRITING_TIME').datetimebox('setValue', getTime());
}

//获取当前时间
function getTime() {
    var currDate = new Date();
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
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

                    InitInputData(patient.Patient_id, patient.Visit_id);
                }
            }
        })
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

function GetCheckboxValues() {
    //入院指导
    var fore_education_id = GetDataList("Fore_education_id");
    $("#txtFore_education_id").textbox("setValue", fore_education_id);
    //住院指导
    var amongst_education_id = GetDataList("Amongst_education_id");
    $("#txtAmongst_education_id").textbox("setValue", amongst_education_id);
    //出院指导
    var after_education_id = GetDataList("After_education_id");
    $("#txtAfter_education_id").textbox("setValue", after_education_id);
}

//查询数据
function searchData()
{
    var record_time = $("#txtDate").datebox("getValue");
    var Visit_id = 0;
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getHealthEducationList",
        data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseRecordHealth_EducationList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordHealth_EducationList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
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
    postData += '"Ward_code":"' + patient.Ward_Code + '",';
    postData += '"P_NAME":"' + patient.Name + '",';
    postData += '"DEPTNAME":"' + patient.Dept_name + '",';
    postData += '"PATIENTBEDNO":"' + patient.Bed_No + '",';

    var target_name = "";
    for (var i = 0; i < NurseRecordEvlDefaultValues.targetData.length; i++) {
        if (NurseRecordEvlDefaultValues.targetData[i].value == $("#target_name").combobox("getValue") || NurseRecordEvlDefaultValues.targetData[i].text == $("#target_name").combobox("getValue")) {
            target_name = NurseRecordEvlDefaultValues.targetData[i].value;
        }
    }

    postData += '"TARGET_NAME":"' + target_name + '",';
    postData += '"WRITING_TIME":"' + $("#WRITING_TIME").datebox("getValue") + '",';

    postData += '"FORE_HOSPITAL_ID":"1",';
    postData += '"AMONGST_HOSPITAL_ID":"2",';
    postData += '"AFTER_HOSPITAL_ID":"3",';

    postData += '"FORE_EDUCATION_ID":"' + $("#txtFore_education_id").val() + '",';
    postData += '"AMONGST_EDUCATION_ID":"' + $("#txtAmongst_education_id").val() + '",';
    postData += '"AFTER_EDUCATION_ID":"' + $("#txtAfter_education_id").val() + '",';

    postData += '"NURSE_NAME":"' + $("#nurse_name").val() + '"';

    postData += "}";
    postData = "[" + postData + "]";

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/saveHealth_education",
        data: { '': postData },
        type: "post",
        success: function (data) {
            $.messager.alert("提示", data);
            clearEditInfo();
            loadtime();
            InitInputData(patient.Patient_id, patient.Visit_id)
        }
    })
}

//清空数据
function clearEditInfo()
{
    $("#target_name").combobox("setValue", "");

    $("#inputTabs").find("input[type='checkbox']").each(function (inputIndex) {
        $(this).prop("checked", false);
        $(this).removeAttr("checked");
        strVar = $(this).attr("id");
        $("#" + strVar).removeClass("ui-checkbox-on");
        $("#" + strVar).addClass("ui-checkbox-off");
    });
}

function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}

//格式化教育对象数据显示
function formatterTargetName(value, Rowdata, rowIndex) {
    for (var i = 0; i < NurseRecordEvlDefaultValues.targetData.length; i++) {
        if (NurseRecordEvlDefaultValues.targetData[i].value == value || NurseRecordEvlDefaultValues.targetData[i].text == value) {
            return NurseRecordEvlDefaultValues.targetData[i].text;
        }
    }
}

//操作列
function InputListOperateField(value, rowData, rowIndex) {
    var patient_id = rowData.Patient_id;
    var Visit_id = rowData.Visit_id;
    var record_time = rowData.Writing_time;
    var Ward_code = rowData.Ward_code;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + Ward_code + "\",\"" + record_time + "\",this)' >删除</a>";
    return str;
}

//编辑数据
function editInputList(patient_id, Visit_id, record_time, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getHealth_educationList",
            data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
            type: "get",
            success: (function (data) {
                if (data != "null") {
                    var jsonData = $.parseJSON(data);
                    $("#WRITING_TIME").datetimebox("setValue", jsonData[0].Writing_time.replace("T"," "));
                    $("#target_name").combobox("setValue", jsonData[0].Target_name);

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
function delData(patient_id, Visit_id, Ward_Code, record_time, obj) {
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "NurseCare/deleteHealth_education",
                data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&Ward_Code=" + Ward_Code + "&record_time=" + record_time + "",
                type: "get",
                success: (function (data) {
                    clearEditInfo();
                    InitInputData(patient_id, Visit_id);
                })
            });
        }
    })
}

//初始化数据
function InitInputData(Patient_id, Visit_id) {
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getHealth_educationList",
        data: "patient_id=" + Patient_id + "&VISIT_ID=" + Visit_id,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseRecordHealth_EducationList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordHealth_EducationList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}