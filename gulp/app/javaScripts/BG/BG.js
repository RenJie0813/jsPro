var bgID;
$(function() {
    // important DataCache
    var roby = null,gameArr=[],isRequest= 0;
    getData();
    //获取版本列表
    FillSelect('ver.getList',[],'#version','获取版本列表错误！',function(){
        sendRequest('bg.getList',[], function (data) {
            if(data.code==0){
                dataPain(data.data);
            }
            else{
                console.log(data);
            }
        });
    });

    $('#domain').on('blur',function(){
        var domain=$("#domain").val();
        if(domain.indexOf(',')>-1){
            $(".two").show();
        }
        else{
            $(".two").hide();
        }
    });

    //select事件
    $("select").on('change', function () {
        var obj=$(this).get(0);
        $(this).next().html(obj.options[obj.options.selectedIndex].text);
    });

    // insert
    $("#add").on('click', function(event) {
        event.stopPropagation();
        isRequest==0&&getData();
        toggleForm();
        formShow(-1);
    });

    // update
    $('.datalist>table').on('click', 'span.edit', function(e) {
        e.stopPropagation();
        var id = $(this).parent().attr('id');
        var type=$(this).attr('type');
        toggleForm(type);
        if (!!id) {
            if(type==2){
                toggleForm();
                formShow(id,type);
            }
            else{
                (isRequest==0&&type==1)&&getData();
                sendRequest('bg.getInfo',[parseInt(id)], function (data) {
                    if(data.code==0){
                        roby=data.data;
                        formShow(id,type);
                    }
                    else{console.log(data)}
                });
            }

        } else {
            alert('id或标识列为空！请查看编辑列是否存在id属性');
        }
    });

    //info
    $('.datalist>table').on('click','td',function(e){
        if(e.target.nodeName=='SPAN'){
            return;
        }else{
            var id = $(this).parent().children('td:last-child').attr('id');
            if (!!id) {
                $('.modal .title').html('BG详细信息');
                $('#formData').hide();
                $('#viewData').show();
                $('.ed').attr('id', id);
                // 得到本条数据填充roby并且渲染详情界面
                sendRequest('bg.getInfo',[parseInt(id)], function (data) {
                    if(data.code==0){
                        roby=data.data;
                        fillData(roby,'select');
                        bounceView();
                    }
                    else{console.log(data)}
                });
            } else {
                alert('id或标识列为空！请查看编辑列是否存在id属性');
            }
        }
    });

    // close view
    $(".close").on('click', closeModal);

    // 详情界面上的编辑按钮事件 
    $('.ed').on('click', function(e) {
        var id = $(e.target).attr('id');
        e.preventDefault();
        e.stopPropagation();
        if (!!id) {
            isRequest==0&&getData();
            toggleForm();
            // 渲染编辑界面
            formShow(id,1);
        } else {
            alert('id或标识列为空！请查看编辑列是否存在id属性');
        }

    });

    // 新增、查看、修改处理
    function formShow(id,type) {
		bgID=id;
        // 判断id是否存在显示不同界面
        if ((type==2&&id!=-1)||(id == -1&&!type)) {
            $('.modal .title').html('添加BG');
            $('.sub').html('确认添加');
            if(type==2){
                //查询数据并填充界面
                sendRequest('bg.getInfo',[parseInt(id)], function (data) {
                    if(data.code==0){
                        fillData(data.data,'edit');
                    }
                    else{console.log(data)}
                });
                bgID=-1;
            }
            else{}
        } else {
            if(type==1){
                $('.modal .title').html('BG信息修改');
                $('.sub').html('确认修改');
                !!roby && fillData(roby, 'edit');
            }
            else{
                //添加服务器点击事件
                $("#addLine").unbind('click').on('click', function () {
                    if($(".insert_a").css('display')=='none'&&$(".insert_p").css('display')=='none'){
                        if(type==2){
                            $(".insert_p").hide();
                            $(".insert_a").show();
                            $(".addBtn").unbind('click').on('click', function () {
                                addServer(1);
                            });
                        }
                        else {
                            $(".insert_a").hide();
                            $(".insert_p").show();
                            $(".addBtn").unbind('click').on('click', function () {
                                addServer(2);
                            });
                        }
                    }
                    else{
                        alert('请先完成当前添加！');return;
                    }
                });

                //初始化添加项数据
                if(type==2){
                    $("#editDiv .addTitle p").text('AgentServers Manage');
                    if(!!roby.agentServers&&Array.isArray(roby.agentServers)){
                        var arr=roby.agentServers;
                        var html="";
                        for(var k= 0,l=arr.length;k<l;k++){
                            html+="<div class='agent' ip='"+arr[k]+"'><p>"+arr[k]+"</p><p><i class='delete'>删除</i></p></div>";
                        }
                        $(html).insertBefore("#editDiv div.insert");
                    }
                    else{}
                    getAgentL();
                    serverView();
                }
                else{
                    $("#editDiv .addTitle p").text('GameServers Manage');
                    (!!roby.gameServers&&Array.isArray(roby.gameServers))&&(gameArr=roby.gameServers);
                        getGameL(serverView);
                }

                //保存按钮
                $("#editDiv .sub-add input[type='button']").attr('id',id);
                $("#editDiv .sub-add input[type='button']").attr('data-t',type);

                $("#editDiv .sub-add input[type='button']").unbind('click').on('click', function () {
                    $(".load").show();
                    var id=$(this).attr('id');
                    var type=$(this).attr('data-t');
                    var agentUrl='bg.changeAerver';
                    var gameUrl='bg.changeGerver';
                    var list=[];
                    if(type==2){
                        var Adata=$("div.agent");
                        for(var i= 0,length=Adata.length;i<length;i++){
                            list.push($(Adata[i]).attr('ip'));
                        }
                    }
                    else{
                        var Gdata=$("div.game");
                        for(var i= 0,length=Gdata.length;i<length;i++){
                            list.push({
                                ip:$(Gdata[i]).attr('ip'),
                                num:parseInt($(Gdata[i]).attr('num')),
                                gid:$(Gdata[i]).attr('name')
                            });
                        }
                    }
                    sendRequest(type==2?agentUrl:gameUrl,[parseInt(id),list], function (data) {
                        if(data.code==0){
                            $(".load .wait").hide();
                            $(".load .suc").show();
                            list=[];
                            if(type==2){
                                getAgentL();
                            }
                            else{
                                getGameL();
                            }
                            setTimeout(closeModal,1600);
                        }
                        else{
                            console.log(data);
                        }
                    })
                });
                return;
            }
        }
        // bind Event
        $('.sub').unbind('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // get sendData
            var id=bgID;
            var name = $('#name').val();
            var version = $('#version').val();
            var domain = $('#domain').val();
            var dbServer = $('#dbServer').val();
            var logDB = $('#logDBServer').val();
            var codeStatus = $('#codeStatus').val();
            var sslKey=$("#sslKey").val();
            var sslCrt=$("#sslCrt").val();
            if (!name || !version ||!dbServer||!domain || !logDB || !codeStatus||!sslCrt||!sslKey) {
                alert('请填写完全部数据再提交！');
            } else {
                var sendData={
                    status:0,
                    name:name,
                    version:parseInt(version),
                    domain:domain,
                    dbServer:dbServer,
                    logDBServer:logDB,
                    agentServers:[],
                    gameServers:[],
                    codeStatus:parseInt(codeStatus),
                    sslCrt:sslCrt,
                    sslKey:sslKey
                };
                if(domain.indexOf(',')!=-1){
                    var sslCrt1=$("#sslCrt1").val();
                    var sslKey1=$("#sslKey1").val();
                    if(!sslCrt1||!sslKey1){
                        alert('请填写完全部数据再提交！');return;
                    }
                    else{
                        sendData.sslCrt1=sslCrt1;
                        sendData.sslKey1=sslKey1;
                    }
                }else{}
                $('.load').show();

                // request
                if (id == -1) {
                    // insert
                    sendRequest('bg.add',[sendData],function(data){
                        if(data.code==0){
                            $(".load .wait").hide();
                            $(".load .suc").show();
                            setTimeout(closeModal,1600);

                        }
                        else{
                            console.log(data);
                        }
                    });
                } else {
                    // update
                    sendRequest('bg.upBase',[id,sendData], function (data) {
                        if(data.code==0){
                            $(".load .wait").hide();
                            $(".load .suc").show();
                            setTimeout(closeModal,1600);
                        }
                        else{
                            console.log(data);
                        }
                    });
                }
            }
        });
        bounceView();
    }

    //添加Server窗口
    function serverView(){
        bounceView();
        $("#editDiv").show();
        $("#editDiv").on('click','i.delete', function () {
            $(this).parent().parent().remove();
        });
        $(".top-edit").on('click', function () {
            closeModal();
        })
    }

    //关闭弹出层
    function closeModal(){
        $(".load").hide();
        $(".load .wait").show();
        $(".load .suc").hide();
        $("#editDiv").hide();
        $(".insert_a").hide();
        $(".insert_p").hide();
        $("#num").val('0');
        $(".game").remove();
        $(".agent").remove();
        $("textarea").val('');

        $('.background').hide();
        $('.modal').removeClass("bounceInDown");
        $("select").val('');
        var c=document.getElementsByName('agentServers');
        for(var i= 0,length= c.length;i<length;i++){
            c[i].checked=false;
        }
        $("input[type='text']").val('');
        $("select").next('span').text('————请选择————');
    }

    //请求数据渲染编辑界面
    function getData(){
        getDbL();
        getLogL();
        isRequest=1;
    }

    //获取db列表
    function getDbL(){
        FillSelect('server.getList',[0],'#dbServer','获取db列表错误！');
    }

    //获取logDb列表
    function getLogL(){
        FillSelect('server.getList',[2],'#logDBServer','获取logDB列表错误！');
    }

    //获取游戏列表
    function getGameL(callback){
        FillSelect('server.getList',[3],'#gameIpSelect','获取gameServerIP列表错误！');
        sendRequest('pm.getGameList',[], function (data) {
            if(Object.prototype.toString.call(data)=='[object Object]'){
                var html='';
                for(var i in data){
                    html+=getOption(data[i].ID,data[i].CName);
                }
                html="<option value=''>请选择</option>"+html;
                $("#gameSelect").empty().append(html);
                FillGame(gameArr);
                !!callback&&callback();
            }
            else{alert('获取游戏列表错误！');console.log(data);}
        });
    }

    //获取agent列表
    function getAgentL(){
        FillSelect('server.getList',[4],'#agentIpSelect','获取agent列表错误！');
    }

    function addServer(t){
        var html='';
        if(t==1){
            var agent=$("#agentIpSelect").val();
            if(!!agent){
                if($("div[ip='"+agent+"']").length==0){
                    html+="<div class='agent' ip='"+agent+"'><p>"+agent+"</p><p><i class='delete'>删除</i></p></div>"
                }
                else{
                    alert('请勿添加重复项！');
                }
            }
            else{
                return;
            }
        }else{
            var gameip=$("#gameIpSelect").val();
            var num=$("#num").val();
            var game=$("#gameSelect").val();
            var g=document.getElementById('gameSelect');
            var gamename=g[g.selectedIndex].text;
            if(!!gameip&&!!game&&!!num){
                if($("div[ip='"+gameip+"'][name='"+game+"']").length==0){
                    html+="<div class='game' num='"+num+"' ip='"+gameip+"' name='"+game+"'><p>"+gameip+"</p><p>"+num+"</p><p>"+gamename+"</p><p><i class='delete'>删除</i></p></div>";
                }
                else{
                    alert('请勿添加重复项！');
                }
            }
            else{
                return;
            }
        }
        $(html).insertBefore("#editDiv div.insert");
        $(".insert_a,.insert_p").hide();
        $("#agentIp,#game,#gameIp").text('————请选择————');
        $("#num").val('0');
        $("#editDiv select").val('');
    }

    //游戏服填充
    function FillGame(data){
        $(".game").remove();
        var leng=data.length;
        if(leng>0){
            var html="";
            for(var i= 0;i<leng;i++){
                var name=$("#gameSelect").children("option[value='"+data[i].gid+"']").text();
                html+="<div class='game' num='"+data[i].num+"' ip='"+data[i].ip+"' name='"+data[i].gid+"'><p>"+data[i].ip+"</p><p>"+data[i].num+"</p><p>"+
                    name+"</p><p><i class='delete'>删除</i></p></div>";
            }
            $(html).insertBefore("#editDiv div.insert");
        }
       else{}
    }

    //select界面填充
    function  FillSelect(method,arr,selector,msg,callback){
        sendRequest(method,arr, function (data) {
            if(data.code==0){
                var arr=data.data;
                var html='';
                for(var i= 0,leng=arr.length;i<leng;i++){
                    if(method=='ver.getList'){
                        html+=getOption(arr[i].id,arr[i].name);
                    }else{
                        if(selector=='#agentIpSelect'||selector=='#gameIpSelect'){
                            (!arr[i].usedByBG||arr[i].usedByBG==-1||arr[i].usedByBG==bgID)&&(html+=getOption(arr[i].ip,arr[i].ip));
                        }else{
                            html+=getOption(arr[i].ip,arr[i].ip);
                        }
                    }
                }

                if(!!html){
                    if(selector=='#agentIpSelect'){
                        $("#agentIpSelect").empty();
                        html="<option value=''>请选择</option>"+html;
                    }
                    else if(selector=='#gameIpSelect') {
                        $("#gameIpSelect").empty();
                        html="<option value=''>请选择</option>"+html;
                    }else {}
                    $(selector).append(html);
                }else{}

                (!!callback&&Object.prototype.toString.call(callback)=='[object Function]')&&callback();
            }
            else{alert(msg);console.log(data);}
        });
    }

    //生成option
    function getOption(id,v){
        return "<option value='"+id+"'>"+v+"</option>";
    }

    /* 
     ***界面渲染
     ***注意：请将标识列（id）放到编辑列的属性id上，否则会导致异常。
     */
    function dataPain(data) {
        var html = "";
        for (var i = 0, leng = data.length; i < leng; i++) {
            var result=data[i];
            var tr = "<tr><td class='on'>" + result.name + "</td>" +
                "<td>" + result.index + "</td><td class='on'>" +
                $('#version').children("option[value='"+result.version+"']").text()+ "</td>" +
                "<td>" + result.domain + "</td><td>" + result.status + "</td>" +
                "<td>" ;
            switch (result.codeStatus){
                case '0':
                    tr+="研发中";
                    break;
                case '1':
                    tr+="测试";
                    break;
                case '2':
                    tr+="正式";
                    break;
                default:
                    tr+="未填写";
            }
            tr+= "</td><td class='on' id='" + result.index + "'><span class='edit trans' type='1'>基础</span>" +
            "<span class='edit trans' type='2'>代理服</span><span class='edit trans' type='3'>游戏服</span></td></tr>";
            html+=tr;
        }
        $(".datalist>table tbody").empty().append(html);
    }

    // 弹出界面
    function bounceView() {
        $('.background').show();
        $('.modal').addClass('bounceInDown');
    }

    //添加和编辑切换显示
    function toggleForm(t) {
        if(!!t){
            $('#viewData,#formData').hide();
            $('#editDiv').show();
        }else{
            $('#viewData').hide();
            $('#formData').show();
        }
    }

    //检查select中是否存在项
    function checkOption(name,val){
        var select = document.getElementById(name);
        for(var i=0; i<select.options.length; i++){
            if(select.options[i].value == val){
                $('#'+name).val(val);
                $('#'+name).next('span').text(val);
                return;
            }else{}
        }
        $('#'+name).next('span').text("————请选择————");
    }

    /*
     ***详情、基本编辑界面数据填充
     ***@param  data:obj
     */
    function fillData(data, type) {
        if (Object.prototype.toString.call(data) == '[object Object]') {
            if (type == 'edit') {
                $('#name').val(data.name);
                $('#version').val(data.version);
                var v=document.getElementById('version');
                $('#version').next('span').text(v[v.selectedIndex].text);
                $('#domain').val(data.domain);

                checkOption('dbServer',data.dbServer);
                checkOption('logDBServer',data.logDBServer);

                $('#codeStatus').val(data.codeStatus);
                var c=document.getElementById('codeStatus');
                $('#codeStatus').next('span').text(c[c.selectedIndex].text);
                $("#sslCrt").val(data.sslCrt);
                $("#sslKey").val(data.sslKey);
                if(data.domain.indexOf(',')>0){
                    $(".two").show();
                    $("#sslCrt1").val(data.sslCrt1);
                    $("#sslKey1").val(data.sslKey1);
                }
                else{
                    $(".two").hide();
                }
                // Important ,clear cache Data !
                roby = null;
            } else {
                $("#v-sslCrt").val(data.sslCrt);
                $("#v-sslKey").val(data.sslKey);
                $('#v-name').val(data.name);
                $('#v-index').val(data.index);
                $('#v-version').val($('#version').children("option[value='"+data.version+"']").text());
                $('#v-domain').val(data.domain);
                $('#v-dbServer').val(data.dbServer);
                $('#v-log').val(data.logDBServer);
                $('#v-codeStatus').val($('#codeStatus').children("option[value='"+data.codeStatus+"']").text());
                if(data.domain.indexOf(',')>0){
                    $(".show-two").show();
                }
                else{
                    $(".show-two").hide();
                }
            }
        } else {
            alert('Data不是一个对象！初始化数据为空！');
        }
    }

})