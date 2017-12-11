
    $("#signInSubmit").click(function () {
        var IDReady = true;
        var passwordReady = true;

        var userID = $("#userID").val().toString();
        var userPassword = $("#userPassword").val().toString();

        if( userID===undefined || userID.length===0 ){
            $("#userID").css("border","1px solid red");
            IDReady = false;
        }
        else {
            $("#userID").css("border","1px solid #c8c8c8");
            IDReady = true;
        }
        if( userPassword===undefined || userPassword.length===0 ){
            $("#userPassword").css("border","1px solid red");
            passwordReady = false;
        }
        else {
            $("#userPassword").css("border","1px solid #c8c8c8");
            passwordReady = true;
        }
        if( IDReady && passwordReady ) {
            var passwordHash = md5(userPassword);
            var data = {"userID": userID, "userPassword": passwordHash};
            $.post('signIn', data, function (res) {
                $("#aSign").hide();
                $("#signInForm").hide();
                $("#aShowStatus").show();
                $("#showStatusDiv").show();
                var result = $.parseJSON( res );
                if (result.status) {
                    $("#signInStatusShow").val("恭喜登陆成功");
                    $("#goToIndexBtn").val("开启探索之旅");
                    $("#goToIndex").attr("href", "indexFind");
                }
                else {
                    $("#signInStatusShow").val("登陆失败");
                    $("#goToIndexBtn").val("重新登陆");
                    $("#goToIndex").attr("href", "signIn");
                }
            });
        }
    });