/**
 * Created by Administrator on 2017/2/28.
 */

//数据请求
$(document).ready(function () {
    getData()
})
//获取数据
function getData() {
    sendRequest('ver.getList',[],function (data) {
        data.head=['名称','版本','后端','固定','编辑']
        data.data.sort(function(a,b){
            return b.id-a.id;
        });
        console.log(data)
        if($('.lineData')){
            $('#tb').empty()
        }
        render(data)
    })
}

//页面渲染
function render(content) {
    $('#tb').append(
        `    <tr class="th">
            <td >${content.head[0]}</td>
            <td >${content.head[1]}</td>
            <td >${content.head[2]}</td>
            <td >${content.head[3]}</td>
            <td >${content.head[4]}</td>
        </tr>`
    )
    content.data.forEach(function (row) {
        let FixedHtml=`<td style="color: #39A3F9"><span class="fixBtn" style="border-bottom:1px dashed #333;cursor: pointer">固定</span></td>`;
        let unFixedHtml=`<td style="color: #EE735C"><span class="fixBtn" style="border-bottom:1px dashed #333;cursor: pointer">未固定</span></td>`;
        if(row.isFixed){
            $('#tb').append(`
        <tr class="lineData">
            <td>${row.name}</td>
            <td>${row.id}</td>
            <td>${row.serverVer}</td>
            ${FixedHtml}
            <td> <span class="editBtn">编辑</span>  <span class="gameBtn">游戏</span></td>
        </tr>
        `)
        }else{
            $('#tb').append(`
        <tr class="lineData">
            <td>${row.name}</td>
            <td>${row.id}</td>         
            <td>${row.serverVer}</td>
            ${unFixedHtml}
            <td> <span class="editBtn">编辑</span>  <span class="gameBtn"> 游戏</span></td>
        </tr>
        `)
        }

    })
    //固定按钮
    $('.fixBtn').on('click',function () {
        let ser=+$(this).parent().parent().children()[1].innerHTML
        console.log(typeof  ser)
        sendRequest('ver.fixed',[ser],function (data) {
            console.log(data)
            if(data.code===0){
                getData()
            }else {
                alert('固定失败')
            }
        })
    })
//编辑按钮
    $('.editBtn').unbind('click').bind('click',function () {
        let id=+$(this).parent().parent().children().eq(1).html();
        localStorage.setItem('editVerId',id);
        location.href='edit.html'
    })
 //游戏按钮
    $('.gameBtn').unbind('click').bind('click',function () {
        let id=+$(this).parent().parent().children().eq(1).html();
        localStorage.setItem('verId',id);
        location.href='game.html'
    });
//添加按钮
    $('#btn').on('click',function () {
        location.href='../../views/version/add.html'
    })
}

