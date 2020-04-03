
var thePlugins = "custom_field";
var f
var oNode = null;
$(function () {
    if (UE.plugins[thePlugins].editdom) {
        oNode = UE.plugins[thePlugins].editdom;
    }
    f = dialog.field;
    $("input[name='fieldType'][value=" + f.FieldType + "]").attr("checked", true)
    $("#txtFieldName").textbox("setValue", f.Name);
    $("#cfSize").numberbox("setValue", f.FontSize);

    selectFieldType();
    if ((f.FieldType == 0 || f.FieldType == 1) && f.Options.length > 0) {
        for (var i in f.Options) {
            var name = "custom_" + f.FieldType
            fnRadioAddComboTr(name, {
                "checked": false,
                "name": name,
                "value": f.Options[i].Value
            });
        }
    }
    $("input[name='fieldType']").click(selectFieldType);
})
function selectFieldType() {
    if ($(".fieldTableShow").find(".ArrangementTable").length != 0) {
        var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];
        for (var i = oTable.rows.length - 1; i > 0; i--) {
            oTable.deleteRow(i)
        }
    }
    $(".fieldTable").removeClass("fieldTableShow");
    var val = $("input[name='fieldType']:checked").val();
    if (val == 1) {
        val = 0
    }
    $("#tbField_" + val).addClass("fieldTableShow");
}
dialog.onok = function () {
    var fieldName = $("#txtFieldName").textbox("getValue");
    if (!fieldName) {
        alert('字段名称不能为空');
        return false;
    }
    f.Name = fieldName;
    f.FontSize = $("#cfSize").numberbox("getValue");

    f.Options = new Array();

    var val = $("input[name='fieldType']:checked").val();
    var options = "";
    //var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];

    switch (val) {
        case '0':
            f.Arrangement = $("input[name='radioArrangement']:checked").val();

            $("[name='custom_0']").each(function (index) {
                var o = { Field_id: f.Id, Value: $(this).val(), OptionOrder: index };
                f.Options.push(o);
            });

            options = getRadioHTML();

            break;
        case '1':
            f.Arrangement = $("input[name='radioArrangement']:checked").val();
            $("[name='custom_1']").each(function (index) {
                var o = { Field_id: f.Id, Value: $(this).val(), OptionOrder: index };
                f.Options.push(o);
            });
            options = getCheckboxHTML();


            break;
        case '2':
            f.DefaultValue = $("#cfTextDefault").textbox("getValue");
            options = getTextHTML();

            break;
        case '3':
            f.DefaultValue = $("#cfTextAreaDefault").textbox("getValue");
            f.Width = $("#cfWidth").numberbox("getValue");
            f.Height = $("#cfHeight").numberbox("getValue");
            options = getTextAreaHTML();
            break;
    }
    var html = $('<div name="customField_' + f.Id + '" id="customField_' + f.Id + '"   style="position:relative"><div  custom_field="' + f.Name + '" style="position:absolute;top:0;left:0;z-index:1;width:100%;height:100%"></div></div>');
    html.prepend(options);
    this.field = f;
    parent.saveField(f);
    if (oNode) {
        oNode.innerHTML = html.html();
        delete UE.plugins[thePlugins].editdom;

    }
    else {
        editor.execCommand('insertHtml', html.prop("outerHTML"));
    }
    return true;


}

//生成radio控件
function getRadioHTML() {

    var html = '';
    var Size = f.FontSize;
    var Arrangement = f.Arrangement;
    for (var i in f.Options) {
        //  html += '<input  name="radio_' + f.Field_Num + '" type="radio" value="' + f.Options[i].Value + '"/><span style="font-size:' + Size + 'px"> ' + f.Options[i].Value + '&nbsp;</span>';
        html += '<input name="check_' + f.Id + '"  fields=' + f.Id + ' type="radio" value="' + f.Options[i].Value + '"/><span style="font-size:' + Size + 'px"> ' + f.Options[i].Value + '&nbsp;</span>';
        if (Arrangement == "1") {
            html += "</td></tr><tr><td  class='customTD'>"
        }
    }
    if (Arrangement == "1") {
        html = html.substr(0, html.length - 18)
    }
    html = "<table class='customTable'><tr><td class='customTD'>" + html + "</td></tr></table>"
    var table = $(html);
    if (Arrangement == "1") {
        table.find("tr:last").remove();
    }

    return table;
}
//生成checkbox控件
function getCheckboxHTML() {

    var html = '';
    var Size = f.FontSize;
    var Arrangement = f.Arrangement;
    for (var i in f.Options) {
        // html += '<input name="check_' + f.Field_Num + '" type="checkbox" value="' + f.Options[i].Value + '"/><span style="font-size:' + Size + 'px"> ' + f.Options[i].Value + '&nbsp;</span>';
        html += '<input name="check_' + f.Id + '" fields=' + f.Id + ' type="checkbox" value="' + f.Options[i].Value + '"/><span style="font-size:' + Size + 'px"> ' + f.Options[i].Value + '&nbsp;</span>';

        if (Arrangement == "1") {
            html += "</td></tr><tr><td  class='customTD'>"
        }
    }
    html = "<table class='customTable'><tr><td class='customTD'>" + html + "</td></tr></table>"
    var table = $(html);
    if (Arrangement == "1") {
        table.find("tr:last").remove();
    }

    return table;
}
//生成文本控件
function getTextHTML() {

    var defaultValue = f.DefaultValue;
    var Size = f.FontSize;
    //  var textbox = $(' <input type="text" name="text_' + f.Field_Num + '" />');
    var textbox = $(' <input type="text" fields=' + f.Id + ' />');
    if (defaultValue && defaultValue != '') {
        textbox.attr('value', defaultValue);
    }
    if (Size) {
        textbox.css("font-size", Size + "px");

    }

    return $("<div></div>").append(textbox);
}
//生成多行文本控件
function getTextAreaHTML() {

    //   var textArea = $("<textarea name='textarea_" + f.Field_Num + "'/>")
    var textArea = $('<textarea fields=' + f.Id + '/>')
    var defaultValue = f.DefaultValue;
    var Size = f.FontSize;
    var width = f.Width
    var height = f.Height
    if (defaultValue && defaultValue != '') {
        textArea.html(defaultValue);
    }
    if (Size) {
        textArea.css("font-size", Size + "px");
    }
    if (width) {
        textArea.css("width", width + "px");
    }
    if (height) {
        textArea.css("height", height + "px");
    }
    return $("<div></div>").append(textArea);
}
//moveRow在IE支持而在火狐里不支持！以下是扩展火狐下的moveRow
if (!window.attachEvent) {
    function getTRNode(nowTR, sibling) {
        while (nowTR = nowTR[sibling]) if (nowTR.tagName == 'TR') break;
        return nowTR;
    }
    if (typeof Element != 'undefined') {
        Element.prototype.moveRow = function (sourceRowIndex, targetRowIndex) //执行扩展操作
        {
            if (!/^(table|tbody|tfoot|thead)$/i.test(this.tagName) || sourceRowIndex === targetRowIndex) return false;
            var pNode = this;
            if (this.tagName == 'TABLE') pNode = this.getElementsByTagName('tbody')[0]; //firefox会自动加上tbody标签，所以需要取tbody，直接table.insertBefore会error
            var sourceRow = pNode.rows[sourceRowIndex],
            targetRow = pNode.rows[targetRowIndex];
            if (sourceRow == null || targetRow == null) return false;
            var targetRowNextRow = sourceRowIndex > targetRowIndex ? false : getTRNode(targetRow, 'nextSibling');
            if (targetRowNextRow === false) pNode.insertBefore(sourceRow, targetRow); //后面行移动到前面，直接insertBefore即可
            else { //移动到当前行的后面位置，则需要判断要移动到的行的后面是否还有行，有则insertBefore，否则appendChild
                if (targetRowNextRow == null) pNode.appendChild(sourceRow);
                else pNode.insertBefore(sourceRow, targetRowNextRow);
            }
        }
    }
}




/*生成tr*/
function fnRadioAddComboTr(gName, obj) {
    var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];
    var new_tr_node = oTable.insertRow(oTable.rows.length);
    // var new_td_node0 = new_tr_node.insertCell(0);
    var new_td_node1 = new_tr_node.insertCell(0);
    var new_td_node2 = new_tr_node.insertCell(1);

    var sChecked = '';
    if (obj.checked) sChecked = 'checked="checked"';
    if (!obj.name) obj.name = '';
    if (!obj.value) obj.value = '';
    //new_td_node0.innerHTML = '<td><input type="radio" ' + sChecked + ' name="' + gName + '"></td>';
    new_td_node1.innerHTML = '<td><input type="text" value="' + obj.value + '" name="' + gName + '" placeholder="选项值"></td>';
    new_td_node2.innerHTML = '<td><div ><a title="上移" href="javascript:void(0);" class="easyui-linkbutton" onclick="fnMoveUp(this)">上移</a><a title="下移" class="easyui-linkbutton" href="javascript:void(0);" onclick="fnMoveDown(this)">下移</a><a title="删除" href="javascript:void(0);" class="easyui-linkbutton" onclick="fnDeleteRow(this)">删除</a></div></td>';
    $.parser.parse(new_td_node2);
    return true;
}
function fnRadioAdd() {
    //var dName = $G('hidname').value;
    //if (!dName) dName = 'leipiNewField';
    var name = "custom_" + $("input[name='fieldType']:checked").val();
    fnRadioAddComboTr(name, {
        "checked": false,
        "name": name,
        "value": ''
    });
}

function fnDeleteRow(obj) {
    var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];
    while (obj.tagName != 'TR') {
        obj = obj.parentNode;
    }
    oTable.deleteRow(obj.rowIndex);
}
/*上移*/
function fnMoveUp(obj) {
    var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];
    while (obj.tagName != 'TR') {
        obj = obj.parentNode;
    }
    var minRowIndex = 1;
    var curRowIndex = obj.rowIndex;
    if (curRowIndex - 1 >= minRowIndex) {
        oTable.moveRow(curRowIndex, curRowIndex - 1);
    }

}
/*下移*/
function fnMoveDown(obj) {
    var oTable = $(".fieldTableShow").find(".ArrangementTable")[0];
    while (obj.tagName != 'TR') {
        obj = obj.parentNode;
    }
    var maxRowIndex = oTable.rows.length;
    var curRowIndex = obj.rowIndex;
    if (curRowIndex + 1 < maxRowIndex) {
        oTable.moveRow(curRowIndex, curRowIndex + 1);
    }
}

$G = function (id) {
    return document.getElementById(id)
};