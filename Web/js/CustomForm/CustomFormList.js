var template = null;
var patient;
$(function () {
    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient
    });


    $("#tbFormList").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        nowrap: false,
        columns: [[
             //{ field: 'Name', title: '表单名称', width: 240 },
             { field: 'Create_Date', title: '创建日期', width: 80, formatter: function (value) { return dateFormatter(new Date(value)) } },
             { field: 'Db_User_Name', title: '创建人', width: 80 },
             { field: 'Edit_Time', title: '修改日期', width: 80, formatter: function (value) { return dateFormatter(new Date(value)) } },
             {
                 field: 'Id', title: '操作', width: 240, formatter: function (value, row) {
                     return "<a href='#' onclick='editForm(" + value + ")' >编辑</a>&nbsp;<a href='#' onclick='viewForm("
                         + value + ")' >查看</a> &nbsp;<a href='#' onclick='delForm(" + value + ")' >删除</a>"
                 }
             },
        ]]
    });
    var tid;
    var para = document.location.search.split('?')
    for (var i in para) {
        if (para[i].indexOf('tid=') > -1) {
            tid = para[i].substr(4);
            break;
        }
    }
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    if (tid) {
        $.ajax({
            url: BaseData.WebApiUrl + "CustomForm/getTemplate",
            data: { template_id: tid },
            type: "get",
            success: (function (data) {
                template = $.parseJSON(data);
                $("#spanTitle").html(template.Name)
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


                            //$("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                            //patient = jsonData[0];
                            //PatientsComboChange();

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
            })
        });
    }


    $('#dd').dialog({
        closed: true,
        cache: false,
        modal: true,
        buttons: [{
            text: '创建',
            handler: function () {
                $('#dd').dialog("close")
                var name = $("#txtFormName").textbox("getValue");
                if (template) {
                    $.ajax({
                        url: BaseData.WebApiUrl + "CustomForm/createCustomForm",
                        data: { template_id: template.Id, name: name },
                        type: "get",
                        success: (function (data) {
                            editForm(data, name);
                            initData();
                        })
                    })
                }
            }

        }, {
            text: '取消',
            handler: function () {
                $('#dd').dialog("close")
            }
        }]
    });
    $('#win').window({
        width: 1040,
        height: 650,
        modal: true,
        maximizable: false,
        minimizable: false,
        collapsible: false,
        closed: true
    });
    $('#dd').dialog("close")
    $('#win').window("close")
})
function PatientsComboChange() {
    var patient_id = $("#ccPatients").combobox('getValue');
    $("#frameMain").attr("src", "")
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientInfoByPatientID",
        data: "patientid=" + patient_id,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {

                SetTableValue("tabPatientInfo", jsonData);
                patient = jsonData;
                initData();

                removeSession("patient_id");
                setSession(patient_id);
            }
        })
    })

}
function initData() {
    if (template) {
        $("#tbFormList").datagrid("loadData", { total: 0, rows: [] });
        $.ajax({
            url: BaseData.WebApiUrl + "CustomForm/getCustomForm",
            data: { template_id: template.Id, patient_id: patient.Patient_id, visit_id: patient.Visit_id },
            type: "get",
            success: (function (data) {
                var jsonData = $.parseJSON(data);
                $("#tbFormList").datagrid("loadData", jsonData);
            })
        })
    }
}
function addForm() {
    //if (template) {
    //    $("#txtFormName").textbox("setValue", template.Name + "_" + dateTimeFormatter(new Date(), 'yyyymmddhhmi'));
    //    $('#dd').dialog("open")
    //}
    //var name = $("#txtFormName").textbox("getValue");
    if (template) {
        $.ajax({
            url: BaseData.WebApiUrl + "CustomForm/createCustomForm",
            data: { template_id: template.Id, patient_id: patient.Patient_id, visit_id: patient.Visit_id },
            type: "get",
            success: (function (data) {
                editForm(data);
                initData();
            })
        })
    }
}

function editForm(fid) {
    //$('#win').window({
    //    title: fName
    //});
    //$('#win').window("open")
    $("#frameMain").attr("src", "CustomFormInput.html?fid=" + fid)
}
function viewForm(fid) {
    //$('#win').window({
    //    title: fName
    //});
    //$('#win').window("open")
    $("#frameMain").attr("src", "CustomFormView.html?fid=" + fid)
}
function delForm(fid) {
    $.messager.confirm('删除记录', '确定删除记录？', function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "CustomForm/delCustomForm",
                data: { form_id: fid },
                type: "get",
                success: (function () {
                    initData();
                })
            })
        }
    });
   
}
function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}