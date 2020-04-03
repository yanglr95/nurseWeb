var NUM=0;
    //输入答案
var Correctanswers=new Array();
//正确答案
var arrList = new Array();
//对错问题
var str="";
var score=0;
$(function () {
         getSubjectData();
        splicingField();
 $("#tbConfig").datagrid({
        width: '98%',
        style: { 'text-align': 'center' },
        singleSelect: true,
        nowrap: false,
        columns: [[
            {
                field: 'id', title: '试卷编号', width: 200, formatter: function (value, row, rowIndex) {
                    return rowIndex + 1;
                }

            },
             {
                 field: 'Papername', title: '试卷名称', width:500,
                 editor: { type: 'textbox' }
             }
,
             {
                 field: 'Totalscore', title: '总分', width: 60,
                 editor: { type: 'textbox' }
             }
,
             {
                 field: 'Questionsnumber', title: '题数', width: 60,
                 editor: { type: 'textbox' }
             }
,
             {
                 field: 'Timelimit', title: '时限', width: 60,
                 editor: { type: 'textbox' }
             }
,
              {
                  field: 'aa', title: '操作', width: 60, formatter: function (value, row, rowIndex) {
                      var str = "<a href='SimulationSubpage.html?id="+row.Id+"&questions="+row.Questions + "' >开始</a>";
                      str += "&nbsp;&nbsp;";
                      str += "<a href='#' onclick='delCrl(" + rowIndex + ")' >删除</a>";
                      return str;
                  }
              }
        ]],
      
        onAfterEdit: function (index, row) {
            //for (var i in NursingTechniques) {
               //if (NursingTechniques[i].TechID == row.TechID) {
                   //row.TechName = NursingTechniques[i].TechName;
                   // break;
                //}
           // }
            row.editing = false;
            updateActions(index);
        },
    });
  $('[editwindow]').window({
            modal: true,
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closed: true
        });
    });
function assignment(o){
    if(o.value==1)
                        {value="A"}else if(o.value==2)
                        {value="B"}else if(o.value==3)
                        {value="C"}else
                        {value="D"}
   $("#"+o.name).html(value);
}
function clear(){
    arrList.splice(0,arrList.length);
    Correctanswers.splice(0,Correctanswers.length);
    str="";
    score=0;
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
                   var n = $("#dd").tree("getSelected");   
                   if(n!=null){   
                        $.ajax({
                            url: BaseData.WebApiUrl + "OnlineExam/getExamManagement/",
                            type: "get",
                            data: "subjectid="+n.id+"&paperType=模拟考试",
                            success: (function (data) {
                                var jsonData=$.parseJSON(data);
                                if (jsonData.length > 0) {
                                    for (var i = 0; i < jsonData.length; i++) {
                                     $("#tbConfig").datagrid('loadData', jsonData);
                                    }  
                                }
                            })
                        });
                   }   
                },   
               
            });   
            })
        }); 
}

function splicingField() {
    $("#patient").find("span").each(function(inputIndex) {
       Correctanswers[inputIndex]=$(this).html();
    });
        for(var i=0;i<arrList.length;i++){
            if(arrList[i]==Correctanswers[i]){
                //str=str+"√";
                $("#第"+(i+1)+"题").append("<span style='color:red;'>√</span>");
                score=score+ Number($("#第"+(i+1)+"题").attr("name"));
            }else{
               // str=str+"×";
                $("#第"+(i+1)+"题").append("<span style='color:red;'>×  正确答案："+arrList[i]+"</span>");
                
             }
            if(i+1<=arrList.length){   
                str=str+(i+1)+":"+Correctanswers[i]+";"
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
  function addModel() {
        
            $('#information').window('open');
        }

 $('#information').window({
            modal: true,
            collapsible: false,
            minimizable: false, 
            maximizable: false,
            closed: true
});
var qid;var totalscore; 
function getQid(){
     $.ajax({
        url: BaseData.WebApiUrl + "OnlineExam/getQid",
        type: "get",
        data: "problem1="+$('#problem1').numberbox('getValue')+"&problem2="+$('#problem2').numberbox('getValue')+"&problem3="+$('#problem3').numberbox('getValue')+"&problem4="+$('#problem4').numberbox('getValue'),
        success: (function (data) {
            if (data) {
              qid=data["qid"];
            totalscore=Number(data["totalscore"]);
            }
        })
});
}
function saveContentData() {
   getQid();
var ProblemsNum=Number($('#problem1').numberbox('getValue'))+Number($('#problem2').numberbox('getValue'))+Number($('#problem3').numberbox('getValue'))+Number($('#problem4').numberbox('getValue'));
    var postData = "";
    postData += '[{';
    postData += '"Id":1,';
    postData += '"Papernumber":"' +  $("#Papernumber").textbox("getValue")  + '",';
    postData += '"Papername":"' +  $("#Papername").textbox("getValue")  + '",';
    postData += '"Papertype":"模拟考试",';//$("#dd").tree("getSelect");
//
    postData += '"Totalscore":' + totalscore  + ',';
    postData += '"Timelimit":' + $("#Timelimit").textbox("getValue")   + ',';
    postData += '"Uploadtime":"' + dateFormatter(new Date())  + '",';
    postData += '"Questions":"' + qid  + '",';
    postData += '"Questionsnumber":' + ProblemsNum ;
    postData += "}]";
    $.ajax({
        url: BaseData.WebApiUrl + "OnlineExam/saveExamManagement",
        type: "POST",
        data: { '': postData },
        success: (function (data) {
            if (data) {
                $.messager.alert("提示", data);
                
               $('#information').window('close');
            }
        })
    });
}
