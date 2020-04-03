var lastIndex;
var NursingTechniques;
$(function () {
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
                    { field: 'DiseaseName', title: '病种', width: 120 },
                    { field: 'SymptomName', title: '症状', width: 120 },
                    {
                        field: 'insertIndex', title: '操作', width: 60, formatter: function (value, row, rowIndex) {

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
                            return "<a href='#' onclick='delTech(" + rowIndex + ")'>删除</a> <a href='#' onclick='saveTech(" + rowIndex + ")'>保存</a>";
                        }
                    },
                ]],
                onClickRow: function (rowIndex) {

                    if (lastIndex != rowIndex) {
                        $('#tbNursingProgram').datagrid('endEdit', lastIndex);
                        $('#tbNursingProgram').datagrid('beginEdit', rowIndex);
                        MergeGrid();
                    }
                    lastIndex = rowIndex;
                },
                onBeforeEdit: function (index, row) {
                    row.editing = true;
                    updateActions(index);
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
                onCancelEdit: function (index, row) {
                    row.editing = false;
                    updateActions(index);
                }
            });
            initData();
        })
    });

    $('[editwindow]').window({
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closed: true
    });
})
function initData() {
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getNursingProgramSettingData",
        type: "get",
        success: (function (data) {
            if (data) {
                var jsonData = $.parseJSON(data);
                var insertIndex = 0;
                var symID = -1;
                for (var t in jsonData) {
                    if (jsonData[t].SymptomID != symID) {
                        symID = jsonData[t].SymptomID;
                        insertIndex += jsonData[t].TechCount;
                    }
                    jsonData[t].insertIndex = insertIndex;
                    //jsonData[t].isNew = (jsonData[t].TechID == null);
                }
                $("#tbNursingProgram").datagrid("loadData", jsonData);
                MergeGrid();
            }
        })
    });
}
function updateActions(index) {
    $('#tbNursingProgram').datagrid('updateRow', {
        index: index,
        row: {}
    });
}
function MergeGrid() {
    MergeCells("tbNursingProgram", "DiseaseName,SymptomName,insertIndex");
}
function addTech(rowIndex) {

    var rows = $('#tbNursingProgram').datagrid('getRows');
    var insertIndex = rows[rowIndex].insertIndex;
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
    r.insertIndex = insertIndex + 1;
    var SymName = rows[rowIndex].SymptomName
    for (var i in rows) {
        if (rows[i].insertIndex >= insertIndex) {
            rows[i].insertIndex += 1;
        }
        if (rows[i].SymptomName == SymName) {
            rows[i].TechCount += 1;
            var techCount = rows[i].TechCount;
        }
    }
    r.TechCount = techCount;
    $('#tbNursingProgram').datagrid("insertRow", { index: insertIndex, row: r });

    $('#tbNursingProgram').datagrid("loadData", rows);
    MergeGrid();

}
function delTech(rowIndex) {
    var rows = $('#tbNursingProgram').datagrid('getRows');
    var row = rows[rowIndex];
    if (row.Stid != null && row.Stid != "") {

        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/delNursingProgramSetting?id=" + row.Stid,
            type: "get",

            success: (function (r) {
                initData();
            })
        });
        return;
    }
    var SymName = rows[rowIndex].SymptomName
    if (rows[rowIndex].TechCount == 1) {
        rows[rowIndex].TechName = "";
        rows[rowIndex].TechID = "";
        rows[rowIndex].Days = null;
        rows[rowIndex].Times = null;
        rows[rowIndex].Memo = "";

    }
    else {
        var insertIndex = rows[rowIndex].insertIndex;
        $('#tbNursingProgram').datagrid("deleteRow", rowIndex);

        for (var i in rows) {
            if (rows[i].insertIndex >= insertIndex) {
                rows[i].insertIndex -= 1;
            }
            if (rows[i].SymptomName == SymName) {

                rows[i].TechCount -= 1;

            }
        }
    }
    $('#tbNursingProgram').datagrid("loadData", rows);
    MergeGrid();
}
function saveTech(rowIndex) {
    $('#tbNursingProgram').datagrid('endEdit', lastIndex);
    MergeGrid();
    var rows = $('#tbNursingProgram').datagrid('getRows')[rowIndex];

    //rows[rowIndex].isNew = false;
    //$('#tbNursingProgram').datagrid("loadData", rows);
    //MergeGrid();
    if (rows.TechID == null || rows.TechID == "") {
        $.messager.alert("提示", "请选择一种护理技术！");
        return;
    }
    var data = JSON.stringify(rows);

    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/saveTCMProgramSetting",
        type: "post",
        data: { '': data },
        success: (function (r) {
            initData();
        })
    });
}



//添加病种
function addDisease()
{
    $('#divaddbz').window('open');
}

//$('#divaddbz').window({
//    modal: true,
//    collapsible: false,
//    minimizable: false,
//    maximizable: false,
//    closed: true
//});

//添加症状
function addSymptom()
{

}