/**
 * Created by Administrator on 2017/2/28.
 */
let username,password;
$(document).keyup(function(event){
    username=$('#username').val();
    password=$('#password').val();
    if(event.keyCode ==13&&username&&password){
        login()
    }
});
$('#btn').on('click',login);
function login(){
    username=$('#username').val();
    password=$('#password').val();
    let sid=''
    var obj={
        m:"keep.login",
        args:[username,password,sid]
    }
    sendRequest(obj.m,obj.args,function (data) {
            if(data.code===0){
                goIndex(data.data)
				
            }else{
                alert('登录失败');
            }
    })
}
function goIndex(data) {
    localStorage.setItem('sid',data)
    localStorage.setItem('user',username)
     location.href='./../index.html'
}