
$(function () {
    $.get('followImages', function (data) {
        if (data) {
            var imgInfos = $.parseJSON( data );
            for (var i = 0; i < imgInfos.length; i++) {
                var imgInfo = imgInfos[i];
                if( imgInfo.imgPath ) {
                    var divImg = "<div class='imgList' id='findHot-"+ imgInfo.imgID +"'>" +
                        "<img src='" + imgInfo.imgPath + "'/>" +
                        "<button id='findHot-"+ imgInfo.imgID +"' class='goodBtn' onclick='giveImageGood(this, \"hotLike-\")'>👍</button>" +
                        "<button id='hotLike-"+ imgInfo.imgID + "' class='commonBtn' style='display: none' disabled>❤️</button>" +
                        "<input class='CommonInput SignInput' value='" + imgInfo.imgSign + "' readonly/>" +
                        "<input class='CommonInput RightInput' value='by " + imgInfo.userID + "' readonly/>" +
                        "</div>";
                    $("#imageBox").append(divImg);
                }
            }
        }
    });
    $("#coolBackgroundDiv").css("min-height", $(window).height());
});