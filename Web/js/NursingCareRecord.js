var AttrName = "nurse_care";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "NursingCareDefaultValues";
var NursingCareDefaultValues = {
    defaultValue: [{ text: "未填", value: "0" }],
    //随机
    auto: [{ text: "随机", value: "随机" }],
    //基本录入选项
    Pulse: [{ text: "拒测", value: "-1" },
        { text: "外出", value: "-2" },
        { text: "请假", value: "-3" }],
    defaultInput: [{ text: "拒测", value: "拒测" },
       { text: "外出", value: "外出" },
       { text: "请假", value: "请假" }],
    //呼吸
    breath: [{ text: "呼吸机", value: "呼吸机" }],
    // 瞳孔（光）
    pupil: [{ text: "灵敏", value: "灵敏" },
        { text: "迟钝", value: "迟钝" },
        { text: "消失", value: "消失" }],
    //意识
    Consciousness: [{ text: "清醒", value: "清醒" },
        { text: "嗜睡", value: "嗜睡" },
        { text: "浅昏迷", value: "浅昏迷" },
        { text: "深昏迷", value: "深昏迷" },
        { text: "麻醉未醒", value: "麻醉未醒" }],
    //皮肤情况
    Skin_Condition: [{ text: "完好", value: "完好" },
        { text: "受损", value: "受损" }
    ],
}
