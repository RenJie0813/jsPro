/**
 * Created by Administrator on 2017/2/28.
 */

(function () {
    $('#submitServer').on('click',function () {
        let ip=$('#ip').val();
        let bakIP=$('#bakIP').val();
        let useType=+$('#useType').val();
        let useArea=+$('#useArea').val();
        let desc=$('#desc').val();
        let cpu=+$('#cpu').val();
        let memory=+$('#memory').val();
        let bandwidth=+$('#bandwidth').val();
        let method="server.add";
        let arr=[{
            ip:ip,
            bakIP:bakIP,
            useType:useType,
            useArea:useArea,
            desc:desc,
            cpu:cpu,
            memory:memory,
            bandwidth:bandwidth
        }]
        sendRequest(method,arr,function (data) {
            console.log(data)
            if(data.code===0){
                alert('添加服务成功');
                $('#ip').val("");
                $('#bakIP').val("");
                $('#useType').val("");
                $('#useArea').val("");
                $('#desc').val("");
                $('#cpu').val("");
                $('#memory').val("");
                $('#bandwidth').val("")
            }
        })
    })
})()