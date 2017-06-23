/**
 * Created by Administrator on 2017/2/28.
 */
// let content={"name":"V_test1.0.13","id":13,"hinxVer":["111213","141516"],"serverVer":456,"info":{"Base":2,"Sound":3,"Sheets":4,"Ui":5,"Rule":6,"Loader":7,"Guide":8,"Server":9},"isFixed":false,"usedBG":[2,3,4]};
$(document).ready(function () {
    getData();
    $('.addinfo_btn').on('click',function () {
        let serverVer=+$('#serverVer').val()
        let id=+$('#id').val()
        let name=$('#name').val();
        let hinxVer=$('#hinxVer').val();
        let serverLib=+$('#serverLib').val();

        let args=[id,{
            serverVer:serverVer,
            id:id,
            name:name,
            hinxVer:hinxVer,
            serverLib:serverLib
        }]
        sendRequest('ver.upBase',args,function (data) {
            if(data.code===0){
                alert('修改成功');
                getData()
            }else{
                alert('修改失败')
            }
        })
    });
    let history={old:null,new:null,switched:false};
    let singleHistory={};
    $('#autoBtn').unbind().bind('click',function () {
        let ss=JSON.parse(sessionStorage.newVer);
        let hinxVer=$('#hinxVer');
        let serverVer=$('#serverVer');
        let serverLib=$('#serverLib');
        if(history.switched){
            serverVer.val(history.old.serverVer);
            hinxVer.val(history.old.hinxVer);
            if(history.old.serverLib){
                serverLib.val(history.old.serverLib)
            }
            history.switched=false
        }else{
            history.old={
                hinxVer:hinxVer.val(),
                serverVer:+serverVer.val(),
                serverLib:+serverLib.val()
            };
            serverVer.val(+ss.serverVer);
            hinxVer.val(ss.hinxVer);
            if(ss.serverLib){
                serverLib.val(ss.serverLib)
            }
            history.new={
                hinxVer:hinxVer.val(),
                serverVer:+serverVer.val(),
                serverLib:+serverLib.val()
            };
            history.switched=true
        }

    })
    $('#handBtn').on('click',function () {
        $('.spinner').css('display','block');
        sendRequest('ver.getNewVer',[],function (data) {
            $('.spinner').css('display','none');
            sessionStorage.newVer=JSON.stringify(data.data);
        })
    });
    $('.lineEdit').on('click',function () {
        let ss=JSON.parse(sessionStorage.newVer);
        let index=$(".lineEdit").index(this)
        console.log(index)
        let changeName='';
        switch (index){
            case 0:changeName='hinxVer';break;
            case 1:changeName='serverVer';break;
            case 2:changeName='serverLib';break;
        }
        console.log(changeName)
        if(!singleHistory[changeName]){
            singleHistory[changeName]={old:null,new:null,switched:false};
        }
        if(singleHistory[changeName].old&&singleHistory[changeName].new&&singleHistory[changeName].switched){
            $('#'+changeName).val(singleHistory[changeName].old);
            singleHistory[changeName].switched=false
        }else{
            if(changeName==='serverLib'){
                if(ss[changeName]){
                    singleHistory[changeName].old=$('#'+changeName).val();
                    $('#'+changeName).val(ss[changeName])
                    singleHistory[changeName].new=ss[changeName];
                    singleHistory[changeName].switched=true
                }
            }else {
                singleHistory[changeName].old=$('#'+changeName).val();
                $('#'+changeName).val(ss[changeName])
                singleHistory[changeName].new=ss[changeName];
                singleHistory[changeName].switched=true
            }
        }
    })
});
let firstRender=true;
function getData() {
    let verId=+localStorage.editVerId;
    sendRequest('ver.getInfo',[verId],function (data) {
        render(data.data)
    })
}
function render(sample) {
    $('#name').val(sample.name);
    $('#id').val(sample.id);
    $('#hinxVer').val(sample.hinxVer);
    $('#serverVer').val(sample.serverVer);
    if(sample.serverLib){
        $('#serverLib').val(sample.serverLib)
    }
    if(firstRender){
        if(sample.isFixed){
            $('#fixedDiv').append(`
            <input type="radio" name="Fiexed" value='true' checked="checked" disabled="disabled">固定
            <input type="radio" name="Fiexed" value='false' style="margin-left: 3.5rem" disabled="disabled">不固定
        `)
        }else{
            $('#fixedDiv').append(`
            <input type="radio" name="Fiexed" value='true' disabled="disabled">固定
            <input type="radio" name="Fiexed" value='false' checked="checked" style="margin-left: 2rem" disabled="disabled">不固定
        `)
        }
        firstRender=false
    }
}
