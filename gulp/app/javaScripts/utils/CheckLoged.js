/**
 * Created by Administrator on 2017/2/28.
 */
function checkLoged(){
    if(!localStorage.getItem('user')){
        location.href='./views/login.html'
    }
}
checkLoged();