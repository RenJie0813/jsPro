/**
 * Created by Administrator on 2017/2/28.
 */
let MoveJavascript=['gamee456'];
window.onload=function () {
    let temp={}
    let scripts=document.getElementsByTagName('script');
    for(let i=0;i<scripts.length;i++){
        temp[scripts[i].src]=[];
        for(let mine in MoveJavascript){
            if(scripts[i].src.indexOf(MoveJavascript[mine])!==-1){
                temp[scripts[i].src]=1;  //如果存在
            }
            // else {
            //     if(temp[scripts[i].src]===1){
            //         //Do nothing
            //     }else {
            //         temp[scripts[i].src]=0
            //     }
            // }
        }
    }
    for(let script in temp){
        if(temp[script]===1){
            let objName="script[src='"+script+"']"
            $(objName).remove()
        }
    }
}

