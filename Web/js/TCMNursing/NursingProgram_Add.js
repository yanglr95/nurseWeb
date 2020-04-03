var patient;
var patient_id;
var lastIndex;
var NursingProgramSettingData;
var DiseaseData;
var NursingTechniques;
$(function () {

    $("#ccPatients").combobox({
        onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
    });


    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getTCMDisease",

        type: "get",
        success: (function (data) {

            DiseaseData = $.parseJSON(data);
            $("#ccDisease").combobox({
                data: DiseaseData,
                editable: false,
                onSelect: function (obj) {
                    if (patient) {
                        var data = new Array();
                        var SymptomID = -1;
                        var insertIndex = 0;
                        var settingData = ObjDeepCopy(NursingProgramSettingData);
                        for (var d in settingData) {
                            if (settingData[d].DiseaseID == obj.Id) {
                                if (settingData[d].SymptomID != SymptomID) {
                                    SymptomID = settingData[d].SymptomID;
                                    insertIndex += settingData[d].TechCount
                                }
                                settingData[d].InsertIndex = insertIndex;
                                data.push(settingData[d]);

                            }
                        }
                        $("#tbNursingProgram").datagrid("loadData", data);
                        MergeGrid();
                    }
                    else {
                        $.messager.alert("提示", "请选择病人！");
                    }
                }
            });
            $.ajax({
                url: BaseData.WebApiUrl + "TCMNursing/getTCMTech",

                type: "get",
                success: (function (data) {

                    NursingTechniques = $.parseJSON(data);
                    $("#tbNursingProgram").datagrid({
                        width: '98%',
                        style: { 'text-align': 'center' },
                        singleSelect: true,
                        nowrap: false,
                        columns: [[


                            { field: 'SymptomName', title: '症状', width: 120 },
                            {
                                field: 'InsertIndex', title: '操作', width: 60, formatter: function (value, row, rowIndex) {

                                    var str = "<a href='#' onclick='addTech(" + rowIndex + ")'>添加技术</a> "
                                    return str;
                                }
                            },
                            {
                                field: 'TechID', title: '使用技术', width: 80, formatter: function (value, row) {
                                    return row.TechName;
                                },
                                editor: {
                                    type: 'combobox',
                                    options: {
                                        valueField: 'TechID',
                                        textField: 'TechName',
                                        data: NursingTechniques,
                                        editable: false
                                    }
                                }
                            },

                            { field: 'Days', title: '天', width: 60, editor: { type: 'numberbox', options: { precision: 0 } } },
                            { field: 'Times', title: '次', width: 60, editor: { type: 'numberbox', options: { precision: 0 } } },
                            { field: 'Memo', title: '描述', width: 300, editor: 'textbox' },
                             {
                                 field: 'isNew', title: '操作', width: 100, formatter: function (value, row, rowIndex) {
                                     return "<a href='#' onclick='delTech(" + rowIndex + ")'>删除</a> ";
                                 }
                             },
                        ]],
                        onClickRow: function (rowIndex, row) {
                            $('#tbNursingProgram').datagrid('endEdit', lastIndex);
                            $('#tbNursingProgram').datagrid('beginEdit', rowIndex);
                            MergeGrid();
                            lastIndex = rowIndex;
                        },
                        onAfterEdit: function (index, row) {
                            for (var i in NursingTechniques) {
                                if (NursingTechniques[i].TechID == row.TechID) {
                                    row.TechName = NursingTechniques[i].TechName;
                                    break;
                                }
                            }
                            row.editing = false;
                            updateActions(index);
                        },
                    });

                })
            });
        })
    });



    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getNursingProgramSettingData",

        type: "get",
        success: (function (data) {

            NursingProgramSettingData = $.parseJSON(data);
        })
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
                if (patient_id) {
                    $("#ccPatients").combobox('setValue', patient_id);
                    PatientsComboChange();
                }
                //  $("#ccPatients").combobox('setValue', jsonData[0].Patient_id);
                //     PatientsComboChange();

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
function updateActions(index) {
    $('#tbNursingProgram').datagrid('updateRow', {
        index: index,
        row: {}
    });
}
function delTech(rowIndex) {
    var rows = $('#tbNursingProgram').datagrid('getRows');
    var row = rows[rowIndex];

    var SymName = rows[rowIndex].SymptomName
    if (row.TechCount == 1) {
        row.TechName = "";
        row.TechID = "";
        row.Days = null;
        row.Times = null;
        row.Memo = "";

    }
    else {
        var insertIndex = rows[rowIndex].InsertIndex;
        $('#tbNursingProgram').datagrid("deleteRow", rowIndex);

        for (var i in rows) {
            if (rows[i].InsertIndex >= insertIndex) {
                rows[i].InsertIndex -= 1;
            }
            if (rows[i].SymptomName == SymName) {

                rows[i].TechCount -= 1;

            }
        }
    }
    $('#tbNursingProgram').datagrid("loadData", rows);
    MergeGrid();
}

function addTech(rowIndex) {

    var rows = $('#tbNursingProgram').datagrid('getRows');
    var insertIndex = rows[rowIndex].InsertIndex;
    // console.log(rowIndex + " " + insertIndex + " " + rows[insertIndex - 1].isNew)


    var r = new Object();
    r.DiseaseName = rows[rowIndex].DiseaseName;
    r.SymptomName = rows[rowIndex].SymptomName;
    r.SymptomID = rows[rowIndex].SymptomID;
    r.TechName = "";
    r.TechID = "";
    r.Days = "";
    r.Times = "";
    r.Memo = "";
    r.isNew = true;
    r.InsertIndex = insertIndex + 1;
    var SymName = rows[rowIndex].SymptomName
    for (var i in rows) {
        if (rows[i].InsertIndex >= insertIndex) {
            rows[i].InsertIndex += 1;
        }
        if (rows[i].SymptomName == SymName) {
            rows[i].TechCount += 1;
            var techCount = rows[i].TechCount;
        }
    }
    r.TechCount = techCount;
    $('#tbNursingProgram').datagrid("insertRow", { index: insertIndex, row: r });

    //$('#tbNursingProgram').datagrid("loadData", rows);
    MergeGrid();

}
function saveData() {
    $('#tbNursingProgram').datagrid('endEdit', lastIndex);
    var rows = $('#tbNursingProgram').datagrid('getRows');
  
    var postData = new Object();
    postData.Patient_id = patient.Patient_id;
    postData.Visit_id = patient.Visit_id;
    postData.Disease_ID = $("#ccDisease").combobox("getValue");
    postData.TechList = new Array();
    for (var i in rows) {
        if (rows[i].TechID != null && rows[i].TechID != "") {
            postData.TechList.push(rows[i]);
        }
    }
    if (postData.TechList.length == 0) {
        $.messager.alert("提示", "没有需要保存的项目！")
    }
    else {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/saveTCMProgram",
            type: "post",
            data: { '': JSON.stringify(postData) },
            success: (function (r) {
                initData();
            })
        });
    }
}
function initData() {
    //var rows = new Array();
    //var r = new Object();
    //r.DiseaseID = "请选择";
    //r.DiseaseName = "请选择";
    //r.ProgramDate = dateTimeFormatter(new Date(), "yyyy-mm-dd");
    //r.SymptomName = "";
    //r.TechName = "";
    //r.TechID = "";
    //r.Days = "";
    //r.Times = "";
    //r.Memo = "";
    //r.isNew = true;
    //rows.push(r)
    //$('#tbNursingProgram').datagrid("loadData", rows);
    ////   $('#tbNursingProgram').datagrid("appendRow", r);
    //MergeGrid()

    $('#tbNursingProgram').datagrid("loadData", { total: 0, rows: [] });

    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getTCMDisease",
        type: "get",
        success: (function (data) {
            DiseaseData = $.parseJSON(data);
            var id = $("#ccDisease").combobox("getValue");
            if (id !=null) {
                if (patient) {
                    var data = new Array();
                    var SymptomID = -1;
                    var insertIndex = 0;
                    var settingData = ObjDeepCopy(NursingProgramSettingData);
                    for (var d in settingData) {
                        if (settingData[d].DiseaseID == id) {
                            if (settingData[d].SymptomID != SymptomID) {
                                SymptomID = settingData[d].SymptomID;
                                insertIndex += settingData[d].TechCount
                            }
                            settingData[d].InsertIndex = insertIndex;
                            data.push(settingData[d]);
                        }
                    }
                    $("#tbNursingProgram").datagrid("loadData", data);
                    MergeGrid();
                }
                else {
                    $.messager.alert("提示", "请选择病人！");
                }
            }
        })
   })
}


function MergeGrid() {
    MergeCells("tbNursingProgram", "SymptomName,InsertIndex");
}

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
                initData();

                removeSession("patient_id");
                setSession(patient_id);
            }
        })
    })
}
function tdDateFormatter(jsonObj) {
    var date = jsonObj.Admission_Date_Time.replace(/-/g, "/").replace(/T/g, " ");;
    return dateTimeFormatter(new Date(date), "yyyy-mm-dd");
}