var ProgamEvaluationData;
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
                { field: 'TechName', title: '使用技术', width: 80 },
                { field: 'Days', title: '天', width: 60, editor: { type: 'numberbox', options: { precision: 0 } } },
                { field: 'Times', title: '次', width: 60, editor: { type: 'numberbox', options: { precision: 0 } } },
                { field: 'Memo', title: '描述', width: 300, editor: 'textbox' },
                {
                field: 'aa', title: '依从性', width: 240, formatter: function (value, row) {
                    var str = "";
                    if (row.Compliance == 1) {
                        str = "依从";
                    }
                    else if (row.Compliance == 2) {
                        str = "部分依从";
                    }
                    else if (row.Compliance == 3) {
                        str = "不依从";
                    }
                    return str;
                },
            },
            {
                field: 'bb', title: '满意度', width: 240, formatter: function (value, row) {
                    var str = "";
                    if (row.Satisfaction == 1) {
                        str = "满意";
                    }
                    else if (row.Satisfaction == 2) {
                        str = "部分满意";
                    }
                    else if (row.Satisfaction == 3) {
                        str = "不满意";
                    }
                    return str;
                }
            },
            {
                field: 'cc', title: '操作', width: 80, formatter: function (value, row) {
                    var str = " <a href='#' onclick='delEffect(" + row.Ntid + ")'>删除</a>";
                    return str;

                }
            },
        ]],
    })
    initData();
    loadPatientNameData();
    loadDiseaseData();
})
function initData() {
    var date = $("#txtDate").datebox("getValue");
    var patientName = $("#comPatientName").combobox("getText");
    var symptomName = $("#comDiseaseName").combobox("getText");
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getProgramEvaluationList",
        type: "get",
        data: "date=" + date + "&patientName=" + patientName + "&symptomName=" + symptomName + "",
        success: (function (data) {
            ProgamEvaluationData = $.parseJSON(data);
            jsonData = $.parseJSON(data);
            setData(1, 20);
            $('#tbNursingProgram').datagrid('getPager').pagination({
                pageSize: 20,
                pageList: [20, 30, 40,60,80],
                beforePageText: '第',
                afterPageText: '页    共 {pages} 页',
                displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',

                onSelectPage: (function (pageNumber, pageSize) {
                    setData(pageNumber, pageSize);
                })
            });
           
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
    $('#tbNursingProgram').datagrid("loadData", data);
    $('#tbNursingProgram').datagrid('getPager').pagination("refresh",
        {
            total: filterData.length,
            pageNumber: pageNum,
            pageSize: pageSize
        });
    MergeGrid();
}

function MergeGrid() {
    MergeCells("tbNursingProgram", "Program_Date,Patient_Name,SymptomName,SymptomID");
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
        url: BaseData.WebApiUrl + "TCMNursing/getEvaluationData/",
        data: "date=" + date + "&patientName=" + patientName + "&symptomName=" + symptomName + "",
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if (jsonData) {
                $("#tbNursingProgram").datagrid("loadData", jsonData);
                MergeGrid();
            }else
            {
                $("#tbNursingProgram").datagrid("loadData", { total: 0, rows: [] });
            }
        })
    })
}

function delEffect(id)
{
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/updateTcmNursingtechById/",
        data: "id="+id,
        type: "get",
        success: (function (data) {
            initData();
        })
    })
}