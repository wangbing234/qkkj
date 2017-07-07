/****************************
*
* 作者：高雄    时间：2013.1.10
* Mobile:13916654519 Mail:gaoxiong513@126.com
* Description:用户获取表情的面板
*
****************************/
(function ($) {
    $.fn.extend({
        insertContent: function (myValue) {
            return this.each(function () {
                var container = $(this),
                    id = container.attr('id'),
                    str = myValue;
                var selection = window.getSelection ? window.getSelection() : document.selection;
                var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
                if (!window.getSelection) {
                    document.getElementById(id).focus();
                    selection = window.getSelection ? window.getSelection() : document.selection;
                    range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
                    range.pasteHTML(str);
                    range.collapse(false);
                    range.select();
                } else {
                    if ((typeof range !== "undefined") && !range.createContextualFragment) {
                        range.createContextualFragment = function(html) {
                            var frag = document.createDocumentFragment(),
                                div = document.createElement("div");
                            frag.appendChild(div);
                            div.outerHTML = html;
                            return frag;
                        };
                    }
                    document.getElementById(id).focus();
                    range.collapse(false);
                    var hasR = range.createContextualFragment(str);
                    var hasR_lastChild = hasR.lastChild;
                    while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
                        var e = hasR_lastChild;
                        hasR_lastChild = hasR_lastChild.previousSibling;
                        hasR.removeChild(e);
                    }
                    range.insertNode(hasR);
                    if (hasR_lastChild) {
                        range.setEndAfter(hasR_lastChild);
                        range.setStartAfter(hasR_lastChild);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                container.focus();
            });
        }
    });
})(jQuery);