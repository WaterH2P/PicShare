$(function () {
    var e = document.getElementById("display");
    $(e).attr("width", $(window).width() * scale_ratio),
        $(e).attr("height", $(window).height() * scale_ratio),
        $(e).css("width", $(window).width()),
        $(e).css("height", $(window).height()),
        display = new Display(document.getElementById("display")),
        display.scale = scale_ratio,
        display.init(),
        particleSystem = (new ParticleSystem).init(display),
        display.start(),
        addEmittersAndFields(particleSystem);
    var t = null;
    $(window).resize(function () {
        clearTimeout(t),
            t = setTimeout(function () {
                    particleSystem.emitters = [],
                        particleSystem.fields = [];
                    var e = document.getElementById("display");
                    $(e).attr("width", $(window).width() * scale_ratio),
                        $(e).attr("height", $(window).height() * scale_ratio),
                        $(e).css("width", $(window).width()),
                        $(e).css("height", $(window).height()),
                        particleSystem.display.context.scale(scale_ratio, scale_ratio),
                        particleSystem.display.scale = scale_ratio,
                        particleSystem.display.calculate_scale(),
                        addEmittersAndFields(particleSystem)
                },
                300)
    })
});