<%@ WebHandler Language="C#" Class="UploadFile" %>

using System;
using System.Web;

public class UploadFile : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/html";
        if (context.Request.Files.Count > 0)
        {
            var fileCount = context.Request.Files.Count;
            HttpPostedFile file = null;
            HttpPostedFile imgfile = null;
            FileModel model = new FileModel();
            string saveName = string.Empty;
            string serverFilePath = string.Empty;
            string saveImgName = string.Empty;
            string serverImgFilePath = string.Empty;
            System.Collections.Generic.List<FileModel> fileList = new System.Collections.Generic.List<FileModel>();
            string folder = DateTime.Now.ToString("yyyyMMddhhmmss");
            for (int i = 0; i < fileCount; i++)
            {
                if (context.Request.Files[i].ContentType.IndexOf("image") == 0)
                {
                    imgfile = context.Request.Files[i];
                }
                else
                {
                    file = context.Request.Files[i];
                }

                try
                {
                    if (file != null)
                    {
                        /////////////////////////////////////视频文件保存///////////////////////////////////////////////////
                        //视频文件保存的文件夹路径
                        string path = context.Server.MapPath("/Web/EducationVideo/video/");

                        //如果文件夹不存在，则创建
                        if (!System.IO.Directory.Exists(path + folder))
                        {
                            System.IO.Directory.CreateDirectory(path + folder);
                        }
                        //上传视频文件的扩展名
                        //string type = file.FileName.Substring(file.FileName.LastIndexOf('.'));
                        //保存视频文件的文件名
                        //string saveName = Guid.NewGuid().ToString() + type;
                        saveName = file.FileName;
                        //保存视频文件
                        serverFilePath = path + folder + "/" + saveName;
                        file.SaveAs(serverFilePath);
                    }

                    if (imgfile != null)
                    {
                        /////////////////////////////////////视频图片文件保存///////////////////////////////////////////////////
                        //图片保存的文件夹路径
                        string imgpath = context.Server.MapPath("/Web/EducationVideo/imge/");
                        //如果文件夹不存在，则创建
                        if (!System.IO.Directory.Exists(imgpath + folder))
                        {
                            System.IO.Directory.CreateDirectory(imgpath + folder);
                        }
                        saveImgName = imgfile.FileName;
                        //保存图片
                        serverImgFilePath = imgpath + folder + "/" + saveImgName;
                        imgfile.SaveAs(serverImgFilePath);
                    }
                }
                catch
                {
                    context.Response.Write("上传失败");
                }
            }

            model.FileNewName = saveName;
            //获取的路径
            model.FilePath = serverFilePath;

            model.FileImgName = saveImgName;

            model.FileImgPath = serverImgFilePath;

            fileList.Add(model);

            System.Type types = fileList.GetType();
            //序列化
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(types);

            serializer.WriteObject(context.Response.OutputStream, fileList);
        }
    }

    public class FileModel
    {
        public string FileOldName { get; set; }

        public string FileNewName { get; set; }

        public string FileImgName { get; set; }

        public string FilePath { get; set; }
        
        public string FileImgPath { get; set; }

        public string Mess { get; set; }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
}

