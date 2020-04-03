function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
function clearInnerHTML() {
    var length = $("#body").find("div").length;
    $("#body").find("div").each(function (o) {
        if (o > 0)
            this.remove()
    });
}
function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
$(function () {
    //clearInnerHTML();
    var ShiftTime = "";
    var bdhtml = "";
    var jsonDataCount = "", jsonDataInfo = "",jsonShiftAdt="";
    var ry = "", cy = "", zr = "", zc = "", sw = "";
    checkSum();
})
function AddHtml() {
    var TrCount = 1;
    var PageCount = 0;
    var adt = 0;
    bdhtml = '<table border="0" align="center" style="text-align:center;border-collapse:separate; border-spacing:0px 0px;" width="1050px">'
        + '<tr><th colspan="2" rowspan="3" style="font-size:30px ">护士值班报告单</th></tr> <tr></tr><tr></tr>'
        + '<tr><th style="text-align:left;font-size:15px">科室：' + getLoginUser().DeptName + '</th><th style="text-align:right;font-size:15px">日期：' + $("#txtDate").datebox("getValue") + '</th></tr>'
        + '</table>'
        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-bottom-style:none;border-left-style:none;border-right-style:none;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;" width="1050px">  '
        + '            <tr>'
        + '                <th  style="width:16%" rowspan="4"></th>'
        + '                <th colspan="4">白班</th>'
        + '                <th colspan="4">小夜班</th>'
        + '                <th colspan="4">大夜班</th>'
        + '            </tr>'
        + '            <tr>'
        + '                    <th style="width:10%;">' + '病人总数' + ((jsonDataCount[0].XYS != null) ? jsonDataCount[0].XYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '入院' + ((jsonDataCount[0].RYS != null) ? jsonDataCount[0].RYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '出院' + ((jsonDataCount[0].CYS != null) ? jsonDataCount[0].CYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '转入' + ((jsonDataCount[0].ZRS != null) ? jsonDataCount[0].ZRS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:10%;">' + '病人总数' + ((jsonDataCount[1].XYS != null) ? jsonDataCount[1].XYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '入院' + ((jsonDataCount[1].RYS != null) ? jsonDataCount[1].RYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '出院' + ((jsonDataCount[1].CYS != null) ? jsonDataCount[1].CYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '转入' + ((jsonDataCount[1].ZRS != null) ? jsonDataCount[1].ZRS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:10%;">' + '病人总数' + ((jsonDataCount[2].XYS != null) ? jsonDataCount[2].XYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '入院' + ((jsonDataCount[2].RYS != null) ? jsonDataCount[2].RYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '出院' + ((jsonDataCount[2].CYS != null) ? jsonDataCount[2].CYS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '转入' + ((jsonDataCount[2].ZRS != null) ? jsonDataCount[2].ZRS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                </tr>'
        + '            <tr>'
        + '                    <th style="width:10%;">' + '转&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp出' + ((jsonDataCount[0].ZCS != null) ? jsonDataCount[0].ZCS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病危' + ((jsonDataCount[0].BWS != null) ? jsonDataCount[0].BWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病重' + ((jsonDataCount[0].BZBR != null) ? jsonDataCount[0].BZBR : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '分娩' + ((jsonDataCount[0].FMS != null) ? jsonDataCount[0].FMS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:10%;">' + '转&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp出' + ((jsonDataCount[1].ZCS != null) ? jsonDataCount[1].ZCS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病危' + ((jsonDataCount[1].BWS != null) ? jsonDataCount[1].BWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病重' + ((jsonDataCount[1].BZBR != null) ? jsonDataCount[1].BZBR : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '分娩' + ((jsonDataCount[1].FMS != null) ? jsonDataCount[1].FMS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:10%;">' + '转&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp出' + ((jsonDataCount[2].ZCS != null) ? jsonDataCount[2].ZCS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病危' + ((jsonDataCount[2].BWS != null) ? jsonDataCount[2].BWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '病重' + ((jsonDataCount[2].BZBR != null) ? jsonDataCount[2].BZBR : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '分娩' + ((jsonDataCount[2].FMS != null) ? jsonDataCount[2].FMS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                </tr>'
        + '            <tr>'
        + '                    <th style="width:10%;">' + '一级护理' + ((jsonDataCount[0].YJHL != null) ? jsonDataCount[0].YJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '特护' + ((jsonDataCount[0].TJHL != null) ? jsonDataCount[0].TJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '手术' + ((jsonDataCount[0].SSS != null) ? jsonDataCount[0].SSS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '死亡' + ((jsonDataCount[0].SWS != null) ? jsonDataCount[0].SWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:10%;">' + '一级护理' + ((jsonDataCount[1].YJHL != null) ? jsonDataCount[1].YJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '特护' + ((jsonDataCount[1].TJHL != null) ? jsonDataCount[1].TJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '手术' + ((jsonDataCount[1].SSS != null) ? jsonDataCount[1].SSS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp")  + '人</th>'
        + '                    <th style="width:6%;">' + '死亡' + ((jsonDataCount[1].SWS != null) ? jsonDataCount[1].SWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp")  + '人</th>'
        + '                    <th style="width:10%;">' + '一级护理' + ((jsonDataCount[2].YJHL != null) ? jsonDataCount[2].YJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '特护' + ((jsonDataCount[2].TJHL != null) ? jsonDataCount[2].TJHL : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '手术' + ((jsonDataCount[2].SSS != null) ? jsonDataCount[2].SSS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                    <th style="width:6%;">' + '死亡' + ((jsonDataCount[2].SWS != null) ? jsonDataCount[2].SWS : "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp") + '人</th>'
        + '                </tr>'
    if (typeof (ry) != "undefined" && ry != "")
    {
        bdhtml += '<tr>'
        + ' <th colspan="1">入院</th>'
        + ' <th colspan="12" style="text-align:left" >' + ry.substring(1, ry.length) + '</th>'
        + '</tr>'
        adt++;
    }
    if (typeof (cy) != "undefined" && cy != "") {
        bdhtml += '<tr>'
             + ' <th colspan="1">出院</th>'
        + ' <th colspan="12" style="text-align:left" >' + cy.substring(1, cy.length) + '</th>'
        + '</tr>'
        adt++;
    }
    if (typeof (zr) != "undefined" && zr != "") {
        bdhtml += '<tr>'
             + ' <th colspan="1">转入</th>'
        + ' <th colspan="12" style="text-align:left" >' + zr.substring(1, zr.length) + '</th>'
        + '</tr>'
        adt++;
    }
    if (typeof (zc) != "undefined" && zc != "") {
        bdhtml += '<tr>'
             + ' <th colspan="1">转出</th>'
        + ' <th colspan="12" style="text-align:left">' + zc.substring(1, zc.length) + '</th>'
        + '</tr>'
        adt++;
    }
    if (typeof (sw) != "undefined" && sw != "") {
        bdhtml += '<tr>'
             + ' <th colspan="1">死亡</th>'
        + ' <th colspan="12" style="text-align:left">' + sw.substring(1, sw.length) + '</th>'
        + '</tr>'
        adt++;
    }
   
    TrCount = jsonDataCount.length + 5 + adt;
    if (typeof (jsonDataInfo) != "undefined") {
        for (var i in jsonDataInfo) {
            var ArrLen = "";
            var len = 42;
            var TableCount = 35;
            var PatInfo = jsonDataInfo[i].Pat_Info;
            var A = jsonDataInfo[i].A != null ? jsonDataInfo[i].A : "";
            var P = jsonDataInfo[i].P != null ? jsonDataInfo[i].P : "";
            var N = jsonDataInfo[i].N != null ? jsonDataInfo[i].N : "";
            var strArrInfo = [], strArrA = [], strArrP = [], strArrN = [];
            strArrInfo = jsonDataInfo[i].Pat_Info.split(',');
            ArrLen = strArrInfo.length;
            if (A.indexOf("$") > 0) {
                var a = A.substring(0, A.indexOf("$")).myReplace(",", "");
                A = A.substring(A.indexOf("$") + 1, A.length).myReplace(" ", "");
                strArrA = reBytesStr(A, len);
                if (a.trim() != "")
                    strArrA.push(a);
                if (ArrLen < strArrA.length)
                    ArrLen = strArrA.length;
            }
            if (P.indexOf("$") > 0) {
                var a = P.substring(0, P.indexOf("$")).myReplace(",", "");
                P = P.substring(P.indexOf("$") + 1, P.length).myReplace(" ", "");   
                strArrP = reBytesStr(P, len);
                if (a.trim() != "")
                    strArrP.push(a);
                if (ArrLen < strArrP.length)
                    ArrLen = strArrP.length;
            }
            if (N.indexOf("$") > 0) {
                var a = N.substring(0, N.indexOf("$")).myReplace(",", "");
                N = N.substring(N.indexOf("$") + 1, N.length).myReplace(" ", "");
                strArrN = reBytesStr(N, len);
                if (a.trim() != "")
                    strArrN.push(a);
                if (ArrLen < strArrN.length)
                    ArrLen = strArrN.length;
            }
            for (var j = 0; j < ArrLen;j++) {
                TrCount++;
                if (TrCount > TableCount) {
                    TrCount = 3;
                    PageCount++;
                    bdhtml += '   <tr><td colspan="1"  style="border-left-style:none;border-bottom-style:none;border-right-style:none;"></td><td colspan="4"  style="border-left-style:none;border-bottom-style:none;border-right-style:none;" >值班护士：</td><td colspan="4" style="border-left-style:none;border-bottom-style:none;border-right-style:none;"  >值班护士：</td><td colspan="4" style="border-left-style:none;border-bottom-style:none;"border-right-style:none; >值班护士：  </td> </tr>'
                    bdhtml += '  <tr><th colspan="13" style="text-align:center;border-style:none;">第' + PageCount + '页</th> </tr> </table><br/>'
                        + '<table id="TbTongJi" border="1" align="center" style="text-align:center;border-left-style:none;border-bottom-style:none;border-right-style:none;border-collapse:separate; border-spacing:0px 0px;page-break-before: auto;page-break-after: always;"; width="1050px;">'
                        + '            <tr>'
                        + '                <th colspan="1" style="width:16%;" >病人</th>'
                        + '                <th colspan="4" style="width:28%;">白班</th>'
                        + '                <th colspan="4" style="width:28%;">小夜班</th>'
                        + '                <th colspan="4" style="width:28%;">大夜班</th>'
                        + '            </tr>'
                }
                if (j == 0&&i>0)
                {
                    bdhtml += '<tr style="border-top-color:red">'
                }
                else
                {
                    bdhtml += '            <tr>'
                }
                if (strArrInfo.length > j) {
                    bdhtml += '                <td>' + strArrInfo[j] + '</td>'
                }
                else {
                    bdhtml += '                <td></td>'
                }
                if (strArrA.length > j) {
                    bdhtml += '                <td colspan="4">' + strArrA[j] + '</td>'
                }
                else {
                    bdhtml += '                <td colspan="4"></td>'
                }
                if (strArrP.length > j) {
                    bdhtml += '                <td colspan="4">' + strArrP[j] + '</td>'
                }
                else {
                    bdhtml += '                <td colspan="4"></td>'
                }
                if (strArrN.length >j) {
                    bdhtml += '                <td colspan="4">' + strArrN[j] + '</td>'
                }
                else {
                    bdhtml += '                <td colspan="4"></td>'
                }
                bdhtml += '            </tr>'
            }

        }
    }
    PageCount++;
    bdhtml += '   <tr><td colspan="1"  style="border-left-style:none;border-bottom-style:none;border-right-style:none;"></td><td colspan="4"  style="border-left-style:none;border-bottom-style:none;border-right-style:none;" >值班护士：</td><td colspan="4" style="border-left-style:none;border-bottom-style:none;border-right-style:none;"  >值班护士：</td><td colspan="4" style="border-left-style:none;border-bottom-style:none;"border-right-style:none; >值班护士：  </td> </tr>'
    bdhtml += '  <tr><th colspan="13" style="text-align:center;border-style:none;">第' + PageCount + '页</th> </tr> </table>'
    var InfoDiv = document.getElementById("Info");
    InfoDiv.innerHTML = bdhtml;
}
//获取交班统计信息
function checkSum() {
    var recording_Date = $("#txtDate").datebox("getValue");
    var Banci = "1";
    $.ajax({
        url: BaseData.WebApiUrl + "TurnDuty/CheckOnTudy",
        data: "Date=" + recording_Date + "&Banci=" + Banci,
        type: "get",
        success: (function (data) {
            if (data) {
                if (data && data != "null") {
                    jsonDataCount = data["Table"];
                }
            }
            InitInputData();
        })
    });
}
function GteAdtShift() {
    var recording_Date = $("#txtDate").datebox("getValue");
    var AstratT = GetQueryString("AstratT");
    var PstratT = GetQueryString("PstratT");
    var NstratT = GetQueryString("NstratT");
    $.ajax({
        url: BaseData.WebApiUrl + "TurnDuty/GteAdtShift",
        data: "ShiftTime=" + AstratT + "&Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data) {
                if (data && data != "null") {
                    jsonShiftAdt = data["Table"];
                    for (var i in jsonShiftAdt)
                    {
                        if (jsonShiftAdt[i].ACTION == "C")
                        {
                            if (typeof (ry) == "undefined")
                                ry = "、" + jsonShiftAdt[i].NAME;
                            else
                                ry += "、" + jsonShiftAdt[i].NAME;
                        }
                        if (jsonShiftAdt[i].ACTION == "D") {
                            if (typeof (zr) == "undefined")
                                zr = "、" + jsonShiftAdt[i].NAME;
                            else
                                zr += "、" + jsonShiftAdt[i].NAME;
                        }
                        if (jsonShiftAdt[i].ACTION == "E") {
                            if (typeof (zc) == "undefined")
                                zc = "、" + jsonShiftAdt[i].NAME;
                            else
                                zc += "、" + jsonShiftAdt[i].NAME;
                        }
                        if (jsonShiftAdt[i].ACTION == "F") {
                            if (typeof (cy) == "undefined")
                                cy = "、" + jsonShiftAdt[i].NAME;
                            else
                                cy += "、" + jsonShiftAdt[i].NAME;
                        }
                        if (jsonShiftAdt[i].ACTION == "H") {
                            if (typeof (sw) == "undefined")
                                sw = "、" + jsonShiftAdt[i].NAME;
                            else
                                sw += "、" + jsonShiftAdt[i].NAME;
                        }
                    }
                }
            }
            AddHtml();
        })
    });
}
//获取该病人当班信息
function InitInputData() {
    var recording_Date = $("#txtDate").datebox("getValue");
    $.ajax({
        url: BaseData.WebApiUrl + "TurnDuty/getData",
        data: "recording_Date=" + recording_Date,
        type: "get",
        success: (function (data) {
            if (data && data != "null") {
                var jsonData = $.parseJSON(data);
                for (var i in jsonData) {
                    jsonData[i].Pat_Info = jsonData[i].Bed_no + ' ' + jsonData[i].Name + "," + (jsonData[i].Diagnosis != null ? jsonData[i].Diagnosis+"," : '')  + jsonData[i].Status;
                }
                jsonDataInfo = jsonData;
            }
            GteAdtShift();
        })
    });
}

function DtSelect() {
    checkSum();
}