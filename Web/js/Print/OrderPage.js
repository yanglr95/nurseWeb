
//遍历生成二维码
function initqrcode() {
    var length = '+length+';
    var i = 0
    while (true) {
        if (document.getElementById("qrcode" + i) == null) {
            break
        }

        var qrcode = new QRCode("qrcode" + i, {
            text: document.getElementById("qrcode" + i).title,
            width: 70,
            height: 70,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        i = i + 1
    }
};

function page_print() {
    var btnprint = document.getElementById('page_print');
    btnprint.style.display = 'none'
    window.print()
    btnprint.style.display = ''
}
$(function () {
    clearInnerHTML();
    var json = $.parseJSON(window.localStorage.getItem('data'));
    //直接调用浏览器打印功能
    bdhtml = "";
    var length = json.length;
    var morediv = "";
    for (var i = 0; i < length; i++) {
        morediv = "";
        lihtml = '<div  id="div' + i + '" class="divfloat">'
        if (i < length - 1) {
            lihtml = '<div  id="div' + i + '"  class="divfloat"  style="page-break-before:always; ">'
        }
        if (json[i].OtherOrder_Text.length > 0) {
            morediv = '</table></div><div  id="div' + i + '"  class="divfloat"  style="page-break-before:always; "><table border="0"><tr><td  nowrap>' + json[i].OtherOrder_Text + '</td></tr>'
        }
        lihtml = lihtml +
        '<table border="0">\
                <tr>\
                    <td width="160px">'+ json[i].Bed_No + '&nbsp' + json[i].Name + '</td>\
                    <td rowspan=4 width="100px">\
                         <div id="qrcode'+ i + '" title="' + json[i].Order_Number + '" class="qrcode"></div>\
                    </td>\
                </tr>\
                <tr>\
                    <td>病案号：'+ json[i].Patient_id + '</td>\
                </tr>\
                <tr>\
                    <td>用法：'+ json[i].Administration + '</td>\
                </tr>\
                <tr>\
                    <td>频次：'+ json[i].Frequency + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2">执行时间：'+ json[i].Exec_Date_Time + '</td>\
                </tr>\
                <tr>\
                    <td colspan="2" nowrap>'+ json[i].Order_Text + '</td>\
                </tr>'  + morediv + '\
            </table>\
        </div>'
        bdhtml = bdhtml + lihtml;
    }
    document.body.innerHTML += bdhtml;

    initqrcode();
})
function clearInnerHTML() {
    var length = $("#body").find("div").length;
    $("#body").find("div").each(function (o) {
        if (o > 0)
            this.remove()
    });
}