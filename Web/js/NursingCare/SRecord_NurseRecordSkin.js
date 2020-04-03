
var patient_id;
var AttrName = "nurse_skin";
var JsonPro = "vital_sign:";
var NurseRecordEvlDefaultValues = {
    BanCiData:[{ text: "早班", value: "1" },
          { text: "中班", value: "2" },
          { text: "晚班", value: "3" }],

    hongzhongData: [{ text: "加重", value: "1" },
          { text: "无变化", value: "2" },
          { text: "减轻", value: "3" },
          { text: "无红肿", value: "4" }],

    shenxueshenyeData:[{ text: "加重", value: "1" },
          { text: "无变化", value: "2" },
          { text: "减少", value: "3" },
          { text: "无渗出", value: "4" }],

    kuiyanmianjiData: [{ text: "加重", value: "1" },
          { text: "无变化", value: "2" },
          { text: "减小", value: "3" },
          { text: "无溃疡", value: "4" }],

    huanongData: [{ text: "加重", value: "1" },
          { text: "无变化", value: "2" },
          { text: "减少", value: "3" },
          { text: "无化脓", value: "4" }],

    huaisimianjiData: [{ text: "加重", value: "1" },
         { text: "无变化", value: "2" },
         { text: "减小", value: "3" },
         { text: "无坏死", value: "4" }],

    echouData: [{ text: "加重", value: "1" },
         { text: "无变化", value: "2" },
         { text: "减轻", value: "3" },
         { text: "无恶臭", value: "4" }]
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

    $("#btnSaveInput").click(savedata);

    $("#btnQuery").click(searchdata);

    loadusername();
    loaddictdata();
    var date = new Date();
    $('#RECORDDATE').datebox('setValue', dateFormatter(date));
    
    $("#Type1").click(function () {
        if ($("#Type1").prop('checked')) {
            $("#thycbw").hide();
            $("#tdbuwei").hide();
        }else{
            $("#tdbuwei").show();
            $("#thycbw").show();
        }
    })
});

//加载护士签名
function loadusername()
{
    var username;
    var jsonUser = getLoginUser();
    if (jsonUser) {
        username = jsonUser.UserName;
    }
    $("#QIANMING").textbox("setValue", username);
}

//加载班次,红肿,渗血渗液,溃疡面积,化脓,坏死面积,恶臭等下拉框数据
function loaddictdata()
{
    $("#Banci").combobox("loadData", NurseRecordEvlDefaultValues.BanCiData);
    $("#hongzhong").combobox("loadData", NurseRecordEvlDefaultValues.hongzhongData);
    $("#shenxueshenye").combobox("loadData", NurseRecordEvlDefaultValues.shenxueshenyeData);
    $("#kuiyanmianji").combobox("loadData", NurseRecordEvlDefaultValues.kuiyanmianjiData);
    $("#huanong").combobox("loadData", NurseRecordEvlDefaultValues.huanongData);
    $("#huaisimianji").combobox("loadData", NurseRecordEvlDefaultValues.huaisimianjiData);
    $("#echou").combobox("loadData", NurseRecordEvlDefaultValues.echouData);
}

function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
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

                    InitInputData(patient.Patient_id, patient.Visit_id, null, null);
                }
            }
        })
    })
}

//格式化日期显示数据
function formatterTime(value, Rowdata, rowIndex) {
    return value.substring(0, 10)
}

//格式化班次显示数据
function FormatterBanci(value, Rowdata, rowIndex)
{
    for (var i = 0; i < NurseRecordEvlDefaultValues.BanCiData.length; i++) {
        if (NurseRecordEvlDefaultValues.BanCiData[i].value == value || NurseRecordEvlDefaultValues.BanCiData[i].text == value) {
            return NurseRecordEvlDefaultValues.BanCiData[i].text;
        }
    }
}

function InputListOperateField(value, rowData, rowIndex) {
    var patient_id = rowData.Pid;
    var Visit_id = rowData.Vid;
    var record_time = rowData.Recorddate;
    var banci = rowData.Banci;
    var inserttime = rowData.Inserttime;
    var type = rowData.Type;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",\"" + banci + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + patient_id + "\",\"" + Visit_id + "\",\"" + record_time + "\",\"" + inserttime + "\",\"" + banci + "\",\"" + type + "\",this)' >删除</a>";
    return str;
}

function editInputList(patient_id, Visit_id, recorddate, banci, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "NurseCare/getPressNursingRecordList",
            data: "pid=" + patient_id + "&vid=" + Visit_id + "&recorddate=" + recorddate + "&banci=" + banci + "",
            type: "get",
            success: (function (data) {
                if (data != "null") {
                    var jsonData = $.parseJSON(data);
                    $("#RECORDDATE").datebox("setValue", jsonData[0].Recorddate.replace("T", " "));
                    $("#Banci").combobox("setValue", jsonData[0].Banci);

                    if (jsonData[0].Type == 2) {
                        $("#Type1").prop("checked", true);
                        $("#Buwei").textbox("setValue", "");
                    } else {
                        $("#Buwei").textbox("setValue", jsonData[0].Buwei);
                    }

                    var chuangmian = jsonData[0].Chuangmian.split(",");
                    $("#hongzhong").combobox("setValue", chuangmian[0]);
                    $("#shenxueshenye").combobox("setValue", chuangmian[1]);
                    $("#kuiyanmianji").combobox("setValue", chuangmian[2]);
                    $("#huanong").combobox("setValue", chuangmian[3]);
                    $("#huaisimianji").combobox("setValue", chuangmian[4]);
                    $("#echou").combobox("setValue", chuangmian[5]);

                    $("#Mianji").textbox("setValue", jsonData[0].Mianji);
                    $("#CUOSHIQITA").textbox("setValue", jsonData[0].Cuoshiqita);
                    $("#NEXTSTEPE").textbox("setValue", jsonData[0].Nextstepe);

                    $("#checks").find("input[" + AttrName + "]").each(function (index, obj) {
                          var strName = $(obj).attr("id").replace("txt", "");
                          setDataList(jsonData[0], strName);
                          if (jsonData[0].Type == 1) {
                              $("#inputTabs").find("input[name='Buwei']").each(function (inputIndex) {
                                  $(this).prop("checked", false);
                                  $(this).removeAttr("checked");
                                  strVar = $(this).attr("id");
                                  $("#" + strVar).removeClass("ui-checkbox-on");
                                  $("#" + strVar).addClass("ui-checkbox-off");
                              });
                          }
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
function delData(patient_id, Visit_id, record_time, inserttime, banci, type, obj) {
        $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "NurseCare/delPressNursingRecordData",
                data: "pid=" + patient_id + "&vid=" + Visit_id + "&recorddate=" + record_time + "&inserttime=" + inserttime + "&banci=" + banci + "&type=" + type + "",
                type: "get",
                success: (function (data) {
                    clearEditInfo();
                    InitInputData(patient_id, Visit_id, null, null)
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

//获取下拉框选中数据
function GetCheckboxValues()
{
    //压疮分期
    var Fenqi = GetDataList("Fenqi");
    $("#txtFenqi").textbox("setValue", Fenqi);
    //护理措施
    var Cuoshi = GetDataList("Cuoshi");
    $("#txtCuoshi").textbox("setValue", Cuoshi);
    //压疮部位
    var Buwei = GetDataList("Buwei");
    $("#txtBuwei").textbox("setValue", Buwei);
}

//保存数据
function savedata()
{
    if (!patient) {
        $.messager.alert("提示", "请选择病人！");
        return;
    }
    //班次
    var banci = $("#Banci").combobox("getValue");
    if (banci == "") {
        $.messager.alert("提示", "请选择班次！");
        return;
    }

    GetCheckboxValues();

    var hour = "";
    var recordtime = "";
    switch (banci)
    {
        case "1":
            hour = " 08:00:00";
            break;
        case "2":
            hour = " 16:00:00";
            break;
        case "3":
            hour = " 21:00:00";
            break;
        default:
            break;
    }

    recordtime = $("#RECORDDATE").combobox("getValue") + hour;

    var type = "";
    var Buwei = "";
    //周评估
    if ($("#Type1").prop('checked')) {
        type = "2";
        Buwei = $("#txtBuwei").val();
    }
    else {
        type = "1";
        Buwei = $("#Buwei").textbox("getValue");
    }
    //创面情况
    var Chuangmian = $("#hongzhong").combobox("getValue") + "," + $("#shenxueshenye").combobox("getValue") + "," + $("#kuiyanmianji").combobox("getValue") + "," +
                     $("#huanong").combobox("getValue") + "," + $("#huaisimianji").combobox("getValue") + "," + $("#echou").combobox("getValue");

    var postData = "";
    postData += '{';

    postData += '"Pid":"' + patient.Patient_id + '",';
    postData += '"Vid":"' + patient.Visit_id + '",';
    postData += '"Recorddate":"' + $("#RECORDDATE").datebox("getValue") + '",';
    postData += '"Banci":"' + banci + '",';
    postData += '"Recordtime":"' + recordtime + '",';
    postData += '"Buwei":"' + Buwei + '",';
    postData += '"Mianji":"' + $("#Mianji").textbox("getValue") + '",';
    postData += '"Fenqi":"' + $("#txtFenqi").val() + '",';
    postData += '"Cuoshiqita":"' + $("#CUOSHIQITA").textbox("getValue") + '",';
    postData += '"Cuoshi":"' + $("#txtCuoshi").val() + '",';
    postData += '"Qianming":"' + $("#QIANMING").val() + '",';
    postData += '"Type":"' + type + '",';
    postData += '"Chuangmian":"' + Chuangmian + '",';
    postData += '"Nextstepe":"' + $("#NEXTSTEPE").textbox("getValue") + '"';

    postData += "}";
    postData = "[" + postData + "]";

    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/savePressNursingRecordData",
        data: { '': postData },
        type: "post",
        success: function (data) {
            $.messager.alert("提示", data);
            clearEditInfo();
            InitInputData(patient.Patient_id, patient.Visit_id, null, null)
        }
    })
}

//清空数据
function clearEditInfo()
{
    $("#Banci").combobox("setValue", "");
    $("#Buwei").textbox("setValue", "");
    $("#Mianji").textbox("setValue", "");

    $("#hongzhong").combobox("setValue", "");
    $("#shenxueshenye").combobox("setValue", "");
    $("#kuiyanmianji").combobox("setValue", "");
    $("#huanong").combobox("setValue", "");
    $("#huaisimianji").combobox("setValue", "");
    $("#echou").combobox("setValue", "");
    
    $("#CUOSHIQITA").textbox("setValue", "");
    $("#NEXTSTEPE").textbox("setValue", "");

    $("#inputTabs").find("input[type='checkbox']").each(function (inputIndex) {
        $(this).prop("checked", false);
        $(this).removeAttr("checked");
        strVar = $(this).attr("id");
        $("#" + strVar).removeClass("ui-checkbox-on");
        $("#" + strVar).addClass("ui-checkbox-off");
    });
}

//查询数据
function searchdata() {
    InitInputData(patient_id, null, $("#txtDate").textbox("getValue"), null);
}

//初始化数据
function InitInputData(Patient_id, Visit_id, recorddate, banci)
{
    $.ajax({
        url: BaseData.WebApiUrl + "NurseCare/getPressNursingRecordList",
        type: "get",
        data: "pid=" + Patient_id + "&vid=" + Visit_id + "&recorddate="+recorddate+"&banci="+banci+"",
        success: function (data) {
            if (data != "null") {
                jsonData = $.parseJSON(data);
                $("#tbNurseRecordSkinList").datagrid("loadData", jsonData);
            }else{
                $("#tbNurseRecordSkinList").datagrid("loadData", { total: 0, rows: [] });
            }
        }
    })
}