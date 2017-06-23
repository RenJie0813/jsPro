var lazyLoad = {
    setImg: function(index) {
        var oDiv = document.getElementById("container")
        var oUl = oDiv.children[0];
        var aLi = oUl.children;
        if (aLi[index].dataset) {
            var src = aLi[index].dataset.src;
        } else {
            var src = aLi[index].getAttribute('data-src');
        }
        var oImg = document.createElement('img');
        oImg.src = src;
        if (aLi[index].children.length == 0) {
            aLi[index].appendChild(oImg);
        }
    },
    //获得对象距离页面顶端的距离  
    getH: function(obj) {
        var h = 0;
        while (obj) {
            h += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return h;
    },
    init: function() {
        window.onscroll = function() {
            lazyLoad.scrolling();
        }
    }.bind(this),
    //EventBind
    scrolling: function() {
        var e = this;
        var oDiv = document.getElementById('container');
        var oUl = oDiv.children[0];
        var aLi = oUl.children;

        for (var i = 0, l = aLi.length; i < l; i++) {
            var oLi = aLi[i];
            //检查oLi是否在可视区域
            var t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop);
            var h = e.getH(oLi);
            if (h < t) {
                setTimeout(e.setImg(i), 500);
            }
        }
    }
}

window.onload = function() {
    lazyLoad.init();
    lazyLoad.scrolling();
};