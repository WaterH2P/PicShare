
$("#searchLogo").click(function () {
    $("#searchImageBox").empty();
    var keyWord = $("#searchInput").val().toString();
    if( keyWord!==undefined && keyWord.length>0 ){
        var data = {"keyWord": keyWord};
        $.post('searchImage', data, function (data) {
            if (data) {
                var imgPaths = $.parseJSON( data );
                $("#searchImageShow").show();
                $("#imageShow").hide();
                for (var i = 1; i < imgPaths.length; i++) {
                    var imgPath = imgPaths[i];
                    if ( imgPath.imgPath ) {
                        var divImg = "<div class='imgList' id='findSearch-"+ imgPath.imgID + "'>" +
                            "<img src='" + imgPath.imgPath + "'/>" +
                            "<button id='findSearchBtn-"+ imgPath.imgID + "' class='goodBtn' onclick='giveImageGood(this, \"searchLike-\")'>👍</button>" +
                            "<button id='searchLike-"+ imgPath.imgID + "' class='commonBtn' style='display: none' disabled>❤️</button>" +
                            "<input class='CommonInput RightInput' value='by " + imgPath.userID + "' readonly/>" +
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
            $(obj).hide();
            $("#"+prefix+IDValue).show();
        }
        else {
            alert('抱歉，点赞失败。。。');
        }
    })
}