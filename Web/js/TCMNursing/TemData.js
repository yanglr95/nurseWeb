var NursingProgramSettingData = [
    {
        DiseaseID: 0,
        DiseaseName: "胃疡（消化性溃疡）",
        Symptom: [
            {
                SymptomID: 0,
                SymptomName: "胃脘疼痛",
                NursingTechniques: [
                    { TechID: 0, TechName: '穴位贴敷', Days: 3, Times: 9, Memo: '穴位贴敷，隐痛取中脘、建里、神阙、关元等穴；胀痛取气海、天枢等穴。' },
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取中脘、气海、胃俞、合谷、足三里等穴。' },
                    { TechID: 2, TechName: '艾灸', Days: 3, Times: 9, Memo: '取中脘、神阙、气海、关元等穴。' },
                    { TechID: 3, TechName: '药熨法', Days: 3, Times: 9, Memo: '取胃脘部。' },
                    { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取脾、胃、交感、神门、肝胆等穴。' },
                    { TechID: 5, TechName: '拔火罐', Days: 3, Times: 9, Memo: '取脾俞、胃俞、肾俞、肝俞等穴。' },
                ]
            },
            {
                SymptomID: 1,
                SymptomName: "嗳气、反酸",
                NursingTechniques: [
                    { TechID: 0, TechName: '穴位贴敷', Days: 3, Times: 9, Memo: '取足三里、天突、中脘、内关等穴。 ' },
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取足三里、合谷、天突、中脘、内关等穴。' },
                    { TechID: 2, TechName: '艾灸', Days: 3, Times: 9, Memo: '取肝俞、胃俞、足三里、中脘、神阙等穴。' },
                    { TechID: 6, TechName: '穴位注射', Days: 3, Times: 9, Memo: '取足三里、内关等穴。' },
                ]
            },
            {
                SymptomID: 2,
                SymptomName: "纳呆 ",
                NursingTechniques: [
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取足三里、内关、丰隆、合谷、中脘等穴。' },
                    { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取脾、胃、肝、小肠、心、交感等穴。 ' },
                ]
            },
        ],
    },
    {
        DiseaseID: 1,
        DiseaseName: "暴聋（突发性耳聋）",
        Symptom: [
            {
                SymptomID: 3,
                SymptomName: "耳聋 ",
                NursingTechniques: [
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取听会、听宫、合谷、耳门、翳风等穴。 ' },
                    { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取肾、内耳、皮质下、肾上腺等穴位。肝火上炎者加肝穴；风邪外犯者加肺穴。' },
                    { TechID: 7, TechName: '刮痧', Days: 3, Times: 9, Memo: '取风池、翳风、听宫，耳门等穴；背部取大杼、风门、肺俞等穴。 ' },
                ]
            },
            {
                SymptomID: 4,
                SymptomName: "耳鸣",
                NursingTechniques: [
                    { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取内耳、神门、肾、心等穴。 ' },
                ]
            },
            {
                SymptomID: 5,
                SymptomName: "耳内胀闷",
                NursingTechniques: [
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取听会、听宫、耳门、翳风等穴。' },
                ]

            },
            {
                SymptomID: 6,
                SymptomName: "头晕目眩",
                NursingTechniques: [
                    { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取神门、肝、心、皮质下等穴。肝火上炎伴血压升高者可加降压沟、肝阳等穴。 ' },
                    { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取印堂、太阳、风池、百会等穴。' },
                ]
            },
             {
                 SymptomID: 7,
                 SymptomName: "夜寐不安",
                 NursingTechniques: [
                     { TechID: 4, TechName: '耳穴贴压', Days: 3, Times: 9, Memo: '取心、肾、交感、神门等穴。 ' },
                     { TechID: 1, TechName: '穴位按摩', Days: 3, Times: 9, Memo: '取神门、三阴交、肾俞、涌泉等穴，伴心悸者加内关、心俞等穴。' },
                     { TechID: -1, TechName: '其他', Days: 3, Times: 9, Memo: '中药泡洗。' },
                 ]
             }
        ],
    },
]

var NursingTechniques = [
    { TechID: -1, TechName: "其他" },
    { TechID: 0, TechName: "穴位贴敷" },
    { TechID: 1, TechName: "穴位按摩" },
    { TechID: 2, TechName: "艾灸" },
    { TechID: 3, TechName: "药熨法" },
    { TechID: 4, TechName: "耳穴贴压" },
    { TechID: 5, TechName: "拔火罐" },
    { TechID: 6, TechName: "穴位注射" },
    { TechID: 7, TechName: "刮痧" }
]
var DiseaseData = [{
    DiseaseID: 0,
    DiseaseName: "胃疡（消化性溃疡）",
},
{
    DiseaseID: 1,
    DiseaseName: "暴聋（突发性耳聋）",
}]
var SymptomID = [{
    DiseaseID: 0,
    SymptomID: 0,
    SymptomName: "胃脘疼痛",
}, {
    DiseaseID: 0,
    SymptomID: 1,
    SymptomName: "嗳气、反酸",
}, {
    DiseaseID: 0,
    SymptomID: 2,
    SymptomName: "纳呆 ",
}, {
    DiseaseID: 1,
    SymptomID: 3,
    SymptomName: "耳聋 ",
}, {
    DiseaseID: 1,
    SymptomID: 4,
    SymptomName: "耳鸣",
}, {
    DiseaseID: 1,
    SymptomID: 5,
    SymptomName: "耳内胀闷",
}, {
    DiseaseID: 1,
    SymptomID: 6,
    SymptomName: "头晕目眩",
}, {
    DiseaseID: 1,
    SymptomID: 7,
    SymptomName: "夜寐不安",
}]


var patientProgram = [{
    Patient_ID: "100113870",
    Patient_Name: "蔡元国",
    Program: [{ "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "耳聋", Effect: "好", SymptomID: "3", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取听会、听宫、合谷、耳门、翳风等穴。 ", "insertIndex": 15, "isNew": false, "TechCount": 3 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "耳聋", Effect: "好", SymptomID: "3", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取肾、内耳、皮质下、肾上腺等穴位。肝火上炎者加肝穴；风邪外犯者加肺穴。", "insertIndex": 15, "isNew": false, "TechCount": 3 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "耳聋", Effect: "好", SymptomID: "3", "TechName": "刮痧", "TechID": 7, "Days": 3, "Times": 9, "Memo": "取风池、翳风、听宫，耳门等穴；背部取大杼、风门、肺俞等穴。 ", "insertIndex": 15, "isNew": false, "TechCount": 3 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "耳鸣", Effect: "较好", SymptomID: "4", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取内耳、神门、肾、心等穴。 ", "insertIndex": 16, "isNew": false, "TechCount": 1 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "耳内胀闷", SymptomID: "5", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取听会、听宫、耳门、翳风等穴。", "insertIndex": 17, "isNew": false, "TechCount": 1 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "头晕目眩", SymptomID: "6", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取神门、肝、心、皮质下等穴。肝火上炎伴血压升高者可加降压沟、肝阳等穴。 ", "insertIndex": 19, "isNew": false, "TechCount": 2 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "头晕目眩", SymptomID: "6", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取印堂、太阳、风池、百会等穴。", "insertIndex": 19, "isNew": false, "TechCount": 2 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "夜寐不安", SymptomID: "7", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取心、肾、交感、神门等穴。 ", "insertIndex": 22, "isNew": false, "TechCount": 3 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "夜寐不安", SymptomID: "7", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取神门、三阴交、肾俞、涌泉等穴，伴心悸者加内关、心俞等穴。", "insertIndex": 22, "isNew": false, "TechCount": 3 },
    { "DiseaseName": "暴聋（突发性耳聋）", ProgramDate: "2017-09-10", "SymptomName": "夜寐不安", SymptomID: "7", "TechName": "其他", "TechID": -1, "Days": 3, "Times": 9, "Memo": "中药泡洗。", "insertIndex": 22, "isNew": false, "TechCount": 3 }]
},
{
    Patient_ID: "100130088",
    Patient_Name: "刘明信",
    Program: [{ "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "穴位贴敷", "TechID": 0, "Days": 3, "Times": 9, "Memo": "穴位贴敷，隐痛取中脘、建里、神阙、关元等穴；胀痛取气海、天枢等穴。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取中脘、气海、胃俞、合谷、足三里等穴。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "艾灸", "TechID": 2, "Days": 3, "Times": 9, "Memo": "取中脘、神阙、气海、关元等穴。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "药熨法", "TechID": 3, "Days": 3, "Times": 9, "Memo": "取胃脘部。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取脾、胃、交感、神门、肝胆等穴。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "胃脘疼痛", SymptomID: "0", "TechName": "拔火罐", "TechID": 5, "Days": 3, "Times": 9, "Memo": "取脾俞、胃俞、肾俞、肝俞等穴。", "insertIndex": 6, "isNew": false, "TechCount": 6 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "嗳气、反酸", SymptomID: "1", "TechName": "穴位贴敷", "TechID": 0, "Days": 3, "Times": 9, "Memo": "取足三里、天突、中脘、内关等穴。 ", "insertIndex": 10, "isNew": false, "TechCount": 4 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "嗳气、反酸", SymptomID: "1", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取足三里、合谷、天突、中脘、内关等穴。", "insertIndex": 10, "isNew": false, "TechCount": 4 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "嗳气、反酸", SymptomID: "1", "TechName": "艾灸", "TechID": 2, "Days": 3, "Times": 9, "Memo": "取肝俞、胃俞、足三里、中脘、神阙等穴。", "insertIndex": 10, "isNew": false, "TechCount": 4 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "嗳气、反酸", SymptomID: "1", "TechName": "穴位注射", "TechID": 6, "Days": 3, "Times": 9, "Memo": "取足三里、内关等穴。", "insertIndex": 10, "isNew": false, "TechCount": 4 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "纳呆 ", SymptomID: "2", "TechName": "穴位按摩", "TechID": 1, "Days": 3, "Times": 9, "Memo": "取足三里、内关、丰隆、合谷、中脘等穴。", "insertIndex": 12, "isNew": false, "TechCount": 2 },
        { "DiseaseName": "胃疡（消化性溃疡）", ProgramDate: "2017-09-12", "SymptomName": "纳呆 ", SymptomID: "2", "TechName": "耳穴贴压", "TechID": 4, "Days": 3, "Times": 9, "Memo": "取脾、胃、肝、小肠、心、交感等穴。 ", "insertIndex": 12, "isNew": false, "TechCount": 2 }]
}
]