var AttrName = "nurse_care";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "CriticalCareDefaultValues";

var CriticalCareDefaultValues = {
    defaultValue: [{ text: " ", value: " " }],
    //基本录入选项
    defaultInput: [{ text: "拒测", value: "-1" },
        { text: "外出", value: "-2" },
        { text: "请假", value: "-3" }],


    //呼吸
    breath: [{ text: "呼吸机", value: "-300" }],
    // 瞳孔（光）
    pupil: [{ text: "灵敏", value: "1" },
        { text: "迟钝", value: "2" },
        { text: "消失", value: "3" }],
    //意识
    Consciousness: [{ text: "清醒", value: "1" },
        { text: "嗜睡", value: "2" },
        { text: "朦胧", value: "3" },
        { text: "浅昏迷", value: "4" },
        { text: "深昏迷", value: "5" },
        { text: "麻醉未醒", value: "6" }],
    //皮肤情况
    Skin_Condition: [{ text: "完好", value: "1" },
        { text: "受损", value: "2" }
    ],
    //吸氧方式
    Breath_Mode: [{ text: "鼻塞", value: "1" },
        { text: "面罩", value: "2" },
        { text: "气插", value: "3" },
        { text: "气切", value: "4" }],
    //呼吸形式
    Breath_Type: [{ text: "自主", value: "1" },
         { text: "机械", value: "2" }],
    //痰液性质
    Sputum: [{ text: "I度", value: 1 },
        { text: "II度", value: 2 },
        { text: "III度", value: 3 }],
    //翻身体位
    Posture: [{ text: "半卧位D", value: 1 },
        { text: "半卧位S", value: 2 },
        { text: "左侧卧位L", value: 3 },
        { text: "右侧卧位D", value: 4 }],
    //皮肤情况
    Skin: [{ text: "完好", value: 1 },
       { text: "异常", value: 2 }],
    //伤口情况
    Wound: [{ text: "清洁", value: 1 },
        { text: "干燥", value: 2 },
        { text: "异常", value: 3 }],
    //管路情况
    Piping: [{ text: "良好", value: 1 },
       { text: "异常", value: 2 },
       { text: "夹闭", value: 3 }],
}
