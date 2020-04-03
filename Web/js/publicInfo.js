$(function(){
    var getData = JSON.parse(getSession("patientData"));
    var diag="";
    if (getData.Diagnosis != null && getData.Diagnosis != "" &&
    getData.Diagnosis.length > 9)
            diag = getData.Diagnosis.substr(0, 9);
        else if (getData.Diagnosis == null)
            diag = "";
        else
            diag = getData.Diagnosis;
    $(".hosName").html(PrintData.HospitalName);
    $(".name").html("姓名："+getData.Name);
    $(".sex").html("性别："+getData.Sex);
    $(".age").html("年龄："+getData.Age);
    $(".inpatient").html("病区："+getData.Dept_name);
    $(".bed_number").html("床号："+getData.Bed_Label);
    $(".patient_number").html("病案号："+getData.Patient_id);
    $(".diagn").html("诊断："+diag)
})
