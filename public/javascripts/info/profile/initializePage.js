
$(function () {
    $.get('userInfo', function (data) {
        if( data ){
            $("#userLogo").attr("src", data.userLogo);
            $("#userBigLogo").attr("src", data.userLogo);
            $("#userID").val(data.userID);
            $("#userName").val(data.userName);
            $("#userEmail").val(data.userEmail);
        }
        else {
            $.post('logout');
        }
    });
});