
function setImagePreview() {
    var docObj = document.getElementById("imageLogoUpload");
    var imgPreview = document.getElementById("userBigLogoPreview");

    if (docObj.files && docObj.files[0]) {
        $("#userBigLogoPreview").show();
        $("#userBigLogo").hide();
        $("#keepLogoBtn").show();
        $("#submitLogoBtn").show();
        $("#changeLogoBtn").hide();
        //imgObjPreview.src = docObj.files[0].getAsDataURL();
        //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
        imgPreview.src = window.URL.createObjectURL(docObj.files[0]);
    }
}

$("#searchInput").focusin(function () {
    $("#searchLogo").show();
});
$("#searchInput").focusout(function () {
    $("#searchLogo").hide();
});

$("#changeLogoBtn").click(function () {
    $("#imageLogoUpload").click();
});

$("#keepLogoBtn").click(function () {
    $("#userBigLogoPreview").hide();
    $("#userBigLogo").show();
    $("#keepLogoBtn").hide();
    $("#submitLogoBtn").hide();
    $("#changeLogoBtn").show();
});

$("#changeInfoBtn").click(function () {
    $("#userName").removeAttr("readonly");
    $("#userEmail").removeAttr("readonly");
    $("#userName").css("border", "2px solid #55E9FF")
    $("#userEmail").css("border", "2px solid #55E9FF")
    $("#changeInfoBtn").hide();
    $("#submitInfoBtn").show();
});

$("#submitLogoBtn").click(function () {
    var imageLogoUpload = document.getElementById("imageLogoUpload");
    if( imageLogoUpload.files.length>0 ) {
        var myImage = new FormData();
        // fileInputElement中已经包含了用户所选择的文件
        myImage.append("imageLogoUpload", imageLogoUpload.files[0]);

        $.ajax({
            type: 'post',
            url: 'uploadLogo',
            data: myImage,
            cache: false,
            // 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置(详见：https://segmentfault.com/a/1190000007207128)
            contentType: false,
            // 是否序列化data属性，默认true(注意：false时type必须是post，详见：https://zhidao.baidu.com/question/1926250710050869147.html?qbl=relate_question_0&word=processData)
            processData: false,
            success: function(res) {
                var result = $.parseJSON( res );
                if( result.status ){
                    $("#userBigLogoPreview").hide();
                    $("#userBigLogo").show();
                    $("#keepLogoBtn").hide();
                    $("#submitLogoBtn").hide();
                    $("#changeLogoBtn").show();
                    $("#userLogo").attr("src", result.logoPath);
                    $("#userBigLogo").attr("src", result.logoPath);
                }
                else{
                    alert( result.message );
                }
            }
        })
    }
});

$("#submitInfoBtn").click(function () {
    var nameReady = true;
    var emailReady = true;

    var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-z])+$/;
    var userName = $("#userName").val().toString();
    var userEmail = $("#userEmail").val().toString();
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
    if( nameReady && emailReady ) {
        $("#userName").attr("readonly", "readonly");
        $("#userEmail").attr("readonly", "readonly");
        $("#changeInfoBtn").show();
        $("#submitInfoBtn").hide();

        var data = {"userName": userName, "userEmail": userEmail};
        $.post('changeInfo', data, function (res) {
            if( !res.status ){
                location.reload(true);
            }
        })
    }
});