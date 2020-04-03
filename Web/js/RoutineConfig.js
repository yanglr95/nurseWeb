var comboTypeItem = [{ text: "每日", value: 1 }, { text: "每周", value: 2 }, { text: "每月", value: 3 }]
var comboExecDayItem = [
    [],
    [{ text: "周日", value: 0 }, { text: "周一", value: 1 }, { text: "周二", value: 2 }, { text: "周三", value: 3 }, { text: "周四", value: 4 }, { text: "周五", value: 5 }, { text: "周六", value: 6 }],
];
$(function () {
    $("#ccType").combobox({
        onSelect: TypeComboChange,
    });
    $("#ccType").combobox('loadData', comboTypeItem);
    var ExecMonthItem = new Array();
    $("#ccType").combobox('setValue', 1);

    for (var i = 1; i <= 31; i++) {
        ExecMonthItem.push({ text: i + "日", value: i });
    }

    $("#ccExecDay").combobox({
        disabled: true
    });

    comboExecDayItem[2] = ExecMonthItem;

    var comboExecTimeItem = new Array();

    for (var i = 0; i < 24; i++) {
        comboExecTimeItem.push({ text: i + "时", value: i });
    }
    comboExecTimeItem.push({ text: "全天", value: -1 });
    $("#ccExecTime").combobox('loadData', comboExecTimeItem);


    $("#tbRoutineConfig").datagrid({
        width: 600,
        style: { 'text-align': 'center' },
        singleSelect: true,
        columns: [[
             { field: 'TypeText', title: '工作周期', width: 80 },
             { field: 'ExecDayText', title: '工作日期', width: 80 },
             { field: 'ExecTimeText', title: '工作时间', width: 80 },
             { field: 'Text', title: '工作内容', width: 240 },
             {
                 field: 'Id', title: '操作', width: 80, formatter: function (value, Rowdata, rowIndex) {
                     var str = "<a href='#' onclick='editConfig(" + rowIndex + ")' >编辑</a>";
                     str += "&nbsp;";
                     str += "<a href='#' onclick='delConfig(" + rowIndex + ")' >删除</a>";
                     return str;
                 }
             },
        ]]
    });
    InitData();
    $("#btnSave").click(saveData);
    $("#btnReset").click(resetData);
})
function TypeComboChange() {
    var type = $("#ccType").combobox("getValue");

    $("#ccExecDay").combobox({
        disabled: (type == 1)
    });
    if (type > 1) {
        $("#ccExecDay").combobox('loadData', comboExecDayItem[type - 1]);
    }
}

function InitData() {
    $("#tbRoutineConfig").datagrid("loadData", { total: 0, rows: [] });
    $.ajax({
        url: BaseData.WebApiUrl + "workplan/getRoutineConfig/",
        type: "get",
        success: (function (data) {
            if (data && data != 'null') {
                var jsonData = $.parseJSON(data);

                $("#tbRoutineConfig").datagrid("loadData", jsonData);
            }
        })
    });
}

var editid = null;
function editConfig(rowIndex) {
    var row = $('#tbRoutineConfig').datagrid('getData').rows[rowIndex];
    editid = row.Id;

    $("#ccType").combobox("setValue", row.Type);
    TypeComboChange();
    $("#ccExecDay").combobox("setValue", row.Exec_Day);
    $("#ccExecTime").combobox("setValue", row.Exec_Time);
    $("#txtWorkInfo").textbox("setValue", row.Text);
}

function delConfig(rowIndex) {
    $.messager.confirm("删除配置", "确定删除配置？", function (r) {
        if (r) {
            var row = $('#tbRoutineConfig').datagrid('getData').rows[rowIndex];
            $.ajax({
                url: BaseData.WebApiUrl + "workplan/delRoutConfig?id=" + row.Id,
                type: "get",
                success: (function (data) {
                    resetData();
                    InitData();
                })
            });
        };
    });
}

function saveData() {
    if($("#txtWorkInfo").textbox('getValue').trim().length==0){
        return $.messager.alert("提示", "请输入内容！");
    }
    var data = new Object();
    if (editid) {
        data.id = editid;
    }
    data.Text = $("#txtWorkInfo").textbox("getValue");
    data.Type = $("#ccType").combobox("getValue");
    data.Exec_Day = $("#ccExecDay").combobox("getValue");
    data.Exec_Time = $("#ccExecTime").combobox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "workplan/saveRoutConfig/",
        data: data,
        type: "post",
        success: (function (data) {
            resetData();
            InitData();
        })
    });

}

function resetData() {

    editid = null;

    $("#ccType").combobox("setValue", 1);
    TypeComboChange();

    $("#ccExecTime").combobox("setValue", 0);
    $("#txtWorkInfo").textbox("setValue", "");
}