
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
                        showImage( imgInfo, 'imageBox', 'findMyBtn-', 'findMyDiv-');
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


function showImage(imgInfo, divID, btnIDPrex, divIDPrex) {
    var divImg = "<div class='imgList' id='" + divIDPrex + imgInfo.imgID +"'>" +
        "<img src='" + imgInfo.imgPath + "'/>" +
        "<input class='CommonInput LeftInput' value='❤️ " + imgInfo.likeNum + "' readonly/>" +
        "<button id='" + btnIDPrex + imgInfo.imgID +"' class='delBtn' onclick='deleteImage(this)'>删除</button>" +
        "</div>";
    $("#"+divID).append(divImg);
}