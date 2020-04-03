$(function () {
    $("#tbDutySet").datagrid({
        width: 480,
        style: { 'text-align': 'center' },
        singleSelect: true,
        nowrap: false,
        columns: [[
            { field: 'RY_NAME', title: '简称', width: 60 },
            { field: 'BC', title: '描述', width: 180 },
            {
                field: 'ID', title: '操作', width: 180, formatter: function (value, row,index) {
                    var id = row.ID;
                    var str = '<a href="#" onclick="edit(' + index + ')">编辑</a>' +
                       '    '+
                         '<a href="#" onclick="del(' + id + ')">删除</a>';
                    return str;
                }
            },

        ]]
    });
    var data = [{ "XH": null, "HLDY": "b01m01", "BC": "晚班", "SJPB": null, "RY_NAME": "P", "ID": "1711031409500" }, { "XH": null, "HLDY": "b01m01", "BC": "夜班", "SJPB": null, "RY_NAME": "N", "ID": "1711031409590" }]
    $("#tbDutySet").datagrid("loadData", data)
});

function edit(index)
{
    var data = $("#tbDutySet").datagrid('getRows')[index];
    $("#txtRY_NAME").textbox('setValue',data.RY_NAME);
    $("#txtBC").textbox('setValue', data.BC);
}
function del(id)
{
    alert(id);
}