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


                    $("#divContent").append(template.Content);
                    //   $('[custom_field]').remove()
                    $.ajax({
                        url: BaseData.WebApiUrl + "CustomForm/getFieldValues",
                        data: { form_id: fid },
                        type: "get",
                        success: (function (values) {
                            var jsonValues = $.parseJSON(values)
                            if (jsonValues) {
                                for (var i in jsonValues) {
                                    $('[fields=' + jsonValues[i].Field_Id + ']').each(function () {
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
                            $('[fields]').each(function () {
                                if (this.tagName == "TEXTAREA") {
                                    var p = $(this).parent();
                                    var str = this.value;
                                    p.css("width", $(this).css('width'));
                                    p.css("height", $(this).css('height'));
                                    p.css("border", '1px solid black');
                                    //          div.innerHTML = this.value;
                                    //  var p =
                                    p.empty()
                                    p.html(str);
                                }
                                else if (this.tagName = "INPUT") {
                                    if (this.type == "text") {
                                        var p = $(this).parent();
                                        var str = this.value;
                                        p.empty()
                                        p.html(str);
                                    }
                                    else {
                                        var field_id = $(this).attr("fields");
                                        var values = this.value;
                                        var str = ""
                                        for (var i in jsonValues) {
                                            if (jsonValues[i].Field_Id == field_id && jsonValues[i].Value == values) {
                                                str = "√"
                                                break;
                                            }
                                            else {
                                                str = "□";
                                            }
                                        }
                                        $(this).before(str);
                                        $(this).remove();
                                    }
                                }
                            })
                        })
                    })
                }
            })
        })
    }
})