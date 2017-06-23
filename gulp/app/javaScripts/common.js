/**
 * Created by RenJie on 2017/2/28.
 */


/*
 ***请求方法
 ***@param   :Obj
 ***@arr     :Array
 ***@callback:Function
 */
function sendRequest(method, arr, callback) {
    var id = localStorage['sid'];
    var param = { m: method, args: arr, sid: id };
    var domain = 'http://' + window.location.host;
    if (domain.indexOf('localhost') !== -1) {
        domain = 'http://jump.rrdwc.cc'
    }
    $.ajax({
        url: domain + '/post',
        type: 'POST',
        datatype: 'json',
        data: JSON.stringify(param),
        success: function(data) {
            data = JSON.parse(data);
            if (data.code === 100) {
                var Domain = 'http://' + window.location.host;
                alert('登录失效，请重新登录');
                if (Domain.indexOf('cc') !== -1 || Domain.indexOf('com') !== -1) {
                    //当为线上的情况
                    localStorage.removeItem('user');
                    localStorage.removeItem('sid');
                    location.href = Domain + '/views/login.html'
                } else {
                    //生产环境
                    localStorage.removeItem('user');
                    localStorage.removeItem('sid');
                    location.href = Domain + '/service/web/views/login.html';
                }
            } else {
                callback(data);
            }

        },
        error: function(xhr, errorType, error) {
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    });
}