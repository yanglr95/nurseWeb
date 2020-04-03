var ProgamEvaluationData;
$(function () {
    $("#tbNursingProgram").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        nowrap: false,
        columns: [[
                { field: 'Program_Date', title: '日期', width: 120 },
              { field: 'Patient_Name', title: '姓名', width: 120 },

            { field: 'SymptomName', title: '症状', width: 120 },

            {
                field: 'TechName', title: '使用技术', width: 80,
            },
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
                    else {
                        str = ' <input type="radio" value="依从" name="eval1_' + row.Ntid + '" >依从</input>' +
                        ' <input type="radio" value="部分依从" name="eval1_' + row.Ntid + '">部分依从</input>' +
                        ' <input type="radio" value="不依从"  name="eval1_' + row.Ntid + '">不依从</input>'

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
                    else {
                        str = ' <input type="radio" value="满意" name="eval2_' + row.Ntid + '" >满意</input>' +
                           ' <input type="radio" value="部分满意" name="eval2_' + row.Ntid + '">部分满意</input>' +
                           ' <input type="radio" value="不满意"  name="eval2_' + row.Ntid + '">不满意</input>'
                    }
                    return str;

                }
            },

            {
                field: 'cc', title: '保存', width: 80, formatter: function (value, row) {

                    var str = " <a href='#' onclick='saveEffect(" + row.Ntid + ")'>保存</a>";
                    return str;

                }
            },

        ]],
    })
    initData();
})
function initData() {
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getProgramEvaluationData",
        type: "get",

        success: (function (data) {
            ProgamEvaluationData = $.parseJSON(data);
            $("#tbNursingProgram").datagrid("loadData", ProgamEvaluationData);
            MergeGrid();
        })
    });
}

function MergeGrid() {
    MergeCells("tbNursingProgram", "Program_Date,Patient_Name,SymptomName,SymptomID");
}

function saveEffect(ntid) {
    var data = new Object();
    data.NtID = ntid;
    data.Compliance = 0;
    data.Satisfaction = 0;
    if ($("[name=eval1_" + ntid + "]:checked").length > 0) {
        var val = $("[name=eval1_" + ntid + "]:checked").val();
        if (val == "依从") {
            data.Compliance = 1;
        }
        else if (val == "部分依从") {
            data.Compliance = 2;
        }
        else if (val == "不依从") {
            data.Compliance = 3;
        }
    }

    if ($("[name=eval2_" + ntid + "]:checked").length > 0) {
        var val = $("[name=eval2_" + ntid + "]:checked").val();
        if (val == "满意") {
            data.Satisfaction = 1;
        }
        else if (val == "部分满意") {
            data.Satisfaction = 2;
        }
        else if (val == "不满意") {
            data.Satisfaction = 3;
        }
    }
    if (data.Compliance > 0 || data.Satisfaction > 0) {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/saveTCMTechEvaluastion",
            type: "post",
            data: { '': "[" + JSON.stringify(data) + "]" },
            success: (function (r) {
                initData();
            })
        });
    }
    else {
        $.messager.alert("提示", "没有需要保存的项目！");
    }
}
function saveData() {
    var postData = new Array();
    $("[name^=eval1]:checked").each(function (val, obj) {
        var data = new Object();
        data.Satisfaction = 0;
        data.NtID = obj.name.replace("eval1_", "")
        if (obj.value == "依从") {
            data.Compliance = 1;

        }
        else if (obj.value == "部分依从") {
            data.Compliance = 2;

        }
        else if (obj.value == "不依从") {
            data.Compliance = 3;

        }
        postData.push(data);
    })
    $("[name^=eval2]:checked").each(function (val, obj) {
        var data = new Object();
        data.Compliance = 0;
        var ntid = obj.name.replace("eval2_", "");

        data.NtID = ntid
        if (obj.value == "满意") {
            data.Satisfaction = 1;
        }
        else if (obj.value == "部分满意") {
            data.Satisfaction = 2;
        }
        else if (obj.value == "不满意") {
            data.Satisfaction = 3;
        }
        postData.push(data);
    })

    if (postData.length > 0) {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/saveTCMTechEvaluastion",
            type: "post",
            data: { '': JSON.stringify(postData) },
            success: (function (r) {
                initData();
            })
        });
    }
    else {
        $.messager.alert("提示", "没有需要保存的项目！");
    }
}

