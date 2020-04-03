var fid = null;
var template = null;
$(function () {
    var para = document.location.search.split('?')
    for (var i in para) {
        if (para[i].indexOf('fid=') > -1) {
            fid = para[i].substr(4);
        }
    }

    if (fid) {
        $.ajax({
            url: BaseData.WebApiUrl + "CustomForm/getFormTemplateContent",
            data: { fid: fid },
            type: "get",
            success: (function (data) {
                if (data) {
                    template = $.parseJSON(data);
                    var dom = $(template.Content);
                    $("#divContent").append(template.Content);
                    $('[custom_field]').remove();
                    $.ajax({
                        url: BaseData.WebApiUrl + "CustomForm/getFieldValues",
                        data: { form_id: fid },
                        type: "get",
                        success: (function (values) {
                            var jsonValues = $.parseJSON(values)
                            if (jsonValues) {
                                for (var i in jsonValues) {
                                    $('[name=data_' + jsonValues[i].Field_Id + ']').each(function () {
                                        if (this.tagName == "TEXTAREA" || (this.tagName == 'INPUT' && this.type == 'text')) {
                                            this.value = jsonValues[i].Value;
                                        }
                                        else {
                                            if (this.value == jsonValues[i].Value) {
                                                $(this).attr("checked", true);
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            })
        })
    }
})


function saveFormData() {
    if (fid) {
        var postdata = new Array();
        $("[name]").each(function () {
            if (this.tagName == "INPUT") {
                if (this.type == 'text' || ((this.type == 'radio' || this.type == 'checkbox') && this.checked)) {
                    if ($(this).attr('name') != "leipiNewField") {
                        postdata.push({ Form_Id: fid, Field_Id: $(this).attr('name').replace("data_", ""), Value: this.value })
                    }
                }
            }
            else {
                if ($(this).attr('name') != "leipiNewField") {
                    postdata.push({ Form_Id: fid, Field_Id: $(this).attr('name').replace("data_", ""), Value: this.value })
                }
            }
        });

        $.ajax({
            url: BaseData.WebApiUrl + "CustomForm/saveFieldValues",
            data: { '': JSON.stringify(postdata) },
            type: "post",
            success: (function (data) {
                alert("保存成功");
            })
        })
    }
}
