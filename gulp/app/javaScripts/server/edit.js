/**
 * Created by Administrator on 2017/2/28.
 */
//    ip:string;
/**
 * 0 masterdb 1 cust db  2 logdb  3 game  4 agent
 * 下拉选择
 */
//    useType:number;
/**
 * 抗压，分流
 * 下拉选择
 */
//    useArea:number;
/**
 * 描述
 */
//    desc:string; default:0 1
/**
 * BG的index
 */
//    usedByBG:number;
/**
 * 线程数
 */
//    cpu:number;
/**
 * 以G为单位
 */
//    memory:number;
/**
 * 带宽用mbps为单位
 */
//    bandwidth:number;
let sample=JSON.parse(localStorage.serverDetail);
console.log(sample)
$('#ip').val(sample[0]);
$('#bakIP').val(sample[1])
switch (sample[2]){
    case 'Master db':sample[2]=0;break;
    case 'Cust db':sample[2]=1;break;
    case 'Log db':sample[2]=2;break;
    case 'Game':sample[2]=3;break;
    case 'Agent':sample[2]=4;break;
}
switch (sample[3]){
    case '抗压':sample[3]=0;break;
    case '分地区':sample[3]=1;break;
}
$('#useType').val(sample[2]);
$('#useArea').val(sample[3]);
$('#desc').val(sample[4]);
$('#cpu').val(+sample[5]);
$('#memory').val(+sample[6]);
$('#bandwidth').val(+sample[7]);
$('.addinfo_btn').on('click',function () {
    let args=[
        {
            ip:$('#ip').val(),
            bakIP:$('#bakIP').val(),
            useType:+$('#useType').val(),
            useArea:+$('#useArea').val(),
            desc:$('#desc').val(),
            cpu:+($('#cpu').val()),
            memory:+$('#memory').val(),
            bandwidth:+$('#bandwidth').val()
        }
    ]
    let method='server.up'
    sendRequest(method,args,function (data) {
        if(data.code===0){
            alert('修改成功')
            location.href='list.html'
        }else {
            alert('修改失败，请重试')
        }
    })
})
