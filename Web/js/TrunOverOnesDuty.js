var AttrName = "trunOver";
var JsonPro = "vital_sign:";
var DefaultDataName = "combo_data:";
var ComboDataName = "TurnOverOnesDutyDefaultValues";
var TurnOverOnesDutyDefaultValues = {
    defaultValue: [{ text: "请选择", value: "-1" }],
    //selAPN: [{ text: "白班", value: "A" },
    //        { text: "小夜班", value: "P" },
    //        { text: "大夜班", value: "N" }],
    DutyTime: [{text:"Astart", value:"08:00:01"},
                {text:"Aend", value:"17:00:00"},
                {text:"Pstart", value:"17:00:01"},
                {text:"Pend", value:"01:00:00"},
                {text:"Nstart", value:"01:00:01"},
                { text: "Nend", value: "08:00:00" }]
}
