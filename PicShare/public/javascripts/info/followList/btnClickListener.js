
function cancelFollow(obj) {
    var followedID = $(obj).attr('id');
    var data = {"followedID":followedID};
    $.post('cancelFollow', data, function (res) {
        var result = $.parseJSON( res );
        if( result.status ){
            $("#"+followedID+"_info_div").remove();
        }
        else{
            alert('抱歉，关注失败。。。');
        }
    });
}


var infoSave = [];
var index = 0;
$("#searchLogo").click(function () {
    $("#searchImageBox").empty();
    var keyWord = $("#searchInput").val().toString();
    if( keyWord!==undefined && keyWord.length>0 ){
        var data = {"keyWord": keyWord};
        $.post('searchUser', data, function (data) {
            $("#followListInfoShow").hide();
            $("#searchFollowListInfoShow").show();
            $("#searchFollowMain").empty();
            $("#tellInput").val("搜索结果");
            if (data) {
                infoSave = [];
                index = 0;
                var leadInfo = "<div class='info_frag'>" +
                    "<input class='inputCommon IDInput' value='账号' readonly>" +
                    "<input class='inputCommon nameInput' value='昵称' readonly>" +
                    "<input class='inputCommon nameInput' value='邮箱' readonly>" +
                    "<button class='inputCommon unFollowBtn' style='visibility: hidden;' disabled></button>" +
                    "</div>";
                $("#searchFollowMain").append(leadInfo);

                var usersInfo = $.parseJSON(data);
                for (var i = 0; i < usersInfo.length; i++) {
                    var info = usersInfo[i];
                    var infoDiv = "<div class='info_frag' id='search_"+info.userID+"_info_div'>" +
                        "<input class='inputCommon IDInput' value='" + info.userID + "' readonly />" +
                        "<input class='inputCommon nameInput' value='" + info.userName + "' readonly />" +
                        "<input class='inputCommon nameInput' value='" + info.userEmail + "' readonly />" +
                        "<button class='inputCommon unFollowBtn' id='" + info.userID + "_" + index + "' onclick='followUser(this)'>关注</button>" +
                        "</div>";
                    infoSave[index] = {"userID":info.userID, "userName":info.userName, "userEmail":info.userEmail};
                    index++;
                    $("#searchFollowMain").append(infoDiv);
                }
            }
            else{
                var infoDiv = "<div class='info_frag'><h2>无相关用户</h2></div>";
                $("#searchFollowMain").append(infoDiv);
            }
        });
    }
    $("#searchInput").val("");
    $("#searchKeyWord").val(keyWord);
});


function followUser(obj) {
    var temp1 = $(obj).attr('id');
    var temp2 = temp1.split("_");
    var indexTemp = temp2[1];
    var info = infoSave[indexTemp];
    var followedID = info.userID;
    var data = {"followedID":followedID};
    $.post('followUser', data, function (res) {
        var result = $.parseJSON( res );
        if( result.status ){
            $("#search_" + followedID + "_info_div").remove();
            var infoDiv = "<div class='info_frag' id='"+info.userID+"_info_div'>" +
                "<input class='inputCommon IDInput' value='" + info.userID + "' readonly />" +
                "<input class='inputCommon nameInput' value='" + info.userName + "' readonly />" +
                "<input class='inputCommon nameInput' value='" + info.userEmail + "' readonly />" +
                "<button class='inputCommon unFollowBtn' id='" + info.userID + "' onclick='cancelFollow(this)'>取消关注</button>" +
                "</div>";
            $("#followMain").append(infoDiv);
        }
        else{
            alert('抱歉，关注失败。。。');
        }
    });
}


$("#searchBackToFollowListBtn").click(function () {
    $("#followListInfoShow").show();
    $("#searchFollowListInfoShow").hide();
    $("#tellInput").val("关注列表");
});