
$("#searchLogo").click(function () {
    $("#searchImageBox").empty();
    var keyWord = $("#searchInput").val().toString();
    if( keyWord!==undefined && keyWord.length>0 ){
        var data = {"keyWord": keyWord};
        $.post('searchFollowImage', data, function (data) {
            if (data) {
                var imgInfos = $.parseJSON( data );
                $("#searchImageShow").show();
                $("#imageShow").hide();
                for (var i = 1; i < imgInfos.length; i++) {
                    var imgInfo = imgInfos[i];
                    if ( imgInfo.imgPath ) {
                        var divImg = "<div class='imgList' id='findSearch-"+ imgInfo.imgID + "'>" +
                            "<img src='" + imgInfo.imgPath + "'/>" +
                            "<button id='findSearchBtn-"+ imgInfo.imgID + "' class='goodBtn' " +
                                "onclick='giveImageGood(this, \"searchLike-\")'>👍 " + imgInfo.likeNum + "</button>" +
                            "<button id='searchLike-"+ imgInfo.imgID + "' class='commonBtn' style='display: none' disabled>❤️</button>" +
                            "<input class='CommonInput SignInput' value='" + imgInfo.imgSign + "' readonly/>" +
                            "<input class='CommonInput RightInput' value='by " + imgInfo.userID + "' readonly/>" +
                            "</div>";
                        $("#searchImageBox").append(divImg);
                    }
                }
            }
        });
    }
    $("#searchInput").val("");
    $("#searchKeyWord").val(keyWord);
});


$("#searchBackToMyImageBtn").click(function () {
    $("#searchImageBox").empty();
    $("#imageShow").show();
    $("#searchImageShow").hide();
});


function giveImageGood(obj, prefix) {
    var temp1 = $(obj).attr('id');
    var temp2 = temp1.split('-');
    var IDValue = temp2[1];
    var data = {"imgID": IDValue};
    $.post('goodImage', data, function (res) {
        var result = $.parseJSON( res );
        if( result.status ){
            var numTemp1 = $(obj).text();
            var numTemp2 = numTemp1.split(" ");
            var likeNum = numTemp2[1];
            var newLikeNum = Number( likeNum ) + 1;
            $(obj).hide();
            $("#"+prefix+IDValue).show();
            $("#"+prefix+IDValue).text("❤️ " + newLikeNum);
        }
        else {
            alert('抱歉，点赞失败。。。');
        }
    })
}
