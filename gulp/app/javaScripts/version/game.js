/**
 * Created by Administrator on 2017/3/3.
 */
// [gid,游戏名,server,base,sound,sheets,ui,rule,loader,guide]
$(document).ready(function () {
    initPage();
})

var games; //游戏版本信息
var editContent;  //临时编辑文本
let history=[]; //历史记录
let lineHistory={} //单行记录
var gameNameList={}  //游戏名字列表
//获取数据
function initPage() {
    games=(JSON.parse(sessionStorage.newVer)).games;
    for(let i=0;i<games.length;i++){
        gameNameList[games[i][0]]=games[i][1]
    }
    getGameData()
}
function getGameData() {
    let verId=JSON.parse(localStorage.verId);
    sendRequest('ver.getInfo',[+verId],function (data) {
        render(data.data)
        //添加数据
        addEvent()
    })
}
//刷新表格
function refreshTable(data){
    for(let i=0;i<data.games.length;i++){
        $('#tb').append(`
        <tr class="lineData">
            <td>${data.games[i][0]}</td>
            <td>${data.games[i][1]}</td>
            <td class="editTd ">${data.games[i][2]}</td>
            <td class="editTd ">${data.games[i][3]}</td>
            <td class="editTd ">${data.games[i][4]}</td>
            <td class="editTd ">${data.games[i][5]}</td>
            <td class="editTd ">${data.games[i][6]}</td>
            <td class="editTd ">${data.games[i][7]}</td>
            <td class="editTd ">${data.games[i][8]}</td>
            <td class="editTd ">${data.games[i][9]}</td>
            <td><span class="editBtn">当前替换</span></td>
        </tr>
         `)
    }
    addEvent()
}
//tr可编辑
function changeToEdit(node){
    node.html("");
    let inputObj = $("<input type='text' style='text-align: center'/>");
    inputObj.css("border","0").css("background-color",node.css("background-color"))
        .css("font-size",node.css("font-size")).css("height","20px")
        .css("width",node.css("width")).val(editContent).appendTo(node)
        .get(0).select();
    inputObj.click(function(){
        return false;
    }).keyup(function(event){
        let keyvalue = event.which;
        if(keyvalue==13){
            node.html(node.children("input").val());
        }
        if(keyvalue==27){
            node.html(editContent);
        }
    }).blur(function(){
        if(node.children("input").val()!=editContent){
            node.html(node.children("input").val());
        }else{
            node.html(editContent);
        }
    });
}
//渲染头部
function renderHead() {
    let head=['id','游戏名','server','base','sound','sheets','ui','rule','loader','guide','操作'];
    $('#tb').append(
        `<tr class="th">
            <td >${head[0]}</td>      
            <td>${head[1]}</td>
            <td class="short">${head[2]}</td>
            <td class="short">${head[3]}</td>
            <td class="short">${head[4]}</td>
            <td class="short">${head[5]}</td>
            <td class="short">${head[6]}</td>
            <td class="short">${head[7]}</td>
            <td class="short">${head[8]}</td>
            <td class="short">${head[9]}</td>
            <td>${head[10]}</td>
    
        </tr>`
    )
}
//渲染视图
function render(sample) {
    renderHead();
    if(sample.info){
        for(let game in sample.info){
            $('#tb').append(`
        <tr class="lineData">
            <td >${game}</td>
            <td >${gameNameList[game]}</td>
            <td class="editTd ">${sample.info[game].server}</td>
            <td class="editTd ">${sample.info[game].base}</td>
            <td class="editTd ">${sample.info[game].sound}</td>
            <td class="editTd ">${sample.info[game].sheets}</td>
            <td class="editTd ">${sample.info[game].ui}</td>
            <td class="editTd ">${sample.info[game].rule}</td>
            <td class="editTd ">${sample.info[game].loader}</td>
            <td class="editTd ">${sample.info[game].guide}</td>
            <td><span class="editBtn">当前替换</span></td>
        </tr>
        `)
        }
    }else{
        $('#tb').append(`
            <td colspan="11" class="noInfo" style="height: 50px;font-size: 14px;text-align: center;vertical-align:middle;cursor: pointer;color:#39A3F9 ">暂无数据...</td>
         `)
    }

    addEvent()
}
//事件绑定
function addEvent() {
    $(".editTd").unbind().bind('click',function(){
        let clickObj = $(this);
        editContent = clickObj.html();
        changeToEdit(clickObj);
    });
    $('#auto').unbind().bind('click',function () {
        let data=JSON.parse(sessionStorage.newVer);
        if($('.editTd').length===0){
            let beforeChange=$('#tb').html();
            $('#tb').html('');
            renderHead();
            refreshTable(data);
            history.push({ctrl:'none-exist',beforeChange:beforeChange})
        }else {
            let beforeChange=$('#tb').html();
            $('#tb').html('');
            renderHead();
            refreshTable(data);
            history.push({ctrl:'modify-exist',beforeChange:beforeChange})
        }
        $(".editTd").unbind().bind('click',function(){
            let clickObj = $(this);
            editContent = clickObj.html();
            changeToEdit(clickObj);
        });
    });
    $('#back').unbind().bind('click',function () {
        if(history.length){
            let controller=history.pop();
            $('#tb').html('')
            $('#tb').html(controller.beforeChange)
            addEvent()
        }
    });
//单行录入
    $('.editBtn').unbind().bind('click',function () {
        let children=$(this).parent().parent().children();
        let gameId=children.eq(0).text();
        if(!lineHistory[gameId]){
            lineHistory[gameId]={old:null,new:null,switched:false};
        }
        if(lineHistory[gameId].old&&lineHistory[gameId].new&&lineHistory[gameId].switched){
            $(this).parent().parent().html(lineHistory[gameId].old);
            lineHistory[gameId].switched=false
        }else{
            lineHistory[gameId].old=$(this).parent().parent().html();
            let gameDetail;
            for(let i=0;i<games.length;i++){
                if(games[i][0]===gameId){
                    gameDetail=games[i]
                }
            }
            children.eq(2).text(gameDetail[2]);
            children.eq(3).text(gameDetail[3]);
            children.eq(4).text(gameDetail[4]);
            children.eq(5).text(gameDetail[5]);
            children.eq(6).text(gameDetail[6]);
            children.eq(7).text(gameDetail[7]);
            children.eq(8).text(gameDetail[8]);
            children.eq(9).text(gameDetail[9]);
            lineHistory[gameId].new=$(this).parent().parent().html();
            lineHistory[gameId].switched=true
        }
        addEvent()
    });
//提交修改
    $('.game_btn').unbind().bind('click',function () {
        let info={};
        let verId=+localStorage.verId;
        $('.lineData').each(function () {
            let children=$(this).children();
            info[children.eq(0).text()]={
                server:+children.eq(2).text(),
                base:+children.eq(3).text(),
                sound:+children.eq(4).text(),
                sheets:+children.eq(5).text(),
                ui:+children.eq(6).text(),
                rule:+children.eq(7).text(),
                loader:+children.eq(8).text(),
                guide:+children.eq(9).text()
            }
        })
        sendRequest('ver.upGames',[verId,info],function (data) {
            if(data.code===0){
                alert('修改成功')
            }else {
                alert('修改失败')
            }
        })
    })
}



