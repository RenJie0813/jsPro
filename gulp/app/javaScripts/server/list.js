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
 * 抗压，分地区
 * 下拉选择
 */
//    useArea:number;
/**
 * 描述
 */
//    desc:string;
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

(function () {
    $(document).ready(function () {
        $('#btn').on('click',function () {
            location.href='add.html'
        })
        $('#useType').change(function () {
            let chooseType=$(this).val()
            getData(chooseType)
        })
        getData();
    })

    function getData(type) {
        let chooseType=type||-1;
        let method='server.getList';
        let arr=[chooseType];
        sendRequest(method,arr,function (data) {
            if($('.lineData')){
                $('#tb').empty()
            }
            renderTable(data)
        });
    }
    function renderTable(content) {
        $('#tb').append(
            `    <tr class="th">
            <td >IP号</td>
            <td >代理服务器</td>
            <td >用途分类</td>
            <td >使用地区</td>
            <td >描述</td>
            <td >线程数</td>
            <td >内容(G)</td>
            <td >带宽(mbps)</td>
            <td >操作</td>
        </tr>`
        )
        content.data.forEach(function (row) {
            let useTypeName;
            let useAreaName;
            switch (row.useType){
                case 0:useTypeName='Master db';break;
                case 1:useTypeName='Cust db';break;
                case 2:useTypeName='Log db';break;
                case 3:useTypeName='Game';break;
                case 4:useTypeName='Agent';break;
                default:useTypeName='未知';break;
            }
            switch (row.useArea){
                case 0:useAreaName='抗压';break;
                case 1:useAreaName='分地区';break;
                default:useAreaName='未知';break
            }

            $('#tb').append(`
        <tr class="lineData">
            <td>${row.ip}</td>
            <td>${row.bakIP}</td>
            <td>${useTypeName}</td>
            <td>${useAreaName}</td>
            <td>${row.desc}</td>
            <td>${row.cpu}</td>
            <td>${row.memory}</td>
            <td>${row.bandwidth}</td>
            <td> <span class="editBtn">编辑 </span>  <span class="deleteBtn"> 删除</span> </td>
        </tr>
        `)
            $('.editBtn').unbind('click').bind('click',function () {
                let content=[];
                let children=$(this).parent().parent().children();
                for(let i=0;i<children.length;i++){
                    content.push(children[i].innerHTML)
                }
                content=JSON.stringify(content)
                localStorage.setItem('serverDetail',content)
                location.href='edit.html'
            })
            $('.deleteBtn').unbind('click').bind('click',function () {
                let con =confirm('确定删除该项？')
                if(con===true){
                    let ip=$(this).parent().parent().children()[0].innerHTML;
                    let args=[
                        ip
                    ]
                    let method='server.del';
                    console.log(args)
                    sendRequest(method,args,function (data) {
                        console.log(data)
                        if(data.code===0){
                            getData()
                        }else{
                            alert('删除失败，请重试')
                        }
                    })
                }
            })
        })
    }
})()
