
var jsonPatient;
var orderStatusDict;

$(function () {
    var date = new Date();
    $('#txtDate').datebox('setValue', dateFormatter(date));
    $("#ccPatients").combobox({
        onSelect: InitData,
        filter: filterPatient,
        panelHeight: document.documentElement.clientHeight
    });
    $(".easyui-combobox[datafilter]").combobox({
        onChange: orderFilter
    });
    $("#tbOrders").datagrid({
        sortName: 'Bed_Label',
        sortOrder: 'asc',
        remoteSort: false
    })
    $("#text").tagBox();
    $(".tagBox-container input").css("display", "none")
    $(".tagBox-container").css("display", "none");
    $.ajax({
        url: BaseData.WebApiUrl + "order/getOrderStatusDict",
        type: "get",
        success: (function (data) {
            orderStatusDict = $.parseJSON(data);
        })
    });
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {

            jsonPatient = $.parseJSON(data);

            if (jsonPatient.length > 0) {
                for (var i = 0; i < jsonPatient.length; i++) {
                    jsonPatient[i].ViewName = "(" + jsonPatient[i].Bed_No + ")" + jsonPatient[i].Name;
                }

                $("#ccPatients").combobox('loadData', jsonPatient);



                //$("#ccPatients").combobox('setValue', "");
                InitData();
            }
        })
    });
    $("#tbOrders").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        idField: 'Order_Number',
        columns: [[
              { field: 'ck', checkbox: true },
              { field: 'Bed_Label', title: '床号', width: '6%', sortable: true },
             { field: 'Patient_Name', title: '姓名', width: '6%' },
             { field: 'Repeat_Indicator', title: '类型', width: '8%' },
             { field: 'Order_Text', title: '药品名称', width: '25%' },
            { field: 'Dosage', title: '剂量', width: '10%' },
            { field: 'Frequency', title: '频率', width: '10%' },
            { field: 'Exec_Time', title: '计划时间', width: '10%' },
            { field: 'Administration', title: '途径', width: '10%' },
            { field: 'Order_Status', title: '状态', width: '10%', formatter: getOrderStatus },
            { field: 'Print_Count', title: '打印次数', width: '4%' },
        ]]
    });
    $("#comboRepeat_Indicator").combobox("loadData", [{ text: "医嘱类型", value: "" },
     { text: "长期医嘱", value: "长期医嘱" },
     { text: "临时医嘱", value: "临时医嘱" }, ]);

    $("#comboOrder_Class").combobox("loadData", [
    { text: "输液", value: "输液" },
    { text: "口服", value: "口服" },
    { text: "注射", value: "注射" },
    ]);
    $("input[name='date']").click(InitData);
    $("input[name='AllPatient']").click(InitPatient);
    $("#btnPrint").click(printOrder);
    $("#btnQuery").click(InitData);
    $("#cbPrinted").click(CheckDataGrid);
})


function CheckDataGrid() {

    if ($("#cbPrinted").get(0).checked) {
        for (var i in orderData) {

            if (orderData[i].Print_Count == "未打印") {

                $("#tbOrders").datagrid("selectRow", i);
            }
            else {
                $("#tbOrders").datagrid("unselectRow", i);
            }
        }
    }
    else {
        $("#tbOrders").datagrid("selectAll");
    }
}
function InitPatient(isAllPatient) {
    if (this.checked) {
        isInsertOrder = false;
    }
    if (this.checked) {
        var date = $("#txtDate").datebox("getValue");
        if (($("input[name='date']:checked").val()) == "tomorrow") {
            date = new Date(date);
            date = new Date(date.setDate(date.getDate() + 1));
            date = dateTimeFormatter(date, 'yyyy-mm-dd');
        }
        var strDate = date;
        if (this.value.indexOf("Patients") < 0) {
            $(".tagBox-container").css("display", "none");
            $("#ccPatients").combobox({ disabled: true })
            InitAll(strDate);
        } else {
            $("input[value='AllPatient']")[0].checked = false;
            $("#ccPatients").combobox({ disabled: false });
            AddPatients();
            $("#ccPatients").combobox('setValue', getSession("Patient_Id"));
            $(".tagBox-container").css("display", "inline-block");
            InitPatients(strDate);
        }
    }
    else {
        $("#ccPatients").combobox({ disabled: false });
        // $("#ccPatients").combobox('setValue', getSession("Patient_Id"));
        InitData();
    }
}
function InitAll(strDate) {
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    //$("#ccPatients").combobox({ disabled: true });
    $.ajax({
        url: BaseData.WebApiUrl + "order/getOrdersList",
        data: "wardCode=" + ward_code + "&exec_date=" + strDate,
        type: "get",
        success: (function (data) {
            jsonData = data;
            if (data.length > 0) {
                dataList = $.parseJSON(data);
                orderData = dataList;//ClearNoDisplayData(dataList);
                $("#tbOrders").datagrid("loadData", orderData);
                CheckDataGrid();
                orderFilter();
            } else {
                $("#tbOrders").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}
function getPatientIds() {

}
function InitPatients(strDate) {
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $("#ccPatients").combobox({ disabled: true });
    $.ajax({
        url: BaseData.WebApiUrl + "order/getOrdersList",
        data: "wardCode=" + ward_code + "&exec_date=" + strDate + "",
        type: "get",
        success: (function (data) {
            jsonData = data;
            if (data.length > 0) {
                dataList = $.parseJSON(data);
                orderData = dataList;//ClearNoDisplayData(dataList);
                $("#tbOrders").datagrid("loadData", orderData);
                CheckDataGrid();
                orderFilter();
            } else {
                $("#tbOrders").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}
function InitData(isInsertOrder) {
    if (isInsertOrder == null) {
        isInsertOrder = true;
    }
    patient_id = $("#ccPatients").combobox('getValue');
    var patient;
    for (var i in jsonPatient) {
        if (jsonPatient[i].Patient_id == patient_id) {
            patient = jsonPatient[i];
            break
        }
    }
    var date = $("#txtDate").datebox("getValue");
    if (($("input[name='date']:checked").val()) == "tomorrow") {
        date = new Date(date);
        date = new Date(date.setDate(date.getDate() + 1));
        date = dateTimeFormatter(date, 'yyyy-mm-dd');
    }
    var strDate = date;
    if (patient) {
        if (isInsertOrder) {
            InitTableData(patient, strDate);
            //$.ajax({
            //    url: BaseData.WebApiUrl + "order/insertOrderExec",
            //    data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&date=" + strDate,
            //    type: "get",
            //    success: (function (data) {
            //        InitTableData(patient, strDate);
            //    })
            //});
        }
        else {
            InitTableData(patient, strDate);
        }
    } else {
        InitAll(strDate);
    }
}
var orderData;

function InitTableData(patient, date) {

    $.ajax({
        url: BaseData.WebApiUrl + "order/getOrderPrintList",
        data: "patient_id=" + patient.Patient_id + "&visit_id=" + patient.Visit_id + "&exec_date=" + date,
        type: "get",
        success: (function (data) {
            jsonData = data;
            if (data.length > 0) {
                dataList = $.parseJSON(data);
                orderData = dataList;//ClearNoDisplayData(dataList);
                $("#tbOrders").datagrid("loadData", orderData);
                CheckDataGrid();
                orderFilter();
                removeSession("patient_id");
                setSession(patient_id);
            } else {
                $("#tbOrders").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    });
}
//清空不需要显示的数据
/*function ClearNoDisplayData(dataList) {
    var dataSource=dataList;
    var rowsCount = dataSource.length
    for (var i = rowsCount - 1; i > 0 ; i--) {
        if (dataSource[i].Patient_id == dataSource[i - 1].Patient_id) {
            dataSource[i].Patient_Name = "";
        }
    }
return dataSource;
}*/

function printOrder() {
    $("#tbOrders").datagrid("rejectChanges");
    var printOrders = $("#tbOrders").datagrid("getSelections");
    if (printOrders.length == 0) {
        $.messager.alert("提示", "请选择需要打印的医嘱！");
    }
    else {
        var strOrderNumberList = "";
        for (var i in printOrders) {
            strOrderNumberList += "," + printOrders[i].Order_Number;
        }
        strOrderNumberList = strOrderNumberList.substr(1);
        $.ajax({
            url: BaseData.WebApiUrl + "printData/getOrderPaster",
            data: { '': strOrderNumberList },
            type: "post",
            success: (function (data) {
                if (data != '') {
                    //var json=  $.parseJSON(data);
                    my_print(data);
                    InitData(false);
                    //window.open(BaseData.WebApiUrl + "print/getOrderPaster/?key=" + data);
                }
            })
        });

    }
}

function orderFilter() {
    var changes = orderDataFilter($.parseJSON(jsonData), "dataFilter");
    $("#tbOrders").datagrid("loadData", changes);
    //$("#tbOrders").datagrid("loadData", ClearNoDisplayData(dataFilter($.parseJSON(jsonData), "dataFilter")));
    //$("#tbOrders").datagrid("rejectChanges");

}

function listDateTimeFormatter(value) {
    var showDate = new Date(value);
    var hour = showDate.getHours() + showDate.getTimezoneOffset() / 60;

    if (hour < 0) {

        hour = hour + 24;
    }
    showDate = showDate.setHours(hour);
    return dateTimeFormatter(new Date(showDate), "yyyy-mm-dd hh:mi:ss");
}
function getOrderStatus(value) {
    return orderStatusDict[value];
}
function my_print(json) {
    //开始打印
    var WinPrint = window.open('../Print/OrderPaster.html', '_blank');
    window.localStorage.setItem('data', json)
}
//新加过滤方法，之前用的是common.js里的dataFilter方法
function orderDataFilter(jsonData, filterAttr) {
    var jsonFilter = new Array();
    var result = new Array();
    $(".easyui-combobox[" + filterAttr + "]").each(function (index, obj) {
        var filterValue = $(obj).combobox("getValues");
        if (filterValue != null && filterValue != "") {
            jsonFilter.push({ field: $(obj).attr(filterAttr), value: filterValue });
        }
    });

    for (var i in jsonData) {
        var flag = true;
        for (var filterIndex in jsonFilter) {
            var filter = jsonFilter[filterIndex];
            if (filter.value.indexOf(jsonData[i][filter.field]) < 0 && filter.value.length > 0) {
                flag = false;
            }
        }

        if (flag) {
            jsonData[i].Ck = "true";
            result.push(jsonData[i]);
        }
    }
    return result;
}
