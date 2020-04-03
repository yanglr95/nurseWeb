var arr = {
    execStatus: [{ text: "PY", value: "配液" },
        { text: "HY", value: "核液" },
        { text: "KS", value: "开始" },
        { text: "ZT", value: "暂停" },
        { text: "JX", value: "继续" },
        { text: "ZF", value: "作废" },
        { text: "JS", value: "结束" },
    ]
}
function getObjectKeys(key) {
    for (var i in arr.execStatus) {
        if (arr.execStatus[i].text == key) {
            return arr.execStatus[i].value;
        }
    }
}
$(function () {
    //初始化
    var date = new Date();
    $('#patientDate').datebox('setValue', dateFormatter(date));
    $("#nurseDate").datebox("setValue", dateFormatter(date))
    getNurses();
    $("#tbNurse").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,//是否单选
        pagination: true,//分页控件
        columns: [[
            { field: 'Bed_Label', title: '床号', width: '10%' },
            { field: 'Patient_Id', title: '病案号', width: '10%' },
             { field: 'Name', title: '姓名', width: '10%' },
               { field: 'Order_Text', title: '医嘱内容', width: '25%' },
             { field: 'Exec_Time', title: '执行时间', width: '5%', formatter: function (value) { return inputListDateFormatter(value) } },
             { field: 'Operator_Name', title: '执行人', width: '15%' },
              { field: 'Operator_Id', title: '执行人编码', width: '15%' },
             { field: 'Operation', title: '操作', width: '10%' },
        ]]
    });
    $("#tbPatient").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,//是否单选
        pagination: true,//分页控件
        columns: [[

            { field: 'Bed_Label', title: '床号', width: '10%' },
             { field: 'Patient_Id', title: '病案号', width: '10%' },
             { field: 'Name', title: '姓名', width: '10%' },
              { field: 'Order_Text', title: '医嘱内容', width: '25%' },
             { field: 'Exec_Time', title: '执行时间', width: '5%', formatter: function (value) { return inputListDateFormatter(value) } },
             { field: 'Operator_Name', title: '执行人', width: '15%' },
              { field: 'Operator_Id', title: '执行人编码', width: '15%' },
             { field: 'Operation', title: '操作', width: '10%' },
        ]]
    });
    $("#btnQuery1").click(getWorkFlowByNurse);
    $("#btnQuery2").click(getWorkFlowByPatient);
})
function getNurses() {
    //获取护士列表
    $.ajax({
        url: BaseData.WebApiUrl + "Nurse/getUserInfoList",
        data: "deptName=" + getLoginUser().DeptCode,
        type: "get",
        success: (function (data) {
            if (data != '') {
                var json = $.parseJSON(data);
                $("#ccNurse").combobox("loadData", json);
                $("#ccNurse").combobox("setValue", getLoginUser().DBUser);
                getWorkFlowByNurse();
            }
        }),
        onchange: getWorkFlowByNurse
    });
    //获取患者列表
    $.ajax({
        url: BaseData.WebApiUrl + "Nurse/getPatientListByWard",
        data: "deptName=" + getLoginUser().DeptCode,
        type: "get",
        success: (function (data) {
            if (data != '') {
                var jsonData = $.parseJSON(data);
                for (var i = 0; i < jsonData.length; i++) {
                    jsonData[i].Name = "(" + jsonData[i].Bed_No + ")" + jsonData[i].Name;
                }
                $("#ccPatients").combobox('loadData', jsonData);
                $("#ccPatients").combobox("setValue", "20001649");//getSession("Patient_Id"));
                getWorkFlowByPatient();
            }
        }),
        onchange: getWorkFlowByPatient
    });
}
//根据护士DB_USER获取护士工作流
function getWorkFlowByNurse() {
    var nurse = $("#ccNurse").combobox("getValue");
    var date = $("#nurseDate").combobox("getValue");
    if (nurse.length == 0) {
        $.messager.alert("提示", "请选择护士！");
        return;
    } else if (date.length == 0) {
        $.messager.alert("提示", "请选择日期！");
        return;
    }
    $.ajax({
        url: BaseData.WebApiUrl + "WorkFlow/getWorkFlowByNurse",
        data: "Nurse=" + nurse + "&execdate=" + date + "",//+ wardcode,
        type: "get",
        success: (function (data) {
            if (data != '') {
                jsonData = $.parseJSON(data);
                setUserInfoData(1, 10, "", "tbNurse");
                $('#tbNurse').datagrid('getPager').pagination({
                    pageSize: 10,//每页显示的记录条数，默认为10
                    pageList: [10, 20, 30],//可以设置每页记录条数的列表
                    beforePageText: '第',//页数文本框前显示的汉字
                    afterPageText: '页    共 {pages} 页',
                    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',

                    onSelectPage: (function (pageNumber, pageSize) {
                        setUserInfoData(pageNumber, pageSize, "", "tbNurse");
                    })
                });
                //$("#tbNurse").datagrid('loadData', jsonData);
            }
        })
    });
}
//根据患者PATIENT_ID获取护士工作流
function getWorkFlowByPatient() {
    var patientId = $("#ccPatients").combobox("getValue");
    var date = $("#patientDate").combobox("getValue");
    if (patientId.length == 0) {
        $.messager.alert("提示", "请选择患者！");
        return;
    } else if (date.length == 0) {
        $.messager.alert("提示", "请选择日期！");
        return;
    }
    $.ajax({
        url: BaseData.WebApiUrl + "WorkFlow/getWorkFlowByPatient",
        data: "patientId=" + patientId + "&execdate=" + date + "",//+ wardcode,
        type: "get",
        success: (function (data) {
            if (data != '') {
                jsonData = $.parseJSON(data);
                setUserInfoData(1, 10, "", "tbPatient");
                $('#tbPatient').datagrid('getPager').pagination({
                    pageSize: 10,//每页显示的记录条数，默认为10
                    pageList: [10, 20, 30],//可以设置每页记录条数的列表
                    beforePageText: '第',//页数文本框前显示的汉字
                    afterPageText: '页    共 {pages} 页',
                    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',

                    onSelectPage: (function (pageNumber, pageSize) {
                        setUserInfoData(pageNumber, pageSize, "", "tbPatient");
                    })
                });
            }
        })
    });
}
function inputListDateFormatter(date) {
    var showDate = new Date(date.replace(/-/g, "/").replace(/T/g, " "));
    return dateTimeFormatter(new Date(showDate), "hh:mi");
}
function jsonFilter(value) {
    var TableName = this.title;
    setUserInfoData(1, 10, value, TableName);
}
function setUserInfoData(pageNum, pageSize, value, TableName) {
    var filterData = dataFilter(jsonData, "datafilter");
    filterData = searchFilter(filterData, value, TableName);
    var data = new Array();
    var startIndex = pageSize * (pageNum - 1);
    for (var i = startIndex; i < startIndex + pageSize && i < filterData.length; i++) {
        data.push(filterData[i]);
    }
    $('#' + TableName).datagrid("loadData", data);
    $('#' + TableName).datagrid('getPager').pagination("refresh",
        {
            total: filterData.length,
            pageNumber: pageNum,
            pageSize: pageSize
        });
}
function searchFilter(jsonData, value, title) {
    // var filterStr = $(".easyui-searchbox").searchbox("getValue");
    var filterStr = $("#Work").find("input[title='" + title + "']").searchbox("getValue");
    var result = new Array();
    if (filterStr && filterStr.length > 0) {
        for (var i in jsonData) {
            var user = jsonData[i];
            if ((user.Bed_Label && user.Bed_Label.toLowerCase().indexOf(filterStr.toLowerCase()) != -1)
                || (user.Operator_Id && user.Operator_Id.toLowerCase().indexOf(filterStr.toLowerCase()) != -1)
                || (user.Patient_Id && user.Patient_Id.toLowerCase().indexOf(filterStr.toLowerCase()) != -1)
                || (user.Operation && user.Operation.indexOf(getObjectKeys(filterStr.toLocaleUpperCase())) != -1)) {
                result.push(user);
            }
        }
    }
    else {
        result = jsonData;
    }
    return result;
}