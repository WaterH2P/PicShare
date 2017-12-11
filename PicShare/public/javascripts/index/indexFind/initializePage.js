
$(function () {
    // $.get('userLogo', function (data) {
    //     var logo = $.parseJSON( data );
    //     $("#userLogo").attr("src", logo.userLogo);
    // });
    $.get('hotImages', function (data) {
        if (data) {
            var imgPaths = $.parseJSON( data );
            for (var i = 0; i < imgPaths.length; i++) {
                var imgPath = imgPaths[i];
                if( imgPath.imgPath ) {
                    var divImg = "<div class='imgList' id='findHot-"+ imgPath.imgID +"'>" +
                        "<img src='" + imgPath.imgPath + "'/>" +
                        "<button id='findHot-"+ imgPath.imgID +"' class='goodBtn' onclick='giveImageGood(this, \"hotLike-\")'>👍</button>" +
                        "<button id='hotLike-"+ imgPath.imgID + "' class='commonBtn' style='display: none' disabled>❤️</button>" +
                        "<input class='CommonInput RightInput' value='by " + imgPath.userID + "' readonly/>" +
                        "</div>";
                    $("#imageBox").append(divImg);
                }
            }
        }
    });
    $("#coolBackgroundDiv").css("min-height", $(window).height());
});