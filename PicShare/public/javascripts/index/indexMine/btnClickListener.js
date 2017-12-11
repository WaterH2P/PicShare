
$("#searchLogo").click(function () {
    $("#searchImageBox").empty();
    var keyWord = $("#searchInput").val().toString();
    if( keyWord!==undefined && keyWord.length>0 ){
        var data = {"keyWord": keyWord};
        $.post('searchMyImage', data, function (data) {
            if (data) {
                var imgInfos = $.parseJSON( data );
                $("#imageShow").hide();
                $("#searchImageShow").show();
                $("#uploadImageShow").hide();
                for (var i = 0; i < imgInfos.length; i++) {
                    var imgInfo = imgInfos[i];
                    if ( imgInfo.imgPath ) {
                        showImage( imgInfo, 'searchImageBox', 'searchMyBtn-', 'searchMyDiv-');
                    }
                }
            }
        });
    }
    $("#searchInput").val("");
    $("#searchKeyWord").val(keyWord);
});


$("#uploadPictureBtn").click(function () {
    $("#imageShow").hide();
    $("#searchImageShow").hide();
    $("#uploadImageShow").show();
    $("#progressBar").css("display", "block");
});
$("#imageUploadSubmit").click(function () {
    var imageUpload = document.getElementById("imageUpload");
    if( imageUpload.files.length>0 ) {
        var myImage = new FormData();
        // fileInputElement中已经包含了用户所选择的文件
        myImage.append("imageUpload", imageUpload.files[0]);

        $.ajax({
            type: 'post',
            url: 'uploadImage',
            data: myImage,
            cache: false,
            // 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置(详见：https://segmentfault.com/a/1190000007207128)
            contentType: false,
            // 是否序列化data属性，默认true(注意：false时type必须是post，详见：https://zhidao.baidu.com/question/1926250710050869147.html?qbl=relate_question_0&word=processData)
            processData: false,
            success: function(res) {
                var result = $.parseJSON( res );
                if( result.status ){
                    showImage( result, 'imageBox', 'findMyBtn-', 'findMyDiv-');
                }
                $('#uploadResultShow').show();
                $('#uploadResultShow').css("color", "#ea6f5a");
                $('#uploadResultShow').text( result.message );
            }
        })
    }
});


$("#uploadBackToMyImageBtn").click(function () {
    $("#imageShow").show();
    $("#uploadImageShow").hide();
});


$("#searchBackToMyImageBtn").click(function () {
    $("#searchImageBox").empty();
    $("#imageShow").show();
    $("#searchImageShow").hide();
});


function setImagePreview() {
    var docObj = document.getElementById("imageUpload");
    var imgObjPreview = document.getElementById("uploadImagePreview");

    if (docObj.files && docObj.files[0]) {
        $("#uploadImagePreviewDIv").show();
        $('#uploadResultShow').hide();
        //imgObjPreview.src = docObj.files[0].getAsDataURL();
        //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
        imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
    }
    else{
        $("#uploadImagePreviewDIv").hide();
    }
}


function deleteImage(obj) {
    var temp1 = $(obj).attr('id');
    var temp2 = temp1.split('-');
    var IDValue = temp2[1];
    var data = {"imgID": IDValue};
    $.post('delMyImage', data, function (res) {
        var result = $.parseJSON( res );
        if( result.status ){
            $("#findMyDiv-"+IDValue).remove();
            $("#searchMyDiv-"+IDValue).remove();
        }
        else {
            alert('抱歉，删除失败。。。');
        }
    })
}