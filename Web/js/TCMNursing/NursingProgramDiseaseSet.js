var ID = 0;
$(function () {

    $("#DiseaSetList").show();
    getNuringProgramDiseaseData(0)
})

//查询数据
function getNuringProgramDiseaseData(isfalg)
{
    var name = $("#txtNAME").textbox('getValue');
    var Description = $("#txtDescription").val();
    var status="";
    if (isfalg==1) {
         status = $("input[type='radio']:checked").val();
    }
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getNuringProgramDiseaseData",
        data: "name=" + name + "&Coefficient=" + Description + "&status=" + status+"",
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            $("#DiseaSetList").datagrid("loadData", jsonData);
        })
    });
}

//清空数据
function clearData()
{
    ID = 0;
    $("#txtNAME").textbox('setValue', "");
    $("#txtDescription").val("");
    $("input[name='STATUS'][value=1]").attr("checked", true);
}

function formatStatus(value,row)
{
    var strstatus = "";
    if (value == 1) {
        strstatus = "启用";
    } else {
        strstatus = "禁用";
    }
    return strstatus;
}

//保存数据
function saveData()
{
    var postData = "";
    postData += '[{';
    postData += '"Id":' + ID + ',';
    postData += '"name":"' +  $("#txtNAME").textbox('getValue') + '",';
    postData += '"Description":"' + $("#txtDescription").val() + '",';
    postData += '"status":"' +$("input[type='radio']:checked").val() + '",';
    postData += "}]";
    
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/saveNuringProgramDisease",
        type: "post",
        data: { '': postData},
        success: (function (r)
        {
            $.messager.alert("提示", "保存成功！")
            clearData();
            getNuringProgramDiseaseData(0);
        })
    });
}

function InputListOperateField(value, rowData, rowIndex) {
    id = rowData.Id;
    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + id + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + id + "\",this)' >删除</a>";
    return str;
}

//编辑数据
function editInputList(id, obj) {
    var state = $(obj).html();
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/getTCMDiseaseById",
            data: "id=" + id,
            type: "get",
            success: (function (data) {
                var jsonData = $.parseJSON(data);
                $('#txtNAME').textbox("setValue", jsonData[0].Name);
                $('#txtDescription').val(jsonData[0].Description);
                $("input[name='STATUS'][value=" + jsonData[0].Status + "]").attr("checked", true);
                $("input[name='STATUS'][value=" + jsonData[0].Status + "]").prop("checked", true);
                ID = id;
                $(obj).html("取消");
            })
        });
    }
    else {
        $(obj).html("编辑");
        clearData();
    }
}

//删除数据
function delData(id, obj) {
    $.messager.confirm('删除记录', '确定删除记录？', function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "TCMNursing/delTCMDiseaseById/",
                data: 'id=' + id,
                type: "get",
                success: (function (data) {
                    if (data) {
                        $.messager.alert("提示", data);
                        getNuringProgramDiseaseData(0);
                    }
                })
            });
        }
    })
}
