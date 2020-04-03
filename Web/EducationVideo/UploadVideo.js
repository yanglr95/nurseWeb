var xhr;//异步请求对象
var ot; //时间
var oloaded;//大小
var ID = "0";
var FilePath, FileNewName,imgFilePath,imgFileName;
$(function () {
    loadusername();
    initdata();
})

//加载护士签名
function loadusername() {
    var username;
    var jsonUser = getLoginUser();
    if (jsonUser) {
        username = jsonUser.UserName;
    }
    $("#txtSignatory").textbox("setValue", username);
}
/*点击提交*/
function sub() {
    var title = $.trim($("#title").val());
    if (title == '') {
        $.messager.alert("提示", "请填写视频标题");
        return false;
    }

    if (ID == "0") {
        var fileObj = document.getElementById("Files").files[0]; // js 获取文件对象
        if (fileObj == undefined || fileObj == "") {
            $.messager.alert("提示", "请选择视频文件");
            return false;
        };
        var index = fileObj.name.indexOf(".");
        var filehz = fileObj.name.substring(index).toLowerCase();
        if (filehz != ".rb" && filehz != ".rmvb" && filehz != ".mp4" && filehz != ".flv") {
            $.messager.alert("提示", "上传视频格式错误,请重新选择");
            return false;
        }

        var imgfileObj = document.getElementById("imgFiles").files[0]; // js 获取文件对象
        if (imgfileObj == undefined || imgfileObj == "") {
            $.messager.alert("提示", "请选择视频封面图片");
            return false;
        };
        var imgindex = imgfileObj.name.indexOf(".");
        var imgfilehz = imgfileObj.name.substring(imgindex).toLowerCase();
        if (imgfilehz != ".png" && imgfilehz != ".jpg" && imgfilehz != ".gif" && imgfilehz != ".jpeg" && imgfilehz != ".bmp") {
            $.messager.alert("提示", "上传图片格式错误,请重新选择");
            return false;
        }
    } 

    $("#form1").ajaxSubmit(function (data) {
        if (data!="") {
            var jsondata = $.parseJSON(data);
            if (jsondata) {
                if (jsondata[0].FilePath !="") {
                    FilePath = jsondata[0].FilePath;
                }
                if (jsondata[0].FileNewName != "") {
                    FileNewName = jsondata[0].FileNewName;
                }
                if (jsondata[0].FileImgPath != "") {
                    imgFilePath = jsondata[0].FileImgPath;
                }
                if (jsondata[0].FileImgName!="") {
                    imgFileName = jsondata[0].FileImgName;
                }
            }
        }
        var dataInfo =
                 {
                     VId:ID,
                     Videoname: title,
                     Videopath: FilePath,
                     Videofile: FileNewName,
                     Imgname: imgFileName,
                     Imgpath: imgFilePath,
                     Adduser: $("#txtSignatory").textbox("getValue")
                 };

        $.ajax({
            url: BaseData.WebApiUrl + "Video/saveVideorecord",
            data: { data: JSON.stringify(dataInfo) },
            success: (function (data) {
                $.messager.alert("提示","上传成功");
                clearEditInfo();
                initdata();
                $("#imgul").css("display", "none");
                $(".el-upload-list").css("display", "none");
            })
        });
    })
}

function initdata()
{
    $.ajax({
        url: BaseData.WebApiUrl + "Video/getVideoList",
        type: "get",
        success: function (data) {
            if (data != "null") {
                jsonData = $.parseJSON(data);
                $("#tbVideoList").datagrid("loadData", jsonData);
            } else {
                $("#tbVideoList").datagrid("loadData", { total: 0, rows: [] });
            }
        }
    })
}

function InputListOperateField(value, rowData, rowIndex) {
    var id = rowData.VId;

    var str = "<a href='#' name='btnEdit' onclick='editInputList(\"" + id + "\",this)' >编辑</a>";
    str += "&nbsp;&nbsp;"
    str += "<a href='#' onclick='delData(\"" + id + "\",this)' >删除</a>";
    return str;
}

function editInputList(id, obj) {
    var state = $(obj).html();
    ID = id;
    $("a[name='btnEdit']").html("编辑");
    if (state == "编辑") {
        $.ajax({
            url: BaseData.WebApiUrl + "Video/getVideoListById",
            data: "id=" + id + "",
            type: "get",
            success: (function (data) {
                if (data != "null") {
                    var jsonData = $.parseJSON(data);
                    $("#title").textbox("setValue", jsonData[0].Videoname);
                    $("#videoNames").text(jsonData[0].Videofile);
                    $("#imgNames").text(jsonData[0].Imgname);

                    FilePath = jsonData[0].Videopath;
                    FileNewName = jsonData[0].Videofile;

                    imgFilePath = jsonData[0].Imgpath;
                    imgFileName = jsonData[0].Imgname;

                    $(".el-upload-list").css("display", "block");
                    $("#imgul").css("display", "block");
                }
                $(obj).html("取消");
            })
        });
    }
    else {
        $(obj).html("编辑");
        $(".el-upload-list").css("display", "none");
        $("#imgul").css("display", "none");
        clearEditInfo();
    }
}

//删除数据
function delData(id, obj) {
    $.messager.confirm("删除记录", "确定删除记录？", function (r) {
        if (r) {
            $.ajax({
                url: BaseData.WebApiUrl + "Video/delVideoFile",
                data: "id=" + id + "",
                type: "get",
                success: (function (data) {
                   
                    $.ajax({
                        url: BaseData.WebApiUrl + "Video/delVideo",
                        data: "id=" + id + "",
                        type: "get",
                        success: (function (data) {
                            $.messager.alert("提示", "删除成功");
                            clearEditInfo();
                            initdata();
                        })
                    });
                })
            })
        }
    })
}

//清空
function clearEditInfo()
{
    $("#title").textbox("setValue", "");
    $("#videoNames").text("");
    $("#imgNames").text("");
}

//上传视频文件方法
function UpladFile() {
    var fileObj = document.getElementById("Files").files[0]; // js 获取文件对象
    if (fileObj == undefined || fileObj == "") {
        $.messager.alert("提示", "请选择视频文件");
        return false;
    };
    if (fileObj.name) {
        $(".el-upload-list").css("display", "block");
        $("#videoNames").text(fileObj.name);
    }
}

//上传图片文件方法
function ImgUpladFile() {
    var fileObj = document.getElementById("imgFiles").files[0]; // js 获取文件对象
    if (fileObj == undefined || fileObj == "") {
        $.messager.alert("提示", "请选择视频封面图片");
        return false;
    };
    if (fileObj.name) {
        $("#imgul").css("display", "block");
        $("#imgNames").text(fileObj.name);
    } 
}
