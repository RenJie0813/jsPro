/**
 * Created by Administrator on 2017/2/28.
 */
$(document).ready(function () {
    let ss=JSON.parse(sessionStorage.newVer);
    let defaultHinx=ss.hinxVer;
    let defaultServerVer=ss.serverVer;
    $('#serverVer').val(defaultServerVer);
    $('.hinxVerInput').val(defaultHinx);
    $('.addinfo_btn').on('click',function () {
        let serverVer=+$('#serverVer').val();
        let name=$('#name').val();
        let hinxVer=$('.hinxVerInput').val();
        let method='ver.add';
        let args=[
            {
                name:name,
                hinxVer:hinxVer,
                serverVer:serverVer
            }
        ]
        sendRequest(method,args,function (data) {
            if(data.code === 0 ){
                alert('添加成功')
                $('#serverVer').val('');
                $('#id').val('');
                $('#name').val('');
                $('.hinxVerInput').val('');

            }else{
                alert('添加失败')
            }
        })
    });
})