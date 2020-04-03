var AttrName = "bodychart";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "BodyChartDefaultValues";
var BodyChartDefaultValues = {
    defaultValue: [{ text: "", value: "" }],
    //随机
    auto: [{ text: "随机", value: "随机" }],
    //基本录入选项
    hourInput: [{ text: "拒测", value: "-1" },
        { text: "外出", value: "-2" },
        { text: "请假", value: "-3" }],
    //体重
    weight: [{ value: "-14", text: "卧床" },
        { text: "平车", value: "-20" },
        { text: "未测", value: "-10" },
        { text: "轮椅", value: "-30" }],
    //呼吸
    breath: [{ text: "呼吸机", value: "-300" }],
    //血糖
    bloodGlucose: [{ value: "-12", text: "hi" },
        { text: "lo", value: "-13" },
        { text: "拒测", value: "-1" },
        { text: "外出", value: "-2" },
        { text: "请假", value: "-3" }],
    //血糖类型
    gluType: [{ text: "空腹", value: "空腹" },
        { text: "早餐后2h", value: "早餐后2h" },
        { text: "午餐前", value: "午餐前" },
        { text: "午餐后2h", value: "午餐后2h" },
        { text: "晚餐前", value: "晚餐前" },
        { text: "晚餐后2h", value: "晚餐后2h" },
        { text: "睡前", value: "睡前" }],
    //血压类型
    bloodPressure: [{ text: "左上肢", value: "左上肢" },
        { text: "右上肢", value: "右上肢" },
        { text: "左下肢", value: "左下肢" },
        { text: "右下肢", value: "右下肢" },
        { text: "有创", value: "有创" },
        { text: "无创", value: "无创" },
        { text: "中心静脉压", value: "中心静脉压" },
    ],
    // 瞳孔（光）
    pupil: [{ text: "灵敏", value: "灵敏" },
        { text: "迟钝", value: "迟钝" },
        { text: "消失", value: "消失" }],

    CCU: [{ text: "窦性心律", value: "窦性心律" },
        { text: "房颤", value: "房颤" },
        { text: "室颤", value: "室颤" },
        { text: "房扑", value: "房扑" },
        { text: "室速", value: "室速" },
        { text: "室上速", value: "室上速" },
        { text: "房早", value: "房早" },
        { text: "室早", value: "室早" },
        { text: "病窦", value: "病窦" },
        { text: "起搏心律", value: "起搏心律" },
        { text: "传导阻滞", value: "传导阻滞" },
        { text: "预激综合症", value: "预激综合症" }],
    //意识
    Consciousness: [{ text: "清醒", value: "清醒" },
        { text: "嗜睡", value: "嗜睡" },
        { text: "浅昏迷", value: "浅昏迷" },
        { text: "深昏迷", value: "深昏迷" },
        { text: "麻醉未醒", value: "麻醉未醒" }],
    //大便
    excrement: [{ text: "※", value: "998" },
        { text: "☆", value: "999" }]
}

