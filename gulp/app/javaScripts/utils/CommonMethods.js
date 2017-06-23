/**
 * Created by Administrator on 2017/2/28.
 */
$(document).ready(function () {
    $('#loginOut').on('click',function (e) {
        if(e.preventDefault){
            e.preventDefault()   //支持dom标准的浏览器
        }else{
            e.returnValue=false  //IE
        }
        let domain='http://'+window.location.host;
        if(domain.indexOf('com')!==-1||domain.indexOf('cc')!==-1){
            //当为线上的情况
            localStorage.removeItem('user');
            localStorage.removeItem('sid');
            location.href=domain+'/index.html'
        }else {
            //生产环境
            localStorage.removeItem('user');
            localStorage.removeItem('sid');
            location.href=domain+'/service/web/index.html';
        }
    })
    $('#backToIndex').on('click',function (e) {
        if(e.preventDefault){
            e.preventDefault()   //支持dom标准的浏览器
        }else{
            e.returnValue=false  //IE
        }
        let domain='http://'+window.location.host;
        if(domain.indexOf('com')!==-1||domain.indexOf('cc')!==-1){
            //当为线上的情况
            location.href=domain+'/index.html'
        }else {
            //生产环境
            location.href=domain+'/service/web/index.html'
        }
    })
    $('.userSpan').text(localStorage.user)
    if(!sessionStorage.count){
        sessionStorage.count=1;
        setInterval(function () {
            sessionStorage.count=+sessionStorage.count+1;
            if(+sessionStorage.count!==0&&+sessionStorage.count%100===0){
                sendRequest('ver.getNewVer',[],function (data) {
                    sessionStorage.newVer=JSON.stringify(data.data);
                })
            }
        },1000)
    }else{
        setInterval(function () {
            sessionStorage.count=+sessionStorage.count+1;
            if(+sessionStorage.count!==0&&+sessionStorage.count%100===0){
                sendRequest('ver.getNewVer',[],function (data) {
                    sessionStorage.newVer=JSON.stringify(data.data);
                })
            }
        },1000)
    }
})