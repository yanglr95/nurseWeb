function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
$(function () {
    $.ajax({
        url: BaseData.WebApiUrl + "print/printBloodGlucose",
        data: "patient_id=" + getUrlParam("patient_id") + "&visit_id=" + getUrlParam("visit_id") ,
        type: "get",
        success: (function (data) {
            if (data != '') {
                var json = $.parseJSON(data);
                addHtml(json)
            }
        })
    });
});
function addHtml(jsonDataInfo){
    var TrCount = 0;
    var PageCount = 0;
    var getData = JSON.parse(getSession("patientData"));
    var diag="";
    if (getData.Diagnosis != null && getData.Diagnosis != "" &&
    getData.Diagnosis.length > 9)
            diag = getData.Diagnosis.substr(0, 9);
        else if (getData.Diagnosis == null)
            diag = "";
        else
            diag = getData.Diagnosis;
    bdhtml = '<table border="0" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;" width="1100px" >'
        + '<h2 style="font-size:25px;text-align:center;line-height:0px;">'+PrintData.HospitalName+'</h2><h3 style="font-size:20px;text-align:center ">血糖监测单</h3><div style=\"margin-bottom:15px;text-align: center;\"><span class="name" style="padding-right:15px;">姓名：'+getData.Name+'</span><span class=\"sex\" style=\"padding-right:15px;\">性别：'+getData.Sex+'</span><span class=\"age\" style=\"padding-right:15px;\">年龄：'+getData.Age+'</span><span class=\"inpatient\" style=\"padding-right:15px;\">病区：'+getData.Dept_name+'</span><span class=\"bed_number\" style=\"padding-right:15px;\">床号：'+getData.Bed_Label+'</span><span class=\"patient_number\" style=\"padding-right:15px;\">病案号：'+getData.Patient_id+'</span><span class=\"diagn\" style=\"padding-right:15px;\"></span>诊断：'+diag+'</div></div>'
        + '</table>'
        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;" width="1100px" >  '
        +'<tr>'
        +'                 <th style="width:8%">日期</th>'
        + '                <th>时间</th>'
        + '                <th>空腹</th>'
        + '                <th style="width:5%">签名</th>'
        +'                 <th>时间</th>'
        + '                <th>早餐后2H</th>'
        + '                <th style="width:5%">签名</th>'
        + '                <th>时间</th>'
        + '                <th>午餐前</th>'
        + '                <th style="width:5%">签名</th>'
        + '                <th>时间</th>'
        + '                <th>午餐后2H</th>'
        + '                <th style="width:5%">签名</th>'
        + '                <th>时间</th>'
        + '                <th>晚餐前</th>'
        + '                <th style="width:5%">签名</th>'
        + '                <th>时间</th>'
        + '                <th>晚餐后2H</th>'
        + '                <th style="width:5%">签名</th>'
        + '                <th>时间</th>'
        + '                <th>睡前</th>'
        + '                <th style="width:5%">签名</th>'
        + '  </tr>'
    TrCount = 28;
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
                    bdhtml += '  <tr><th colspan="22" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr> </table><br/>'
                        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;"; width="1100px;">'
                        +'<tr>'
                        +'                 <th style="width:8%">日期</th>'
                        + '                <th>时间</th>'
                        + '                <th>空腹</th>'
                        + '                <th style="width:5%">签名</th>'
                        +'                 <th>时间</th>'
                        + '                <th>早餐后2H</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '                <th>时间</th>'
                        + '                <th>午餐前</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '                <th>时间</th>'
                        + '                <th>午餐后2H</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '                <th>时间</th>'
                        + '                <th>晚餐前</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '                <th>时间</th>'
                        + '                <th>晚餐后2H</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '                <th>时间</th>'
                        + '                <th>睡前</th>'
                        + '                <th style="width:5%">签名</th>'
                        + '  </tr>'
                }
                bdhtml += '            <tr>'
                bdhtml += '                <td>' + jsonDataInfo[i].date + '</td>'
                bdhtml += '                <td>' + jsonDataInfo[i].time_1 + '</td>'
                bdhtml += '                <td>' + jsonDataInfo[i].Value_1 + '</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_1+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_2+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_2+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_2+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_3+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_3+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_3+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_4+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_4+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_4+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_5+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_5+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_5+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_6+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_6+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_6+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].time_7+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Value_7+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName_7+'</td>'
                bdhtml += '            </tr>'
        }
    }
    PageCount++;
    bdhtml += '   <tr><th colspan="22" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr>      </table>'
    var InfoDiv = document.getElementById("Info");
    InfoDiv.innerHTML = bdhtml;
}