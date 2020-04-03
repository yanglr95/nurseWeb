var TableColumn = [[
              { field: 'Order_Text', width: '25%', title: '药品名称' },
               { field: 'Repeat_Indicator', width: '8%', title: '医嘱类型' },
               { field: 'Dose', width: '15%', title: '剂量' },
               { field: 'Order_Class', width: '8%', title: '医嘱类别',formatter:InputFormatter},
               { field: 'Administration', width: '8%', title: '给药途径' },
               { field: 'Start_Date_Time', width: '8%', title: '开始时间' },
               { field: 'Frequency', width: '8%', title: '频次' },
               { field: 'Doctor_Advice', width:  '20%', title: '嘱托' },

]];
function InputFormatter(value, rowData, rowIndex) {
    var br = 0;
    for (var i = 0; i < OrderClass.length; i++) {
        if (OrderClass[i].ORDER_CLASS_CODE == value) {
            br = 1;
            return OrderClass[i].ORDER_CLASS_NAME;
        }
    }
    if (br == 0) {
        return "";
    }
}