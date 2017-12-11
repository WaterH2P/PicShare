
$(function () {
    $.get('followInfo', function (data) {
        if( data ){
            var followInfo = $.parseJSON( data );
            if( followInfo.length>0 ){
                for(var i=0; i<followInfo.length; i++){
                    var info = followInfo[i];
                    var infoDiv = "<div class='info_frag' id='"+info.userID+"_info_div'>" +
                        "<input class='inputCommon IDInput' value='" + info.userID + "' readonly />" +
                        "<input class='inputCommon nameInput' value='" + info.userName + "' readonly />" +
                        "<input class='inputCommon nameInput' value='" + info.userEmail + "' readonly />" +
                        "<button class='inputCommon unFollowBtn' id='" + info.userID + "' onclick='cancelFollow(this)'>取消关注</button>" +
                        "</div>";
                    $("#followMain").append(infoDiv);
                }
            }
            else{
                $("#noFollowTell").show();
                $("#noFollowTell").text('无关注');
                $("#noFollowTell").css('color', '#ff6b77');
            }
        }
        else{
            $("#noFollowTell").show();
            $("#noFollowTell").text('无关注');
            $("#noFollowTell").css('color', '#ff6b77');
        }
    })
});