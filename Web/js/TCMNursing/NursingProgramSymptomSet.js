var ID = 0;
$(function () {

    $("#DiseaSetList").show();
    getNuringProgramSymptomData(0);
    getTCMDiseaseData();
})

//获取病种设置数据
function getTCMDiseaseData()
{
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getTCMDisease",
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            $("#txtNAME").combobox("loadData", jsonData);
        })
    });
}

//查询数据
function getNuringProgramSymptomData(isfalg) {
    var disease_id = $("#txtNAME").combobox('getValue');
    var name = $("#txtsymptomName").val();
    var status = "";
    if (isfalg == 1) {
        status = $("input[type='radio']:checked").val();
    }
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getNuringProgramSymptomData",
        data: "disease_id=" + disease_id + "&name=" + name + "&status=" + status + "",
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            $("#DiseaSetList").datagrid("loadData", jsonData);
        })
    });
}

//清空数据
function clearData() {
    ID = 0;
    $("#txtNAME").combobox('setValue', "");
    $("#txtsymptomName").val("");
    $("input[name='STATUS'][value=1]").attr("checked", true);
}

function formatStatus(value, row) {
    var strstatus = "";
    if (value == 1) {
        strstatus = "启用";
    } else {
        strstatus = "禁用";
    }
    return strstatus;
}

function formatDiseaseName(value, row)
{
    var sDiseaseName = "";
    if (value != null) {
        sDiseaseName= getDiseaseName(value);
    }
    return sDiseaseName;
}

function getDiseaseName(value)
{
    var strDiseaseName = "";
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getTCMDiseaseById",
        data: "id=" + value,
        async: false,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            strDiseaseName = jsonData[0].Name;
        })
    });
    return strDiseaseName;
}

//保存数据
function saveData() {

    var diseaseID = $("#txtNAME").textbox('getValue');
    if (diseaseID == null || diseaseID == "") {
        $.messager.alert("提示", "请选择病种!");
        return
    } else {
        if (isNaN(diseaseID) && typeof diseaseID != 'number') {
            $.ajax({
                url: BaseData.WebApiUrl + "TCMNursing/getNuringProgramDiseaseData",
                data: "name=" + diseaseID + "&Coefficient=null&status=1",
                async: false,
                type: "get",
                success: (function (data) {
                    var jsonData = $.parseJSON(data);
                    diseaseID = jsonData[0].Id;
                })
            });
        }
    }
    var postData = "";
    postData += '[{';
    postData += '"Id":' + ID + ',';
    postData += '"disease_id":"' + diseaseID + '",';
    postData += '"Name":"' + $("#txtsymptomName").val() + '",';
    postData += '"status":"' + $("input[type='radio']:checked").val() + '",';
    postData += "}]";

    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/saveNuringProgramSymptom",
        type: "post",
        data: { '': postData },
        success: (function (r) {
            $.messager.alert("提示", "保存成功！")
            clearData();
            getNuringProgramSymptomData(0);
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
            url: BaseData.WebApiUrl + "TCMNursing/getTCMSymptomById",
            data: "id=" + id,
            type: "get",
            success: (function (data) {
                var jsonData = $.parseJSON(data);
                var dname = getDiseaseName(jsonData[0].Disease_id);
                $('#txtNAME').textbox("setValue", dname);
                $('#txtsymptomName').val(jsonData[0].Name);
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
                url: BaseData.WebApiUrl + "TCMNursing/delTCMSymptomById/",
                data: 'id=' + id,
                type: "get",
                success: (function (data) {
                    if (data) {
                        $.messager.alert("提示", data);
                        getNuringProgramSymptomData(0);
                    }
                })
            });
        }
    })
}
