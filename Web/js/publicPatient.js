$(function(){
    var table="<tr><td>姓名：</td><td field=\"Name\"></td><td>床号：</td><td field=\"Bed_No\"></td><td>病案号：</td><td field=\"Patient_id\" formatfun=\"getPatientID\"></td><td>性别：</td><td field=\"Sex\"></td><td>年龄：</td><td field=\"Age\"></td></tr><tr><td>病情：</td><td field=\"Patient_Condition\" formatfun=\"getConditionTitle\"></td><td>护理等级：</td><td field=\"Nursing_Class\" formatfun=\"getNursingClass\"></td><td>入院时间：</td><td field=\"Admission_Date_Time\" formatfun=\"tdDateFormatter\"></td><td>费别：</td><td field=\"Charge_Type\"></td><td>费用：</td><td field=\"Total_Costs\"></td></tr><tr><td>责任医生：</td><td field=\"Doctor_In_Charge\"></td><td>诊断：</td><td colspan=\"7\" field=\"Diagnosis\"></td></tr>";
    $("#tabPatientInfo").append(table);
    $(".easyui-datagrid").datagrid({
        emptyMsg:'暂无数据!',
        onLoadSuccess: function (data) {
            if (data.total == 0) {
              showEmpty($(this))
            }
        } 
    })
})
function getNursingClass(v) {
    return NursingClass[v.Nursing_Class] || "";
}
function getPatientID(v) {
    return v.Patient_id+"("+v.Visit_id+")";
}
function getConditionTitle(v) {
   return condition[v.Patient_Condition] || "";
}
//没有数据时候显示
function showEmpty(target) {
    var opts = $(target).datagrid('options');
    var vc = $(target).datagrid('getPanel').children('div.datagrid-view');
    var gridBody=vc.find(".datagrid-body").last();
    if (!$(target).datagrid('getRows').length) { //判断是否有数据
        gridBody.empty(); //清空默认展示
        var bodyHeight=30; //设定高度
        gridBody.height(bodyHeight);
        var d = $('<div class="datagrid-empty"></div>').html(opts.emptyMsg || 'no records').appendTo(gridBody);
        d.css({
            height: bodyHeight,
            'line-height' : bodyHeight+'px',
            width : '100%',
            textAlign : 'center'
        });
        //设定datagrid-view的高度
        vc.height(bodyHeight+gridBody.prevAll(".datagrid-header").outerHeight());
    } 
}