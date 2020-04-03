
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
            { field: 'Days', title: '天', width: 60 },
            { field: 'Times', title: '次', width: 60 },
            { field: 'Memo', title: '描述', width: 300 },
            {
                field: 'Nsid', title: '评价', width: 320, formatter: function (value, row) {

                    var str = ' <input type="radio" value="好" name="effect_' + value + '">好</input>' +
                    ' <input type="radio" value="较好" name="effect_' + value + '">较好</input>' +
                    ' <input type="radio" value="一般"  name="effect_' + value + '">一般</input>' +
                    ' <input type="radio" value="差"  name="effect_' + value + '">差</input>'
                    return str;
                }
            },
             {
                 field: 'Saveid', title: '操作', width: 60, formatter: function (value, row) {
                     var str = '<a href="#" onclick="saveEffect(' + value + ')">保存</a>'
                     return str;


                 }
             },
        ]],
    })

    initData();
})
function initData() {
    $.ajax({
        url: BaseData.WebApiUrl + "TCMNursing/getProgramEffectData",
        type: "get",

        success: (function (data) {
            ProgamEvaluationData = $.parseJSON(data);
            $("#tbNursingProgram").datagrid("loadData", ProgamEvaluationData);
            MergeGrid();
        })
    });
}
function MergeGrid() {
    MergeCells("tbNursingProgram", "Program_Date,Patient_Name,DiseaseName,SymptomName,SymptomID,Nsid,Saveid");
}

function saveEffect(Nsid) {

    var data = new Object();
    data.Nsid = Nsid;
    data.Effect = 0;
    var str = "[name=effect_" + Nsid + "]:checked";

    if ($("[name=effect_" + Nsid + "]:checked").length > 0) {
        var val = $("[name=effect_" + Nsid + "]:checked").val();
        data.Effect = getEffect(val);
    }
    if (data.Effect > 0) {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/saveTCMTechEffect",
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
    $("[name^=effect]:checked").each(function (val, obj) {
        var data = new Object();
        data.Satisfaction = getEffect(obj.value);
        data.Nsid = obj.name.replace("effect_", "");
        postData.push(data);
    })
    if (postData.length > 0) {
        $.ajax({
            url: BaseData.WebApiUrl + "TCMNursing/saveTCMTechEffect",
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
function getEffect(val) {
    if (val == "好") {
        return 1;
    }
    else if (val == "较好") {
        return 2;
    }
    else if (val == "一般") {
        return 3;
    }
    else if (val == "差") {
        return 4;
    }
}

