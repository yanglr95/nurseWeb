//遍历生成二维码
function initqrcode() {
    var qrcode = new QRCode("qrcode", {
        text: document.getElementById("qrcode").title,
        width: 50,
        height: 50,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
};

function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
$(function () {
    var json = JSON.parse(getSession("fuelbandtData"));
    var date = json.Admission_Date_Time;
    var diag = "";
    if (json.Diagnosis != null && json.Diagnosis != "" &&
    json.Diagnosis.length > 9)
            diag = json.Diagnosis.substr(0, 9);
        else if (json.Diagnosis == null)
            diag = "";
        else
            diag = json.Diagnosis;
    var bedhtml = '<table border="0">\
    <tr>\
        <td colspan=4 style="text-align:center;font-weight:600;">床头牌</td>\
    </tr>\
    <tr>\
      <td>姓名：' + json.Name + '</td>\
        <td rowspan=4 width="100px">\
             <div id="qrcode" title="' + json.Patient_id + '" class="qrcode"></div>\
        </td>\
    </tr>\
    <tr>\
        <td>性别：' + json.Sex + '</td>\
    </tr>\
    <tr>\
        <td>年龄：' + json.Age + '</td>\
    </tr>\
    <tr>\
        <td>住院号:' + json.Patient_id + '</td>\
    </tr>\
    <tr>\
        <td colspan="2">入院日期：' + date.substr(0, 10)+ '</td>\
    </tr>\
    <tr>\
        <td colspan="2" nowrap>病情：' + diag+ '</td>\
    </tr>\
</table>'
    document.body.innerHTML += bedhtml;
    initqrcode();
})