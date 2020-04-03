//遍历生成二维码
function initqrcode() {
    var qrcode = new QRCode("qrcode", {
        text: document.getElementById("qrcode").title,
        width: 100,
        height: 100,
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
    var bedhtml = '<div id="spire"><div>'+PrintData.HospitalName+'</div><div><p><span>姓名：'+json.Name+'</span><span>性别：'+json.Sex+'</span></p><p><span>编号：'+json.Patient_id+'</span><span>年龄：'+json.Age+'</span></p></div><div id="qrcode" title="' + json.Patient_id + '"></div></div>'
    document.body.innerHTML += bedhtml;
    initqrcode();
})