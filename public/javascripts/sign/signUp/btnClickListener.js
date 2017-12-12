
$("#signUpSubmit").click(function () {
    var nameReady = true;
    var emailReady = true;
    var passwordReady = true;

    var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-z])+$/;
    var userName = $("#userName").val().toString();
    var userEmail = $("#userEmail").val().toString();
    var userPassword = $("#userPassword").val().toString();
    var userPasswordAgain = $("#userPasswordAgain").val().toString();

    if( userName===undefined || userName.length===0 ){
        $("#userName").css("border","1px solid red");
        nameReady = false;
    }
    else {
        $("#userName").css("border","1px solid #c8c8c8");
        nameReady = true;
    }
    if( userEmail===undefined || userEmail.length===0 || !emailReg.test(userEmail) ){
        $("#userEmail").css("border","1px solid red");
        emailReady = false;
    }
    else {
        $("#userEmail").css("border","1px solid #c8c8c8");
        emailReady = true;
    }
    if( (userPassword.length===0) ||(userPassword !== userPasswordAgain) ){
        $("#userPassword").css("border","1px solid red");
        $("#userPasswordAgain").css("border","1px solid red");
        passwordReady = false;
    }
    else {
        $("#userPassword").css("border","1px solid #c8c8c8");
        $("#userPasswordAgain").css("border","1px solid #c8c8c8");
        passwordReady = true;
    }
    if( passwordReady && emailReady && nameReady ){

        var passwordHash = md5(userPassword);

        var data = {"userName":userName, "userEmail":userEmail, "userPassword":passwordHash};
        $.post('signUp', data, function (res) {
            var result = $.parseJSON( res );
            if( result.status ){
                $("#aSign").hide();
                $("#signUpForm").hide();
                $("#aShowID").show();
                $("#showIDDiv").show();
                $("#userIDShow").val(result.userID);
            }
        });
    }
});