function AdjustLayout() {
    $("body.one-page-outter-body").css("width", document.body.scrollWidth);
    $("body.one-page-outter-body").css("height", document.body.scrollHeight);
    var s = ""; 
    s += " 网页可见区域宽:  document.body.clientWidth  = " + document.body.clientWidth  +  "\n"; 
    s += " 网页可见区域高:  document.body.clientHeight  = " + document.body.clientHeight  +  "\n"; 
    s += " 网页可见区域宽:  document.body.offsetWidth   = " + document.body.offsetWidth   +   " (包括边线和滚动条的宽)"+"\n"; 
    s += " 网页可见区域高:  document.body.offsetHeight   = " + document.body.offsetHeight   +   " (包括边线的宽)"+"\n"; 
    s += " 网页正文全文宽:  document.body.scrollWidth  = " + document.body.scrollWidth  +  "\n"; 
    s += " 网页正文全文高:  document.body.scrollHeight  = " + document.body.scrollHeight  +  "\n"; 
    s += " 网页被卷去的高(ff):  document.body.scrollTop  = " + document.body.scrollTop  +  "\n"; 
    s += " 网页被卷去的高(ie):  document.documentElement.scrollTop = " + document.documentElement.scrollTop + "\n"; 
    s += " 网页被卷去的左:  document.body.scrollLeft  = " + document.body.scrollLeft  +  "\n"; 
    s += " 网页正文部分上:  window.screenTop = " + window.screenTop + "\n"; 
    s += " 网页正文部分左:  window.screenLeft = " + window.screenLeft + "\n"; 
    s += " 屏幕分辨率的高:  window.screen.height  = " + window.screen.height  +  "\n"; 
    s += " 屏幕分辨率的宽:  window.screen.width  = " + window.screen.width  +  "\n"; 
    s += " 屏幕可用工作区高度:  window.screen.availHeight  = " + window.screen.availHeight  +  "\n"; 
    s += " 屏幕可用工作区宽度:  window.screen.availWidth  = " + window.screen.availWidth  +  "\n"; 
    s += " 你的屏幕设置是:  window.screen.colorDepth   = " + window.screen.colorDepth   +  " 位彩色"+"\n"; 
    s += " 你的屏幕设置:  window.screen.deviceXDPI   = " + window.screen.deviceXDPI   +  " 像素/英寸"+"\n";
    //console.log(s);
}
function ChangeVersion () {
    let version = process.env.NOMES_VERNO;
    let src = './index' + version + '.html';
    $("#mainframe-id").prop("src", src);
}
$(document).ready(function() {
    ChangeVersion();
    AdjustLayout();
});