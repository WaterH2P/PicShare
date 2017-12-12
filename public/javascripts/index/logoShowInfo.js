var nav = document.getElementById("div_lis");
var btns = document.getElementsByTagName("li");
var subnavs = nav.getElementsByTagName("div");
var paddingbottom = 10;
var defaultHeight = 0;

function drop(obj, ivalue) {
    var a = obj.offsetHeight;
    var speed = (ivalue - obj.offsetHeight) / 8;
    a += Math.floor(speed);
    obj.style.height = a + "px";
}

$(function() {
    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onmouseover = function () {
            var osubnav = subnavs[this.index];
            var sublinks = osubnav.getElementsByTagName("a");
            if (osubnav.firstChild.tagName == undefined) {
                var itarheight = parseInt(osubnav.childNodes[1].offsetHeight) * sublinks.length + paddingbottom;
            }
            else {
                var itarheight = parseInt(osubnav.firstChild.offsetHeight) * sublinks.length + paddingbottom;
            }

            clearInterval(this.itimer);
            this.itimer = setInterval(function () {
                    drop(osubnav, itarheight);
                },
                30);
        };

        btns[i].onmouseout = function () {
            var osubnav = subnavs[this.index];
            clearInterval(this.itimer);
            this.itimer = setInterval(function () {
                    drop(osubnav, defaultHeight);
                },
                30);
        }
    }
});