function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = '';
}
$(function () {
    $.ajax({
        url: BaseData.WebApiUrl + "print/printCrlJosn",
        data: "patient_id=" + getUrlParam("patient_id") + "&visit_id=" + getUrlParam("visit_id") ,
        type: "get",
        success: (function (data) {
            if (data != '') {
                var json = $.parseJSON(data);
                addHtml(json);
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
        + '<h2 style="font-size:25px;text-align:center;line-height:0px;">'+PrintData.HospitalName+'</h2><h3 style="font-size:20px;text-align:center ">出入量记录</h3><div style=\"margin-bottom:15px;text-align: center;\"><span class="name" style="padding-right:15px;">姓名：'+getData.Name+'</span><span class=\"sex\" style=\"padding-right:15px;\">性别：'+getData.Sex+'</span><span class=\"age\" style=\"padding-right:15px;\">年龄：'+getData.Age+'</span><span class=\"inpatient\" style=\"padding-right:15px;\">病区：'+getData.Dept_name+'</span><span class=\"bed_number\" style=\"padding-right:15px;\">床号：'+getData.Bed_Label+'</span><span class=\"patient_number\" style=\"padding-right:15px;\">病案号：'+getData.Patient_id+'</span><span class=\"diagn\" style=\"padding-right:15px;\"></span>诊断：'+diag+'</div></div>'
        + '</table>'
        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;" width="1100px" >  '
    +'<tr>'
    +'                 <th  rowspan="2">时间</th>'
    + '                <th colspan="2">入量(ML)</th>'
    + '                <th colspan="5">出量</th>'
    + '                <th  rowspan="2">签名</th>'
    + '            </tr>'
    + '<tr>'
    +'                <th>项目</th>'
    + '                <th>实入量</th>'
    + '                <th>大便</th>'
    + '                <th>小便</th>'
    + '                <th>呕吐</th>'
    + '                <th>胃液</th>'
    + '                <th>引流</th>'
    + '            </tr>'
    TrCount = 20;
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
                    TrCount = 17;
                    PageCount++;
                    bdhtml += '  <tr><th colspan="9" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr> </table><br/>'
                        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;"; width="1100px;">'
                        + '            <tr>'
                        +'                 <th  rowspan="2">时间</th>'
                        + '                <th colspan="2">入量(ML)</th>'
                        + '                <th colspan="5">出量</th>'
                        + '                <th  rowspan="2">签名</th>'
                        + '            </tr>'
                        +'           <tr>'
                        +'                <th>项目</th>'
                        + '                <th>实入量</th>'
                        + '                <th>大便</th>'
                        + '                <th>小便</th>'
                        + '                <th>呕吐</th>'
                        + '                <th>胃液</th>'
                        + '                <th>引流</th>'
                        + '            </tr>'
                }
                bdhtml += '            <tr style="background:'+jsonDataInfo[i].summaryType+'">'
                bdhtml += '                <td>' + jsonDataInfo[i].TimePoint + '</td>'
                bdhtml += '                <td>' + jsonDataInfo[i].Kind_0_Type + '</td>'
                bdhtml += '                <td>' + jsonDataInfo[i].Kind_0_Value + '</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Kind_1_B_Value+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Kind_1_NL_Value+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Kind_1_OT_Value+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Kind_1_WYYLY_Value+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].Kind_1_TypeValue+'</td>'
                bdhtml += '                <td>'+jsonDataInfo[i].NurseName+'</td>'
                bdhtml += '            </tr>'
        }
    }
    PageCount++;
    bdhtml += '   <tr><th colspan="9" style="text-align:center;border-bottom-style:none;" >第' + PageCount + '页</th> </tr>      </table>'
    var InfoDiv = document.getElementById("Info");
    InfoDiv.innerHTML = bdhtml;
}