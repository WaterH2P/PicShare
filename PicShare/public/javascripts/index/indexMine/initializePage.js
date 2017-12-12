
$(function () {
    $.get('myImages', function (data) {
        if (data) {
            var imgInfos = $.parseJSON( data );
            if( data=="none" ){
                var divImg = "<h2>你还未上传图片。。。</h2>";
                $("#imageBox").append(divImg);
            }
            else{
                for (var i = 0; i < imgInfos.length; i++) {
                    var imgInfo = imgInfos[i];
                    if ( imgInfo.imgPath ) {
                        var pre = {"divIDPrex":"findMyDiv-", "showSignPrex":"signShow-",
                            "delBtnIDPrex":"findMyBtn-", "changeBtnIDPrex":"findChangeBtn-",
                            "submitChangeBtnIDPrex":"findSubmitChangeBtn-"};
                        var divID = "imageBox";
                        var divImg = "<div class='imgList' id='" + pre.divIDPrex + imgInfo.imgID +"'>" +
                            "<img src='" + imgInfo.imgPath + "'/>" +
                            "<input class='CommonInput LeftInput' value='❤️ " + imgInfo.likeNum + "' readonly/>" +
                            "<input class='CommonInput SignInput' id='" + pre.showSignPrex + imgInfo.imgID + "' value='" + imgInfo.imgSign + "' readonly/>" +
                            "<button class='justForFindBtnDel delBtn' id='" + pre.delBtnIDPrex + imgInfo.imgID +"' style='display:none' " +
                                "onclick='deleteImage(this)'>删除</button>" +
                            "<button class='justForFindBtnChangeSign delBtn' id='" + pre.changeBtnIDPrex + imgInfo.imgID +"' style='display:none' " +
                                "onclick='mainChangeSign(this)'>修改</button>" +
                            "<button class='delBtn' id='" + pre.submitChangeBtnIDPrex + imgInfo.imgID +"' style='display:none' " +
                                "onclick='mainSubmitChange(this)'>提交</button>" +
                            "</div>";
                        $("#"+divID).append(divImg);
                    }
                }
            }
        }
        else {
            var divImg = "<h2>抱歉，未拿到图片。。。</h2>";
            $("#imageBox").append(divImg);
        }
    });
    $("#coolBackgroundDiv").css("min-height", $(window).height());
});