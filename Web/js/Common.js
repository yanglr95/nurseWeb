// BaseUrl = "http://localhost/Huayi.Nurse.Webapi/";
//BaseUrl = "http://localhost:52355/"
BaseUrl = "http://192.168.2.143:8000/"
//BaseUrl = "http://localhost:8088/"
var BaseData = {

    WebApiUrl: BaseUrl + "api/",
    PictureUrl: BaseUrl + "pictures/"
}
var PrintData = {
    HospitalName:"南阳中心人民医院"
}
function dateFormatter(date) {

    return dateTimeFormatter(date, "yyyy-mm-dd");
}
function dateTimeFormatter(date, formatter) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var hour = date.getHours();
    var mi = date.getMinutes();
    var se = date.getSeconds();
    return formatter.replace("yyyy", y).replace("mm", m).replace("dd", d).replace("hh", replenish(hour)).replace("mi", replenish(mi)).replace("ss", replenish(se));
}

function replenish(num) {
    var s = num.toString()
    if (s.length < 2) {
        s = "0" + s;
    }
    return s;
}
function dateParser(date) {

    if (!date) {
        return new Date();
    }
    else {
        var ss = (date.split('-'));
        var y = parseInt(ss[0], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {

            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    }
}
function SetTableValue(tableName, jsonObj) {
    $("#" + tableName + " td[field]").each(function (index, obj) {
        var td = $(obj);
        if (jsonObj[td.attr("field")]) {
            var value;
            if (td.attr("formatFun")) {

                value = window[td.attr("formatFun")](jsonObj);
            }
            else {
                value = jsonObj[td.attr("field")];
            }
            td.html(value);
        }
    });
}

function InitEasyUIInputData(parentObj, data) {
    InitTextBoxData(parentObj, data);
    InitNumberBoxData(parentObj, data);
    InitComboData(parentObj, data);
}

function InitTextBoxData(parentObj, data) {
    $(parentObj).find(".easyui-textbox[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        if (data) {
            for (var s in bodyChart) {
                var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
                var length = JsonPro.length;
                if (p.substr(0, length).toLowerCase() == JsonPro) {
                    $(obj).textbox("setValue", data[p.substr(length)]);
                    break;
                }
            }
        }
        else {
            $(obj).textbox("setValue", null);
        }
    });
}

function InitNumberBoxData(parentObj, data) {
    $(parentObj).find(".easyui-numberbox[" + AttrName + "]").each(function (index, obj) {
        var bodyChart = $(obj).attr(AttrName).split(';');
        if (data) {
            for (var s in bodyChart) {
                var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
                var length = JsonPro.length;
                if (p.substr(0, length).toLowerCase() == JsonPro) {
                    $(obj).numberbox("setValue", data[p.substr(length)]);
                    break;
                }
            }
        }
        else {
            $(obj).numberbox("setValue", null);
        }
    });
}

function InitComboData(parentObj, data) {

    var defaultValue;
    if (window["ComboDataName"] && window[ComboDataName]) {
        defaultValue = window[ComboDataName];
    }
    $(parentObj).find(".easyui-combobox[" + AttrName + "]").each(function (index, obj) {
        var jsonData = [];
        var bodyChart = $(obj).attr(AttrName).split(';');
        var hasValue = false;
        var dataValue = null;
        if (data) {
            for (var s in bodyChart) {
                var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "");
                var length = JsonPro.length;
                if (p.substr(0, length).toLowerCase() == JsonPro) {
                    if (data[p.substr(length)]) {

                        var aa = $.parseJSON('{"text":"' + data[p.substr(length)] + '","value":"' + data[p.substr(length)] + '"}');
                        jsonData.push(aa);
                        hasValue = true;
                        dataValue = data[p.substr(length)];
                        break;
                    }
                }
            }
        }
        if (defaultValue) {
            if (!dataValue) {
                dataValue = defaultValue.defaultValue[0].value;
            }
            if (!hasValue) {
                for (var defaultIndex in defaultValue.defaultValue) {
                    jsonData.push(defaultValue.defaultValue[defaultIndex]);
                }
            }

            for (var s in bodyChart) {
                var p = bodyChart[s].replace(/(^\s*)|(\s*$)/g, "")
                var lenth = DefaultDataName.length;

                if (p.substr(0, lenth).toLowerCase() == DefaultDataName) {

                    for (var jsonIndex in defaultValue[p.substr(lenth)]) {

                        jsonData.push(defaultValue[p.substr(lenth)][jsonIndex]);
                        if (dataValue == defaultValue[p.substr(lenth)][jsonIndex].value) {
                            jsonData[0] = defaultValue.defaultValue[0];
                        }
                    }
                }
            }

            $(obj).combobox("loadData", jsonData);
        }
        // alert(dataValue);
        $(obj).combobox("setValue", dataValue);
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function getComboTextByValue(name, value) {

    var defaultValue = window[ComboDataName];
    if (defaultValue[name]) {
        for (var i in defaultValue[name]) {
            if (defaultValue[name][i].value == value) {
                return defaultValue[name][i].text;
            }
        }
    }
    return value;
}

function dataFilter(jsonData, filterAttr, beforeData) {
    var jsonFilter = new Array();
    var result = new Array();
    $(".easyui-combobox[" + filterAttr + "]").each(function (index, obj) {
        var filterValue = $(obj).combobox("getValue");
        if (filterValue != null && filterValue != "") {
            jsonFilter.push({ field: $(obj).attr(filterAttr), value: filterValue });
        }
    });
    if (beforeData && beforeData.length > 0) {
        for (var i in beforeData) {
            result.push(beforeData[i]);
        }
    }

    for (var i in jsonData) {
        var flag = true;
        for (var filterIndex in jsonFilter) {
            var filter = jsonFilter[filterIndex];
            if (jsonData[i][filter.field] != filter.value) {
                flag = false;
            }
        }
        if (flag) {
            result.push(jsonData[i]);
        }
    }
    return result;

}

function setLoginUser(strUser) {
    var expires = new Date();
    // expires.setTime(expires.getTime() + 2 * 60 * 60 * 1000);
    expires.setTime(expires.getTime() + 24 * 1 * 60 * 60 * 1000);
    setCookie("loginUser", strUser, expires);
}

function getLoginUser(showLogin) {
    if (showLogin == null) {
        showLogin = true;
    }
    var user = $.parseJSON(getCookie("loginUser"));
    if (user) {
        return user;
    }
    userLoginOut();
    if (showLogin) {
        $.messager.alert("提示", "用户没有登陆！", null, function () { $(window.top.document).find("#btnShowLogin").click(); });
    }
}

function userLoginOut() {
    //$(window.top.document).find("#divLoginInfo").css("display", "none");
    //$(window.top.document).find("#divNotLogin").css("display", "block");

    //var menu = $(window.top.document).find("#divMenu").eq(0);

    //var menuPanal = menu.accordion("panels");
    //for (var i = menuPanal.length - 1; i >= 0; i--) {
    //    menu.accordion("remove", i);
    //}
    //delCookie("loginUser");
    HideMainMask();
    window.top.loginOut();
}


//cookie操作
function setCookie(name, value, expiresDate) {
    if (!expiresDate) {
        expiresDate = new Date()
        expiresDate.setTime(expiresDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    }
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + expiresDate.toGMTString();
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function clearDataGrid(tableID) {
    $("#" + tableID).datagrid("loadData", { total: 0, rows: [] });
}

//删除cookies 设置过期
function delCookies(name)
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 

function setSession(Patient_Id)
{
    //localStorage.setItem("Patient_Id", Patient_Id);
    $.session.set('Patient_Id', Patient_Id);
}

function getSession(Patient_Id) {
    //var patient_Id = localStorage.getItem(Patient_Id);
    //if (patient_Id) {
    //    return patient_Id;
    //}
    var patient_Id = $.session.get(Patient_Id);
    if (patient_Id) {
        return patient_Id;
    }
}

function removeSession(Patient_Id)
{
    $.session.remove(Patient_Id);
}

function setCookiePatient_Id(Patient_Id) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 2 * 60 * 60 * 1000);
    setCookie("Patient_Id", Patient_Id, expires);
}

function getCookiePatient_Id(Patient_Id) {
    var patient_Id = getCookie(Patient_Id);
    if (patient_Id) {
        return patient_Id;
    } 
}

var CommonData = {
    SpecialChar: [{ text: "℃", value: "℃" },
  { text: "+", value: "+" },
  { text: "mmol/L", value: "mmol/L" },
  { text: "mmHg", value: "mmHg" },
  { text: "mm", value: "mm" },
  { text: "cm", value: "cm" },
  { text: "mg", value: "mg" },
  { text: "g", value: "g" },
  { text: "ml", value: "ml" },
  { text: "α", value: "α" },
  { text: "ml/h", value: "ml/h" },
  { text: "‰", value: "‰" },
  { text: "ug/(kg.min)", value: "ug/(kg.min)" },
  { text: "Ⅰ", value: "Ⅰ" },
  { text: "Ⅱ", value: "Ⅱ" },
  { text: "Ⅲ", value: "Ⅲ" },
  { text: "CO₂", value: "CO₂" },
  { text: "H₂O", value: "H₂O" },
  { text: "O₂", value: "O₂" },
  { text: "10^9", value: "10^9" },
  { text: "10^12", value: "10^12" }, ],

}

function ShowMainMask() {
    if (window.top.ShowMask) {
        window.top.ShowMask();
    }
}

function HideMainMask() {
    if (window.top.HideMask) {
        window.top.HideMask();
    }
}

$.ajaxSetup({
    isSetLogin: true,
    beforeSend: function (request) {

        ShowMainMask();
        jQuery.support.cors = true;
        if (this.isSetLogin) {
            var user = getLoginUser(false);
            if (user) {
                request.setRequestHeader("LoginUser", user.DBUser);
                request.setRequestHeader("UserName", encodeURI(user.UserName));
                request.setRequestHeader("WardName", encodeURI(user.DeptName));
                request.setRequestHeader("WardCode", user.DeptCode);
            }
            else {

                //   userLoginOut();
                $.messager.alert("提示", "用户没有登陆！", null, function () {
                    $(window.top.document).find("#btnShowLogin").click();
                    $(window.top.document).find("[name='MainFrame']").attr("src", "");
                });
                // $.messager.alert("提示", "用户没有登陆！");
                request.abort();
            }
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        //  $.messager.alert("出错！", "XMLHttpRequest:" + errorThrown);
        $.messager.alert("出错！", "系统错误，请联系管理员！");
    },
    complete: function () {
        HideMainMask();
    }
});

function filterPatient(q, row) {
    var opts = $(this).combobox("options");

    return row[opts.textField].indexOf(q) > -1;
}
//datagrid合并相同单元格
function MergeCells(tableID, fldList) {
    var Arr = fldList.split(",");
    var dg = $('#' + tableID);
    var fldName;
    var RowCount = dg.datagrid("getRows").length;
    var span;
    var PerValue = "";
    var CurValue = "";
    var length = Arr.length - 1;
    for (i = length; i >= 0; i--) {
        fldName = Arr[i];
        PerValue = "";
        span = 1;
        for (row = 0; row <= RowCount; row++) {
            if (row == RowCount) {
                CurValue = "";
            }
            else {
                CurValue = dg.datagrid("getRows")[row][fldName];
            }
            if (PerValue == CurValue) {
                span += 1;
            }
            else {
                var index = row - span;
                dg.datagrid('mergeCells', {
                    index: index,
                    field: fldName,
                    rowspan: span,
                    colspan: null
                });
                span = 1;
                PerValue = CurValue;
            }
        }
    }
}
function ObjDeepCopy(obj) {
    if (typeof obj != 'object') {
        return obj;
    }
    var newobj = {};
    for (var attr in obj) {
        newobj[attr] = ObjDeepCopy(obj[attr]);
    }
    return newobj;
}
//省份信息
var ProvinceInfo = [{
    //省份ID
    ProvinceID: 1,
    //省份名称
    ProvinceName: "北京"
},
{
    //省份ID
    ProvinceID: 2,
    //省份名称
    ProvinceName: "上海"
}]

//城市信息
var CityInfo = [{
    //所属省份
    ProvinceID: 1,
    //城市ID
    CityID: 1,
    //城市名称
    CityName: "东城区"
},
{
    //所属省份
    ProvinceID: 1,
    //城市ID
    CityID: 1,
    //城市名称
    CityName: "东城区"
}]
 //假设这是从后台获取到的json数据
    function parseDatagrid(dataJsonObj){
        //要显示的字段
        var fileds = "Id,Subjectname";
        //获取已转为符合treegrid的json的对象
        var nodes = ConvertToTreeGridJson(dataJsonObj, "Id", "Parentid", fileds);
        //json即为treegrid需要的json格式数据
        var json = JSON.stringify(nodes);

     return nodes;

    }
           /*将一般的JSON格式转为EasyUI TreeGrid树控件的JSON格式
        * @param rows:json数据对象
        * @param idFieldName:表id的字段名
        * @param pidFieldName:表父级id的字段名
        * @param fileds:要显示的字段,多个字段用逗号分隔
        */
        function ConvertToTreeGridJson(rows, idFieldName, pidFieldName, fileds) {
            function exists(rows, Parentid) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i][idFieldName] == Parentid)
                        return true;
                }
                return false;
            }
            var nodes = [];
            // get the top level nodes
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (!exists(rows, row[pidFieldName])) {
                    var data = {
                        id: row[idFieldName]
                    }
                    var arrFiled = fileds.split(",");
                    for (var j = 0; j < arrFiled.length; j++)
                    {
                        if (arrFiled[j] != idFieldName){
                                if(arrFiled[j]=="Subjectname"||arrFiled[j]=="Examination_item"){data["text"]=row[arrFiled[j]]}else
                            {data[arrFiled[j]] = row[arrFiled[j]];}
                        }
                    }
                    nodes.push(data);
                }
            }

            var toDo = [];
            for (var i = 0; i < nodes.length; i++) {
                toDo.push(nodes[i]);
            }
            while (toDo.length) {
                var node = toDo.shift(); // the parent node
                // get the children nodes
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row[pidFieldName] == node.id) {
                        var child = {
                            id: row[idFieldName]
                        };
                        var arrFiled = fileds.split(",");
                        for (var j = 0; j < arrFiled.length; j++) {
                            if (arrFiled[j] != idFieldName) {
                                if(arrFiled[j]=="Subjectname"){child["text"]=row[arrFiled[j]]}else
                                {child[arrFiled[j]] = row[arrFiled[j]];}
                            }
                        }
                        if (node.children) {
                            node.children.push(child);
                        } else {
                            node.children = [child];
                        }
                        toDo.push(child);
                    }
                }
            }
            return nodes;
        };

//解析页面传参
function getRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
////去除右键
//document.oncontextmenu = function (e) {
//    return false;
//}
//函数：获取浏览器尺寸
function findDimensions()
{
    var winWidth = 0;
    var winHeight = 0;
    //获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    //获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    return winWidth + ";" + winHeight;
}
//按字节截取字符串长度
function reBytesStr(str, len) {
    if((!str && typeof(str) != 'undefined')) {
        return '';
    }
    var num = 0;
    var str1 = str;
    var str = '';
    for(var i = 0, lens = str1.length; i < lens; i++) {
        num += ((str1.charCodeAt(i) > 255) ? 2 : 1);
        if(num > len) {
            break;
        } else {
            str = str1.substring(0, i + 1);
        }
    }
    return str;
}
//按字节截取字符串长度,生成数组
function reBytesStr(str, len) {
    if ((!str && typeof (str) != 'undefined')) {
        return '';
    }
    var strArray = [];
    var strA;
    var num = 0;
    var subnum = 0;
    for (var i = 0; i < str.length; i++) {
        num += ((str.charCodeAt(i) > 255) ? 2 : 1);
        if (num > len) {
            strArray.push(strA);
            num = 0;
            subnum = i;
            strA = "";
        } else {
            strA = str.substring(subnum, i + 1);
        }
    }
    if (strA != "")
        strArray.push(strA);
    return strArray;
}
String.prototype.myReplace = function (f, e) {//吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
    return this.replace(reg, e);
}
