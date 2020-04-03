$(function () {
    $("#AddPatient").window({
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closed: true

    });
    $("#Patients").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        checkbox: true,
        checkOnSelect: true,
        idField: 'Patient_id',
        singleSelect: false,//是否单选
        pagination: true,//分页控件
        columns: [[
            { field: 'ck', checkbox: true, align: 'left', width: '14%' },
            { field: 'Bed_No', width: '20%', title: '床号' },
            { field: 'Name', width: '15%', title: '姓名' },
            { field: 'Patient_id', width: '20%', title: '住院号' },
            { field: 'Visit_id', width: '10%', title: '住院次数' },
            { field: 'Diagnosis', width: '30%', title: '诊断' }
        ]]
    });
});

function jsonFilter(value) {
    var TableName = this.title;
    setUserInfoData(1, 20);
}
//获取可是所i有病人信息
function GetPatientListByWard() {
    //var ward_code = getSession("ward_code") == undefined ? "251" : getSession("ward_code");
    var ward_code = "251";
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {
            jsonData = $.parseJSON(data);
            setUserInfoData(1, 20);
            $('#Patients').datagrid('getPager').pagination({
                pageSize: 20,//每页显示的记录条数，默认为10
                pageList: [10, 20, 30],//可以设置每页记录条数的列表
                beforePageText: '第',//页数文本框前显示的汉字
                afterPageText: '页    共 {pages} 页',
                displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',

                onSelectPage: (function (pageNumber, pageSize) {
                    setUserInfoData(pageNumber, pageSize);
                })
            });
        })
    });
}
//增加病人窗体显示
function AddPatients() {
    $('#AddPatient').window('open');
    GetPatientListByWard();

}
function setUserInfoData(pageNum, pageSize) {
    var filterData = dataFilter(jsonData, "datafilter");
    filterData = searchFilter(filterData);
    var data = new Array();
    var startIndex = pageSize * (pageNum - 1);
    for (var i = startIndex; i < startIndex + pageSize && i < filterData.length; i++) {
        data.push(filterData[i]);
    }
    $('#Patients').datagrid("loadData", data);
    $('#Patients').datagrid('getPager').pagination("refresh",
        {
            total: filterData.length,
            pageNumber: pageNum,
            pageSize: pageSize
        });
}
function searchFilter(jsonData) {
    var filterStr = $(".easyui-searchbox").searchbox("getValue");
    //var filterStr = $("#Work").find("input[title='"+title+"']").searchbox("getValue");
    var result = new Array();
    if (filterStr && filterStr.length > 0) {
        for (var i in jsonData) {
            var user = jsonData[i];
            if ((user.Bed_No && user.Bed_No.toLowerCase().indexOf(filterStr.toLowerCase()) != -1)) {
                result.push(user);
            }
        }
    }
    else {
        result = jsonData;
    }
    return result;
}
function getBeds() {
    var bedNos = "";
    var length = $('#Patients').datagrid('getChecked').length;
    for (var i = 0; i < length; i++) {
        $('#Patients').datagrid('getChecked')[i].checked = "true";
        bedNos = bedNos + "," + $('#Patients').datagrid('getChecked')[i].Bed_No;
    }
    $(".tagBox-input")[0].value = bedNos;
    $('#AddPatient').window('close');
}

function getChecked(tag_items) {
    var patients = $('#Patients').datagrid('getChecked');

}
