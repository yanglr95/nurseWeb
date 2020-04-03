var ComboData = {
}
var patientData;
$(function () {
    $("#ccPatients").combobox({
        //onSelect: PatientsComboChange,
        filter: filterPatient,
        panelHeight:document.documentElement.clientHeight
    });

    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {

            var jsonData = $.parseJSON(data);
            if (jsonData.length > 0) {
                patientData = jsonData.concat();
                for (var i = 0; i < jsonData.length; i++) {
                    jsonData[i].Name = "(" + jsonData[i].Bed_No + ")" + jsonData[i].Name;
                }
                jsonData.unshift({ Patient_id: "-1", Name: "科室工作" })
                $("#ccAddPatient").combobox('loadData', jsonData);
                jsonData.push({ Patient_id: "", Name: "全部" });
                $("#ccPatients").combobox('loadData', jsonData);
            }
        })
    });


    var comboWorkTimeItem = new Array();
    // comboWorkTimeItem.push({ text: "全部", value: -1 });
    for (var i = 0; i < 24; i++) {
        var item = { text: i + '点', value: i };
        comboWorkTimeItem.push(item)
    }
    comboWorkTimeItem.push({ text: "全天", value: 24 });
    //$("#ccWorkTime").combobox('loadData', comboWorkTimeItem);
    //$("#ccWorkTime").combobox('setValue', -1);
    $("#ccAddWorkTime").combobox('loadData', comboWorkTimeItem.concat());
    comboWorkTimeItem.unshift({ text: "全部", value: -1 });

    $("#ccWorkTime").combobox('loadData', comboWorkTimeItem);

    $("#ccWorkTime").combobox('setValue', -1);

    var comboWorkTypeItem = [{ text: "全部", value: -1 },
        { text: "医嘱", value: 1 },
        { text: "体征", value: 2 },
        { text: "日常", value: 3 },
        { text: "备注", value: 4 }]
    $("#ccWorkType").combobox('loadData', comboWorkTypeItem);
    $("#ccWorkType").combobox('setValue', -1);

    var comboStatusItem = [{ text: "全部", value: -1 },
       { text: "未执行", value: 0 },
       { text: "已执行", value: 2 }];
    $("#ccStatus").combobox('loadData', comboStatusItem);
    $("#ccStatus").combobox('setValue', -1);

    var date = new Date();
    //  $('#txtDate').datebox('setValue', dateFormatter(date));
    $('#txtDate').datebox('setValue', dateFormatter(date));

    $("#tbWorkPlan").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        singleSelect: true,//是否单选
        pagination: true,//分页控件
        columns: [[
             { field: 'Patientname', title: '姓名', width: '12%' },
             { field: 'PlanTimeText', title: '工作时间', width: '10%' },
             { field: 'WorktypeText', title: '类型', width: '8%' },
             { field: 'WorkInfo', title: '工作内容', width: '24%' },
             { field: 'StatusText', title: '状态', width: '8%' },
             { field: 'Exec_db_username', title: '执行人', width: '8%' },
             { field: 'ExecTimeText', title: '执行时间', width: '15%' },
             {
                 field: 'Operate', title: '操作', width: '15%', formatter: function (value, Rowdata, rowIndex) {
                     var str = Rowdata.StatusText;

                     if (Rowdata.Status == "0") {
                         str = "执行";
                     }
                     else {
                         str = "查看";
                     }

                     var url;
                     if (Rowdata.Worktype == 1) {
                         url = "href='../Order/Order_ExecuteList.html?menu_id=34&pid=" + Rowdata.Patient_id + "'";
                     }
                     else if (Rowdata.Worktype == 2) {
                         url = " href='../BodyChart/BodyInput.html?pid=" + Rowdata.Patient_id + "'";
                     } 
                     else {
                         if (Rowdata.Status == "0") {
                             url = " href='#' onclick='execWork(" + Rowdata.Id + ")'";
                         }
                         else {
                             return "";
                         }
                     }
                     str = "<a  " + url + ">" + str + " </>";
                    str += "&nbsp;";
                     str += "<a href='#' onclick='delWorkPlan(" + rowIndex + ")' >删除</a>";
                     return str;
                 }
             }
        ]]
    });

    $("#btnQuery").click(getWorkPlanData);
    $("#btnShowAddWindow").click(showAddWindow);
    $("#btnAdd").click(postNewWork);
    getWorkPlanData();
    $('[editwindow]').window({
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closed: true
    });
})

function getWorkPlanData() {
    $("#tbWorkPlan").datagrid("loadData", { total: 0, rows: [] });
    var postData = new Object();
    postData.patientid = $("#ccPatients").combobox("getValue");

    postData.WorkDate = $('#txtDate').datebox('getValue');

    var status = $("#ccStatus").combobox("getValue");
    if (status != -1) {
        postData.Status = status;
    }
    var hour = $("#ccWorkTime").combobox("getValue");
    if (hour != -1) {
        postData.WorkHour = hour;
    }
    var worktype = $("#ccWorkType").combobox("getValue");
    if (worktype != -1) {
        postData.WorkType = worktype;
    }
    $.ajax({
        url: BaseData.WebApiUrl + "workplan/getworkplan/",
        data: postData,
        type: "post",
        success: (function (data) {
            if (data && data != 'null') {
                jsonData = $.parseJSON(data);
                ClearNoDisplayData(jsonData);
                    setData(1, 20);
                        $('#tbWorkPlan').datagrid('getPager').pagination({
                            pageSize: 20,//每页显示的记录条数，默认为10
                            pageList: [10, 20, 30],//可以设置每页记录条数的列表
                            beforePageText: '第',//页数文本框前显示的汉字
                            afterPageText: '页    共 {pages} 页',
                            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',

                            onSelectPage: (function (pageNumber, pageSize) {
                                setData(pageNumber, pageSize);
                            })
                        });
            }
        })
    });
}
function setData(pageNum, pageSize) {
        var filterData = dataFilter(jsonData, "datafilter");
        var data = new Array();
        var startIndex = pageSize * (pageNum - 1);
        for (var i = startIndex; i < startIndex + pageSize && i < filterData.length; i++) {
            data.push(filterData[i]);
        }
        $('#tbWorkPlan').datagrid("loadData", data);
        $('#tbWorkPlan').datagrid('getPager').pagination("refresh",
            {
                total: filterData.length,
                pageNumber: pageNum,
                pageSize: pageSize
            });
    }
function showAddWindow() {
    $("#ccAddPatient").combobox('setValue', "-1");
    var date = new Date();
    //  $('#txtDate').datebox('setValue', dateFormatter(date));
    $('#txtAddWorkDate').datebox('setValue', dateFormatter(date));
    $("#ccAddWorkTime").combobox('setValue', 24);
    $("#txtWorkInfo").textbox("setValue","");
    $("#divAdd").window('open');
}

function postNewWork() {
    if($("#txtWorkInfo").textbox('getValue').trim().length==0){
        return $.messager.alert("提示", "请输入内容！");
    }
    var data = new Object();
    var patient_id = $("#ccAddPatient").combobox('getValue');
    data.Patient_id = patient_id;
    if (patient_id != "-1") {
        for (var i = 0; i < patientData.length; i++) {
            if (patientData[i].Patient_id == patient_id) {
                data.Visit_id = patientData[i].Visit_id;
                break;
            }
        }
    }
    data.PlanTime = $('#txtAddWorkDate').datebox('getValue');
    data.Hour = $("#ccAddWorkTime").combobox("getValue");
    data.WorkInfo = $("#txtWorkInfo").textbox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "workplan/saveCustomWorkPlan/",
        data: data,
        type: "post",
        success: (function (data) {
            getWorkPlanData();
        })
    });
    $("#divAdd").window('close');
}
function delWorkPlan(rowIndex) {
    $.messager.confirm("删除", "确定删除？", function (r) {
        if (r) {
            var row = $('#tbWorkPlan').datagrid('getData').rows[rowIndex];
            $.ajax({
                url: BaseData.WebApiUrl + "workplan/delWorkPlan?id=" + row.Id,
                type: "get",
                success: (function (data) {
                  getWorkPlanData();
                })
            });
        };
    });
}
//清空不需要显示的数据
function ClearNoDisplayData(dataSource) {
    var rowsCount = dataSource.length
    for (var i = rowsCount - 1; i > 0 ; i--) {
        if (dataSource[i].Patient_id == dataSource[i - 1].Patient_id) {
            dataSource[i].Patientname = "";


        }
    }
}