function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
function getProduct(name){
    var con=[];
    var pip=[];
    var product="<tr style=\"font-size:16px;\">符号:<span style=\"padding-left:20px;\">意识：</span>";
    $.ajax({
        url: BaseData.WebApiUrl + "NursingCommon/getData",
        data: "dictType="+name,
        type: "get",
        success: (function (data) {
            var jsonData = $.parseJSON(data);
            if(jsonData!=null){
                for(var i=0;i<jsonData.length;i++){
                    if(jsonData[i].Dict_type=="护理报告意识"){
                       product +="<span>"+jsonData[i].Dict_code+" "+jsonData[i].dict_name+"</span>";
                    }
                }
                $("#TbTongJi").append(product);
            }
        })
        
    });
   
}

$(function () {
    "patientId=20001649&visitId=1",
    $.ajax({
        url: BaseData.WebApiUrl + "print/printNurseCare",
        data: "patient_id=" + getUrlParam("patient_id") + "&visit_id=" + getUrlParam("visit_id") ,
        type: "get",
        success: (function (data) {
            if (data != '') {
                var json = $.parseJSON(data)["Table"];
                getProduct("护理报告意识")
                addHtml(json)
                //window.open(BaseData.WebApiUrl + "print/getOrderPaster/?key=" + data);
            }
        })
    });
});

function addHtml(jsonDataInfo) {
    var TrCount = 0;
    var PageCount = 0;
    var getData = JSON.parse(getSession("patientData"));
    var diag = "";
    if (getData.Diagnosis != null && getData.Diagnosis != "" &&
        getData.Diagnosis.length > 9)
        diag = getData.Diagnosis.substr(0, 9);
    else if (getData.Diagnosis == null)
        diag = "";
    else
        diag = getData.Diagnosis;
        
    bdhtml = '<table border="0" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;" width="1100px" >' +
        '<h2 style="font-size:25px;text-align:center;line-height:0px;">' + PrintData.HospitalName + '</h2><h3 style="font-size:20px;text-align:center;height:20px;" ">一般护理记录单</h3><div style=\"margin-bottom:15px;text-align: center;\"><span class="name" style="padding-right:15px;">姓名：'+getData.Name+'</span><span class=\"sex\" style=\"padding-right:15px;\">性别：'+getData.Sex+'</span><span class=\"age\" style=\"padding-right:15px;\">年龄：'+getData.Age+'</span><span class=\"inpatient\" style=\"padding-right:15px;\">病区：'+getData.Dept_name+'</span><span class=\"bed_number\" style=\"padding-right:15px;\">床号：'+getData.Bed_Label+'</span><span class=\"patient_number\" style=\"padding-right:15px;\">病案号：'+getData.Patient_id+'</span><span class=\"diagn\" style=\"padding-right:15px;\"></span>诊断：'+diag+'</div></div>'
        +'</table>'
        +'<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;" width="1100px" >  ' +
        '<tr>' +
        '                <th  rowspan="3">日期</th>' +
        '                <th  rowspan="3">时间</th>' +
        '                <th  rowspan="3">体温</th>' +
        '                <th  rowspan="3">脉搏</th>' +
        '                <th  rowspan="3">呼吸</th>' +
        '                <th  rowspan="3">血压</th>' +
        '                <th  rowspan="3">意识</th>' +
        '                <th  colspan="4">瞳孔</th>' +
        '                <th  rowspan="3">血氧饱和度</th>' +
        '                <th  colspan="2">氧流量</th>' +
        '                <th  rowspan="3">皮肤情况</th>' +
        '                <th  rowspan="3">病情记录</th>' +
        '                <th  rowspan="3">签名</th>' +
        '            </tr>' +
        '<tr>' +
        '                <th colspan="2">大小</th>' +
        '                <th colspan="2">对光反应</th>' +
        '                <th rowspan="2">面罩</th>' +
        '                <th rowspan="2">鼻导管</th>' +
        ' </tr>' +
        '<tr>' +
        '                <th>左</th>' +
        '                <th>右</th>' +
        '                <th>左</th>' +
        '                <th>右</th>' +
        ' </tr>'
    TrCount =33;
    if (typeof (jsonDataInfo) != "undefined") {
        for (var i in jsonDataInfo) {
            for(var k in jsonDataInfo[i]){
                if(jsonDataInfo[i][k]==null){
                    jsonDataInfo[i][k]=""
                }
            }
            var TableCount = 37;
            TrCount++;
            if (TrCount > TableCount) {
                TrCount = 33;
                PageCount++;
                bdhtml += '  <tr><th colspan="17" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr> </table><br/>' +
                    '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;"; width="1100px;">' +
                    '<tr>' +
                    '                <th  rowspan="3">日期</th>' +
                    '                <th  rowspan="3">时间</th>' +
                    '                <th  rowspan="3">体温</th>' +
                    '                <th  rowspan="3">脉搏</th>' +
                    '                <th  rowspan="3">呼吸</th>' +
                    '                <th  rowspan="3">血压</th>' +
                    '                <th  rowspan="3">意识</th>' +
                    '                <th  colspan="4">瞳孔</th>' +
                    '                <th  rowspan="3">血氧饱和度</th>' +
                    '                <th  colspan="2">氧流量</th>' +
                    '                <th  rowspan="3">皮肤情况</th>' +
                    '                <th  rowspan="3">病情记录</th>' +
                    '                <th  rowspan="3">签名</th>' +
                    '            </tr>' +
                    '<tr>' +
                    '                <th colspan="2">大小</th>' +
                    '                <th colspan="2">对光反应</th>' +
                    '                <th rowspan="2">面罩</th>' +
                    '                <th rowspan="2">鼻导管</th>' +
                    ' </tr>' +
                    '<tr>' +
                    '                <th>左</th>' +
                    '                <th>右</th>' +
                    '                <th>左</th>' +
                    '                <th>右</th>' +
                    ' </tr>'
            }
            bdhtml += '            <tr>'
            bdhtml += '                <td>' + jsonDataInfo[i].RECORDDATE + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TIMEPOINT + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TW + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].MB + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].HXPL + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].XY + '</td>'
            bdhtml += '                <td></td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TKZ + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TKY + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TKZZ + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].TKYY + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].SPO + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].O2MEASURE + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].NOSECONDUIT + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].SKINCONDITION + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].MEASURE + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].NURSENAME + '</td>'
            bdhtml += '            </tr>'
        }
    }
    PageCount++;
    bdhtml += '   <tr><th colspan="17" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr>      </table>'
    var InfoDiv = document.getElementById("Info");
    InfoDiv.innerHTML = bdhtml;
}
function setDataGrid(num) {
    $("#genurseList"+num).datagrid({
        width: '90%',
        style: {
            'text-align': 'center',
            "margin": "0 auto"
        },
        columns: [
            [{
                    field: 'RECORDDATE',
                    title: '日期',
                    width: '8%',
                    rowspan: 3
                },
                {
                    field: 'TIMEPOINT',
                    title: '时间',
                    width: '6%',
                    rowspan: 3
                },
                {
                    field: 'TW',
                    title: '体温',
                    width: '4%',
                    rowspan: 3
                },
                {
                    field: 'MB',
                    title: '脉搏',
                    width: '4%',
                    rowspan: 3
                },
                {
                    field: 'HXPL',
                    title: '呼吸',
                    width: '4%',
                    rowspan: 3
                },
                {
                    field: 'XY',
                    title: '血压',
                    width: '5%',
                    rowspan: 3
                },
                {
                    field: 'YS',
                    title: '意识',
                    width: '4%',
                    rowspan: 3
                },
                {
                    title: '瞳孔',
                    colspan: 4
                },
                {
                    field: 'SPO',
                    title: '血氧饱和度',
                    width: '6%',
                    rowspan: 3
                },
                {
                    title: '氧流量',
                    colspan: 2
                },
                {
                    field: 'SKINCONDITION',
                    title: '皮肤情况',
                    width: '5%',
                    rowspan: 3
                },
                {
                    field: 'MEASURE',
                    title: '病情记录',
                    width: '25%',
                    rowspan: 3
                },
                {
                    field: 'NURSENAME',
                    title: '签名',
                    width: '6%',
                    rowspan: 3
                },
            ],
            [{
                    title: '大小',
                    colspan: 2,
                },
                {
                    title: '对光反应',
                    colspan: 2,
                },
                {
                    field: 'O2MEASURE',
                    title: '面罩',
                    rowspan: 2
                },
                {
                    field: 'NoseConduit',
                    title: '鼻导管',
                    rowspan: 2
                },
            ],
            [{
                    field: 'TKZ',
                    title: '左',
                    width:'3%'
                },
                {
                    field: 'TKY',
                    title: '右',
                    width:'3%'
                },
                {
                    field: 'TKZZ',
                    title: '左',
                    width:'3%'
                },
                {
                    field: 'TKYY',
                    title: '右',
                    width:'3%'
                },
            ]
        ],

    });


}