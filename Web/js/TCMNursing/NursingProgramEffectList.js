
$(function () {
    $("#tbNursingProgram").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        pagination: true,//分页控件
        nowrap: false,
        columns: [[
            { field: 'Program_Date', title: '日期', width: 120 },
              { field: 'Patient_Name', title: '姓名', width: 120 },

            { field: 'SymptomName', title: '症状', width: 120 },

            {
                field: 'TechName', title: '使用技术', width: 80,
            },
            { field: 'Days', title: '天', width: 60 },
            { field: 'Times', title: '次', width: 60 },
            { field: 'Memo', title: '描述', width: 300 },
            {
                field: 'Nsid', title: '评价', width: 320, formatter: function (value, row) {
                    var str = "";
                    if (row.Effect == 1) {
                        str = "好";
                    }
                    else if (row.Effect == 2) {
                        str = "较好";
                    }
                    else if (row.Effect == 3) {
                        str = "一般";
                    } else {
                        str = "差";
                    }
                    return str;
                }
            },
             {
                 field: 'Saveid', title: '操作', width: 60, formatter: function (value, row) {
                     var str = '<a href="#" onclick="delEffect(' + value + ')">删除</a>'
                     return str;


                 }
             },
        ]],
    })

    searchData();
    loadPatientNameData();
    loadDiseaseData();
})

function setData(pageNum, pageSize) {
    var filterData = dataFilter(jsonData, "datafilter");
    var data = new Array();
    var startIndex = pageSize * (pageNum - 1);
    for (var i = startIndex; i < startIndex + pageSize && i < filterData.length; i++) {
        data.push(filterData[i]);
    }
    $('#tbNursingProgram').datagrid("loadData", data);
    $('#tbNursingProgram').datagrid('getPager').pagination("refresh",
        {
            total: filterData.length,
            pageNumber: pageNum,
            pageSize: pageSize
        });
}

function MergeGrid() {
    MergeCells("tbNursingProgram", "Program_Date,Patient_Name,DiseaseName,SymptomName,SymptomID,Nsid,Saveid");
}
//加载病人信息
function loadPatientNameData() {
    var ward_code = getSession("ward_code") == undefined ? "null" : getSession("ward_code");
    $.ajax({
        url: BaseData.WebApiUrl + "nurse/getPatientListByWard/",
        data: "ward_code=" + ward_code,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {
                for (var i = 0; i < jsonData.length; i++) {
                    jsonData[i].Name = jsonData[i].Name;
                }
                $("#comPatientName").combobox('loadData', jsonData);
            }
        })
    })
}

//加载症状信息
function loadDiseaseData() {
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getTCMSymptom/",
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {
                $("#comDiseaseName").combobox('loadData', jsonData);
            }
        })
    })
}

function searchData() {
    var date = $("#txtDate").datebox("getValue");
    var patientName = $("#comPatientName").combobox("getText");
    var symptomName = $("#comDiseaseName").combobox("getText");
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getEffectData/",
        data: "date=" + date + "&patientName=" + patientName + "&symptomName=" + symptomName + "",
        type: "get",
        success: (function (data) {
            jsonData = $.parseJSON(data);
            if (jsonData) {
                setData(1, 20);
                $('#tbNursingProgram').datagrid('getPager').pagination({
                    pageSize: 20,
                    pageList: [20, 30, 40, 60, 80],
                    beforePageText: '第',
                    afterPageText: '页    共 {pages} 页',
                    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
                    onSelectPage: (function (pageNumber, pageSize) {
                        setData(pageNumber, pageSize);
                    })
                });
             }else{
                $('#tbNursingProgram').datagrid("loadData", { total: 0, rows: [] });
            }
        })
    })
}

function setData(pageNum, pageSize) {
    var filterData = dataFilter(jsonData, "datafilter");
    var data = new Array();
    var startIndex = pageSize * (pageNum - 1);
    for (var i = startIndex; i < startIndex + pageSize && i < filterData.length; i++) {
        data.push(filterData[i]);
    }
    $('#tbNursingProgram').datagrid("loadData", data);
    $('#tbNursingProgram').datagrid('getPager').pagination("refresh",
        {
            total: filterData.length,
            pageNumber: pageNum,
            pageSize: pageSize
        });
    MergeGrid();
}

function delEffect(value) {
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/updateTcmNursingsymptomById/",
        data: "id=" + value,
        type: "get",
        success: (function (data) {
            searchData();
        })
    })
}