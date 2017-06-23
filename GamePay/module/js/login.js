/**
  项目JS主入口
  以依赖Layui的layer和form模块为例
**/
$(function() {
    layui.define(["layer", "form", "upload"], function(exports) {
        var layer = layui.layer,
            form = layui.form();

        layui.upload({
             elem: "#imgFile",
            url: "../module/up/upImg",
            unwrap: true,
            success: function(res) {
                console.log(res);
            }
        });

        //表单验证
        form.verify({
            checkPwdL: function(value) {
                if (value.length != 6) {
                    return "请输入至少6位数交易密码";
                }
            },
            checkPwd: function(value) {
                var reg = /^(\w){6,14}$/;
                if (!reg.test(value)) {
                    return "登录密码由6-14位数字，字母组成";
                }
            }
        });

        //提交事件
        form.on("submit(login)", function (data) {
            var username=data["field"]["username"];
            var pwd=data["field"]["pwd"];
            if(username=="aidi"&&pwd=="memeda"){
                $("#loginForm").hide();
                $("#login").removeClass("layui-hide");
            }else{
                layer.msg("密码错误！",{skin:"demo-class",time:1000});
            }
        });

        //个人信息完善
        form.on("submit(addInfo)", function (data) {
            console.log(data);
        });

        exports("login", {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
    });

    //上传头像预览
    $("#imgFile").on("change", function() {
        var _this = this;
        $("#upImage").css("color", "#fff");
        $("#preview").attr("src", URL.createObjectURL(_this.files[0]));
    })
})