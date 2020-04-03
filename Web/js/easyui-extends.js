$.extend($.messager.defaults, { ok: "是", cancel: "否" });
//$.extend($.fn.panel.defaults, { fit: true });
$.extend($.fn.datebox.defaults, { editable: false });
$.extend($.fn.datagrid.defaults, { striped: true });
$.extend($.fn.numberbox.defaults, {
    max: 65535,
    min: -65535,
    precision: 2
})
$.extend($.fn.combobox.defaults, {
    numbercombo: false,

    maxValue: 65535,
    minValue: -65535,
    onChange: function (newValue, oldValue) {
        var opt = $(this).combobox("options");
        if (opt.numbercombo) {
            var canInput = true;
            if (isNaN(newValue) && newValue != '') {
                canInput = false;

            }
            else if (newValue > opt.maxValue) {
                $.messager.alert("提示", "输入值不能大于" + opt.maxValue)
                canInput = false;
            }
            else if (newValue < opt.minValue) {
                $.messager.alert("提示", "输入值不能小于" + opt.minValue)
                canInput = false;
            }
            if (!canInput) {
                $(this).combobox("setValue", '');
            }
        }
    }
    //    alert(newValue + oldValue);

})
