/**
 * Created by leson on 2016/9/22.
 */
var dialog  = {
    init: function (content, type, fn) {
        var div = this.create(content);
        var btn = this.button(type);
        for (var i  in btn) {
            div.appendChild(btn[i]);
        }
        document.body.appendChild(div);
        for (var i in btn) {
            this.bind(div, btn[i].id, fn);
        }
    },
    bind: function (div, id, fn) {
        var target = document.getElementById(id);
        target.onclick = function () {
            document.body.removeChild(div);
            var status = this.getAttribute("data-info");
            if (status == 1) {
                if (fn) {
                    fn();
                }
            }
        }

    },
    create: function (content) {
        var div = document.createElement("div");
        div.id = "content";
        div.className = "show";
        div.innerHTML = content;
        return div;
    },
    button: function (type) {
        switch (type) {
            case 0:
                return "";
                break;
            case 1:
                var ok = document.createElement("span");
                ok.id = "ok";
                ok.setAttribute("data-info", "1");
                ok.innerHTML = "确定";
                return {OK: ok};
                break;
            case 2:

                var ok = document.createElement("span");
                ok.id = "ok";
                ok.setAttribute("data-info", "1");
                ok.innerHTML = "确定";
                var cancle = document.createElement("span");
                cancle.id = "cancle";
                cancle.setAttribute("data-info", 2);
                cancle.innerHTML = "取消";
                return {
                    OK: ok,
                    cancel: cancle
                };
                break;
        }
    }
}