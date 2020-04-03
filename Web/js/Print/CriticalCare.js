function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
$(function () {
    // "patientId=20001649&visitId=1",
    // $.ajax({
    //     url: BaseData.WebApiUrl + "print/printNurseCareReport",
    //     data: "patient_id=" + getUrlParam("patient_id") + "&visit_id=" + getUrlParam("visit_id") ,
    //     type: "get",
    //     success: (function (data) {
    //         if (data != '') {
    //             var json = $.parseJSON(data);
    //             var count = 1;
    //             if (count > 0)
    //             {
    //                 for (var i = 0; i < count; i++) {
    //                     var html = " <div id=\"print\"  class=\"divfloat\"><h3 style=\"text-align:left;float:left;display:none;\">科室：" + getSession("ward_code") + "</h3><h3 style=\"text-align:right;float:right;display:none;\">日期：" + getUrlParam("date") + "</h3>" +
    //                     "<table id=\"nurseList" + i + "\" class=\"easyui-datagrid;\" ></table><h5 style=\"text-align:center;font-weight:normal;\">第"+(i+1)+"页 共"+count+"页</h5></div>";
    //                     $("#body").append(html);
    //                     setDataGrid(i);
    //                     $("#nurseList" + i).datagrid('loadData', json["ds"]["Table" + (i + 1)])
    //                 }
    //             }
                
    //             //window.open(BaseData.WebApiUrl + "print/getOrderPaster/?key=" + data);
    //         }
    //     })
    // });

    var count = 1;
    var json=[]
    if (count > 0)
    {
        for (var i = 0; i < count; i++) {
            var html = " <div id=\"print\"  class=\"divfloat\"><h3 style=\"text-align:left;float:left;display:none;\">科室：" + getSession("ward_code") + "</h3><h3 style=\"text-align:right;float:right;display:none;\">日期：" + getUrlParam("date") + "</h3>" +
            "<table id=\"nurseList" + i + "\" class=\"easyui-datagrid;\" ></table><h5 style=\"text-align:center;font-weight:normal;\">第"+(i+1)+"页 共1页</h5></div>";
            $("#body").append(html);
            setDataGrid(i);
            $("#nurseList" + i).datagrid('loadData', json)
        }
        var div="<div><div style=\"display:inline-block\"><p><span>气管插管/气切第日</span><span>气切第日</span><span>插管深度cm</span><span>胃管第日</span><span>尿管第日</span><span>中心静脉导管第日</span></p><p>位置：</p><div style=\"display:inline-block\">痰液：<p></p></div></div><div><p>意识：</p><p>体位：</p><p>皮肤情况：</p><p>对光反射：</p></div><div><p>伤口情况：</p><p>吸氧方式：</p><p>管理情况：</p><p>呼吸形式：</p></div></div>";
        // $("#body").append(div)

    }

});
function setDataGrid(num) {
    $("#nurseList"+num).datagrid({
        width: '100%',
        style: { 'text-align': 'center',"margin":"0 auto" },
        columns: [
             [
                { field: 'Time_Point', title: '时间', width: '3%', rowspan: 3},
                { title:"生命体征",colspan:4},
                { field: 'aa', title: 'SP02%', width: '3%', rowspan: 3 },
                { field: '22P', title: 'CVPcmH20', width: '3%', rowspan: 3 },
                { title:'意识状态',colspan:5},
                { title:'吸氧',colspan:3},
                { title:'呼吸机参数',colspan:6},
                { title:'入量',colspan:3},
                { title:'出量',colspan:9},
                { title:'护理情况',colspan:5},
                { field:'nurse',title:'护理记录',width:'3%',rowspan: 3},
                { field:'Name',title:'签名',width:'3%',rowspan: 3}
            ],
            [
                { field: '2T', title: '体温℃', rowspan: 2,width:'3%'},
                { field: '2P', title: '脉搏(次/分)',rowspan: 2,width:'3%'},
                { field: '2R', title: '呼吸(次/分)',rowspan: 2,width:'3%'},
                { field: '2BP', title: '血压(mmHg)',rowspan: 2,width:'3%'},
                { field: 'a', title: '意识', rowspan: 2,width:'3%'},
                { field: 'b', title: '瞳孔(mm)',colspan:2,width:'2%'},
                { field: 'c', title: '对光反应',colspan:2,width:'2%'},
                { field: 'd',title:'吸氧形式',rowspan:2,width:'3%'},
                { field: 'e',title:'呼吸形式',rowspan:2,width:'3%'},
                { field: 'f',title:'氧流量L/min',rowspan:2,width:'3%'},
                { field: 'g',title:'呼吸模式',rowspan:2,width:'3%'},
                { field: 'h',title:'VT(ml)',rowspan:2,width:'3%'},
                { field: 'i',title:'PEEP/CPAP(cmH20)',rowspan:2,width:'4%'},
                { field: 'j',title:'PS/IPAP(cmH20)',rowspan:2,width:'3%'},
                { field: 'k',title:'f(次/分)',rowspan:2,width:'3%'},
                { field: 'l',title:'Fi02(%)',rowspan:2,width:'3%'},
                { field: 'm',title:'口服/鼻饲(ml)',rowspan:2,width:'3%'},
                { field: 'n',title:'其他给药(ml)',rowspan:2,width:'3%'},
                { field: 'o',title:'尿(ml)',rowspan:2,width:'3%'},
                { field: 'o1',title:'便(ml)',rowspan:2,width:'3%'},
                { field: 'o2',title:'呕吐(ml)',rowspan:2,width:'3%'},
                { field: 'o3',title:'胃液(ml)',rowspan:2,width:'3%'},
                { field: 'o4',title:'引流(1)(ml)',rowspan:2,width:'3%'},
                { field: 'o5',title:'引流(2)(ml)',rowspan:2,width:'3%'},
                { field: 'o6',title:'引流(3)(ml)',rowspan:2,width:'3%'},
                { field: 'o7',title:'引流(4)(ml)',rowspan:2,width:'3%'},
                { field: 'o8',title:'引流(5)(ml)',rowspan:2,width:'3%'},
                { field: 'o9',title:'痰液性质',rowspan:2,width:'2%'},
                { field: '010',title:'翻身体位',rowspan:2,width:'2%'},
                { field: 'o11',title:'皮肤情况',rowspan:2,width:'2%'},
                { field: 'o12',title:'伤口情况',rowspan:2,width:'2%'},
                { field: 'o13',title:'管路情况',rowspan:2,width:'2%'},

                
            ], 
            [
                { field: 'b', title: '左'},
                { field: 'b', title: '右'},
                { field: 'c', title: '左'},
                { field: 'c', title: '右'},
            ]],

    });


}