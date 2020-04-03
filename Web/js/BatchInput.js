var AttrName = "batchinput";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "BodyChartDefaultValues";
var BodyChartDefaultValues = {
    defaultValue: [{ text: "", value: "" }],
    //基本录入选项
    twinput: [{ text: "拒测", value: "-1" },
        { text: "外出", value: "-2" },
        { text: "请假", value: "-3" }],
    //体重
    weight: [{ value: "-14", text: "卧床" },
        { text: "平车", value: "-20" },
        { text: "未测", value: "-10" },
        { text: "轮椅", value: "-30" }],
    //呼吸
    breath: [{ text: "呼吸机", value: "-300" }],
    //大便
    excrement:[{ text: "*", value: "998" },
    { text: "☆", value: "999" }]
}
var BatchInputList = {
    TimeList: [
    { text: "00", value: "00:00" },
    { text: "01", value: "01:00" },
    { text: "02", value: "02:00" },
    { text: "03", value: "03:00" },
    { text: "04", value: "04:00" },
    { text: "05", value: "05:00" },
    { text: "06", value: "06:00" },
    { text: "07", value: "07:00" },
    { text: "08", value: "08:00" },
    { text: "09", value: "09:00" },
    { text: "10", value: "10:00" },
    { text: "11", value: "11:00" },
    { text: "12", value: "12:00" },
    { text: "13", value: "13:00" },
    { text: "14", value: "14:00" },
    { text: "15", value: "15:00" },
    { text: "16", value: "16:00" },
    { text: "17", value: "17:00" },
    { text: "18", value: "18:00" },
    { text: "19", value: "19:00" },
    { text: "20", value: "20:00" },
    { text: "21", value: "21:00" },
    { text: "22", value: "22:00" },
    { text: "23", value: "23:00" }]
}
var fFilterType = [{ value:0, text: "全科患者" },
                          { value: 1, text: "连续三天大便为0的病人" },
                          { value: 2, text: "今日体温单需打印病人" },
                          //{ value: 3, text: "7天内有手术的病人" },
                          //{ value: 4, text: "3天内大于等于37.5度，小于38.5度" },
                          //{ value: 5, text: "3天内大于等于38.5，小于39度" },
                          { value: 9, text: "体温超过38.5（包含38.5）" },
                          { value: 10, text: "测血压病人" },
                          { value: 11, text: "测血糖病人" },
                          //{ value: 7, text: "入院前三天的病人" },
                         // { value: 8, text: "一级护理病人" }
];