function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
$(function () {
    $.ajax({
        url: BaseData.WebApiUrl + "printData/getTList",
        data: "recordingDate=" + getUrlParam("date"),
        type: "get",
        success: (function (data) {
            if (data != '') {
                var json = $.parseJSON(data).ds;
                var data=[];
                for(var i in json){
                   var arr=json[i];
                   var obj={};
                   for(var j=0;j<arr.length;j++){
                     data.push(arr[j])
                   }
                }
                addHtml(data)
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
        '<h2 style="font-size:25px;text-align:center;line-height:0px;">' + PrintData.HospitalName + '</h2><h3 style="font-size:20px;text-align:center;height:20px;" ">T表打印</h3><tr style="line-height:15px;"><th style="text-align:left;font-size:15px">科室：' + getLoginUser().DeptName + '</th><th style="text-align:right;font-size:15px">日期：' +getUrlParam("date")+'</th></tr>'
        +'</table>'
        +'<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;" width="1100px" >  ' +
        '<tr>' +
        '                <th  rowspan="3">床号</th>' +
        '                <th  rowspan="3" style="width:100px">姓名</th>' +
        '                <th  colspan="4">2</th>' +
        '                <th  colspan="4">10</th>' +
        '                <th  colspan="4">14</th>' +
        '                <th  colspan="4">18</th>' +
        '                <th  colspan="4">22</th>' +
        '                <th  rowspan="3" style="width:50px">大便</th>' +
        '            </tr>' +
        '<tr>' +
        '                <th style="width:50px;">T</th>' +
        '                <th style="width:50px;">P</th>' +
        '                <th style="width:50px;">R</th>' +
        '                <th style="width:50px;">BP</th>' +
        '                <th style="width:50px;">P</th>' +
        '                <th style="width:50px;">R</th>' +
        '                <th style="width:50px;">BP</th>' +
        '                <th style="width:50px;">T</th>' +
        '                <th style="width:50px;">P</th>' +
        '                <th style="width:50px;">R</th>' +
        '                <th style="width:50px;">BP</th>' +
        '                <th style="width:50px;">T</th>' +
        '                <th style="width:50px;">P</th>' +
        '                <th style="width:50px;">R</th>' +
        '                <th style="width:50px;">BP</th>' +
        '                <th style="width:50px;">T</th>' +
        '                <th style="width:50px;">P</th>' +
        '                <th style="width:50px;">R</th>' +
        '                <th style="width:50px;">BP</th>' +
        '                <th style="width:50px;">T</th>' +
        ' </tr>' +
        '<tr>' +
        '                <th style="width:50px;">℃</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">mm<br/>Hc</th>' +
        '                <th style="width:50px;">℃</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">mm<br/>Hc</th>' +
        '                <th style="width:50px;">℃</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">mm<br/>Hc</th>' +
        '                <th style="width:50px;">℃</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">mm<br/>Hc</th>' +
        '                <th style="width:50px;">℃</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">次/分</th>' +
        '                <th style="width:50px;">mm<br/>Hc</th>' +
        ' </tr>'
    TrCount =28;
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
                TrCount = 27;
                PageCount++;
                bdhtml += '  <tr><th colspan="23" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr> </table><br/>' +
                    '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;"; width="1100px;">' +
                    '<tr>' +
                    '                <th  rowspan="3">床号</th>' +
                    '                <th  rowspan="3" style="width:100px">姓名</th>' +
                    '                <th  colspan="4">2</th>' +
                    '                <th  colspan="4">10</th>' +
                    '                <th  colspan="4">14</th>' +
                    '                <th  colspan="4">18</th>' +
                    '                <th  colspan="4">22</th>' +
                    '                <th  rowspan="3" style="width:50px">大便</th>' +
                    '            </tr>' +
                    '<tr>' +
                    '                <th style="width:50px;">T</th>' +
                    '                <th style="width:50px;">P</th>' +
                    '                <th style="width:50px;">R</th>' +
                    '                <th style="width:50px;">BP</th>' +
                    '                <th style="width:50px;">P</th>' +
                    '                <th style="width:50px;">R</th>' +
                    '                <th style="width:50px;">BP</th>' +
                    '                <th style="width:50px;">T</th>' +
                    '                <th style="width:50px;">P</th>' +
                    '                <th style="width:50px;">R</th>' +
                    '                <th style="width:50px;">BP</th>' +
                    '                <th style="width:50px;">T</th>' +
                    '                <th style="width:50px;">P</th>' +
                    '                <th style="width:50px;">R</th>' +
                    '                <th style="width:50px;">BP</th>' +
                    '                <th style="width:50px;">T</th>' +
                    '                <th style="width:50px;">P</th>' +
                    '                <th style="width:50px;">R</th>' +
                    '                <th style="width:50px;">BP</th>' +
                    '                <th style="width:50px;">T</th>' +
                    ' </tr>' +
                    '<tr>' +
                    '                <th style="width:50px;">℃</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">mm<br/>Hc</th>' +
                    '                <th style="width:50px;">℃</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">mm<br/>Hc</th>' +
                    '                <th style="width:50px;">℃</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">mm<br/>Hc</th>' +
                    '                <th style="width:50px;">℃</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">mm<br/>Hc</th>' +
                    '                <th style="width:50px;">℃</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">次/分</th>' +
                    '                <th style="width:50px;">mm<br/>Hc</th>' +
                    ' </tr>'
            }
            bdhtml += '            <tr>'
            bdhtml += '                <td>' + jsonDataInfo[i].Bed_Label + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].Name + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['2T'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['2P'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['2R'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['2BP'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['10P'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['10R'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['10BP'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['10T'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['14P'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['14R'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['14BP'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['14T'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['18P'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['18R'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['18BP'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['18T'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['22P'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['22R'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['22BP'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i]['22T'] + '</td>'
            bdhtml += '                <td>' + jsonDataInfo[i].DB + '</td>'
            bdhtml += '            </tr>'
        }
    }
    PageCount++;
    bdhtml += '   <tr><th colspan="23" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr>      </table>'
    var InfoDiv = document.getElementById("Info");
    InfoDiv.innerHTML = bdhtml;
}