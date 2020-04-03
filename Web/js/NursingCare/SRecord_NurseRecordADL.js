
var AttrName = "nurse_eval";
var AttrEval = "eval_name";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "NurseRecordEvlDefaultValues";
var BodyChartDefaultValues = {
    //基本录入选项
    ComoboInput: [{ text: 0, value: 0 },
        { text: 1, value: 1 },
        { text: 2, value: 2 },
        { text: 3, value: 3 },
        { text: 4, value: 4 }],
}

var patient;
//住院号
var hos_num;
var arr = new Array();
var visitid;
var username = null;
//获取全科病人，绑定下拉框
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
            if (data != "null") {
                var jsonData = $.parseJSON(data);
                if (jsonData) {
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
                }
            }
        })
    });
    var date = new Date();
    $('#txtDate').datebox('setValue', dateFormatter(date));
    $('#dtInput').datebox('setValue', dateFormatter(date));

    $("#btnSaveInput").click(saveData);
    $("#btnQuery").click(searchData);
    loadcomoboxData();
   
    var jsonUser = getLoginUser();
    if (jsonUser) {
        username = jsonUser.UserName;
    }
    $("#txtSignatory").textbox("setValue",username);
});

function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}

function formatterTime(value, Rowdata, rowIndex)
{
   return value.substring(0,10)
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
                }
            }
        })
    });
    InitInputData();
}

function InitInputData() {
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getNursingCareAdlList",
        data: "patient_id=" + patient_id ,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseRecordADLList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordADLList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}

function searchData()
{
    var record_time = $("#txtDate").datebox("getValue");
    var Visit_id = 0;
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getNursingCareAdlList",
        data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                $("#tbNurseRecordADLList").datagrid("loadData", jsonData);
            } else {
                $("#tbNurseRecordADLList").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}

function loadcomoboxData()
{
    $("#combojss").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combomy").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combocyxs").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#comborc").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combocshd").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combozw").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combozd").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combosxlt").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combogw").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combopr").combobox("loadData", BodyChartDefaultValues.ComoboInput);
    $("#combolj").combobox("loadData", BodyChartDefaultValues.ComoboInput);
}

//获取住院号
function getHosNum()
{
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getPatMasterIndex_Inp_No",
            data: "patient_id=" + patient.Patient_id,
            type: "get",
            async:false,
            success: function (data)
            {
                if (data != "null") {
                    var jsondata = $.parseJSON(data);
                    hos_num = jsondata[0].Inp_no;
                }
            }
        })
}

function InputListOperateField(value, rowData, rowIndex) {
    var patient_id = rowData.Patient_id;
    var Visit_id = rowData.Visit_id;
    var record_time = rowData.Record_time;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",this)' >删除</a>";
    return str;
}

function editInputList(patient_id, Visit_id, record_time, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getNursingCareAdlList",
            data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
            type: "get",
            success: (function (data) {
                if (data!="null") {
                    var jsonData = $.parseJSON(data);
                    $("#dtInput").datebox("setValue", jsonData[0].Record_time);
                    var content = jsonData[0].Content;
                    var data = content.split("/");
                    $("#combojss").combobox("setValue", data[0] == "" ? 0 : data[0])
                    $("#combomy").combobox("setValue", data[1] == "" ? 0 : data[1])
                    $("#combocyxs").combobox("setValue", data[2]==""?0:data[2])
                    $("#comborc").combobox("setValue", data[3] == "" ? 0 : data[3])
                    $("#combocshd").combobox("setValue", data[4] == "" ? 0 : data[4])
                    $("#combozw").combobox("setValue", data[5] == "" ? 0 : data[5])
                    $("#combozd").combobox("setValue", data[6] == "" ? 0 : data[6])
                    $("#combosxlt").combobox("setValue", data[7] == "" ? 0 : data[7])
                    $("#combogw").combobox("setValue", data[8] == "" ? 0 : data[8])
                    $("#combopr").combobox("setValue", data[9] == "" ? 0 : data[9])
                    $("#combolj").combobox("setValue", data[10] == "" ? 0 : data[10])
                }
                $(obj).html("取消");
            })
        });
    }
    else {
        $(obj).html("编辑");
        clear();
    }
}

function clear()
{
    $("#combojss").combobox("setValue",0 )
    $("#combomy").combobox("setValue", 0)
    $("#combocyxs").combobox("setValue", 0 )
    $("#comborc").combobox("setValue", 0 )
    $("#combocshd").combobox("setValue", 0)
    $("#combozw").combobox("setValue",  0 )
    $("#combozd").combobox("setValue",  0)
    $("#combosxlt").combobox("setValue", 0 )
    $("#combogw").combobox("setValue",  0 )
    $("#combopr").combobox("setValue",  0 )
    $("#combolj").combobox("setValue",  0)
}

function delData(patient_id, Visit_id, record_time, obj)
{
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "NurseCare/deleteNursingCareAdl",
                data: "patient_id=" + patient_id + "&Visit_id=" + Visit_id + "&record_time=" + record_time + "",
                type: "get",
                success: (function (data) {
                    clear();
                    InitInputData();
                })
            });
        }
    })
}

function saveData() {
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    getHosNum();
   
    var content = "", ability = "";
    var recording_Date = $("#dtInput").datebox("getValue");

    var combojss = $("#combojss").combobox("getValue") == "" ? 0 :$("#combojss").combobox("getValue");
    var combomy = $("#combomy").combobox("getValue") == "" ? 0 : $("#combomy").combobox("getValue");
    var combocyxs = $("#combocyxs").combobox("getValue") == "" ? 0 :$("#combocyxs").combobox("getValue");
    var comborc = $("#comborc").combobox("getValue") == "" ? 0 : $("#comborc").combobox("getValue");
    var combocshd = $("#combocshd").combobox("getValue") == "" ? 0 :$("#combocshd").combobox("getValue");
    var combozw = $("#combozw").combobox("getValue") == "" ? 0 :$("#combozw").combobox("getValue");
    var combozd = $("#combozd").combobox("getValue") == "" ? 0 :$("#combozd").combobox("getValue");
    var combosxlt = $("#combosxlt").combobox("getValue") == "" ? 0 :$("#combosxlt").combobox("getValue");
    var combogw = $("#combogw").combobox("getValue") == "" ? 0 :$("#combogw").combobox("getValue");
    var combopr = $("#combopr").combobox("getValue") == "" ? 0 :$("#combopr").combobox("getValue");
    var combolj = $("#combolj").combobox("getValue") == "" ? 0 :$("#combolj").combobox("getValue");

    content = combojss + "/" + combomy + "/" + combocyxs + "/" + comborc + "/" + combocshd + "/" + combozw + "/" + combozd + "/" + combosxlt + "/" + combogw + "/" + combopr + "/" + combolj;

    var sum = parseInt(combojss) + parseInt(combomy) + parseInt(combocyxs) + parseInt(comborc) + parseInt(combocshd) + parseInt(combozw) + parseInt(combozd) + parseInt(combosxlt) + parseInt(combogw) + parseInt(combopr) + parseInt(combolj);

    if (sum == 0) {
        ability = "完全自理";
    }
    if (sum <= 43 && sum >= 1) {
        ability = "部分自理";
    }
    if (sum == 44) {
        ability = "完全不能自理";
    }

    var postData = "";
    postData += '{';

    postData += '"Patient_id":"' + patient.Patient_id + '",';
    postData += '"Visit_id":"' + patient.Visit_id + '",';
    postData += '"Dept_name":"' + patient.Dept_name + '",';
    postData += '"BED_LABEL":"' + patient.Bed_No + '",';
    postData += '"PATIENT_NAME":"' + patient.Name + '",';
    postData += '"PATIENT_SEX":"' + patient.Sex + '",';
    postData += '"PATIENT_AGE":"' + patient.Age + '",';
    postData += '"ADMISSION_NO":"' + hos_num + '",';
    postData += '"Record_Time":"' + recording_Date + '",';
    postData += '"CONTENT":"' + content + '",';
    postData += '"SIGNATURE":"' + username + '",';
    postData += '"SUM":"' + sum + '",';
    postData += '"ABILITY":"' + ability + '",';

    postData += "}";
    postData = "[" + postData + "]";

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/saveNurseRecordADL",
        data: { '': postData },
        type: "post",
        success: function (data) {
            $.messager.alert("提示", data);
            clear();
            InitInputData();
        }
    })
}