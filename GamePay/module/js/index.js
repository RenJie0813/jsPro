/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
$(function () {
    var index = (function (index) {
        //关闭当前窗口
        index.closeWindow= function (sales) {
            function closeM() {
                layer.close(sales);
            }

            $(".resetBtn").unbind("click", closeM);
            $(".resetBtn").on("click", closeM);
        }

        //事件绑定
        index.eventRegist = function () {
            $("#searchTxt").on("focus", function () {
                var _this = this;
                var val = $(_this).val();
                if (!val) {
                    var txtW = $("#searchTxt").width();
                    var btnW = $("#searchBtn").width();
                    var offWidth = $("#searchTxt").offset().left + txtW - $("#searchBtn").offset().left - btnW;
                    $("#searchBtn").css("transform", "translateX(" + (offWidth) + "px)");
                }
            });

            $("#searchTxt").on("blur", function () {
                var _this = this;
                var val = $(_this).val();
                if (!val) {
                    $("#searchBtn").css("transform", "translateX(0px)");
                }
            });

            //右侧顶部消息按钮
            $("#msgBtn").click(function () {
                var load = layer.load(0, {
                    shade: [0.4, "#000"], //0.1透明度的白色背景
                    scrollbar: false
                });
                setTimeout(function () {
                    layer.close(load)
                }, 2000);
            });

            //出售按钮
            $("#sell").on("click", function () {
                var html = template("sales_M", []);
                var sales = layer.open({
                    type: 1,
                    content: html,
                    skin: "dl",
                    title: ["销售"],
                    closeBtn: 0,
                    area: ["25rem"]
                });
                index.closeWindow(sales);
            });

            //购买按钮
            $(".deal").on("click", function (e) {
                var node= $(this).attr("data-i");
                var html = template("buy_M", {
                    temp:node=="buy"?"卖出":"购入"
                });
                var sales = layer.open({
                    type: 1,
                    title:false,
                    content: html,
                    skin: "dl",
                    closeBtn: 0,
                    area: ["25rem"]
                });
                index.closeWindow(sales);
            });

            //充值按钮
            $("#payBtn").on("click",function(){
                var html=template("pub_Pay",[]);
                var sales = layer.open({
                    type: 1,
                    title:false,
                    content: html,
                    skin: "dl",
                    closeBtn: 0,
                    area: ["25rem"]
                });
                index.closeWindow(sales);
            });
        };

        //支付密码框
        index.payOpen= function (title,money) {
            var html=template("pay_Pwd",{title:title,money:money});
            layer.open({
                type:1,
                content:html,
                closeBtn: 1,
                title:["请输入支付密码","padding:.4rem 40px;text-align:center;font-size:1.2rem"],
                area: ["25rem"],
                skin:"pay"
            });
        };

        //支付请求
        index.payRequst= function (val) {
            console.log(val);
            layer.load(0, {
                shade: [0.4, "#000"], //0.1透明度的白色背景
                scrollbar: false
            });
            setTimeout(function () {
                layer.closeAll();
                layer.alert("成功！",{icon:1,title:false,btnAlign:'c',closeBtn:0});
            }, 2000);
        };

        //支付密码输入
        index.payInput= function () {
            $("#payPwdText").on("input propertychange", function () {
                console.log("input");
                var val=$(this).val();
                var leng=val.length;
                var span=$("#pwd .layui-form-item>span");
                var text=$("#pwd .layui-form-item>span[input='true']").length;
                if(text<=leng){
                    for(var i=0;i<leng;i++){
                        span.eq(i).html("*").attr("input",true);
                    }
                    i==6&&index.payRequst(val);
                }else{
                    for(var i=leng;i<6;i++){
                        span.eq(i).html("").attr("input",false);
                    }
                    console.log(val);
                }

            });
        }

        index.init=function () {
            layui.define(["layer", "form"], function (exports) {
                layer = layui.layer;
                var form = layui.form();

                <!--初始化大厅数据-->
                var data = {
                    list: [{
                        title: '678 game Center',
                        dl:'当前代理人数很多123213123131',
                        is:1,
                        max:7545,
                        min:7125,
                        deal:12312123123124
                    }, {
                        title: '678 game Center',
                        dl:'当前代理人数很多',
                        is:1,
                        max:7545,
                        min:7125,
                        deal:345345
                    }, {
                        title: '678 game Center',
                        dl:'当前代理人数不是很多',
                        is:0,
                        max:7545,
                        min:7125,
                        deal:455232
                    }, {
                        title: '678 game Center',
                        dl:'当前代理人数没有',
                        is:1,
                        max:7545,
                        min:7125,
                        deal:121333
                    }]
                }
                var html = template('hall_M', data);
                $("#main").html(html);

                //输入验证
                form.verify({
                    checkPwdL: function (value) {
                        if (value.length != 6) {
                            return "请输入6位数交易密码";
                        }
                    },
                    checkPwd: function (value) {
                        var reg = /^(\w){6,14}$/;
                        if (!reg.test(value)) {
                            return "登录密码由6-14位数字，字母组成";
                        }
                    }
                });
                
                //提交事件
                form.on("submit(deal)", function (data) {
                    console.log(data, 1);
                });
                form.on("submit(sure_deal)", function (data) {
                    var node=data.elem.dataset.i;
                    layer.close(layer.index);
                    layer.open({
                        content:'hello',
                        title:false,
                        btnAlign:'c',
                        yes: function (i,layero) {
                            layer.close(i);
                            index.payOpen(node,7123);
                            index.payInput();
                        }
                    });
                });
                
                index.eventRegist();
                exports("index", {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
            });
        };
        return index;
}(index || {}));
    index.init();
})