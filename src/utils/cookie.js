
export function isPromise (value) {
  if (value !== null && typeof value === 'object') {
    return value.promise && typeof value.promise.then === 'function';
  }
}

export function getCookie (name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function setCookie (c_名称,value,expiredays) {
    var exdate = null;
    if (expiredays) {
        var utc = new Date().getTime() + expiredays * 24 * 60 * 60 * 1000
        exdate = new Date(utc).toUTCString();
        document.cookie = c_名称+ "=" + escape(value) + ";expires=" + exdate + "; path=/";
    } else {
        document.cookie = c_名称+ "=" + escape(value) + "; path=/";
    }
}

export function delCookie (name) {
  //console.log(name);
  var exp = new Date(0);
  //exp.setTime(exp.getTime() - 1);
  var cval=this.getCookie(name);
  if(cval!=null)
  document.cookie= name + "="+cval+";expires="+exp.toUTCString() + "; path=/";
}