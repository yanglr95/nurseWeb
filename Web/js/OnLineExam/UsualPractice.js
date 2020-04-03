var NUM=0;
    //输入答案
var Correctanswers=new Array();
//正确答案
var arrList = new Array();
//对错问题
var str="";
var score=0;
//总分
var totalscore=0;
$(function () {
         getSubjectData();
            splicingField();
    });
function assignment(o){
    if(o.value==1)
                        {value="A"}else if(o.value==2)
                        {value="B"}else if(o.value==3)
                        {value="C"}else
                        {value="D"}
   $("#"+o.name).html(value);
}
//设定时间
var interval;
  function two_char(n) {            return n >= 10 ? n : "0" + n;        }
        function time_fun() {            var sec=0;
        interval=setInterval(function () {
        sec++;
        var date = new Date(0, 0)
        date.setSeconds(sec);
        var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
        document.getElementById("mytime").innerText = two_char(h) + ":" + two_char(m) + ":" + two_char(s);
        }, 1000);        }  
function clear(){
$("#xuanze").remove();
    arrList.splice(0,arrList.length);
    Correctanswers.splice(0,Correctanswers.length);
    str="";
    score=0;
totalscore=0;
}
function getSubjectData(){
    clear();
    $.ajax({
            url: BaseData.WebApiUrl + "OnlineExam/getSubjectList/",
            type: "get",
            success: (function (data) {
                $('#dd').tree("loadData", parseDatagrid($.parseJSON(data)));
                
        $("#dd").tree({   
                onSelect:function(node){
               clear();
                   var n = $("#dd").tree("getSelected");   
                   if(n!=null){   
                        $.ajax({
                            url: BaseData.WebApiUrl + "OnlineExam/getSubjectById/",
                            type: "get",
                            data: "id="+n.id,
                            success: (function (data) {
                                 clearInterval(interval) ; 
                               $("#patient").html("");NUM=0;
                                var jsonData=$.parseJSON(data);
                                if(jsonData!=null&&jsonData.length > 0)
                                { $("#mytime").html("00:00:00");
                               bindingData(jsonData);
                               window.time_fun();
                                }
                            })
                        });
                   }   
                },   
               
            });   
            })
        }); 
}

function bindingData(jsonData){
         var days;
        var option="";
                for (var i = 1; i <=jsonData.length; i++) {
                    if(jsonData[i-1].Type==1){
                    if (i==1)
                   $("#patient").before("<span id='xuanze' style='width:30px;'>第一题 ：选择题 </span>");
                    option="<input type='radio' name='"+jsonData[i-1].Titleid+"' value='"+jsonData[i-1].Id+"' onclick=assignment(this) />"
                    }else if(jsonData[i-1].Type==2){
                    option="<input type='checkbox' name='"+jsonData[i-1].Titleid+"' value='"+jsonData[i-1].Id+"' onclick=assignment(this) />"
                    }else if(jsonData[i-1].Type==3){
                        option="<input type='radio' name='panduan' value='√' onclick=assignment(this) />正确<input type='radio' name='panduan' value='×' onclick=assignment(this) />错误"
                    }
                    if(i==jsonData.length){
                         $("#patient").append($("<li>&nbsp;&nbsp;"+option+jsonData [i-1].Topiccontent+"</li>"));
                            break;
                    }
                     if(jsonData[i].Titleid != jsonData[i-1].Titleid&&i!=1)
                        {
                            var patient = $("<li>&nbsp;&nbsp;"+option+jsonData[i-1].Topiccontent+ "</br>" 
                                            + "</li>");
                            $("#patient").append(patient);
                        }    
                    if (jsonData[i].Titleid != jsonData[i-1].Titleid||i==1) {   
                            NUM++; 
                        if(i!=1){
                                days="第" + NUM+ "题&nbsp;"+jsonData[i].Title+"(";
                            }else{
                                days="第" + NUM+ "题&nbsp;"+jsonData[i-1].Title+"(";
                               
                            }
                         arrList[NUM-1]=jsonData[i].Correctanswer;
                        totalscore=totalscore+jsonData[i].Score;
                        $("#patient").append( $("<li style=' font-size: 14px;font-weight:bold' name='"+jsonData[i].Score+"' id='第"+NUM+"题'>"+days+"<span style='width:30px;' id='"+jsonData[i].Titleid+"'>&nbsp;</span>) </li>"));
                        }
                      
                 if(jsonData[i].Titleid == jsonData[i-1].Titleid){
                        var patient = $("<li>&nbsp;&nbsp;"+option+jsonData[i-1].Topiccontent+ "</br>" 
                            + "</li>");
                        $("#patient").append(patient);
                    }
               
                }
}
function splicingField() {
    $("#patient").find("span").each(function(inputIndex) {
       Correctanswers[inputIndex]=$(this).html();
    });
    var sign="";
        for(var i=0;i<arrList.length;i++){
            sign="";
            if(arrList[i]==Correctanswers[i]){
                sign="√";
                $("#第"+(i+1)+"题").append("<span style='color:red;'>√</span>");
                score=score+ Number($("#第"+(i+1)+"题").attr("name"));
            }else{
               sign="×";
                $("#第"+(i+1)+"题").append("<span style='color:red;'>×  正确答案："+arrList[i]+"</span>");
                
             }
            if(i+1<=arrList.length){   
                str=str+(i+1)+":"+sign+";"
            }
        }
}
var flog=1;
function saveData(){
    if(flog>1){
    $.messager.alert("提示","已提交！");
    return;
        }
    splicingField();
    //var demo=document.getElementById('Patient').contentWindow;
    var examTime=new Date();
    var postData = "";
    postData += '[{';
    postData += '"Id":1,';
    postData += '"Username":"aa",';
    postData += '"Submitanswer":"' + str  + '",';
    postData += '"Examtime":"' + dateTimeFormatter(examTime,"yyyy-mm-dd hh:mi:ss") + '",';
    postData += '"Score":' + score + ',';
    postData += '"Totalscore":' + totalscore + ',';
    postData += '"Examtype":"平时练习",';
    postData += '"Exampaperid":' +$('#dd').tree("getSelected").id + ',';
    postData += '"Usedtime":"' +$("#mytime").html() + '"';
    postData += "}]";
    $.ajax({
        url: BaseData.WebApiUrl + "OnlineExam/saveAnswerCard",
        type: "POST",
        data: { '': postData },
        success: (function (data) {
            if (data) {
                flog++;
               // $.messager.alert("提示", data);
               clearInterval(interval) ; 
            }
        })
    });
}
